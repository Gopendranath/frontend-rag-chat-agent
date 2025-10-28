// components/ChatHeader.tsx
"use client";
import { Badge } from "@/components/ui/badge";
import { ChatDropdownMenu } from "@/components/DropdownMenu";

interface ChatHeaderProps {
  conversationId: string | null;
  messageCount: number;
  getDocs: boolean;
  saveStatus: "idle" | "saving" | "saved" | "error";
  onHistoryClick: () => void;
  onSaveClick: () => void;
  onClearClick: () => void;
  setGetDocs: (getDocs: boolean) => void;
}

export const ChatHeader = ({
  conversationId,
  messageCount,
  getDocs,
  saveStatus,
  onHistoryClick,
  onSaveClick,
  onClearClick,
  setGetDocs,
}: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <div className="flex items-center justify-between text-xl font-semibold">
          <span>RAG Chat Assistant</span>
          <button
            className={`text-sm ml-4 transition-colors duration-200 ease-in-out cursor-pointer ${
              getDocs ? "text-blue-500" : "text-gray-600 hover:text-blue-500"
            }`}
            onClick={() => setGetDocs(!getDocs)}
          >
            Docs
          </button>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            ID: {conversationId || "New"}
          </Badge>
          {messageCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {messageCount} messages
            </Badge>
          )}
        </div>
      </div>
      <ChatDropdownMenu
        onSaveClick={onSaveClick}
        onHistoryClick={onHistoryClick}
        onClearClick={onClearClick}
        saveStatus={saveStatus}
      />
    </div>
  );
};
