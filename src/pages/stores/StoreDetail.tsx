
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
import { StoreSummaryCards } from "@/components/store/StoreSummaryCards";
import { StoreProgressCards } from "@/components/store/StoreProgressCards";
import { DocumentEntryDialog } from "@/components/store/DocumentEntryDialog";
import { StoreAssetsTable } from "@/components/store/StoreAssetsTable";
import { StoreAsset } from "@/types";
import { storeAPI } from "@/api/storeAPI";
import EnhancedStoreAssetsTable from "@/components/store/EnhancedStoreAssetsTable";

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
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [useEnhancedTable, setUseEnhancedTable] = useState(true);

  // Fetch store details
  const [store, setStore] = useState(null);

  // -----------------------------
  const highProgressValue = 140;

  // -------------------------
  useEffect(() => {
    if (id) {
      initialService();
    }
  }, [id]);

  function initialService() {
    fetchStoreDetails();
    fetchStoreAssets();
  }
  
  async function fetchStoreDetails() {
    try {
      console.log("Fetching store details for ID:", id);
      const storeDetails = await storeAPI.getStoreById(id);
      console.log("Fetched store details:", storeDetails);
      setStore(storeDetails);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching store details:", error);
      toast({
        title: "Error",
        description: "Failed to load store details",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }
  
  async function fetchStoreAssets() {
    try {
      console.log("Fetching store assets for ID:", id);
      const assets = await storeAPI.getStoreDetailsAssetsByStoreId(id);
      console.log("Fetched store assets:", assets);
      setStoreAssetsList(assets);
    } catch (error) {
      console.error("Error fetching store assets:", error);
      toast({
        title: "Error",
        description: "Failed to load store assets",
        variant: "destructive"
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading Store Details...</h2>
          <p className="text-muted-foreground mb-4">
            Please wait while we load the store information.
          </p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Store Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The store you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/stores">Back to Stores</Link>
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
  );

  // Calculate summary statistics
  const totalAssets = storeAssetsList.length;

  // ---------------------------
  // Calculate high progress stores
  const highProgressStores = filteredAssets.filter((asset) => {
    // Access total_assets_cnt safely
    return asset && asset.grn_progress !== undefined;
  });

  const lowProgressStores = totalAssets - highProgressStores.length;

  // ---------------------------
  // Asset progress calculations
  const assetsInProgress = storeAssetsList.filter(
    (sa) => sa.po_number && (!sa.isGrnDone || !sa.is_finance_booked)
  ).length;
  const assetsCompleted = storeAssetsList.filter(
    (sa) => sa.isGrnDone && sa.is_finance_booked
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
      if (type === "po") setInputValue(asset.po_number || "");
      if (type === "invoice") setInputValue(asset.invoice_number || "");
      if (type === "grn") setInputValue(asset.grn_number || "");
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
              updatedAsset.po_number = inputValue;
            } else if (documentType === "invoice") {
              updatedAsset.invoice_number = inputValue;
            } else if (documentType === "grn") {
              updatedAsset.grn_number = inputValue;
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
  const toggleStatus = async (assetId: string, updateParam: string, body: any) => {
    setIsLoading(true);
    try {
      await storeAPI.storeAssetTrackingStatusUpdate(assetId, updateParam, body);
      await fetchStoreAssets();
      toast({
        title: "Status updated",
        description: "Asset status has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate completion percentages
  const grnCompletionPercentage = filteredAssets.filter((asset) => 
    asset.grn_number !== "" && asset.grn_number !== null
  );
  
  const erpCompletionPercentage = filteredAssets.filter((asset) =>
    asset.is_finance_booked !== null && asset.is_finance_booked !== false
  );

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

      <StoreProgressCards
        grnCompletionPercentage={grnCompletionPercentage.length > 0 
          ? ((grnCompletionPercentage.length/filteredAssets.length) * 100) 
          : 0}
        financeBookingPercentage={erpCompletionPercentage.length > 0 
          ? ((erpCompletionPercentage.length/filteredAssets.length) * 100) 
          : 0}
      />

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

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Asset Tracking</h2>
        <Button variant="outline" onClick={() => setUseEnhancedTable(!useEnhancedTable)}>
          {useEnhancedTable ? "Switch to Classic View" : "Switch to Enhanced View"}
        </Button>
      </div>

      {useEnhancedTable ? (
        <EnhancedStoreAssetsTable
          storeId={store.id}
          storeAssets={filteredAssets}
          isLoading={isLoading}
          onToggleStatus={toggleStatus}
          onRefresh={fetchStoreAssets}
        />
      ) : (
        <StoreAssetsTable
          storeId={store.id}
          storeAssets={filteredAssets}
          isLoading={isLoading}
          onToggleStatus={toggleStatus}
          onDocumentDialogOpen={openDocumentDialog}
          onInputChange={setInputValue}
          onSaveDocument={saveDocumentNumber}
        />
      )}

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
