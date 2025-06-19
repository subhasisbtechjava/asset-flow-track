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
import DocumentsManager from "./DocumentsManager";
import { storeAPI } from "@/api/storeAPI";

interface MultipleDocumentsPopoverProps {
  storeId: string;
  assetName: string;
  assetId: string;
  documentType: "po" | "invoice" | "grn";
  documentCount: number;
  hasDocuments: boolean;
  documentList;
  onUpdate: (data) => void;
  vendorPoInvoiceDetails:string;
  onPoDelete: () => void;
}

const MultipleDocumentsPopover: React.FC<MultipleDocumentsPopoverProps> = ({
  storeId,
  assetName,
  assetId,
  documentType,
  documentList,
  documentCount: initialDocumentCount,
  hasDocuments: initialHasDocuments,
  onUpdate,
  vendorPoInvoiceDetails,
  onPoDelete
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [documentCount, setDocumentCount] = useState(initialDocumentCount);
  const [hasDocuments, setHasDocuments] = useState(initialHasDocuments);

  useEffect(() => {

  }, [storeId, assetId, documentType, initialDocumentCount,documentList,hasDocuments]);

  // const getButtonLabel = () => {
  //   if (!hasDocuments) return "Not Done";
  //   return documentCount > 1 ? `${documentCount} Added` : "Done";
  // };

  const handleUpdate = (data) => {
    // Refresh document count when documents are added or removed
    const refreshDocuments = async () => {
      try {
        // const documents = await storeAPI.getStoreDocuments(storeId, assetId, documentType);
        // setDocumentCount(documents.length);
        // setHasDocuments(documents.length > 0);
        onUpdate(data); // Call the parent's onUpdate function
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
            Manage {documentType}s
          </h4>

          <DocumentsManager
            documentCount={documentList?.length}
            documentList={documentList}
            hasDocuments={documentList?.length>0 }
            storeId={storeId}
            assetId={assetId}
            documentType={documentType}
            onUpdate={handleUpdate}
            vendorPoInvoiceDetails={vendorPoInvoiceDetails}
            onPoDelete={onPoDelete}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MultipleDocumentsPopover;
