
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentEntryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: 'po' | 'invoice' | 'grn' | null;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSave: () => void;
  isLoading: boolean;
}

export const DocumentEntryDialog = ({
  isOpen,
  onClose,
  documentType,
  inputValue,
  onInputChange,
  onSave,
  isLoading,
}: DocumentEntryDialogProps) => {
  const { toast } = useToast();

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {documentType === 'po' && 'Enter PO Number'}
            {documentType === 'invoice' && 'Enter Invoice Number'}
            {documentType === 'grn' && 'Enter GRN Number'}
          </DialogTitle>
          <DialogDescription>
            {documentType === 'po' && 'Enter the purchase order number for this asset'}
            {documentType === 'invoice' && 'Enter the invoice number for this asset'}
            {documentType === 'grn' && 'Enter the goods receipt note number for this asset'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              placeholder={
                documentType === 'po'
                  ? 'e.g. PO-2023-001'
                  : documentType === 'invoice'
                  ? 'e.g. INV-2023-001'
                  : 'e.g. GRN-2023-001'
              }
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
            />
          </div>
          {(documentType === 'po' || documentType === 'invoice') && (
            <div>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Upload feature",
                    description: "File upload will be implemented soon"
                  });
                }}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload File (PDF/JPG)
              </Button>
              <div className="text-xs text-muted-foreground mt-2">
                Max file size: 5MB. Only PDF or JPG formats allowed.
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={onSave}
            disabled={!inputValue || isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
