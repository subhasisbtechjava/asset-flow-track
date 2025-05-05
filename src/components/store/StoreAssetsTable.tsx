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
          <Button
            variant="default"
            onClick={() => navigate(`/stores/${storeId}/add-assets`)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Manage Assets
          </Button>
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

                    return  (<AssetTableRow  fileUploads={fileUploads} handleInvoiceAmountChange={handleInvoiceAmountChange} handleFileUpload={handleFileUpload} handleInvoiceDateChange={handleInvoiceDateChange} handleRemoveFile={handleRemoveFile} invoiceAmounts={invoiceAmounts} invoiceDates={invoiceDates}isLoading={isLoading} onDocumentDialogOpen={onDocumentDialogOpen} onInputChange={onInputChange} onSaveDocument={onSaveDocument} onToggleStatus={onToggleStatus} storeAsset={storeAsset} storeId= {storeId} /> )
                    
                    // (
                    //   <TableRow key={storeAsset.id}>
                    //     <TableCell>
                    //       <div className="font-medium">
                    //         {storeAsset?.assets_name}
                    //       </div>
                    //       <div className="text-xs text-muted-foreground">
                    //         {storeAsset.asset?.code}
                    //       </div>
                    //     </TableCell>
                    //     <TableCell>
                    //       {storeAsset.quantity}{" "}
                    //       {storeAsset.asset?.unitOfMeasurement}
                    //     </TableCell>

                    //     {/* PO Number with file uploads */}
                    //     <TableCell>
                    //       <Popover>
                    //         <PopoverTrigger asChild>
                    //           <Button
                    //             variant={
                    //               storeAsset.poNumber ? "secondary" : "outline"
                    //             }
                    //             size="sm"
                    //             className="w-full"
                    //           >
                    //             {storeAsset.poNumber || "Not Done"}
                    //           </Button>
                    //         </PopoverTrigger>
                    //         <PopoverContent className="w-80">
                    //           <div className="grid gap-4">
                    //             <div className="space-y-2">
                    //               <h4 className="font-medium leading-none">
                    //                 PO Number
                    //               </h4>
                    //               <p className="text-sm text-muted-foreground">
                    //                 Enter the purchase order number for{" "}
                    //                 {storeAsset.asset?.name}
                    //               </p>
                    //             </div>
                    //             <div className="grid gap-2">
                    //               <Input
                    //                 placeholder="Enter PO number"
                    //                 defaultValue={storeAsset.poNumber || ""}
                    //                 onChange={(e) =>
                    //                   onInputChange(e.target.value)
                    //                 }
                    //               />

                    //               {/* File uploads */}
                    //               <div className="space-y-2 pt-2">
                    //                 <Label
                    //                   htmlFor={`po-upload-${storeAsset.id}`}
                    //                   className="text-sm font-medium"
                    //                 >
                    //                   Upload PO Documents
                    //                 </Label>
                    //                 <div className="flex items-center gap-2">
                    //                   <Input
                    //                     id={`po-upload-${storeAsset.id}`}
                    //                     type="file"
                    //                     multiple
                    //                     className="hidden"
                    //                     onChange={(e) =>
                    //                       handleFileUpload(
                    //                         storeAsset.id,
                    //                         "po",
                    //                         e
                    //                       )
                    //                     }
                    //                   />
                    //                   <Button
                    //                     variant="outline"
                    //                     size="sm"
                    //                     className="w-full"
                    //                     onClick={() =>
                    //                       document
                    //                         .getElementById(
                    //                           `po-upload-${storeAsset.id}`
                    //                         )
                    //                         ?.click()
                    //                     }
                    //                   >
                    //                     <Upload className="mr-2 h-4 w-4" />
                    //                     Upload Files
                    //                   </Button>
                    //                 </div>

                    //                 {/* File list */}
                    //                 {fileUploads[storeAsset.id]?.po?.length >
                    //                   0 && (
                    //                   <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                    //                     <p className="text-xs font-medium">
                    //                       Uploaded files:
                    //                     </p>
                    //                     {fileUploads[storeAsset.id].po.map(
                    //                       (file, index) => (
                    //                         <div
                    //                           key={index}
                    //                           className="flex items-center justify-between bg-muted p-2 rounded-md"
                    //                         >
                    //                           <div className="flex items-center text-xs truncate">
                    //                             <FileCheck className="h-3 w-3 mr-1" />
                    //                             <span className="truncate max-w-[150px]">
                    //                               {file.name}
                    //                             </span>
                    //                           </div>
                    //                           <div className="flex items-center gap-1">
                    //                             <Button
                    //                               size="icon"
                    //                               variant="ghost"
                    //                               className="h-6 w-6"
                    //                               onClick={() =>
                    //                                 window.open(file.url)
                    //                               }
                    //                             >
                    //                               <Download className="h-3 w-3" />
                    //                             </Button>
                    //                             <Button
                    //                               size="icon"
                    //                               variant="ghost"
                    //                               className="h-6 w-6"
                    //                               onClick={() =>
                    //                                 handleRemoveFile(
                    //                                   storeAsset.id,
                    //                                   "po",
                    //                                   index
                    //                                 )
                    //                               }
                    //                             >
                    //                               <X className="h-3 w-3" />
                    //                             </Button>
                    //                           </div>
                    //                         </div>
                    //                       )
                    //                     )}
                    //                   </div>
                    //                 )}
                    //               </div>

                    //               <Button
                    //                 onClick={() =>
                    //                   onDocumentDialogOpen(storeAsset.id, "po")
                    //                 }
                    //               >
                    //                 Save
                    //               </Button>
                    //             </div>
                    //           </div>
                    //         </PopoverContent>
                    //       </Popover>
                    //     </TableCell>

                    //     {/* Invoice Number with file uploads and additional fields */}
                    //     <TableCell>
                    //       <Popover>
                    //         <PopoverTrigger asChild>
                    //           <Button
                    //             variant={
                    //               storeAsset.invoiceNumber
                    //                 ? "secondary"
                    //                 : "outline"
                    //             }
                    //             size="sm"
                    //             className="w-full"
                    //           >
                    //             {storeAsset.invoiceNumber || "Not Done"}
                    //           </Button>
                    //         </PopoverTrigger>
                    //         <PopoverContent className="w-96">
                    //           <div className="grid gap-4">
                    //             <div className="space-y-2">
                    //               <h4 className="font-medium leading-none">
                    //                 Invoice Details
                    //               </h4>
                    //               <p className="text-sm text-muted-foreground">
                    //                 Enter invoice information for{" "}
                    //                 {storeAsset.asset?.name}
                    //               </p>
                    //             </div>
                    //             <div className="grid gap-2">
                    //               <Label
                    //                 htmlFor={`invoice-number-${storeAsset.id}`}
                    //               >
                    //                 Invoice Number
                    //               </Label>
                    //               <Input
                    //                 id={`invoice-number-${storeAsset.id}`}
                    //                 placeholder="Enter invoice number"
                    //                 defaultValue={
                    //                   storeAsset.invoiceNumber || ""
                    //                 }
                    //                 onChange={(e) =>
                    //                   onInputChange(e.target.value)
                    //                 }
                    //               />

                    //               {/* Invoice Date */}
                    //               <div className="space-y-1 pt-2">
                    //                 <Label
                    //                   htmlFor={`invoice-date-${storeAsset.id}`}
                    //                 >
                    //                   Invoice Date
                    //                 </Label>
                    //                 <Popover>
                    //                   <PopoverTrigger asChild>
                    //                     <Button
                    //                       id={`invoice-date-${storeAsset.id}`}
                    //                       variant="outline"
                    //                       className="w-full justify-start text-left font-normal"
                    //                     >
                    //                       {invoiceDates[storeAsset.id] ? (
                    //                         format(
                    //                           invoiceDates[storeAsset.id],
                    //                           "PPP"
                    //                         )
                    //                       ) : (
                    //                         <span>Pick a date</span>
                    //                       )}
                    //                     </Button>
                    //                   </PopoverTrigger>
                    //                   <PopoverContent
                    //                     className="w-auto p-0"
                    //                     align="start"
                    //                   >
                    //                     <Calendar
                    //                       mode="single"
                    //                       selected={invoiceDates[storeAsset.id]}
                    //                       onSelect={(date) =>
                    //                         handleInvoiceDateChange(
                    //                           storeAsset.id,
                    //                           date
                    //                         )
                    //                       }
                    //                       initialFocus
                    //                       className="p-3 pointer-events-auto"
                    //                     />
                    //                   </PopoverContent>
                    //                 </Popover>
                    //               </div>

                    //               {/* Invoice Amount */}
                    //               <div className="space-y-1 pt-2">
                    //                 <Label
                    //                   htmlFor={`invoice-amount-${storeAsset.id}`}
                    //                 >
                    //                   Invoice Amount (₹)
                    //                 </Label>
                    //                 <Input
                    //                   id={`invoice-amount-${storeAsset.id}`}
                    //                   type="number"
                    //                   min="0"
                    //                   step="0.01"
                    //                   placeholder="Enter invoice amount"
                    //                   value={
                    //                     invoiceAmounts[storeAsset.id] || ""
                    //                   }
                    //                   onChange={(e) =>
                    //                     handleInvoiceAmountChange(
                    //                       storeAsset.id,
                    //                       e.target.value
                    //                     )
                    //                   }
                    //                 />
                    //               </div>

                    //               {/* File uploads */}
                    //               <div className="space-y-2 pt-2">
                    //                 <Label
                    //                   htmlFor={`invoice-upload-${storeAsset.id}`}
                    //                   className="text-sm font-medium"
                    //                 >
                    //                   Upload Invoice Documents
                    //                 </Label>
                    //                 <div className="flex items-center gap-2">
                    //                   <Input
                    //                     id={`invoice-upload-${storeAsset.id}`}
                    //                     type="file"
                    //                     multiple
                    //                     className="hidden"
                    //                     onChange={(e) =>
                    //                       handleFileUpload(
                    //                         storeAsset.id,
                    //                         "invoice",
                    //                         e
                    //                       )
                    //                     }
                    //                   />
                    //                   <Button
                    //                     variant="outline"
                    //                     size="sm"
                    //                     className="w-full"
                    //                     onClick={() =>
                    //                       document
                    //                         .getElementById(
                    //                           `invoice-upload-${storeAsset.id}`
                    //                         )
                    //                         ?.click()
                    //                     }
                    //                   >
                    //                     <Upload className="mr-2 h-4 w-4" />
                    //                     Upload Files
                    //                   </Button>
                    //                 </div>

                    //                 {/* File list */}
                    //                 {fileUploads[storeAsset.id]?.invoice
                    //                   ?.length > 0 && (
                    //                   <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                    //                     <p className="text-xs font-medium">
                    //                       Uploaded files:
                    //                     </p>
                    //                     {fileUploads[storeAsset.id].invoice.map(
                    //                       (file, index) => (
                    //                         <div
                    //                           key={index}
                    //                           className="flex items-center justify-between bg-muted p-2 rounded-md"
                    //                         >
                    //                           <div className="flex items-center text-xs truncate">
                    //                             <FileCheck className="h-3 w-3 mr-1" />
                    //                             <span className="truncate max-w-[150px]">
                    //                               {file.name}
                    //                             </span>
                    //                           </div>
                    //                           <div className="flex items-center gap-1">
                    //                             <Button
                    //                               size="icon"
                    //                               variant="ghost"
                    //                               className="h-6 w-6"
                    //                               onClick={() =>
                    //                                 window.open(file.url)
                    //                               }
                    //                             >
                    //                               <Download className="h-3 w-3" />
                    //                             </Button>
                    //                             <Button
                    //                               size="icon"
                    //                               variant="ghost"
                    //                               className="h-6 w-6"
                    //                               onClick={() =>
                    //                                 handleRemoveFile(
                    //                                   storeAsset.id,
                    //                                   "invoice",
                    //                                   index
                    //                                 )
                    //                               }
                    //                             >
                    //                               <X className="h-3 w-3" />
                    //                             </Button>
                    //                           </div>
                    //                         </div>
                    //                       )
                    //                     )}
                    //                   </div>
                    //                 )}
                    //               </div>

                    //               <div className="flex justify-end gap-2 pt-2">
                    //                 <Button
                    //                   variant="outline"
                    //                   onClick={() =>
                    //                     saveInvoiceDetails(storeAsset.id)
                    //                   }
                    //                 >
                    //                   Save Details
                    //                 </Button>
                    //                 <Button
                    //                   onClick={() =>
                    //                     onDocumentDialogOpen(
                    //                       storeAsset.id,
                    //                       "invoice"
                    //                     )
                    //                   }
                    //                 >
                    //                   Save Number
                    //                 </Button>
                    //               </div>
                    //             </div>
                    //           </div>
                    //         </PopoverContent>
                    //       </Popover>
                    //     </TableCell>

                    //     {/* GRN Number */}
                    //     <TableCell>
                    //       <Popover>
                    //         <PopoverTrigger asChild>
                    //           <Button
                    //             variant={
                    //               storeAsset.grnNumber ? "secondary" : "outline"
                    //             }
                    //             size="sm"
                    //             className="w-full"
                    //           >
                    //             {storeAsset.grn_number || "Not Done"}
                    //           </Button>
                    //         </PopoverTrigger>
                    //         <PopoverContent className="w-80">
                    //           <div className="grid gap-4">
                    //             <div className="space-y-2">
                    //               <h4 className="font-medium leading-none">
                    //                 GRN Number : {storeAsset.grn_number}
                    //               </h4>
                    //               <p className="text-sm text-muted-foreground">
                    //                 Enter the GRN number for{" "}
                    //                 {storeAsset.asset?.name}
                    //               </p>
                    //             </div>
                    //             <div className="grid gap-2">
                    //               <Input
                    //               value={storeAsset.grn_number}
                    //                 placeholder="Enter GRN number"
                    //                 defaultValue={storeAsset.grnNumber || ""}
                    //                 onChange={(e) =>
                    //                   setValue(e.target.value)
                    //                 }
                    //               />
                    //               <Button
                    //                 onClick={() =>
                    //                  onToggleStatus(storeAsset.id, "grn", {
                    //                     grn_val: value
                    //                   })
                    //                 }
                    //               >
                    //                 Save
                    //               </Button>
                    //             </div>
                    //           </div>
                    //         </PopoverContent>
                    //       </Popover>
                    //     </TableCell>

                    //     {/* Status cells */}
                    //     <TableCell>
                    //       <Button
                    //         size="sm"
                    //         className={
                    //           storeAsset.is_tagging_done
                    //             ? "w-full bg-green-500"
                    //             : "w-full"
                    //         }
                    //         variant={
                              
                    //           storeAsset.is_tagging_done ? "default" : "outline"
                    //         }
                          
                    //         onClick={() =>
                    //           onToggleStatus(
                    //             storeAsset.id,
                    //             "tagging",

                    //             {
                    //               ...existingBody,
                    //               tagging_val: storeAsset.is_tagging_done
                    //                 ? false
                    //                 : true,
                    //             }
                    //           )
                    //         }
                    //         disabled={isLoading}
                    //       >
                    //         {storeAsset.is_tagging_done ? (
                    //           <>
                    //             <Check className="mr-1 h-4 w-4" /> Done
                    //           </>
                    //         ) : (
                    //           "Not Done"
                    //         )}
                    //       </Button>
                    //     </TableCell>

                    //     <TableCell>
                    //       <Button
                    //         size="sm"
                    //         variant={
                    //           storeAsset.is_project_head_approved
                    //             ? "default"
                    //             : "destructive"
                    //         }
                    //         className={
                    //           storeAsset.is_project_head_approved
                    //             ? "w-full bg-green-500"
                    //             : "w-full"
                    //         }
                    //         onClick={() =>
                    //           onToggleStatus(
                    //             storeAsset.id,
                    //             "approval",

                    //             {
                    //               ...existingBody,
                    //               approve_val:
                    //                 storeAsset.is_project_head_approved
                    //                   ? false
                    //                   : true,
                    //             }
                    //           )
                    //         }
                    //         disabled={isLoading}
                    //       >
                    //         {storeAsset.is_project_head_approved ? (
                    //           <>
                    //             <Check className="mr-1 h-4 w-4" /> Approved
                    //           </>
                    //         ) : (
                    //           <>
                    //             <X className="mr-1 h-4 w-4" /> Not Approved
                    //           </>
                    //         )}
                    //       </Button>
                    //     </TableCell>

                    //     <TableCell>
                    //       <Button
                    //         size="sm"
                          
                    //         // className="w-full"
                    //         className={
                    //           storeAsset.is_audit_done
                    //             ? "w-full bg-green-500"
                    //             : "w-full"
                    //         }
                    //         variant={
                              
                    //           storeAsset.is_audit_done ? "default" : "outline"
                    //         }
                    //         onClick={() =>
                    //           onToggleStatus(storeAsset.id, "audit", {
                    //             ...existingBody,
                    //             audit_val: storeAsset.is_audit_done
                    //               ? false
                    //               : true,
                    //           })
                    //         }
                    //         disabled={isLoading}
                    //       >
                    //         {storeAsset.is_audit_done ? (
                    //           <>
                    //             <Check className="mr-1 h-4 w-4" /> Done
                    //           </>
                    //         ) : (
                    //           "Not Done"
                    //         )}
                    //       </Button>
                    //     </TableCell>

                    //     <TableCell>
                    //       <Button
                    //         size="sm"
                    //         className={
                    //           storeAsset.is_finance_booked
                    //             ? "w-full bg-green-500"
                    //             : "w-full"
                    //         }
                    //         variant={
                              
                    //           storeAsset.is_finance_booked ? "default" : "outline"
                    //         }
                    //         onClick={() =>
                    //           onToggleStatus(storeAsset.id, "booking", {
                    //             ...existingBody,
                    //             booking_val: storeAsset.is_finance_booked
                    //               ? false
                    //               : true,
                    //           })
                    //         }
                    //         disabled={isLoading}
                    //       >
                    //         {storeAsset.is_finance_booked ? (
                    //           <>
                    //             <Check className="mr-1 h-4 w-4" /> Done
                    //           </>
                    //         ) : (
                    //           "Not Done"
                    //         )}
                    //       </Button>
                    //     </TableCell>
                    //   </TableRow>
                    // );
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
