
import React, { useState, useEffect } from 'react';
import { Plus, X, FileCheck, Download } from 'lucide-react';
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
  assetId: string;
  documentType: 'po' | 'invoice' | 'grn';
  existingDocuments?: Document[];
  onUpdate: () => void;
}

const DocumentsManager: React.FC<DocumentsManagerProps> = ({
  storeId,
  assetId,
  documentType,
  existingDocuments = [],
  onUpdate
}) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>(existingDocuments);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [newDocument, setNewDocument] = useState<{
    documentNumber: string;
    documentDate: Date | null;
    documentAmount: string;
    attachment: { name: string; base64: string } | null;
  }>({
    documentNumber: '',
    documentDate: null,
    documentAmount: '',
    attachment: null
  });
  
  useEffect(() => {
    fetchDocuments();
  }, [storeId, assetId, documentType]);
  
  const fetchDocuments = async () => {
    try {
      const data = await storeAPI.getStoreDocuments(storeId, assetId, documentType);
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
        if (typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error('Failed to convert file to base64'));
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
            base64: base64
          }
        });
      } catch (error) {
        console.error('Error converting file to base64:', error);
        toast({
          title: "Error",
          description: "Failed to process the file",
          variant: "destructive"
        });
      }
    }
  };

  const handleAddDocument = async () => {
    if (!newDocument.documentNumber || !newDocument.attachment) {
      toast({
        title: "Validation Error",
        description: `Please provide document number and attachment for the ${documentType.toUpperCase()}`,
        variant: "destructive"
      });
      return;
    }

    // Additional validation for invoice type
    if (documentType === 'invoice' && (!newDocument.documentDate || !newDocument.documentAmount)) {
      toast({
        title: "Validation Error",
        description: "Please provide date and amount for the invoice",
        variant: "destructive"
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
      if (documentType === 'invoice') {
        const dateOnly = newDocument.documentDate ? new Date(newDocument.documentDate).toISOString().split('T')[0] : null;
        documentData.invoice_date = dateOnly;
        documentData.invoice_amount = newDocument.documentAmount;
      }

      await storeAPI.addStoreDocument(storeId, assetId, documentType, documentData);
      
      toast({
        title: "Success",
        description: `${documentType.toUpperCase()} added successfully`
      });
      
      // Reset form and refresh documents
      setNewDocument({
        documentNumber: '',
        documentDate: null,
        documentAmount: '',
        attachment: null
      });
      setIsAddingNew(false);
      fetchDocuments();
      onUpdate();
    } catch (error) {
      console.error(`Error adding ${documentType}:`, error);
      toast({
        title: "Error",
        description: `Failed to add ${documentType.toUpperCase()}`,
        variant: "destructive"
      });
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await storeAPI.deleteStoreDocument(storeId, assetId, documentType, documentId);
      toast({
        title: "Success",
        description: `${documentType.toUpperCase()} deleted successfully`
      });
      fetchDocuments();
      onUpdate();
    } catch (error) {
      console.error(`Error deleting ${documentType}:`, error);
      toast({
        title: "Error",
        description: `Failed to delete ${documentType.toUpperCase()}`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* List existing documents */}
      <div className="grid grid-cols-1 gap-3">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
            <div className="flex flex-col">
              <div className="font-medium">
                {documentType.toUpperCase()} #{doc.documentNumber}
              </div>
              {doc.documentDate && (
                <div className="text-sm text-muted-foreground">
                  Date: {format(new Date(doc.documentDate), 'PP')}
                </div>
              )}
              {doc.documentAmount && (
                <div className="text-sm text-muted-foreground">
                  Amount: ₹{doc.documentAmount}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {doc.attachmentUrl && (
                <Button size="icon" variant="ghost" onClick={() => window.open(doc.attachmentUrl)}>
                  <Download className="h-4 w-4" />
                </Button>
              )}
              <Button 
                size="icon" 
                variant="destructive" 
                onClick={() => handleDeleteDocument(doc.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add new document form */}
      {isAddingNew ? (
        <div className="border p-4 rounded-md space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Add New {documentType.toUpperCase()}</h3>
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
                onChange={(e) => setNewDocument({...newDocument, documentNumber: e.target.value})}
                className="mt-1"
              />
            </div>
            
            {documentType === 'invoice' && (
              <>
                <div>
                  <Label htmlFor="invoice-date">
                    Invoice Date <LabelMandatorySymbol />
                  </Label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left mt-1"
                      >
                        {newDocument.documentDate ? (
                          format(newDocument.documentDate, 'PPP')
                        ) : (
                          <span className="text-muted-foreground">Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newDocument.documentDate || undefined}
                        onSelect={(date) => {
                          setNewDocument({...newDocument, documentDate: date});
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
                    onChange={(e) => setNewDocument({...newDocument, documentAmount: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </>
            )}
            
            <div>
              <Label htmlFor={`${documentType}-attachment`}>
                Attachment <LabelMandatorySymbol />
              </Label>
              <Input
                id={`${documentType}-attachment`}
                type="file"
                onChange={handleFileChange}
                className="mt-1"
              />
            </div>
            
            {newDocument.attachment && (
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                <FileCheck className="h-4 w-4" />
                <span className="text-sm truncate">{newDocument.attachment.name}</span>
              </div>
            )}
            
            <Button 
              onClick={handleAddDocument}
              disabled={
                !newDocument.documentNumber || 
                !newDocument.attachment ||
                (documentType === 'invoice' && (!newDocument.documentDate || !newDocument.documentAmount))
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
