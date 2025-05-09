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
import {
  getFileIconComponent,
  getFileNameFromUrl,
  getFileTypeCategory,
} from "@/utility/get_file_type";
import FileCard from "./fileCard";
import { isSameDay } from "date-fns";
import GrnListTable from "./grnListTable";
import InvoiceListTable from "./invoiceListTable";
import PoListTable from "./poListTable";
import MultipleDocumentsPopover from "./MultipleDocumentsPopover";
interface AssetTableRow {
  storeId: string;
  storeAsset: StoreAsset;
  isLoading: boolean;
  onToggleStatus;
  onToggleStatusWithFormData;
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
  onToggleStatusWithFormData,
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
  const [invoiceValue, setInvoiceValue] = useState({
    invoiceNumber: null,
    invoiceDate: null,
    invoiceDateRow: new Date(new Date().setHours(0, 0, 0, 0)),
    invoiceAmount: "",
    invoiceFileDetails: {
      name: "",
      base64: "",
    },
    file: null,
  });

  function isInvoiceUploadValidated() {
    if (
      !invoiceValue.invoiceNumber ||
      !invoiceValue.invoiceAmount ||
      !invoiceValue.invoiceFileDetails.name ||
      !invoiceValue.invoiceDate ||
      !invoiceValue.file
    ) {
      return false;
    }
    return true;
  }
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
      reader.onerror = (error) => reject(error);

      reader.readAsDataURL(file); // This encodes the file as base64
    });
  }

  async function getFileDetails(file: File) {
    const base64 = await fileToBase64(file);
    const formatedBase64List = base64.toString().trim().split("base64,");
    const formatedBase64 = formatedBase64List[formatedBase64List.length - 1];

    console.log("====================================");
    console.log(formatedBase64List);
    console.log("====================================");
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
  const [isInvoicePopoverOpen, setIsInvoicePopoverOpen] = useState(false);
  useEffect(() => {
    setGrnValue(storeAsset.grn_number);
  }, [storeAsset]);

  const resetInvoiceForm = () => {
    setInvoiceValue({
      invoiceNumber: null,
      invoiceDate: null,
      invoiceDateRow: new Date(new Date().setHours(0, 0, 0, 0)),
      invoiceAmount: "",
      invoiceFileDetails: {
        name: "",
        base64: "",
      },
      file: null,
    });
  };
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
        <MultipleDocumentsPopover
         assetName={storeAsset?.assets_name}
          documentList={storeAsset?.po_details}
          storeId={storeId}
          assetId={storeAsset.id}
          documentType="po"
          documentCount={storeAsset?.po_details?.length}
          hasDocuments={storeAsset?.po_details?.length > 0}
          onUpdate={(data) => {
            console.log("data: ", data);

            const isoString = data.documentDate;
            const dateOnly = new Date(isoString).toISOString().split("T")[0];

            const formData = new FormData();
            formData.append("po_number", data.documentNumber);
            formData.append("attachment", data?.attachment?.file);
            onToggleStatusWithFormData(storeAsset.id, "po", formData);
          }}
        />
      </TableCell>

      {/* Invoice Number with file uploads and additional fields */}
      <TableCell>
        <MultipleDocumentsPopover
       assetName={storeAsset?.assets_name}
          documentList={storeAsset?.invoice_details}
          storeId={storeId}
          assetId={storeAsset.id}
          documentType="invoice"
          documentCount={storeAsset?.invoice_details?.length}
          hasDocuments={storeAsset?.invoice_details?.length > 0}
          onUpdate={(data) => {
            console.log("data: ", data);

            const isoString = data.documentDate;
            const dateOnly = new Date(isoString).toISOString().split("T")[0];

            const formData = new FormData();
            formData.append("invoice_no", data.documentNumber);
            formData.append("invoice_date", dateOnly);
            formData.append("invoice_amount", data.documentAmount);
            formData.append("attachment", data?.attachment?.file);
            onToggleStatusWithFormData(storeAsset.id, "invoice", formData);
          }}
        />
      </TableCell>

      {/* GRN Number */}

      <TableCell>
        <MultipleDocumentsPopover
        assetName={storeAsset?.assets_name}
          documentList={storeAsset?.grn_number}
          storeId={storeId}
          assetId={storeAsset.id}
          documentType="grn"
          documentCount={storeAsset?.grn_number?.length}
          hasDocuments={storeAsset?.grn_number?.length > 0}
          onUpdate={(data) => {
            console.log("data: ", data);

            onToggleStatus(storeAsset.id, "grn", {
              grn_val: 
data?.documentNumber,
            });
          }}
        />
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
