import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/alert-dialog";
import { FileEdit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getStoreById, getStoreAssetsByStoreId } from "@/data/mockData";
import { StoreSummaryCards } from "@/components/store/StoreSummaryCards";
import { StoreProgressCards } from "@/components/store/StoreProgressCards";
import { DocumentEntryDialog } from "@/components/store/DocumentEntryDialog";
import { StoreAssetsTable } from "@/components/store/StoreAssetsTable";
import EnhancedStoreAssetsTable from "@/components/store/EnhancedStoreAssetsTable";
import { StoreAsset } from "@/types";
import { storeAPI } from "@/api/storeAPI";
import { assetAPI } from "@/api/storeAPI";

import Loader from '../../components/loader/Loader';
import { useLoadertime } from "../../contexts/loadertimeContext";

import StoreLayoutPopUp from '../../components/popup/StoreLayoutPopUp';

import  SupplierMultipleDocumentsPopover  from "../../components/store/SupplierMultipleDocumentsPopover";


// --- START OF NEW IMPORT FOR TABS ---
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// --- END OF NEW IMPORT ---

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stringify } from "querystring";


const StoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [storeAssetsList, setStoreAssetsList] = useState<StoreAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [useEnhancedTable, setUseEnhancedTable] = useState(true);
  const [documentType, setDocumentType] = useState<
    "po" | "invoice" | "grn" | null
  >(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadintime = useLoadertime();
  const [searchTerm, setSearchTerm] = useState("");

  const [activity, setActivity] = useState("");
  
  // Fetch store details
  const [storedata, setStore] = useState(null);

  const store = (storedata) ? storedata :[];


  const [activeTab, setActiveTab] = useState("store-details");

  const [vendorPoInvoiceDetails, setVendorPoInvoiceDetails] = useState("");


  // Fetch store assets
  const storeAssets = id ? getStoreAssetsByStoreId(id) : [];

  const highProgressValue = 140;

  useEffect(() => {
    setLoading(true)
    if (id) {
      console.log("id: ", id);
      initialService();
    }
    
  }, []);

  function initialService() {
    fetchStoreDetails();
    fetchStoreAssets();
    fetchVendorInvoiceDetails();
  }

  const [vendorInvoiceDetails, setVendorInvoiceDetails] = useState([]);
   async function fetchVendorInvoiceDetails() {
    const vendorInvoice = await assetAPI.getVendorDeatisByAssignAssets(id);

    const allactivity = await assetAPI.getVendorStoreActivity(id);
    setActivity(JSON.stringify(allactivity));
    console.log("Getactivity================"+JSON.stringify(allactivity));

    //console.log("IIIIIIIIIIIIIIIIIIIIIIIIIIII");
    //console.log("vendorInvoiceDetails: ", vendorInvoice);
    //console.log("IIIIIIIIIIIIIIIIIIIIIIIIIIII");
    setVendorInvoiceDetails(vendorInvoice);
  }






  async function fetchStoreDetails() {
    const storeDetails = await storeAPI.getStoreById(id);
    console.log("====================================");
    console.log("storeDetails: ", storeDetails);
    console.log("====================================");
    setStore(storeDetails);
  }
  async function fetchStoreAssets() {
    const assets = await storeAPI.getStoreDetailsAssetsByStoreId(id);

    //console.log(">>>>>>>>>>>>>>>>>>>>>>>>");
    //console.log("storeAssetssssssssssss: ", assets.vendor_invoice_result);

    setStoreAssetsList(assets.store_assets_data);
    setVendorPoInvoiceDetails(assets.vendor_invoice_result);

    console.log("storeAssetsList: ", storeAssetsList);
    setTimeout(() => {
      setLoading(false)
    }, loadintime);  
  }

  console.log("setVendorPoInvoiceDetails>>>>>>>>>>"+vendorPoInvoiceDetails);

  const handleDeleteStore = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      toast({
        title: "Store deleted",
        description: `${store.name} has been deleted successfully.`,
      });
      navigate("/stores");
    }, 1000);
  };

  const filteredAssets = storeAssetsList.filter(
    (asset) =>
      asset?.assets_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAssets = storeAssetsList.length;

  const highProgressStores = filteredAssets.filter((store) => {
    const grnCompletionPercentage =
      (store.grn_progress / totalAssets) * 100 || 0;
    const erpCompletionPercentage =
      (store.erp_progress / totalAssets) * 100 || 0;
    const totalProgress = grnCompletionPercentage + erpCompletionPercentage;
    const isHighProgress = totalProgress > highProgressValue;

    return isHighProgress;
  });

  const lowProgressStores = totalAssets - highProgressStores.length;

  const assetsInProgress = storeAssetsList.filter(
    (sa) => sa.poNumber && (!sa.isGrnDone || !sa.isFinanceBooked)
  ).length;
  const assetsCompleted = storeAssetsList.filter(
    (sa) => sa.isGrnDone && sa.isFinanceBooked
  ).length;

  const openDocumentDialog = (
    assetId: string,
    type: "po" | "invoice" | "grn"
  ) => {
    setSelectedAsset(assetId);
    setDocumentType(type);
    const asset = storeAssetsList.find((a) => a.id === assetId);
    if (asset) {
      if (type === "po") setInputValue(asset.poNumber || "");
      if (type === "invoice") setInputValue(asset.invoiceNumber || "");
      if (type === "grn") setInputValue(asset.grnNumber || "");
    }
  };

  const closeDocumentDialog = () => {
    setSelectedAsset(null);
    setDocumentType(null);
    setInputValue("");
  };

  const saveDocumentNumber = () => {
    if (!selectedAsset || !documentType || !inputValue) return;

    setIsLoading(true);
    setTimeout(() => {
      setStoreAssetsList((prev) =>
        prev.map((asset) => {
          if (asset.id === selectedAsset) {
            const updatedAsset = { ...asset };
            if (documentType === "po") {
              updatedAsset.poNumber = inputValue;
            } else if (documentType === "invoice") {
              updatedAsset.invoiceNumber = inputValue;
            } else if (documentType === "grn") {
              updatedAsset.grnNumber = inputValue;
            }
            return updatedAsset;
          }
          return asset;
        })
      );

      toast({
        title: "Update successful",
        description: `${documentType.toUpperCase()} number updated successfully.`,
      });

      setIsLoading(false);
      closeDocumentDialog();
    }, 800);
  };

  const toggleStatus = async (assetId: string, updateParam: string, body) => {
    setIsLoading(true);

    const res = await storeAPI.storeAssetTrackingStatusUpdate(
      assetId,
      updateParam,
      body
    );
    fetchStoreAssets();

    toast({
      title: "Status updated",
      description: "Asset status has been updated successfully.",
    });

    setIsLoading(false);
  };

  const toggleStatusWithFormData = async (
    assetId: string,
    updateParam: string,
    body: FormData
  ) => {
    try {
      setIsLoading(true);

      const res = await storeAPI.storeAssetTrackingStatusUpdateWithFormData(
        assetId,
        updateParam,
        body
      );
      console.log('====================================');
      console.log('update+++++++++res: ', res);
      console.log('====================================');
      fetchStoreAssets();

      fetchVendorInvoiceDetails(); //ADDED FOR NOT REFRESHING DATA
      if(res.data == 'PO No already exist'){
        toast({
        title: "Status updated",
        description: res.data,
        variant: "destructive",
      });
      }else{
        toast({
        title: "Status updated",
        description: "Asset status has been updated successfully.",
        });
      }

      
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const grnCompletionPercentage = filteredAssets.filter((asset) => {
    return asset.grn_number != "" && asset.grn_number != null;
  });
  const erpCompletionPercentage = filteredAssets.filter((asset) => {
    return asset.is_finance_booked != null && asset.is_finance_booked != false;
  });

  // --- START OF NEW MOCK DATA FOR INVOICE DETAILS ---
  const invoiceDetails = [
    {
      vendor_name: "Supplier A",
      actual_price: 5000,
      total_po_amount: 4800,
      uploadPO: "Not Uploaded",
      total_invoice_amount: "Not Uploaded",
    },    
  ];
  // --- END OF NEW MOCK DATA ---



    const toggleSupplierPoInvoiceFormData = async (
    dataId: number,
    updateParam: string,
    body: FormData
  ) => {
    try {
      setIsLoading(true);

      const res = await assetAPI.assetsPoInvoiceUpdateWithFormData(
        dataId,
        updateParam,
        body
      );
      console.log('====================================');
      console.log('after form submit podata: ', res);
      console.log('====================================');
      fetchVendorInvoiceDetails();
      fetchStoreAssets();
      toast({
        title: "Status updated",
        description: "Vendor PO and Invoice has been updated successfully.",
      });
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsLoading(false);
    }
  };




  return (
    <>
     <Loader loading={loading} />
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span>{store.name}</span>
          </div>
          <h1 className="text-3xl font-bold mt-1">{store.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge>{store.brandname}</Badge>
            <Badge variant="outline">{store.code}</Badge>
            <span className="text-sm text-muted-foreground">{store.city}</span>
          </div>
        </div>
        {store.status == 'in_progress' &&
        (<div className="flex gap-2">
          <StoreLayoutPopUp></StoreLayoutPopUp>
        <Button
            variant="default"
            onClick={() => navigate(`/stores/${id}/add-assets`)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Manage Assets
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/stores/edit/${store.id}`}>
              <FileEdit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>)}
      </div>

     {activeTab === "store-details" ? (     
      <StoreProgressCards
        grnCompletionPercentage={
          grnCompletionPercentage.length > 0
            ? (grnCompletionPercentage.length / filteredAssets.length) * 100
            : 0
        }
        financeBookingPercentage={
          erpCompletionPercentage.length > 0
            ? (erpCompletionPercentage.length / filteredAssets.length) * 100
            : 0
        }
      />):(
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(activity)? JSON.parse(activity).totalAsset :0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total PO</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(activity)?JSON.parse(activity).totalPo:0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Released</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(activity)?JSON.parse(activity).sum_invoice:0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(activity)?Number(JSON.parse(activity).totalPo-JSON.parse(activity).sum_invoice).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }):0}</div>
        </CardContent>
      </Card>
    </div>)} 








      {/* --- START OF NEW TABS IMPLEMENTATION --- */}
      <Tabs defaultValue="store-details" className="space-y-4"  onValueChange={(value) => setActiveTab(value)}>
        <TabsList>
          <TabsTrigger value="store-details" >Store Details</TabsTrigger>
          <TabsTrigger value="invoice-details" >Invoice Details</TabsTrigger>
        </TabsList>

        <TabsContent value="store-details">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <StoreAssetsTable
            storeId={store.id}
            storeAssets={filteredAssets}
            storeStatus={store.status}
            isLoading={isLoading}
            onToggleStatus={toggleStatus}
            onToggleStatusWithFormData={toggleStatusWithFormData}
            onDocumentDialogOpen={openDocumentDialog}
            onInputChange={setInputValue}
            onSaveDocument={saveDocumentNumber}
            vendorPoInvoiceDetails={vendorPoInvoiceDetails}
            onPoDelete={fetchStoreAssets}
          />
        </TabsContent>

       <TabsContent value="invoice-details">
  {/* <div className="border rounded-lg shadow-sm bg-white overflow-x-auto"> */}
    <div className="border rounded-lg shadow-sm bg-white overflow-x-auto overflow-y-auto max-h-[400px]">
    <table className="w-full text-sm min-w-max">
      <thead className="sticky top-0 bg-white z-10">
        <tr className="border-b border-gray-200">
          <th className="p-2 text-left font-semibold text-gray-700">PO No</th>
          <th className="p-2 text-left font-semibold text-gray-700">Supplier Name</th>
          {/* <th className="p-2 text-left font-semibold text-gray-700">Total Amount</th> TOTAL ASSET AMOUNT */} 
          <th className="p-2 text-left font-semibold text-gray-700">PO Amount</th>
          <th className="p-2 text-left font-semibold text-gray-700">Release Amount</th>
          <th className="p-2 text-left font-semibold text-gray-700">Pending Amount</th>
          <th className="p-2 text-left font-semibold text-gray-700">GRN No</th>
          <th className="p-2 text-left font-semibold text-gray-700">Upload PO</th>
          <th className="p-2 text-left font-semibold text-gray-700">Update GRN No</th>
          <th className="p-2 text-left font-semibold text-gray-700">Upload Invoice</th>
        </tr>
      </thead>
      <tbody>
        {vendorInvoiceDetails.map((invoice, index) => (
          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="p-2 text-gray-600">{invoice.vendorpono}</td>
            <td className="p-2 text-gray-600">{invoice.vendor_name}</td>
            {/* <td className="p-2 text-gray-600">{invoice.actual_price}</td> */}
            <td className="p-2 text-gray-600">{Number(invoice.total_po_amount).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}</td>
            <td className="p-2 text-gray-600">{Number(invoice.total_invoice_amount).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}</td>
            <td className="p-2 text-gray-600">{Number(invoice.total_po_amount - invoice.total_invoice_amount).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}</td>
            <td className="p-2 text-gray-600">{invoice.grnno}</td>
            <td className="p-2">
              <SupplierMultipleDocumentsPopover              
                documentList={invoice?.po_details}              
                updatedPo={invoice?.vendorpono}    
                updatePoDate = {invoice?.podate}          
                updatePoAttchment = {invoice?.poattachment}          
                documentType="po"
                documentCount={invoice?.po_details?.length}
                hasDocuments={invoice?.po_details?.length > 0}
                onUpdate={(data) => {
                  console.log("workingpodata: ", data);
                  //const isoString = data.documentDate;
                  //const dateOnly = new Date(isoString).toISOString().split("T")[0];

                  // const dateOnly = data.documentDate
                  // ? new Date(data.documentDate).toISOString().split("T")[0]
                  // : null;

                  const dateOnly = data.documentDate
                  ? new Date(data.documentDate.getTime() - (data.documentDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0]
                  : null;

                  const formData = new FormData();
                 // formData.append("po_number", data.documentNumber);
                  formData.append("po_number", invoice.vendorpono);
                  formData.append("po_date", dateOnly);
                  formData.append("po_amount", data.documentAmount);
                  formData.append("attachment", data?.attachment?.file);
                  toggleSupplierPoInvoiceFormData(invoice.id, "po", formData);
                }}
              />
            </td>

           <td className="p-2">
              <SupplierMultipleDocumentsPopover                     
               documentList={invoice?.invoice_details} 
               updatedGrn = {invoice?.grnno}                 
                documentType="grn"
                documentCount={invoice?.invoice_details?.length}
                hasDocuments={invoice?.invoice_details?.length > 0}                
                onUpdate={(data) => {
                  console.log("data: ", data);
                  const isoString = data.documentDate;
                  const dateOnly = new Date(isoString).toISOString().split("T")[0];
                  const formData = new FormData();
                  formData.append("grn_no", data.documentNumber);                 
                  toggleSupplierPoInvoiceFormData(invoice.id, "grn", formData);
                }}
              />
            </td>     

            <td className="p-2">
              <SupplierMultipleDocumentsPopover
               updatedPo={invoice?.vendorpono}              
               documentList={invoice?.invoice_details}              
                documentType="invoice"
                documentCount={invoice?.invoice_details?.length}
                hasDocuments={invoice?.invoice_details?.length > 0}                
                onUpdate={(data) => {
                  console.log("data: ", data);
                  const isoString = data.documentDate;
                  const dateOnly = new Date(isoString).toISOString().split("T")[0];
                  const formData = new FormData();
                  formData.append("invoice_no", data.documentNumber);
                  formData.append("invoice_date", dateOnly);
                  formData.append("invoice_amount", data.documentAmount);
                  formData.append("attachment", data?.attachment?.file);
                  toggleSupplierPoInvoiceFormData(invoice.id, "invoice", formData);
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</TabsContent>
      </Tabs>
      {/* --- END OF NEW TABS IMPLEMENTATION --- */}

      <DocumentEntryDialog
        isOpen={!!selectedAsset && !!documentType}
        onClose={closeDocumentDialog}
        documentType={documentType}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSave={saveDocumentNumber}
        isLoading={isLoading}
      />
    </div>
    </>
  );
};

export default StoreDetail;