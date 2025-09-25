// hooks/useChat.ts
import { useState, useRef, useCallback } from 'react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  files?: any[];
  toolCalls?: any[];
}

interface UseChatOptions {
  initialMessages?: Message[];
  conversationId?: string;
  userId?: string;
}

export function useChat({
  initialMessages = [],
  conversationId: initialConversationId,
  userId = 'anonymous',
}: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(
    initialConversationId || `conv_${Date.now()}`
  );
  const [error, setError] = useState<string | null>(null);
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content: input,
      role: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    // Create a placeholder for the assistant message
    const assistantMessageId = `assistant_${Date.now()}`;
    setMessages(prev => [...prev, {
      id: assistantMessageId,
      content: '',
      role: 'assistant',
      timestamp: new Date().toISOString(),
    }]);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('message', input);
      formData.append('conversationId', conversationId);
      formData.append('userId', userId);
      formData.append('streaming', 'true');
      
      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();
      
      // Send request to streaming endpoint
      const response = await fetch('http://localhost:5000/api/v1/chat/stream', {
        method: 'POST',
        body: formData,
        signal: abortControllerRef.current.signal,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        throw new Error('Failed to get response reader');
      }
      
      let buffer = '';
      let assistantContent = '';
      let toolCalls: any[] = [];
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              switch (data.type) {
                case 'chunk':
                  assistantContent += data.content;
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId 
                      ? { ...msg, content: assistantContent } 
                      : msg
                  ));
                  break;
                  
                case 'tool-call':
                  toolCalls.push(data.data);
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId 
                      ? { ...msg, toolCalls: [...toolCalls] } 
                      : msg
                  ));
                  break;
                  
                case 'error':
                  setError(data.message);
                  break;
                  
                case 'end':
                  setIsLoading(false);
                  break;
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
      
      setIsLoading(false);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
        setIsLoading(false);
      }
    }
  }, [input, conversationId, userId]);
  
  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);
  
  const resetChat = useCallback(() => {
    setMessages([]);
    setConversationId(`conv_${Date.now()}`);
    setError(null);
  }, []);
  
  return {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
    error,
    stopGeneration,
    resetChat,
    conversationId,
  };
}