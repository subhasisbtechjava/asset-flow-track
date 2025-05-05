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
import { StoreAsset } from "@/types";
import { storeAPI } from "@/api/storeAPI";

const StoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [storeAssetsList, setStoreAssetsList] = useState<StoreAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<
    "po" | "invoice" | "grn" | null
  >(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch store details
  const [store, setStore] = useState(null);

  // Fetch store assets
  const storeAssets = id ? getStoreAssetsByStoreId(id) : [];

  // -----------------------------
  const highProgressValue = 140;

  // -------------------------
  useEffect(() => {
    if (id) {
      console.log("id: ", id);
      initialService();
    }
  }, []);

  function initialService() {
    fetchStoreDetails();
    fetchStoreAssets();
  }
  async function fetchStoreDetails() {
    const storeDetails = await storeAPI.getStoreById(id);
    console.log("====================================");
    console.log("storeDetails: ", storeDetails);

    console.log("====================================");
    setStore(storeDetails);
    // setStore({
    //   id: id,
    //   name: "Acropolis",
    //   code: "KOL246",
    //   brand: "Wow! Kulfi",
    //   city: "Kolkata",
    //   grnCompletionPercentage: 100,
    //   financeBookingPercentage: 80,
    // });
  }
  async function fetchStoreAssets() {
    const assets = await storeAPI.getStoreDetailsAssetsByStoreId(id);
    setStoreAssetsList(assets);

    console.log("storeAssetsList: ", storeAssetsList);
  }
  //  async function fetchStoreAssets() {
  //   const assets = await getStoreAssetsByStoreId(id);
  //   setStoreAssetsList(assets);
  //  }
  // async function fetchStoreAssetss() {
  //   const assets = await storeAPI.getStoreDetailsAssetsByStoreId(id);
  //   console.log("assets: ", assets);
  //   // setStoreAssetsList(assets);
  // }
  if (!store) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Store Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The store you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Handle delete store
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

  // Filter assets based on search term
  const filteredAssets = storeAssetsList.filter(
    (asset) =>
      asset?.assets_name?.toLowerCase().includes(searchTerm.toLowerCase())
    // ||
    // asset.asset?.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate summary statistics
  const totalAssets = storeAssetsList.length;

  // ---------------------------

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

  // ---------------------------

  const assetsInProgress = storeAssetsList.filter(
    (sa) => sa.poNumber && (!sa.isGrnDone || !sa.isFinanceBooked)
  ).length;
  const assetsCompleted = storeAssetsList.filter(
    (sa) => sa.isGrnDone && sa.isFinanceBooked
  ).length;

  // Handle document dialog
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

  // Save document number
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

  // Toggle status
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

  const grnCompletionPercentage = filteredAssets.filter((asset)=>{

    return asset.grn_number!="" && asset.grn_number!=null;


  })
  const erpCompletionPercentage = filteredAssets.filter((asset)=>{

    return asset.is_finance_booked!=null && asset.is_finance_booked!=false;


  })
  return (
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
            <Badge>{store.brand}</Badge>
            <Badge variant="outline">{store.code}</Badge>
            <span className="text-sm text-muted-foreground">{store.city}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/stores/edit/${store.id}`}>
              <FileEdit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <StoreSummaryCards
        totalAssets={totalAssets}
        assetsInProgress={assetsInProgress}
        assetsCompleted={assetsCompleted}
      />

      <StoreProgressCards
        grnCompletionPercentage={(grnCompletionPercentage.length/filteredAssets.length)*100}
        financeBookingPercentage={(erpCompletionPercentage.length/filteredAssets.length)*100}
      />

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <StoreAssetsTable
        storeId={store.id}
        storeAssets={filteredAssets}
        isLoading={isLoading}
        onToggleStatus={toggleStatus}
        onDocumentDialogOpen={openDocumentDialog}
        onInputChange={setInputValue}
        onSaveDocument={saveDocumentNumber}
      />

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
  );
};

export default StoreDetail;
