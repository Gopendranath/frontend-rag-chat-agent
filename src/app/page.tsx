// app/page.tsx
"use client";

import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Square, Trash2, Paperclip, X } from "lucide-react";
import { Response } from "@/components/ai-elements/response";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { useState, useRef, ChangeEvent } from "react";

export default function ChatPage() {
  const {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
    error,
    stopGeneration,
    resetChat,
  } = useChat();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(selectedFiles);
      setSelectedFiles([]); // Clear files after submission
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(selectedFiles);
    setSelectedFiles([]); // Clear files after submission
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      <Card className="flex flex-col h-full shadow-md border">
        {/* Header */}
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              RAG Chat Assistant
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => alert('History feature coming soon!')}
              >
                History
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetChat}
                disabled={isLoading}
                className="flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Chat area */}
        <CardContent className="flex-grow p-0">
          <ScrollArea className="h-[calc(100vh-220px)] px-4 py-3">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-center">
                <p>Start a conversation by typing a message below</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <Message from={message.role} key={message.id}>
                    <MessageContent>
                      <Response>{message.content}</Response>
                      {/* Display file attachments for user messages */}
                      {message.role === 'user' && message.files && message.files.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-1">Attachments:</p>
                          <div className="flex flex-wrap gap-2">
                            {message.files.map((file, index) => (
                              <div key={index} className="flex items-center gap-1 text-sm bg-muted px-2 py-1 rounded">
                                {file.type.startsWith('image/') ? (
                                  <img 
                                    src={file.url} 
                                    alt={file.name} 
                                    className="h-8 w-8 object-cover rounded"
                                  />
                                ) : (
                                  <Paperclip className="h-4 w-4" />
                                )}
                                <span className="max-w-[150px] truncate">{file.name}</span>
                                <span className="text-muted-foreground text-xs">
                                  ({(file.size / 1024).toFixed(1)}KB)
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </MessageContent>
                  </Message>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <Card className="max-w-[80%] bg-muted rounded-2xl">
                      <CardContent className="pt-4 px-4 pb-3">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">
                            Assistant is thinking...
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {error && (
                  <div className="flex justify-start">
                    <Card className="max-w-[80%] bg-destructive/10 border border-destructive/30 rounded-2xl">
                      <CardContent className="pt-4 px-4 pb-3">
                        <p className="text-sm text-destructive">
                          Error: {error}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>

        {/* Input area */}
        <CardFooter className="pt-3 border-t">
          <form
            onSubmit={onSubmit}
            className="flex w-full flex-col gap-2"
          >
            {/* File attachments preview */}
            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-1 text-sm bg-muted px-2 py-1 rounded">
                    {file.type.startsWith('image/') ? (
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={file.name} 
                        className="h-8 w-8 object-cover rounded"
                      />
                    ) : (
                      <Paperclip className="h-4 w-4" />
                    )}
                    <span className="max-w-[100px] truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex w-full items-center gap-2">
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept=".pdf,image/*"
                className="hidden"
              />
              
              {/* File attachment button */}
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={triggerFileInput}
                disabled={isLoading}
                className="rounded-full"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              
              {/* Text input */}
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                disabled={isLoading}
                className="flex-grow rounded-xl"
              />
              
              {/* Send/Stop button */}
              {isLoading ? (
                <Button
                  type="button"
                  onClick={stopGeneration}
                  size="icon"
                  variant="destructive"
                  className="rounded-full"
                >
                  <Square className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  className="rounded-full"
                  disabled={!input.trim() && selectedFiles.length === 0}
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}