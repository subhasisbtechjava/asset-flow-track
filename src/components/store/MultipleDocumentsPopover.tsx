
import React, { useEffect, useState } from 'react';
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
import { storeAPI } from "@/api/storeAPI";

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
  documentCount: initialDocumentCount,
  hasDocuments: initialHasDocuments,
  onUpdate
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [documentCount, setDocumentCount] = useState(initialDocumentCount);
  const [hasDocuments, setHasDocuments] = useState(initialHasDocuments);
  
  useEffect(() => {
    // Fetch the actual document count when the component mounts
    const fetchDocuments = async () => {
      try {
        const documents = await storeAPI.getStoreDocuments(storeId, assetId, documentType);
        setDocumentCount(documents.length);
        setHasDocuments(documents.length > 0);
      } catch (error) {
        console.error(`Error fetching ${documentType} documents:`, error);
      }
    };
    
    fetchDocuments();
  }, [storeId, assetId, documentType, initialDocumentCount]);
  
  const getButtonLabel = () => {
    if (!hasDocuments) return "Not Done";
    return documentCount > 1 ? `${documentCount} Added` : "Done";
  };

  const handleUpdate = () => {
    // Refresh document count when documents are added or removed
    const refreshDocuments = async () => {
      try {
        const documents = await storeAPI.getStoreDocuments(storeId, assetId, documentType);
        setDocumentCount(documents.length);
        setHasDocuments(documents.length > 0);
        onUpdate(); // Call the parent's onUpdate function
      } catch (error) {
        console.error(`Error refreshing ${documentType} documents:`, error);
      }
    };
    
    refreshDocuments();
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
            onUpdate={handleUpdate}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MultipleDocumentsPopover;
