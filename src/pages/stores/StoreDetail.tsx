import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { FileEdit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getStoreById, getStoreAssetsByStoreId } from "@/data/mockData";
import { StoreSummaryCards } from "@/components/store/StoreSummaryCards";
import { StoreProgressCards } from "@/components/store/StoreProgressCards";
import { DocumentEntryDialog } from "@/components/store/DocumentEntryDialog";
import { StoreAssetsTable } from "@/components/store/StoreAssetsTable";
import { StoreAsset } from "@/types";

const StoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [storeAssetsList, setStoreAssetsList] = useState<StoreAsset[]>(() => 
    id ? getStoreAssetsByStoreId(id) : []
  );
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<'po' | 'invoice' | 'grn' | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch store details
  const store = id ? getStoreById(id) : null;
  
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

  // Calculate summary statistics
  const totalAssets = storeAssetsList.length;
  const assetsInProgress = storeAssetsList.filter(
    sa => sa.poNumber && (!sa.isGrnDone || !sa.isFinanceBooked)
  ).length;
  const assetsCompleted = storeAssetsList.filter(
    sa => sa.isGrnDone && sa.isFinanceBooked
  ).length;

  // Handle document dialog
  const openDocumentDialog = (assetId: string, type: 'po' | 'invoice' | 'grn') => {
    setSelectedAsset(assetId);
    setDocumentType(type);
    const asset = storeAssetsList.find(a => a.id === assetId);
    if (asset) {
      if (type === 'po') setInputValue(asset.poNumber || '');
      if (type === 'invoice') setInputValue(asset.invoiceNumber || '');
      if (type === 'grn') setInputValue(asset.grnNumber || '');
    }
  };

  const closeDocumentDialog = () => {
    setSelectedAsset(null);
    setDocumentType(null);
    setInputValue('');
  };

  // Save document number
  const saveDocumentNumber = () => {
    if (!selectedAsset || !documentType || !inputValue) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setStoreAssetsList(prev => 
        prev.map(asset => {
          if (asset.id === selectedAsset) {
            const updatedAsset = { ...asset };
            if (documentType === 'po') {
              updatedAsset.poNumber = inputValue;
            } else if (documentType === 'invoice') {
              updatedAsset.invoiceNumber = inputValue;
            } else if (documentType === 'grn') {
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
  const toggleStatus = (assetId: string, field: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setStoreAssetsList(prev => 
        prev.map(asset => {
          if (asset.id === assetId) {
            const updatedAsset = { ...asset };
            if (field === 'isGrnDone') {
              updatedAsset.isGrnDone = !asset.isGrnDone;
            } else if (field === 'isTaggingDone') {
              updatedAsset.isTaggingDone = !asset.isTaggingDone;
            } else if (field === 'isProjectHeadApproved') {
              if (asset.isProjectHeadApproved === null) {
                updatedAsset.isProjectHeadApproved = true;
              } else {
                updatedAsset.isProjectHeadApproved = !asset.isProjectHeadApproved;
              }
            } else if (field === 'isAuditDone') {
              updatedAsset.isAuditDone = !asset.isAuditDone;
            } else if (field === 'isFinanceBooked') {
              updatedAsset.isFinanceBooked = !asset.isFinanceBooked;
            }
            return updatedAsset;
          }
          return asset;
        })
      );
      
      toast({
        title: "Status updated",
        description: "Asset status has been updated successfully.",
      });
      
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
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
          <Button variant="default" asChild>
            <Link to={`/stores/${store.id}/add-assets`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Assets
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  store and all of its associated assets and purchase records.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteStore}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <StoreSummaryCards
        totalAssets={totalAssets}
        assetsInProgress={assetsInProgress}
        assetsCompleted={assetsCompleted}
      />

      <StoreProgressCards
        grnCompletionPercentage={store.grnCompletionPercentage}
        financeBookingPercentage={store.financeBookingPercentage}
      />

      <StoreAssetsTable
        storeId={store.id}
        storeAssets={storeAssetsList}
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
