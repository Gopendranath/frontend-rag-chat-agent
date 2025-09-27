// app/page.tsx
"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useChat } from "@/hooks/useChat";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatInput } from "@/components/ChatInput";
import { ConversationHistoryDialog } from "@/components/ConversationHistoryDialog";
import { useState } from "react";

export default function ChatPage() {
  const [showHistory, setShowHistory] = useState(false);
  
  const {
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
  } = useChat();

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      <Card className="flex flex-col h-full shadow-md border">
        {/* Header */}
        <CardHeader className="pb-3 border-b">
          <ChatHeader
            conversationId={conversationId}
            messageCount={messages.length}
            saveStatus={saveStatus}
            onHistoryClick={() => {
              loadConversationHistory();
              setShowHistory(true);
            }}
            onSaveClick={handleSaveConversation}
            onClearClick={resetChat}
          />
        </CardHeader>

        {/* Chat area */}
        <CardContent className="flex-grow p-0">
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            error={error}
            formatTimestamp={formatTimestamp}
            messagesEndRef={messagesEndRef}
          />
        </CardContent>

        {/* Input area */}
        <CardFooter className="pt-3 border-t flex-shrink-0 relative">
          <ChatInput
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            selectedFiles={selectedFiles}
            fileInputRef={fileInputRef}
            onKeyDown={handleKeyDown}
            onFileChange={handleFileChange}
            onRemoveFile={removeFile}
            onTriggerFileInput={triggerFileInput}
            onSubmit={onSubmit}
            onStopGeneration={stopGeneration}
          />
        </CardFooter>
      </Card>

      {/* Conversation History Dialog */}
      <ConversationHistoryDialog
        open={showHistory}
        onOpenChange={setShowHistory}
        conversations={conversationHistory}
        onLoadConversation={(convId) => {
          handleLoadConversation(convId);
          setShowHistory(false);
        }}
        onDeleteConversation={deleteConversation}
        formatTimestamp={formatTimestamp}
        getMessageCount={getMessageCount}
      />
    </div>
  );
}