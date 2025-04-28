
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Package, 
  FileEdit, 
  Trash2, 
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBadge } from "@/components/ui/progress-badge";
import { StatusBadge } from "@/components/ui/status-badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStoreById, getStoreAssetsByStoreId } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";

const StoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch store details
  const store = id ? getStoreById(id) : null;
  
  // Fetch store assets
  const storeAssets = id ? getStoreAssetsByStoreId(id) : [];
  
  if (!store) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Store Not Found</CardTitle>
            <CardDescription className="text-center">
              The store you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link to="/stores">Back to Stores</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Handle delete store
  const handleDeleteStore = () => {
    setIsDeleting(true);
    
    // Mock API call - would be replaced with real data deletion
    setTimeout(() => {
      console.log("Deleting store:", id);
      setIsDeleting(false);
      
      toast({
        title: "Store deleted",
        description: `${store.name} has been deleted successfully.`,
      });
      
      navigate("/stores");
    }, 1000);
  };

  // Calculate some summary statistics
  const totalAssets = storeAssets.length;
  const assetsInProgress = storeAssets.filter(
    sa => sa.poNumber && (!sa.isGrnDone || !sa.isFinanceBooked)
  ).length;
  const assetsCompleted = storeAssets.filter(
    sa => sa.isGrnDone && sa.isFinanceBooked
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/stores" className="text-muted-foreground hover:text-foreground">
              Stores
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

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{assetsInProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{assetsCompleted}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Status</CardTitle>
          <CardDescription>
            Track the progress of your store setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">GRN Completion</div>
              <ProgressBadge percentage={store.grnCompletionPercentage} />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Finance Booking</div>
              <ProgressBadge percentage={store.financeBookingPercentage} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Store Assets</CardTitle>
              <CardDescription>
                Manage and track assets for this store
              </CardDescription>
            </div>
            <Button asChild>
              <Link to={`/stores/${store.id}/assets`}>
                <Package className="mr-2 h-4 w-4" />
                Manage Assets
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Assets ({storeAssets.length})</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress ({assetsInProgress})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({assetsCompleted})</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <AssetList assets={storeAssets} storeId={store.id} />
            </TabsContent>
            <TabsContent value="in-progress" className="mt-4">
              <AssetList 
                assets={storeAssets.filter(sa => 
                  sa.poNumber && (!sa.isGrnDone || !sa.isFinanceBooked)
                )} 
                storeId={store.id} 
              />
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
              <AssetList 
                assets={storeAssets.filter(sa => 
                  sa.isGrnDone && sa.isFinanceBooked
                )} 
                storeId={store.id} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

interface AssetListProps {
  assets: any[];
  storeId: string;
}

const AssetList = ({ assets, storeId }: AssetListProps) => {
  const navigate = useNavigate();

  const getAssetStatus = (asset: any): 'not-started' | 'pending' | 'in-progress' | 'approved' | 'completed' => {
    if (!asset.poNumber) return 'not-started';
    if (asset.isFinanceBooked) return 'completed';
    if (asset.isProjectHeadApproved) return 'approved';
    if (asset.poNumber) return 'in-progress';
    return 'pending';
  };

  if (assets.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <AlertTriangle className="mx-auto h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No assets found</h3>
        <p className="mt-1 text-muted-foreground">
          You haven't added any assets to this store yet.
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate(`/stores/${storeId}/assets`)}
        >
          Add Assets
        </Button>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="py-3 px-4 text-left text-sm font-medium">Asset</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Category</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Quantity</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id} className="border-t hover:bg-muted/20">
                <td className="py-3 px-4">
                  <div className="font-medium">{asset.asset?.name}</div>
                  <div className="text-xs text-muted-foreground">{asset.asset?.code}</div>
                </td>
                <td className="py-3 px-4">{asset.asset?.category}</td>
                <td className="py-3 px-4">
                  {asset.quantity} {asset.asset?.unitOfMeasurement}
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={getAssetStatus(asset)} />
                </td>
                <td className="py-3 px-4">
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreDetail;
