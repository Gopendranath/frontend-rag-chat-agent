// components/ProcessingModeToggle.tsx
import { Button } from "@/components/ui/button";
import { FileText, Image, ToggleLeft, ToggleRight } from "lucide-react";

interface ProcessingModeToggleProps {
  processDocuments: boolean;
  processImages: boolean;
  onToggleDocuments: () => void;
  onToggleImages: () => void;
}

export const ProcessingModeToggle = ({
  processDocuments,
  processImages,
  onToggleDocuments,
  onToggleImages,
}: ProcessingModeToggleProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={processDocuments ? "default" : "outline"}
        size="sm"
        onClick={onToggleDocuments}
        className="flex items-center gap-1"
      >
        {processDocuments ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
        <FileText className="h-4 w-4" />
        Documents
      </Button>
      
      <Button
        variant={processImages ? "default" : "outline"}
        size="sm"
        onClick={onToggleImages}
        className="flex items-center gap-1"
      >
        {processImages ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
        <Image className="h-4 w-4" />
        Images
      </Button>
    </div>
  );
};