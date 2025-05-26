import React, { useEffect, useState } from "react";
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
import SupplierDocumentsManager from "./SupplierDocumentsManager";
import { storeAPI } from "@/api/storeAPI";

interface SupplierMultipleDocumentsPopoverProps {
   documentType: "po" | "invoice";
  documentCount: number;
  hasDocuments: boolean;
  documentList;
  onUpdate: (data) => void;

}

const SupplierMultipleDocumentsPopover: React.FC<SupplierMultipleDocumentsPopoverProps> = ({
  documentType,
  documentList,
  documentCount: initialDocumentCount,
  hasDocuments: initialHasDocuments,
  onUpdate,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [documentCount, setDocumentCount] = useState(initialDocumentCount);
  const [hasDocuments, setHasDocuments] = useState(initialHasDocuments);

  useEffect(() => {

  }, [documentType, initialDocumentCount,documentList,hasDocuments]);



  const handleUpdate = (data) => {
    // Refresh document count when documents are added or removed
    const refreshDocuments = async () => {
      try {
       
        onUpdate(data); 
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
              variant={documentList?.length>0 ? "default" : "outline"}
              size="sm"
              className={documentList?.length>0 ? "w-full bg-green-500" : "w-full "}
            >
              {documentList?.length > 1 ? `${documentList?.length } Added` : "Done"}{" "}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {documentList?.length>0 
            ? `${documentList?.length} ${documentType.toUpperCase()}${
                documentList?.length > 1 ? "s" : ""
              } Added`
            : `Click to add ${documentType.toUpperCase()}`}
        </TooltipContent>
      </Tooltip>
      <PopoverContent className="w-96 p-4">
        <div className="space-y-4">
          <h4 className="font-medium text-lg capitalize">
            Manage {documentType === 'po'?documentType.toUpperCase():documentType}
          </h4>

          <SupplierDocumentsManager
            documentCount={documentList?.length}
            documentList={documentList}
            hasDocuments={documentList?.length>0 }           
            documentType={documentType}
            onUpdate={handleUpdate}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SupplierMultipleDocumentsPopover;
