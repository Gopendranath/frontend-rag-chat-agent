// components/ChatInput.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Square, Paperclip, X } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  selectedFiles: File[];
  fileInputRef: any;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onTriggerFileInput: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onStopGeneration: () => void;
}

export const ChatInput = ({
  input,
  setInput,
  isLoading,
  selectedFiles,
  fileInputRef,
  onKeyDown,
  onFileChange,
  onRemoveFile,
  onTriggerFileInput,
  onSubmit,
  onStopGeneration,
}: ChatInputProps) => {
  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-2">
      {/* File attachments preview */}
      {selectedFiles.length > 0 && (
        <div className="absolute bottom-full left-0 w-full flex flex-wrap gap-2 mb-2 bg-background p-2 shadow-lg rounded overflow-y-auto max-h-32">
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
                onClick={() => onRemoveFile(index)}
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
          onChange={onFileChange}
          multiple
          accept=".pdf,.txt,.doc,.docx,image/*"
          className="hidden"
        />
        
        {/* File attachment button */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onTriggerFileInput}
          disabled={isLoading}
          className="rounded-full"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        
        {/* Text input */}
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Continue the conversation..."
          disabled={isLoading}
          className="flex-grow rounded-xl"
        />
        
        {/* Send/Stop button */}
        {isLoading ? (
          <Button
            type="button"
            onClick={onStopGeneration}
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
  );
};