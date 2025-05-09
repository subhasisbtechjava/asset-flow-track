
import React, { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreAsset } from "@/types";
import MultipleDocumentsPopover from "./MultipleDocumentsPopover";
import { storeAPI } from "@/api/storeAPI";

interface AssetTableRowEnhancedProps {
  storeId: string;
  storeAsset: StoreAsset;
  isLoading: boolean;
  onToggleStatus: (assetId: string, updateParam: string, body: any) => void;
  onRefresh: () => void;
}

const AssetTableRowEnhanced: React.FC<AssetTableRowEnhancedProps> = ({
  storeId,
  storeAsset,
  isLoading,
  onToggleStatus,
  onRefresh
}) => {
  // State for document counts
  const [poCount, setPoCount] = useState(storeAsset.poCount || (storeAsset.po_number ? 1 : 0));
  const [invoiceCount, setInvoiceCount] = useState(storeAsset.invoiceCount || (storeAsset.invoice_number ? 1 : 0));
  const [grnCount, setGrnCount] = useState(storeAsset.grnCount || (storeAsset.grn_number ? 1 : 0));
  
  // Fetch document counts on mount
  useEffect(() => {
    const fetchDocumentCounts = async () => {
      try {
        const poDocuments = await storeAPI.getStoreDocuments(storeId, storeAsset.id, 'po');
        const invoiceDocuments = await storeAPI.getStoreDocuments(storeId, storeAsset.id, 'invoice');
        const grnDocuments = await storeAPI.getStoreDocuments(storeId, storeAsset.id, 'grn');
        
        setPoCount(poDocuments.length);
        setInvoiceCount(invoiceDocuments.length);
        setGrnCount(grnDocuments.length);
      } catch (error) {
        console.error("Error fetching document counts:", error);
      }
    };
    
    fetchDocumentCounts();
  }, [storeId, storeAsset.id]);
  
  // For status toggles
  const toggleStatusHandler = (field: string, value: boolean) => {
    const body: any = {};
    
    switch (field) {
      case 'tagging':
        body.tagging_val = value;
        break;
      case 'approval':
        body.approve_val = value;
        break;
      case 'audit':
        body.audit_val = value;
        break;
      case 'booking':
        body.booking_val = value;
        break;
    }
    
    onToggleStatus(storeAsset.id, field, body);
  };

  // Handle document updates
  const handleDocumentUpdate = async () => {
    // Refresh document counts
    const poDocuments = await storeAPI.getStoreDocuments(storeId, storeAsset.id, 'po');
    const invoiceDocuments = await storeAPI.getStoreDocuments(storeId, storeAsset.id, 'invoice');
    const grnDocuments = await storeAPI.getStoreDocuments(storeId, storeAsset.id, 'grn');
    
    setPoCount(poDocuments.length);
    setInvoiceCount(invoiceDocuments.length);
    setGrnCount(grnDocuments.length);
    
    // Call parent refresh function
    onRefresh();
  };
  
  return (
    <tr className="border-b">
      <td className="py-3 px-4">
        <div className="font-medium">{storeAsset?.assets_name}</div>
        <div className="text-xs text-muted-foreground">
          {storeAsset.asset?.code}
        </div>
      </td>
      <td className="py-3 px-4">
        {storeAsset.quantity} {storeAsset.asset?.unitOfMeasurement}
      </td>
      
      {/* PO Multiple Documents */}
      <td className="py-3 px-4">
        <MultipleDocumentsPopover
          storeId={storeId}
          assetId={storeAsset.id}
          documentType="po"
          documentCount={poCount}
          hasDocuments={poCount > 0}
          onUpdate={handleDocumentUpdate}
        />
      </td>
      
      {/* Invoice Multiple Documents */}
      <td className="py-3 px-4">
        <MultipleDocumentsPopover
          storeId={storeId}
          assetId={storeAsset.id}
          documentType="invoice"
          documentCount={invoiceCount}
          hasDocuments={invoiceCount > 0}
          onUpdate={handleDocumentUpdate}
        />
      </td>
      
      {/* GRN Multiple Documents */}
      <td className="py-3 px-4">
        <MultipleDocumentsPopover
          storeId={storeId}
          assetId={storeAsset.id}
          documentType="grn"
          documentCount={grnCount}
          hasDocuments={grnCount > 0}
          onUpdate={handleDocumentUpdate}
        />
      </td>
      
      {/* Status cells - Tagging */}
      <td className="py-3 px-4">
        <Button
          size="sm"
          className={storeAsset.is_tagging_done ? "w-full bg-green-500" : "w-full"}
          variant={storeAsset.is_tagging_done ? "default" : "outline"}
          onClick={() => toggleStatusHandler('tagging', !storeAsset.is_tagging_done)}
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
      </td>
      
      {/* Project Head Approval */}
      <td className="py-3 px-4">
        <Button
          size="sm"
          variant={storeAsset.is_project_head_approved ? "default" : "destructive"}
          className={storeAsset.is_project_head_approved ? "w-full bg-green-500" : "w-full"}
          onClick={() => toggleStatusHandler('approval', !storeAsset.is_project_head_approved)}
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
      </td>
      
      {/* Audit Done */}
      <td className="py-3 px-4">
        <Button
          size="sm"
          className={storeAsset.is_audit_done ? "w-full bg-green-500" : "w-full"}
          variant={storeAsset.is_audit_done ? "default" : "outline"}
          onClick={() => toggleStatusHandler('audit', !storeAsset.is_audit_done)}
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
      </td>
      
      {/* Finance Booking */}
      <td className="py-3 px-4">
        <Button
          size="sm"
          className={storeAsset.is_finance_booked ? "w-full bg-green-500" : "w-full"}
          variant={storeAsset.is_finance_booked ? "default" : "outline"}
          onClick={() => toggleStatusHandler('booking', !storeAsset.is_finance_booked)}
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
      </td>
    </tr>
  );
};

export default AssetTableRowEnhanced;
