
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight, Search, Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { getStoreById, mockAssets } from "@/data/mockData";
import { Asset } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssetToAdd extends Asset {
  selected: boolean;
  quantity: number;
  customPrice?: number;
}

interface AssignedAsset {
  id: string;
  assetId: string;
  name: string;
  code: string;
  quantity: number;
  unit: string;
  price: number;
}

const StoreAddAssets = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [assetsToAdd, setAssetsToAdd] = useState<AssetToAdd[]>([]);
  const [assignedAssets, setAssignedAssets] = useState<AssignedAsset[]>([]);
  
  // New state for quick asset assignment
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");
  const [newAssetQuantity, setNewAssetQuantity] = useState<number>(1);
  const [newAssetPrice, setNewAssetPrice] = useState<number | undefined>(undefined);
  
  // Fetch store details
  const store = id ? getStoreById(id) : null;
  
  // Prepare assets list
  useEffect(() => {
    // Load existing assigned assets if any
    // In a real app, this would come from an API fetch
    setAssignedAssets([]);
    
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

  // Filter assets for search functionality
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
  
  const handlePriceChange = (assetId: string, price: number) => {
    if (price < 0) return;
    
    setAssetsToAdd(prev => 
      prev.map(asset => 
        asset.id === assetId ? { ...asset, customPrice: price } : asset
      )
    );
  };

  const handleQuickAdd = () => {
    if (!selectedAssetId) {
      toast({
        title: "No asset selected",
        description: "Please select an asset to assign.",
        variant: "destructive"
      });
      return;
    }

    const assetToAdd = assetsToAdd.find(asset => asset.id === selectedAssetId);
    if (!assetToAdd) return;

    const price = newAssetPrice !== undefined ? newAssetPrice : assetToAdd.pricePerUnit;

    const newAssignedAsset: AssignedAsset = {
      id: `temp-${Date.now()}`,
      assetId: assetToAdd.id,
      name: assetToAdd.name,
      code: assetToAdd.code,
      quantity: newAssetQuantity,
      unit: assetToAdd.unitOfMeasurement,
      price: price
    };

    setAssignedAssets(prev => [...prev, newAssignedAsset]);
    
    // Reset form
    setSelectedAssetId("");
    setNewAssetQuantity(1);
    setNewAssetPrice(undefined);
    
    toast({
      title: "Asset added",
      description: `${assetToAdd.name} has been added to the assignment list.`,
    });
  };
  
  const handleRemoveAssignedAsset = (id: string) => {
    setAssignedAssets(prev => prev.filter(asset => asset.id !== id));
    toast({
      title: "Asset removed",
      description: "Asset has been removed from the assignment list."
    });
  };
  
  const handleUpdateAssignedAsset = (id: string, field: 'quantity' | 'price', value: number) => {
    if (value < 0) return;
    
    setAssignedAssets(prev => 
      prev.map(asset => 
        asset.id === id ? { ...asset, [field]: value } : asset
      )
    );
  };

  const handleSubmit = () => {
    const selectedFromTable = assetsToAdd
      .filter(asset => asset.selected)
      .map(asset => ({
        id: `selected-${asset.id}`,
        assetId: asset.id,
        name: asset.name,
        code: asset.code,
        quantity: asset.quantity,
        unit: asset.unitOfMeasurement,
        price: asset.customPrice !== undefined ? asset.customPrice : asset.pricePerUnit
      }));
    
    const allAssetsToSubmit = [...assignedAssets, ...selectedFromTable];
    
    if (allAssetsToSubmit.length === 0) {
      toast({
        title: "No assets selected",
        description: "Please select or add at least one asset to assign to the store.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Mock API call to add assets to store
    setTimeout(() => {
      console.log("Assigning assets to store:", {
        storeId: store.id,
        assets: allAssetsToSubmit.map(asset => ({
          assetId: asset.assetId,
          quantity: asset.quantity,
          price: asset.price
        }))
      });
      
      toast({
        title: "Assets assigned",
        description: `${allAssetsToSubmit.length} assets have been assigned to ${store.name}.`
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
          <span>Assign Assets</span>
        </div>
        <h1 className="text-3xl font-bold mt-1">Assign Assets to {store.name}</h1>
        <p className="text-muted-foreground">
          Select assets and specify quantities to assign to this store
        </p>
      </div>
      
      {/* Currently Assigned Assets */}
      {assignedAssets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Currently Assigned Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Asset Code</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Price (₹)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.name}</TableCell>
                    <TableCell>{asset.code}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        className="w-20"
                        value={asset.quantity}
                        onChange={(e) => handleUpdateAssignedAsset(
                          asset.id, 
                          'quantity', 
                          parseInt(e.target.value) || 1
                        )}
                      />
                    </TableCell>
                    <TableCell>{asset.unit}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-24"
                        value={asset.price}
                        onChange={(e) => handleUpdateAssignedAsset(
                          asset.id, 
                          'price', 
                          parseFloat(e.target.value) || 0
                        )}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAssignedAsset(asset.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Quick Asset Assignment */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Asset Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-12 gap-4">
            <div className="md:col-span-5">
              <label className="text-sm font-medium mb-1 block">Select Asset</label>
              <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an asset..." />
                </SelectTrigger>
                <SelectContent>
                  {assetsToAdd.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.name} ({asset.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">Quantity</label>
              <Input
                type="number"
                min="1"
                value={newAssetQuantity}
                onChange={(e) => setNewAssetQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
            
            <div className="md:col-span-3">
              <label className="text-sm font-medium mb-1 block">Price (₹) (Optional)</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={newAssetPrice !== undefined ? newAssetPrice : ''}
                placeholder="Default price"
                onChange={(e) => setNewAssetPrice(e.target.value === '' ? undefined : parseFloat(e.target.value))}
              />
            </div>
            
            <div className="md:col-span-2 flex items-end">
              <Button onClick={handleQuickAdd} className="w-full">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
                    <th className="py-3 px-4 text-left text-sm font-medium">Custom Price</th>
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
                            min="0"
                            step="0.01"
                            className="w-24"
                            placeholder="Optional"
                            value={asset.customPrice !== undefined ? asset.customPrice : ''}
                            onChange={(e) => handlePriceChange(
                              asset.id, 
                              e.target.value === '' ? asset.pricePerUnit : parseFloat(e.target.value)
                            )}
                            disabled={!asset.selected}
                          />
                        </td>
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
                      <td colSpan={7} className="py-6 text-center text-muted-foreground">
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
              disabled={isLoading || (assignedAssets.length === 0 && !assetsToAdd.some(asset => asset.selected))}
            >
              {isLoading ? "Assigning..." : "Assign Selected Assets"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreAddAssets;
