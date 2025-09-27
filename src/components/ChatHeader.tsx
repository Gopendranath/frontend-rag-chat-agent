// components/ChatHeader.tsx
import { Badge } from "@/components/ui/badge";
import { ChatDropdownMenu } from "@/components/DropdownMenu";

interface ChatHeaderProps {
  conversationId: string | null;
  messageCount: number;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  onHistoryClick: () => void;
  onSaveClick: () => void;
  onClearClick: () => void;
}

export const ChatHeader = ({
  conversationId,
  messageCount,
  saveStatus,
  onHistoryClick,
  onSaveClick,
  onClearClick,
}: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <div className="text-xl font-semibold">
          RAG Chat Assistant
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