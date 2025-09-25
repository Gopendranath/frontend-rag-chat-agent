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
import { Separator } from "@/components/ui/separator";
import { Loader2, Send, Square, Trash2 } from "lucide-react";
import { Response } from "@/components/ai-elements/response";
import { Message, MessageContent } from "@/components/ai-elements/message";

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
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
            onSubmit={handleSubmit}
            className="flex w-full items-center gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              disabled={isLoading}
              className="flex-grow rounded-xl"
            />
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
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
