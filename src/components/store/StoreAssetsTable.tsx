import {
  AlertTriangle,
  Check,
  Download,
  FileCheck,
  Link,
  Package,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StoreAsset } from "@/types";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import AssetTableRow from "./assetTtableRow";

interface StoreAssetsTableProps {
  storeId: string;
  storeAssets: StoreAsset[];
  isLoading: boolean;
  onToggleStatus;
  onToggleStatusWithFormData,
  onDocumentDialogOpen: (
    assetId: string,
    type: "po" | "invoice" | "grn"
  ) => void;
  onInputChange: (value: string) => void;
  onSaveDocument: () => void;
}

interface FileUpload {
  name: string;
  url: string;
  date?: Date;
}

export const StoreAssetsTable = ({
  storeId,
  storeAssets,
  isLoading,
  onToggleStatus,
  onToggleStatusWithFormData,
  onDocumentDialogOpen,
  onInputChange,
  onSaveDocument,
}: StoreAssetsTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [value, setValue] = useState("");
  // File uploads state management
  const [fileUploads, setFileUploads] = useState<
    Record<string, Record<string, FileUpload[]>>
  >({});
  const [invoiceDates, setInvoiceDates] = useState<Record<string, Date>>({});
  const [invoiceAmounts, setInvoiceAmounts] = useState<Record<string, number>>(
    {}
  );

  const handleFileUpload = (
    assetId: string,
    type: "po" | "invoice",
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const newFiles = Array.from(event.target.files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      date: new Date(),
    }));

    setFileUploads((prev) => ({
      ...prev,
      [assetId]: {
        ...(prev[assetId] || {}),
        [type]: [...(prev[assetId]?.[type] || []), ...newFiles],
      },
    }));

    toast({
      title: "Files uploaded",
      description: `${newFiles.length} file(s) uploaded successfully.`,
    });

    // Reset file input
    event.target.value = "";
  };

  const handleRemoveFile = (
    assetId: string,
    type: "po" | "invoice",
    index: number
  ) => {
    setFileUploads((prev) => {
      const assetFiles = { ...prev[assetId] };
      const typeFiles = [...(assetFiles[type] || [])];
      typeFiles.splice(index, 1);
      assetFiles[type] = typeFiles;
      return { ...prev, [assetId]: assetFiles };
    });
  };

  const handleInvoiceDateChange = (assetId: string, date: Date | undefined) => {
    if (!date) return;
    setInvoiceDates((prev) => ({ ...prev, [assetId]: date }));
  };

  const handleInvoiceAmountChange = (assetId: string, amount: string) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return;
    setInvoiceAmounts((prev) => ({ ...prev, [assetId]: numAmount }));
  };

  const saveInvoiceDetails = (assetId: string) => {
    const date = invoiceDates[assetId];
    const amount = invoiceAmounts[assetId];

    console.log("Saving invoice details:", { assetId, date, amount });

    toast({
      title: "Invoice details saved",
      description: `Invoice details updated successfully.`,
    });

    // In a real app, you would send this data to your backend
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Store Assets</CardTitle>
            <CardDescription>
              Manage store assets and track purchasing progress
            </CardDescription>
          </div>
          {/* <Button 
            variant="outline" 
            onClick={() => navigate(`/stores/${storeId}/add-assets`)}
          >
            <Package className="mr-2 h-4 w-4" />
            Assign Assets
          </Button> */}
      
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead className="w-[100px]">Quantity</TableHead>
                  <TableHead className="w-[120px]">PO</TableHead>
                  <TableHead className="w-[120px]">Invoice</TableHead>
                  <TableHead className="w-[120px]">GRN</TableHead>
                  <TableHead className="w-[100px]">Tagging</TableHead>
                  <TableHead className="w-[100px]">Approval</TableHead>
                  <TableHead className="w-[100px]">Audit</TableHead>
                  <TableHead className="w-[100px]">Booking</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storeAssets.length > 0 ? (
                  storeAssets.map((storeAsset) => {
                    const existingBody = {
                      // approve_val: storeAsset.is_project_head_approved?true:false,
                      // audit_val: storeAsset.is_audit_done?true:false,
                      // booking_val: storeAsset.is_finance_booked?true:false,
                      // tagging_val: storeAsset.isTaggingDone?true:false,
                    };

                    return (
                      <AssetTableRow
                        fileUploads={fileUploads}
                        handleInvoiceAmountChange={handleInvoiceAmountChange}
                        handleFileUpload={handleFileUpload}
                        handleInvoiceDateChange={handleInvoiceDateChange}
                        handleRemoveFile={handleRemoveFile}
                        invoiceAmounts={invoiceAmounts}
                        invoiceDates={invoiceDates}
                        isLoading={isLoading}
                        onDocumentDialogOpen={onDocumentDialogOpen}
                        onInputChange={onInputChange}
                        onSaveDocument={onSaveDocument}
                        onToggleStatus={onToggleStatus}
                        onToggleStatusWithFormData={onToggleStatusWithFormData}
                        storeAsset={storeAsset}
                        storeId={storeId}
                      />
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <AlertTriangle className="h-8 w-8 mb-2" />
                        <p>No assets found for this store</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() =>
                            navigate(`/stores/${storeId}/add-assets`)
                          }
                        >
                          <Package className="mr-2 h-4 w-4" />
                          Assign Assets
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
