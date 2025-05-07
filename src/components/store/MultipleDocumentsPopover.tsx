
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DocumentsManager from './DocumentsManager';

interface MultipleDocumentsPopoverProps {
  storeId: string;
  assetId: string;
  documentType: 'po' | 'invoice' | 'grn';
  documentCount: number;
  hasDocuments: boolean;
  onUpdate: () => void;
}

const MultipleDocumentsPopover: React.FC<MultipleDocumentsPopoverProps> = ({
  storeId,
  assetId,
  documentType,
  documentCount,
  hasDocuments,
  onUpdate
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const getButtonLabel = () => {
    if (!hasDocuments) return "Not Done";
    return documentCount > 1 ? `${documentCount} Added` : "Done";
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant={hasDocuments ? "default" : "outline"}
              size="sm"
              className={hasDocuments ? "w-full bg-green-500" : "w-full"}
            >
              {getButtonLabel()}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {hasDocuments
            ? `${documentCount} ${documentType.toUpperCase()}${documentCount > 1 ? 's' : ''} Added`
            : `Click to add ${documentType.toUpperCase()}`}
        </TooltipContent>
      </Tooltip>
      <PopoverContent className="w-96 p-4">
        <div className="space-y-4">
          <h4 className="font-medium text-lg capitalize">Manage {documentType}s</h4>
          
          <DocumentsManager
            storeId={storeId}
            assetId={assetId}
            documentType={documentType}
            onUpdate={() => {
              onUpdate();
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MultipleDocumentsPopover;
