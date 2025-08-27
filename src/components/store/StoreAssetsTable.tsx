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
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight
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
import { assetAPI } from "@/api/storeAPI";
import { copyFileSync } from "fs";

interface StoreAssetsTableProps {
  storeId: string;
  storeAssets: StoreAsset[];
  storeStatus:string;
  isLoading: boolean;
  onToggleStatus;
  onToggleStatusWithFormData,
  onDocumentDialogOpen: (
    assetId: string,
    type: "po" | "invoice" | "grn"
  ) => void;
  onInputChange: (value: string) => void;
  onSaveDocument: () => void;
  vendorPoInvoiceDetails:string;
  onPoDelete: () => void;
}

interface FileUpload {
  name: string;
  url: string;
  date?: Date;
}

export const StoreAssetsTable = ({
  storeId,
  storeAssets,
  storeStatus,
  isLoading,
  onToggleStatus,
  onToggleStatusWithFormData,
  onDocumentDialogOpen,
  onInputChange,
  onSaveDocument,
  vendorPoInvoiceDetails,
  onPoDelete,
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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20); // You can make this configurable

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

  const handleDownloadDetails = async () => {
    console.log("Download details clicked");
    const csvResponse = await assetAPI.downloadDetails(storeId);
    
    const csvString = [
        [
            "City","Brand", "Store Code", 
            "Store Name", "Format", "Description", "Category",
            "Vendor Name", "Amount Without GST", "Amount With GST",
            "Invoice No","Invoice Date","Purchase No", "GRN No","Additional Details","Display Name"
        ],
        ...csvResponse.map(item => [          
            item.city,            
            item.brand,
            item.storecode,
            `"${item.name.replace(/"/g, '""')}"`,  // Wrap in quotes in case of commas
            item.format,
            `"${item.assets_name.replace(/"/g, '""')}"`,
            item.assets_category,
            `"${item.vendor_name.replace(/"/g, '""')}"`,
            item.actual_without_gst,
            item.actual_with_gst,
            //`"${item.invoice_dtls.replace(/"/g, '""')}"`,  // This keeps invoice data in one column           
            item.invoice_no,
            item.invoice_date,
            item.purchase_no,
            item.grnno,
             `"${item.addtional_description.replace(/[\r\n,]/g, "")}"`,
            item.display_name
        ].map(field => typeof field === 'string' ? field : String(field))) // Ensure all fields are strings
    ]
    .map(row => row.join(','))
    .join('\n');

    // Create and trigger download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "Store_Assets_Report.csv";
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
};



   // Calculate pagination
      const totalItems = storeAssets.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);

      // Get current items
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = storeAssets.slice(indexOfFirstItem, indexOfLastItem);

      // Change page
      const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
      const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
      const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
      const firstPage = () => setCurrentPage(1);
      const lastPage = () => setCurrentPage(totalPages);

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

    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={handleDownloadDetails} // You must define this handler
        className="flex items-center gap-2"
      >
        <Download className="mr-2 h-4 w-4" />
        Download Details
      </Button>
    </div>
  </div>
</CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead className="w-[100px]">Supplier</TableHead>
                  <TableHead className="w-[100px]">Description</TableHead>
                  <TableHead className="w-[100px]">Display Name</TableHead>
                  <TableHead className="w-[100px]">Quantity</TableHead>
                  <TableHead className="w-[120px]">PO</TableHead>
                  <TableHead className="w-[120px]">Invoice</TableHead>
                  <TableHead className="w-[120px]">GRN</TableHead>
                  <TableHead className="w-[100px]">Tagging</TableHead>
                  <TableHead className="w-[100px]">Approval</TableHead>
                  <TableHead className="w-[100px]">Audit</TableHead>
                  <TableHead className="w-[100px]">Booking</TableHead>
                  <TableHead className="w-[100px]">History</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((storeAsset) => {
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
                        vendorPoInvoiceDetails={vendorPoInvoiceDetails}
                        onPoDelete={onPoDelete}
                      />
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        {storeStatus == 'in_progress'&&(
                          <>
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
                        </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        { totalItems > itemsPerPage && (
                      <div className="flex items-center justify-center gap-4 px-2 mt-4">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={firstPage}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="flex items-center justify-center text-sm font-medium mx-4">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={lastPage}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
                    ) }
      </CardContent>
    </Card>
  );
};
