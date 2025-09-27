// components/ConversationHistoryDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Conversation {
  conversationId: string;
  updatedAt: string;
  lastMessage?: string;
  messages?: any[];
}

interface ConversationHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversations: Conversation[];
  onLoadConversation: (convId: string) => void;
  onDeleteConversation: (convId: string) => void;
  formatTimestamp: (timestamp: string) => string;
  getMessageCount: (conversation: Conversation) => number;
}

export const ConversationHistoryDialog = ({
  open,
  onOpenChange,
  conversations,
  onLoadConversation,
  onDeleteConversation,
  formatTimestamp,
  getMessageCount,
}: ConversationHistoryDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Conversation History</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-64">
          {conversations.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No saved conversations found
            </p>
          ) : (
            <div className="space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv.conversationId}
                  className="p-3 border rounded-lg hover:bg-muted"
                >
                  <div className="flex justify-between items-start">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => onLoadConversation(conv.conversationId)}
                    >
                      <p className="text-sm font-medium">
                        {conv.conversationId.slice(-8)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getMessageCount(conv)} messages
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(conv.updatedAt)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conv.conversationId);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {conv.lastMessage && (
                    <p 
                      className="text-xs text-muted-foreground mt-1 truncate cursor-pointer"
                      onClick={() => onLoadConversation(conv.conversationId)}
                    >
                      {conv.lastMessage}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};