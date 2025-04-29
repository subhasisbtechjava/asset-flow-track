
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { getStoreById, mockAssets } from "@/data/mockData";
import { Asset } from "@/types";

interface AssetToAdd extends Asset {
  selected: boolean;
  quantity: number;
}

const StoreAddAssets = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [assetsToAdd, setAssetsToAdd] = useState<AssetToAdd[]>([]);

  // Fetch store details
  const store = id ? getStoreById(id) : null;
  
  // Prepare assets list
  useEffect(() => {
    const preparedAssets = mockAssets.map(asset => ({
      ...asset,
      selected: false,
      quantity: 1
    }));
    setAssetsToAdd(preparedAssets);
  }, []);

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

  const filteredAssets = assetsToAdd.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleSelect = (assetId: string) => {
    setAssetsToAdd(prev => 
      prev.map(asset => 
        asset.id === assetId ? { ...asset, selected: !asset.selected } : asset
      )
    );
  };

  const handleQuantityChange = (assetId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setAssetsToAdd(prev => 
      prev.map(asset => 
        asset.id === assetId ? { ...asset, quantity } : asset
      )
    );
  };

  const handleSubmit = () => {
    const selectedAssets = assetsToAdd.filter(asset => asset.selected);
    
    if (selectedAssets.length === 0) {
      toast({
        title: "No assets selected",
        description: "Please select at least one asset to add to the store.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Mock API call to add assets to store
    setTimeout(() => {
      console.log("Adding assets to store:", {
        storeId: store.id,
        assets: selectedAssets.map(asset => ({
          assetId: asset.id,
          quantity: asset.quantity
        }))
      });
      
      toast({
        title: "Assets added",
        description: `${selectedAssets.length} assets have been added to ${store.name}.`
      });
      
      setIsLoading(false);
      navigate(`/stores/${store.id}`);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link 
            to={`/stores/${store.id}`} 
            className="text-muted-foreground hover:text-foreground"
          >
            {store.name}
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span>Add Assets</span>
        </div>
        <h1 className="text-3xl font-bold mt-1">Add Assets to {store.name}</h1>
        <p className="text-muted-foreground">
          Select assets and specify quantities to add to this store
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Assets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="w-12 px-4 py-3"></th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Asset Code</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Asset Name</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Category</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Unit Cost (₹)</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map((asset) => (
                      <tr key={asset.id} className="border-t">
                        <td className="px-4 py-3 text-center">
                          <Checkbox
                            id={`asset-${asset.id}`}
                            checked={asset.selected}
                            onCheckedChange={() => handleToggleSelect(asset.id)}
                          />
                        </td>
                        <td className="py-3 px-4 text-sm">{asset.code}</td>
                        <td className="py-3 px-4 text-sm font-medium">{asset.name}</td>
                        <td className="py-3 px-4 text-sm">{asset.category}</td>
                        <td className="py-3 px-4 text-sm">₹{asset.pricePerUnit.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <Input
                            type="number"
                            min="1"
                            className="w-20"
                            value={asset.quantity}
                            onChange={(e) => handleQuantityChange(
                              asset.id, 
                              parseInt(e.target.value) || 1
                            )}
                            disabled={!asset.selected}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-muted-foreground">
                        No assets found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/stores/${store.id}`)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || !assetsToAdd.some(asset => asset.selected)}
            >
              {isLoading ? "Adding..." : "Add Selected Assets"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreAddAssets;
