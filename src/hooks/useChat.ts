// hooks/useChat.ts
import { useState, useRef, useEffect, ChangeEvent } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  files?: FileAttachment[];
}

interface FileAttachment {
  name: string;
  size: number;
  type: string;
  url: string;
}

interface Conversation {
  conversationId: string;
  updatedAt: string;
  lastMessage?: string;
  messages?: any[];
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [conversationHistory, setConversationHistory] = useState<
    Conversation[]
  >([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load conversation history
  const loadConversationHistory = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/chat/history");
      if (response.ok) {
        const data = await response.json();
        setConversationHistory(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load conversation history:", err);
    }
  };

  // Save current conversation
  const saveConversation = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/chat/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          conversationId: conversationId || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save conversation");
      }

      const data = await response.json();
      if (data.success) {
        if (!conversationId) {
          setConversationId(data.conversationId || `conv_${Date.now()}`);
        }
        return data;
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (err) {
      console.error("Error saving conversation:", err);
      throw err;
    }
  };

  // Load a specific conversation
  const loadConversation = async (convId: string) => {
    try {
      console.log(`Loading conversation ${convId}`);
      setConversationId(convId);
      setMessages([]);
      setInput("");
      setError(null);

      // In a real app, we would load the conversation messages here
      setMessages([
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `Conversation ${convId} loaded. This is a placeholder - in a real implementation, the actual messages would be loaded here.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error("Failed to load conversation:", err);
      setError("Failed to load conversation");
    }
  };

  // Delete a conversation
  const deleteConversation = async (convId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/${convId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete conversation");
      }

      const data = await response.json();
      if (data.success) {
        setConversationHistory((prev) =>
          prev.filter((conv) => conv.conversationId !== convId)
        );

        if (conversationId === convId) {
          resetChat();
        }

        return data;
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (err) {
      console.error("Error deleting conversation:", err);
      throw err;
    }
  };

  // Handle form submission
  const handleSubmit = async (files: File[]) => {
    if (!input.trim() && files.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
      files: files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      })),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("messages", JSON.stringify([...messages, userMessage]));
    formData.append("stream", "true");

    const hasDocuments = files.some(
      (file) =>
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "text/plain"
    );
    const hasImages = files.some((file) => file.type.startsWith("image/"));

    if (hasDocuments) {
      formData.append("processDocuments", "true");
    }
    if (hasImages) {
      formData.append("processImages", "true");
    }

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        formData.append("images", file);
      } else if (
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "text/plain"
      ) {
        formData.append("documents", file);
      } else {
        formData.append("files", file);
      }
    });

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let assistantMessageId = Date.now().toString();

      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date().toISOString(),
        },
      ]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.type === "chunk") {
                  assistantMessage += parsed.content;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: assistantMessage }
                        : msg
                    )
                  );  
                } else if (parsed.type === "final_response_chunk") {
                  assistantMessage += parsed.content;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: assistantMessage }
                        : msg
                    )
                  );
                } else if (parsed.type === "error") {
                  setError(parsed.error);
                  break;
                }
              } catch (e) {
                console.error("Error parsing SSE data:", e);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("Error submitting chat:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Stop generation
  const stopGeneration = () => {
    setIsLoading(false);
  };

  // Reset chat
  const resetChat = () => {
    setMessages([]);
    setInput("");
    setError(null);
    setConversationId(null);
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(selectedFiles);
      setSelectedFiles([]);
    }
  };

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  // Remove a file
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    if (selectedFiles[index]) {
      URL.revokeObjectURL(URL.createObjectURL(selectedFiles[index]));
    }
  };

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle form submission
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(selectedFiles);
    setSelectedFiles([]);
  };

  // Load conversation
  const handleLoadConversation = async (convId: string) => {
    await loadConversation(convId);
  };

  // Save conversation
  const handleSaveConversation = async () => {
    setSaveStatus("saving");
    try {
      await saveConversation();
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get message count
  const getMessageCount = (conversation: Conversation) => {
    return conversation.messages?.length || 0;
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    error,
    selectedFiles,
    conversationHistory,
    conversationId,
    saveStatus,
    fileInputRef,
    messagesEndRef,
    loadConversationHistory,
    handleLoadConversation,
    handleSaveConversation,
    deleteConversation,
    resetChat,
    handleKeyDown,
    handleFileChange,
    removeFile,
    triggerFileInput,
    onSubmit,
    stopGeneration,
    formatTimestamp,
    getMessageCount,
  };
};
