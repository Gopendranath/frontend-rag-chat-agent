// components/DropdownMenu.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, History, Save, Trash2 } from "lucide-react";

interface DropdownMenuProps {
  onSaveClick: () => void;
  onHistoryClick: () => void;
  onClearClick: () => void;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}

export const ChatDropdownMenu = ({
  onSaveClick,
  onHistoryClick,
  onClearClick,
  saveStatus,
}: DropdownMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onSaveClick}>
          <Save className="h-4 w-4 mr-2" />
          {saveStatus === 'saving' ? 'Saving...' : 
           saveStatus === 'saved' ? 'Saved!' : 
           saveStatus === 'error' ? 'Error - Retry' : 'Save'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onHistoryClick}>
          <History className="h-4 w-4 mr-2" />
          History
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onClearClick}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};