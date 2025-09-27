// components/ChatMessages.tsx
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { Response } from "@/components/ai-elements/response";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Paperclip } from "lucide-react";

interface FileAttachment {
  name: string;
  size: number;
  type: string;
  url: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  files?: FileAttachment[];
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  formatTimestamp: (timestamp: string) => string;
  messagesEndRef: any
}

export const ChatMessages = ({
  messages,
  isLoading,
  error,
  formatTimestamp,
  messagesEndRef,
}: ChatMessagesProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-220px)] px-4 py-3">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted-foreground text-center">
          <div>
            <p className="mb-2">Start a conversation by typing a message below</p>
            <p className="text-xs">Your conversation will be automatically saved and can be resumed later</p>
          </div>
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
                      {message.files.map((file, fileIndex) => (
                        <div key={fileIndex} className="flex items-center gap-1 text-sm bg-muted px-2 py-1 rounded">
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
                
                {/* Message timestamp */}
                <p className="text-xs text-muted-foreground mt-2">
                  {formatTimestamp(message.timestamp)}
                </p>
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
          
          <div ref={messagesEndRef} />
        </div>
      )}
    </ScrollArea>
  );
};