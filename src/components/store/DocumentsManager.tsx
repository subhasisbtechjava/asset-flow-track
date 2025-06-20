import React, { useState, useEffect } from "react";
import { Plus, X, FileCheck, Download,Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import FileCard from "./fileCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { storeAPI } from "@/api/storeAPI";
import LabelMandatorySymbol from "../ui/labeMandatorySymbol";
import { downloadFile } from "@/utility/download";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface Document {
  id: string;
  documentNumber: string;
  documentDate?: Date | null;
  documentAmount?: string;
  attachmentUrl?: string;
  attachmentName?: string;
}

interface DocumentsManagerProps {
  storeId: string;
  assetId: number;
  documentType: "po" | "invoice" | "grn";
  existingDocuments?: Document[];
  onUpdate: (data) => void;
  documentCount: number;
  hasDocuments: boolean;
  documentList;
  vendorPoInvoiceDetails:string;
  onPoDelete: () => void;
}

const DocumentsManager: React.FC<DocumentsManagerProps> = ({
  storeId,
  assetId,
  documentType,
  existingDocuments = [],
  documentCount,
  documentList,
  hasDocuments,
vendorPoInvoiceDetails,
  onUpdate,
  onPoDelete,
}) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>(existingDocuments);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [newDocument, setNewDocument] = useState<{
    documentNumber: string;
    documentDate: Date | null;
    documentAmount: string;
    attachment: { name: string; base64: string; file } | null;
  }>({
    documentNumber: "",
    documentDate: null,
    documentAmount: "",
    attachment: null,
  });

  useEffect(() => {
    fetchDocuments();
  }, [storeId, assetId, documentType]);

  const fetchDocuments = async () => {
    try {
      const data = await storeAPI.getStoreDocuments(
        storeId,
        assetId,
        documentType
      );
      if (data && Array.isArray(data)) {
        setDocuments(data);
      }
    } catch (error) {
      console.error(`Error fetching ${documentType} documents:`, error);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await fileToBase64(file);
        setNewDocument({
          ...newDocument,
          attachment: {
            name: file.name,
            base64: base64,
            file: file,
          },
        });
      } catch (error) {
        console.error("Error converting file to base64:", error);
        toast({
          title: "Error",
          description: "Failed to process the file",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddDocument = async () => {
    //if( (documentType == "grn"?(!newDocument.documentNumber ):( !newDocument.documentNumber || !newDocument.attachment)) {
    if ((documentType == "grn" || documentType == "po")?(!newDocument.documentNumber ):( !newDocument.documentNumber || !newDocument.attachment)) {
      toast({
        title: "Validation Error",
        description: `Please provide document number and attachment for the ${documentType.toUpperCase()}`,
        variant: "destructive",
      });
      return;
    }

    // Additional validation for invoice type
    if (
      documentType === "invoice" &&
      (!newDocument.documentDate || !newDocument.documentAmount)
    ) {
      toast({
        title: "Validation Error",
        description: "Please provide date and amount for the invoice",
        variant: "destructive",
      });
      return;
    }

    try {
      const documentData: any = {
        [`${documentType}_number`]: newDocument.documentNumber,
        [`${documentType}_attachment_name`]: newDocument.attachment?.name,
        [`${documentType}_attachment`]: newDocument.attachment?.base64,
      };

      // Add invoice specific fields if applicable
      if (documentType === "invoice") {
        const dateOnly = newDocument.documentDate
          ? new Date(newDocument.documentDate).toISOString().split("T")[0]
          : null;
        documentData.invoice_date = dateOnly;
        documentData.invoice_amount = newDocument.documentAmount;
      }

      onUpdate(newDocument);
      toast({
        title: "Success",
        description: `${documentType.toUpperCase()} added successfully`,
      });

      // Reset form and refresh documents
      setNewDocument({
        documentNumber: "",
        documentDate: null,
        documentAmount: "",
        attachment: null,
      });
      setIsAddingNew(false);
      // fetchDocuments();
    } catch (error) {
      console.error(`Error adding ${documentType}:`, error);
      toast({
        title: "Error",
        description: `Failed to add ${documentType.toUpperCase()}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await storeAPI.deleteStoreDocument(
        storeId,
        assetId,
        documentType,
        documentId
      );
      toast({
        title: "Success",
        description: `${documentType.toUpperCase()} deleted successfully`,
      });
      fetchDocuments();
      onUpdate(newDocument);
    } catch (error) {
      console.error(`Error deleting ${documentType}:`, error);
      toast({
        title: "Error",
        description: `Failed to delete ${documentType.toUpperCase()}`,
        variant: "destructive",
      });
    }
  };


     const handleDeletePO = async (id: number,pono:string) => {
    try {
         await storeAPI.deletePO(
        id,
        pono,
      );
      toast({
        title: "Success",
        description: `${documentType.toUpperCase()} deleted successfully`,
      });
      //fetchDocuments();
      //onUpdate(newDocument);
      onPoDelete();
    } catch (error) {
      console.error(`Error deleting ${documentType}:`, error);
      toast({
        title: "Error",
        description: `Failed to delete ${documentType.toUpperCase()}`,
        variant: "destructive",
      });
    }
  };





  return (
    <div className="space-y-4">
     
      {/*
      <div className="grid grid-cols-1 gap-3">
    
        {documentList?.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
          >
            <div className="flex flex-col">
              <div className="font-medium">
                {documentType.toUpperCase()}  : {documentType=="invoice"? doc.invoice_no:documentType=="po"?doc?.po_number:documentType=="grn"?doc?.grn_val:""}
              </div>
              {documentType=="invoice" && doc.invoice_date && (
                <div className="text-sm text-muted-foreground">
                  Date: {format(new Date(doc.invoice_date), "PP")}
                </div>
              )}
              {doc.documentAmount && (
                <div className="text-sm text-muted-foreground">
                  Amount: ₹{doc.documentAmount}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {(documentType=="invoice"? doc?.invoice_attachment_url :documentType=="po"? doc?.po_attachment_url :false ) && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => downloadFile ( documentType=="invoice" ?doc.invoice_attachment_url:documentType=="po"?doc.po_attachment_url:"")}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
             
            </div>
          </div>
        ))}
      </div>
        */}

<div className="grid grid-cols-1 gap-3">
  {documentList?.map((doc) => (
    <div
      key={doc.id}
      className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
    >
      <div className="flex flex-col">
        <div className="font-medium">
          {documentType.toUpperCase()} : {documentType === "invoice" ? doc.invoice_no : documentType === "po" ? doc?.po_number : documentType === "grn" ? doc?.grn_val : ""}
        </div>
        {documentType === "invoice" && doc.invoice_date && (
          <div className="text-sm text-muted-foreground">
            Date: {format(new Date(doc.invoice_date), "PP")}
          </div>
        )}
        {doc.documentAmount && (
          <div className="text-sm text-muted-foreground">
            Amount: ₹{doc.documentAmount}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {(documentType === "invoice" ? doc?.invoice_attachment_url : documentType === "po" ? doc?.po_attachment_url : false) && (
          <Button
            size="icon"
            variant="ghost"
            className="text-muted-foreground hover:bg-transparent"
            onClick={() =>
              downloadFile(
                documentType === "invoice"
                  ? doc.invoice_attachment_url
                  : documentType === "po"
                  ? doc.po_attachment_url
                  : ""
              )
            }
          >
            <Download className="h-4 w-4" />
          </Button>
        )}

        {/* 🗑️ Trash button */}
        {documentType === "po" &&
  (! vendorPoInvoiceDetails || vendorPoInvoiceDetails.trim() === "" || !vendorPoInvoiceDetails.includes(doc?.po_number) ) && (
    // <Button
    //   size="icon"
    //   variant="ghost"
    //   className="text-red-500"
    //   onClick={() => handleDeletePO(assetId,doc?.po_number)}
    // >
    //   <Trash2 className="h-4 w-4" />
    // </Button>

    <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                              <Button variant="ghost" size="icon">
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Delete</span>
                                              </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                              <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                  This will delete the po no {doc?.po_number} from list.                                                 
                                                </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                onClick={() => handleDeletePO(assetId,doc?.po_number)}
                                                 
                                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                >
                                                  Delete                                                
                                                </AlertDialogAction>
                                              </AlertDialogFooter>
                                            </AlertDialogContent>
                                          </AlertDialog>



)}


      </div>
    </div>
  ))}
</div>




      {/* Add new document form */}
      {isAddingNew ? (
        <div className="border p-4 rounded-md space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">
              Add New {documentType.toUpperCase()}
            </h3>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsAddingNew(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor={`${documentType}-number`}>
                {documentType.toUpperCase()} Number <LabelMandatorySymbol />
              </Label>
              <Input
                id={`${documentType}-number`}
                placeholder={`Enter ${documentType.toUpperCase()} number`}
                value={newDocument.documentNumber}
                onChange={(e) =>
                  setNewDocument({
                    ...newDocument,
                    documentNumber: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>

            {documentType === "invoice" && (
              <>
                <div>
                  <Label htmlFor="invoice-date">
                    Invoice Date <LabelMandatorySymbol />
                  </Label>
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left mt-1"
                      >
                        {newDocument.documentDate ? (
                          format(newDocument.documentDate, "PPP")
                        ) : (
                          <span className="text-muted-foreground">
                            Pick a date
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newDocument.documentDate || undefined}
                        onSelect={(date) => {
                          setNewDocument({
                            ...newDocument,
                            documentDate: date,
                          });
                          setIsCalendarOpen(false);
                        }}
                        disabled={{ after: new Date() }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="invoice-amount">
                    Invoice Amount (₹) <LabelMandatorySymbol />
                  </Label>
                  <Input
                    id="invoice-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={newDocument.documentAmount}
                    onChange={(e) =>
                      setNewDocument({
                        ...newDocument,
                        documentAmount: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </>
            )}

           {/* {documentType !== "grn" && <div> */}
           {documentType !== "grn" && documentType !== "po" && <div>
              <Label htmlFor={`${documentType}-attachment`}>
                Attachment <LabelMandatorySymbol />
              </Label>
              <Input
                id={`${documentType}-attachment`}
                type="file"
                onChange={handleFileChange}
                className="mt-1"
              />
            </div>}

            {newDocument.attachment && (
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                <FileCheck className="h-4 w-4" />
                <span className="text-sm truncate">
                  {newDocument.attachment.name}
                </span>
              </div>
            )}


            {/* BELOW IS PREVIOUS DEVELOPEMENT */}

            {/* <Button
              onClick={handleAddDocument}
              disabled={documentType == "grn"?(!newDocument.documentNumber)
:                (!newDocument.documentNumber ||
                !newDocument.attachment ||
                (documentType === "invoice" &&
                  (!newDocument.documentDate || !newDocument.documentAmount)))
              }
              className="w-full"
            >
              Add {documentType.toUpperCase()}
            </Button> */}


            {/* BELOW IS NEW DEVELOPEMENT */}
            <Button
              onClick={handleAddDocument}
              disabled={(documentType == "grn" || documentType == "po")?(!newDocument.documentNumber)
:                (!newDocument.documentNumber ||
                !newDocument.attachment ||
                (documentType === "invoice" &&
                  (!newDocument.documentDate || !newDocument.documentAmount)))
              }
              className="w-full"
            >
              Add {documentType.toUpperCase()}
            </Button>  



          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => setIsAddingNew(true)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New {documentType.toUpperCase()}
        </Button>
      )}
    </div>
  );
};

export default DocumentsManager;
