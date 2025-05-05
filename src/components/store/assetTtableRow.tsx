import { StoreAsset } from "@/types";
import React, { useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AssetTableRow {
  storeId: string;
  storeAsset: StoreAsset;
  isLoading: boolean;
  onToggleStatus;
  invoiceDates;
  handleInvoiceDateChange;
  handleInvoiceAmountChange;
  handleFileUpload;
  handleRemoveFile;
  fileUploads;
  invoiceAmounts;
  onDocumentDialogOpen: (
    assetId: string,
    type: "po" | "invoice" | "grn"
  ) => void;
  onInputChange: (value: string) => void;
  onSaveDocument: () => void;
}
const AssetTableRow = ({
  storeId,
  storeAsset,
  isLoading,
  onToggleStatus,
  onDocumentDialogOpen,
  onInputChange,
  invoiceAmounts,
  invoiceDates,
  handleInvoiceDateChange,
  handleInvoiceAmountChange,
  handleFileUpload,
  handleRemoveFile,
  onSaveDocument,
  fileUploads,
}: AssetTableRow) => {
  const [grnValue, setGrnValue] = useState(storeAsset.grn_number);
  const [poValue, setPoValue] = useState(null);
  const [poAttachment, setPoAttachmentValue] = useState(null);
  const existingBody = {
    // approve_val: storeAsset.is_project_head_approved?true:false,
    // audit_val: storeAsset.is_audit_done?true:false,
    // booking_val: storeAsset.is_finance_booked?true:false,
    // tagging_val: storeAsset.isTaggingDone?true:false,
  };

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = () => resolve(reader.result); // base64 string
      reader.onerror = error => reject(error);
  
      reader.readAsDataURL(file); // This encodes the file as base64
    });
  }

  async function getFileDetails(file: File) {

    const base64 = await fileToBase64(file);
    const formatedBase64List =  base64.toString().trim().split("base64,")
    const formatedBase64 =  formatedBase64List[formatedBase64List.length-1]

    console.log('====================================');
    console.log(formatedBase64List);
    console.log('====================================');
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      base64: formatedBase64,
    };
  }
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isPoPopoverOpen, setIsPoPopoverOpen] = useState(false);
  useEffect(() => {
    setGrnValue(storeAsset.grn_number);
  }, []);
  return (
    <TableRow key={storeAsset.id}>
      <TableCell>
        <div className="font-medium">{storeAsset?.assets_name}</div>
        <div className="text-xs text-muted-foreground">
          {storeAsset.asset?.code}
        </div>
      </TableCell>
      <TableCell>
        {storeAsset.quantity} {storeAsset.asset?.unitOfMeasurement}
      </TableCell>

      {/* PO Number with file uploads */}
      <TableCell>
        <Popover  
       open={isPoPopoverOpen}
       onOpenChange={() => {
            setPoValue(storeAsset.po_number);
            setIsPoPopoverOpen(true);
          }}
          
          >
          <PopoverTrigger asChild>
            <Button
              variant={storeAsset.po_number ? "default" : "outline"}
              size="sm"
              className={  storeAsset.po_number ? "w-full bg-green-500" : "w-full"}
            >
              {storeAsset.po_number?"Done": "Not Done"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">PO Number : {storeAsset.po_number}</h4>
                <p className="text-sm text-muted-foreground">
                  Enter the purchase order number for {storeAsset.assets_name}
                </p>
              </div>
              <div className="grid gap-2">
                {/* File uploads */}
                <div className="space-y-2 pt-2">
                  <Label
                    htmlFor={`po-upload-${storeAsset.id}`}
                    className="text-sm font-medium"
                  >
                    Upload PO Documents
                  </Label>

                  <div className="grid gap-2">
                    <Input
                      placeholder="Enter PO number"
                       defaultValue={poValue || ""}
                      onChange={(e) => setPoValue(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      id={`po-upload-${storeAsset.id}`}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={
                        (e) => {
                          setPoAttachmentValue(e.target.files[0]);
                        }
                        // handleFileUpload(
                        //   storeAsset.id,
                        //   "po",
                        //   e
                        // )
                      }
                    />
                    <Input
                      type="file"
                     
                      onChange={
                        async (e) => {
                          const fileDetails = await getFileDetails(
                            e.target.files[0]
                          );
                          setPoAttachmentValue(fileDetails);
                          console.log("====================================");
                          console.log(fileDetails);
                          console.log("====================================");
                        }
                        
                      }
                    />
                    
                  </div>

                  {/* File list */}
                  {fileUploads[storeAsset.id]?.po?.length > 0 && (
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                      <p className="text-xs font-medium">Uploaded files:</p>
                      {fileUploads[storeAsset.id].po.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-muted p-2 rounded-md"
                        >
                          <div className="flex items-center text-xs truncate">
                            <FileCheck className="h-3 w-3 mr-1" />
                            <span className="truncate max-w-[150px]">
                              {file.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => window.open(file.url)}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() =>
                                handleRemoveFile(storeAsset.id, "po", index)
                              }
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                disabled = {!poValue || !poAttachment}
                  onClick={() => {
                    // onDocumentDialogOpen(storeAsset.id, "po")
                    onToggleStatus(storeAsset.id, "po", {
                      po_number: poValue,
                      po_attachment_name: poAttachment?.name,
                      po_attachment: poAttachment?.base64,
                    });
                    setIsPoPopoverOpen(!isPoPopoverOpen);
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </TableCell>

      {/* Invoice Number with file uploads and additional fields */}
      <TableCell>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={storeAsset.invoiceNumber ? "secondary" : "outline"}
              size="sm"
              className="w-full"
            >
              {storeAsset.invoiceNumber || "Not Done"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Invoice Details</h4>
                <p className="text-sm text-muted-foreground">
                  Enter invoice information for {storeAsset.asset?.name}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`invoice-number-${storeAsset.id}`}>
                  Invoice Number
                </Label>
                <Input
                  id={`invoice-number-${storeAsset.id}`}
                  placeholder="Enter invoice number"
                  defaultValue={storeAsset.invoiceNumber || ""}
                  onChange={(e) => onInputChange(e.target.value)}
                />

                {/* Invoice Date */}
                <div className="space-y-1 pt-2">
                  <Label htmlFor={`invoice-date-${storeAsset.id}`}>
                    Invoice Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id={`invoice-date-${storeAsset.id}`}
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {invoiceDates[storeAsset.id] ? (
                          format(invoiceDates[storeAsset.id], "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={invoiceDates[storeAsset.id]}
                        onSelect={(date) =>
                          handleInvoiceDateChange(storeAsset.id, date)
                        }
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Invoice Amount */}
                <div className="space-y-1 pt-2">
                  <Label htmlFor={`invoice-amount-${storeAsset.id}`}>
                    Invoice Amount (₹)
                  </Label>
                  <Input
                    id={`invoice-amount-${storeAsset.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter invoice amount"
                    value={invoiceAmounts[storeAsset.id] || ""}
                    onChange={(e) =>
                      handleInvoiceAmountChange(storeAsset.id, e.target.value)
                    }
                  />
                </div>

                {/* File uploads */}
                <div className="space-y-2 pt-2">
                  <Label
                    htmlFor={`invoice-upload-${storeAsset.id}`}
                    className="text-sm font-medium"
                  >
                    Upload Invoice Documents
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id={`invoice-upload-${storeAsset.id}`}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(storeAsset.id, "invoice", e)
                      }
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        document
                          .getElementById(`invoice-upload-${storeAsset.id}`)
                          ?.click()
                      }
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Files
                    </Button>
                  </div>

                  {/* File list */}
                  {fileUploads[storeAsset.id]?.invoice?.length > 0 && (
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                      <p className="text-xs font-medium">Uploaded files:</p>
                      {fileUploads[storeAsset.id].invoice.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-muted p-2 rounded-md"
                        >
                          <div className="flex items-center text-xs truncate">
                            <FileCheck className="h-3 w-3 mr-1" />
                            <span className="truncate max-w-[150px]">
                              {file.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => window.open(file.url)}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() =>
                                handleRemoveFile(
                                  storeAsset.id,
                                  "invoice",
                                  index
                                )
                              }
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    // onClick={() =>
                    //   // saveInvoiceDetails(storeAsset.id)
                    // }
                  >
                    Save Details
                  </Button>
                  <Button
                    onClick={() =>
                      onDocumentDialogOpen(storeAsset.id, "invoice")
                    }
                  >
                    Save Number
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </TableCell>

      {/* GRN Number */}
      <TableCell>
        <Popover
          open={isPopoverOpen}
          onOpenChange={() => {
            setGrnValue(storeAsset.grn_number);
            setIsPopoverOpen(!isPopoverOpen);
          }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant={storeAsset.grn_number ? "default" : "outline"}
                  size="sm"
                  className={
                    storeAsset.grn_number ? "w-full bg-green-500" : "w-full"
                  }
                >
                  {storeAsset.grn_number ? "Done" : "Not Done"}
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              {storeAsset.grn_number
                ? `GRN No  ${storeAsset.grn_number}`
                : "Click to enter GRN number"}
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">
                  GRN Number : {storeAsset.grn_number}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Enter the GRN number for {storeAsset?.assets_name}
                </p>
              </div>
              <div className="grid gap-2">
                <Input
                  value={grnValue}
                  placeholder="Enter GRN number"
                  defaultValue={grnValue || ""}
                  onChange={(e) => setGrnValue(e.target.value)}
                />
                <Button
                disabled = {!grnValue}
                  onClick={() => {
                    onToggleStatus(storeAsset.id, "grn", {
                      grn_val: grnValue,
                    });

                    setIsPopoverOpen(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </TableCell>

      {/* Status cells */}
      <TableCell>
        <Button
          size="sm"
          className={
            storeAsset.is_tagging_done ? "w-full bg-green-500" : "w-full"
          }
          variant={storeAsset.is_tagging_done ? "default" : "outline"}
          onClick={() =>
            onToggleStatus(
              storeAsset.id,
              "tagging",

              {
                ...existingBody,
                tagging_val: storeAsset.is_tagging_done ? false : true,
              }
            )
          }
          disabled={isLoading}
        >
          {storeAsset.is_tagging_done ? (
            <>
              <Check className="mr-1 h-4 w-4" /> Done
            </>
          ) : (
            "Not Done"
          )}
        </Button>
      </TableCell>

      <TableCell>
        <Button
          size="sm"
          variant={
            storeAsset.is_project_head_approved ? "default" : "destructive"
          }
          className={
            storeAsset.is_project_head_approved
              ? "w-full bg-green-500"
              : "w-full"
          }
          onClick={() =>
            onToggleStatus(
              storeAsset.id,
              "approval",

              {
                ...existingBody,
                approve_val: storeAsset.is_project_head_approved ? false : true,
              }
            )
          }
          disabled={isLoading}
        >
          {storeAsset.is_project_head_approved ? (
            <>
              <Check className="mr-1 h-4 w-4" /> Approved
            </>
          ) : (
            <>
              <X className="mr-1 h-4 w-4" /> Not Approved
            </>
          )}
        </Button>
      </TableCell>

      <TableCell>
        <Button
          size="sm"
          // className="w-full"
          className={
            storeAsset.is_audit_done ? "w-full bg-green-500" : "w-full"
          }
          variant={storeAsset.is_audit_done ? "default" : "outline"}
          onClick={() =>
            onToggleStatus(storeAsset.id, "audit", {
              ...existingBody,
              audit_val: storeAsset.is_audit_done ? false : true,
            })
          }
          disabled={isLoading}
        >
          {storeAsset.is_audit_done ? (
            <>
              <Check className="mr-1 h-4 w-4" /> Done
            </>
          ) : (
            "Not Done"
          )}
        </Button>
      </TableCell>

      <TableCell>
        <Button
          size="sm"
          className={
            storeAsset.is_finance_booked ? "w-full bg-green-500" : "w-full"
          }
          variant={storeAsset.is_finance_booked ? "default" : "outline"}
          onClick={() =>
            onToggleStatus(storeAsset.id, "booking", {
              ...existingBody,
              booking_val: storeAsset.is_finance_booked ? false : true,
            })
          }
          disabled={isLoading}
        >
          {storeAsset.is_finance_booked ? (
            <>
              <Check className="mr-1 h-4 w-4" /> Done
            </>
          ) : (
            "Not Done"
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default AssetTableRow;
