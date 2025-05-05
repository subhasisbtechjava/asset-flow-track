import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight, Search, Plus, Trash2, Edit, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { assetAPI, storeAPI } from "@/api/storeAPI";
import { log } from "console";
import { custom } from "zod";



interface AssignedAsset {
  id: string;
  assetId: string;
  name: string;
  code: string;
  quantity: number;
  unit: string;
  price: number;
  isEditing?: boolean;
}

const StoreAddAssets = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [allAssets, setAssets] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [assignedAssets, setAssignedAssets] = useState<AssignedAsset[]>([]);


  // Fetch store details
  const store = id ? {
    id: id,
    name: 'Acropolis',
    code: 'KOL246',
    brand: 'Wow! Kulfi',
    city: 'Kolkata',
    grnCompletionPercentage: 100,
    financeBookingPercentage:80
  } : null;
  // const store = id ? getStoreById(id) : null;
  // -------------------------ismile--------------------
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const [isAssignAssetLoading, setIsAssignAssetLoading] = useState(false);

  const [editingItemId, setEditingItemId] = useState(false);

  const [assetsToAdd, setAssetsToAdd] = useState([]);
  const [selectedAssignAsset, setSelectedAssignAsset] = useState(undefined);
  const [selectedAssignAssetQuantity, setSelectedAssignAssetQuantity] =
    useState(1);
  const [selectedAssignAssetPrice, setSelectedAssignAssetPrice] = useState(0);
  // -------------------------ismile--------------------
  // Prepare assets list
  const fetchMasterAssets = async () => {
    try {
      const allAssets = await assetAPI.getAllAssets();
      console.log(allAssets);
      setAssets(allAssets);
    } catch (error) {
      console.error("Failed to fetch stores", error);
    }
  };
  const fetchStoreAssets = async () => {
    try {
      const storeAssets = await storeAPI.fetchStoreWiseAssetsList(id);
      console.log("====================================");

      console.log(storeAssets);
      console.log("====================================");
      setAssetsToAdd(storeAssets);
      // setAssets(allAssets);
    } catch (error) {
      console.error("Failed to fetch stores", error);
    }
  };
  useEffect(() => {
    // Load existing assigned assets if any
    // In a real app, this would come from an API fetch

    fetchMasterAssets();
    fetchStoreAssets();
    setAssignedAssets([]);

    // const preparedAssets = mockAssets.map(asset => ({
    //   ...asset,
    //   selected: false,
    //   quantity: 1
    // }));
    // setAssetsToAdd(preparedAssets);
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
  const filteredAssets = assetsToAdd
  .filter(asset =>
    asset.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.asset_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const handleToggleSelect = (assetId: string) => {
    setAssetsToAdd((prev) =>
      prev.map((asset) =>
        asset.id === assetId ? { ...asset, selected: !asset.selected } : asset
      )
    );
  };

  const handleQuantityChange = (assetId: string, quantity: number) => {
    if (quantity < 1) return;

    setAssetsToAdd((prev) =>
      prev.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              quantity,
              // customPrice:
              //   asset.asset == undefined
              //     ? quantity * Number(asset.price_per_unit)
              //     : Number(asset.customPrice) * quantity,
            }
          : asset
      )
    );
  };

  const handlePriceChange = (assetId: string, price: number) => {
    console.log("price: ", price);
    if (price < 0) return;

    setAssetsToAdd((prev) =>
      prev.map((asset) =>
        asset.id === assetId ? { ...asset, price_per_unit: price } : asset
      )
    );
  };

  const resetQuickAddForm = () => {
    setSelectedAssignAsset({});
    setSelectedAssignAssetPrice(0);
    setSelectedAssignAssetQuantity(1);
  };
  const handleQuickAdd = async () => {
    try {
      setIsAssignAssetLoading(true);
      if (!selectedAssignAsset?.id) {
        toast({
          title: "No asset selected",
          description: "Please select an asset to assign.",
          variant: "destructive",
        });
        return;
      }

      console.log("id: ", id);
      const assignAssetRes = await storeAPI.assignAssetToStore(
        id,
        selectedAssignAsset?.id,
        selectedAssignAssetQuantity,
        selectedAssignAssetPrice
      );

      if (!assignAssetRes["success"]) {
        toast({
          title: "Error",
          description: "Failed to assign asset. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("assignAssetRes: ", assignAssetRes);
      resetQuickAddForm();
      fetchStoreAssets();
      toast({
        title: "Asset assigned",
        description: `${selectedAssignAsset?.name} has been assigned to the list.`,
      });
    } catch (error) {
      toast({
        title: "Failed to assign asset",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsAssignAssetLoading(false);
    }
  };

  const handleRemoveAssignedAsset = (id: string) => {
    setAssignedAssets((prev) => prev.filter((asset) => asset.id !== id));
    toast({
      title: "Asset removed",
      description: "Asset has been removed from the assignment list.",
    });
  };

  const toggleEditMode = (id: string) => {
    setAssignedAssets((prev) =>
      prev.map((asset) =>
        asset.id === id ? { ...asset, isEditing: !asset.isEditing } : asset
      )
    );
  };

  const handleUpdateAssignedAsset = async (asset) => {
    try {
      setIsEditingLoading(true);
      if (!asset) {
        toast({
          title: "No assets selected",
          description: "Something went wrong",
          variant: "destructive",
        });

        return;
      }

      console.log("asset+++: ", asset);
      const { id, quantity, customPrice, price_per_unit } = asset;
      const res = await storeAPI.updateAssignedAssets(
        id,
        quantity,
        customPrice ?? price_per_unit
      );
      console.log("res: ", res);
      setIsEditing(!isEditing);
      setEditingItemId(null);
      fetchStoreAssets();
      toast({
        title: "Asset Upated",
        description: "Asset has been updated successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "No assets selected",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsEditingLoading(false);
    }
  };
  // const handleUpdateAssignedAsset = (id: string, field: 'quantity' | 'price', value: number) => {
  //   if (value < 0) return;

  //   setAssignedAssets(prev =>
  //     prev.map(asset =>
  //       asset.id === id ? { ...asset, [field]: value } : asset
  //     )
  //   );
  // };

  const handleSubmit = () => {
    const selectedFromTable = assetsToAdd
      .filter((asset) => asset.selected)
      .map((asset) => ({
        id: `selected-${asset.id}`,
        assetId: asset.id,
        name: asset.name,
        code: asset.code,
        quantity: asset.quantity,
        unit: asset.unitOfMeasurement,
        price:
          asset.customPrice !== undefined
            ? asset.customPrice
            : asset.pricePerUnit,
      }));

    const allAssetsToSubmit = [...assignedAssets, ...selectedFromTable];

    if (allAssetsToSubmit.length === 0) {
      toast({
        title: "No assets selected",
        description:
          "Please select or add at least one asset to assign to the store.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Mock API call to add assets to store
    setTimeout(() => {
      console.log("Assigning assets to store:", {
        storeId: store.id,
        assets: allAssetsToSubmit.map((asset) => ({
          assetId: asset.assetId,
          quantity: asset.quantity,
          price: asset.price,
        })),
      });

      toast({
        title: "Assets assigned",
        description: `${allAssetsToSubmit.length} assets have been assigned to ${store.name}.`,
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
        <h1 className="text-3xl font-bold mt-1">
          Assign Assets to {store.name}
        </h1>
        <p className="text-muted-foreground">
          Select assets and specify quantities to assign to this store
        </p>
      </div>
      {/* Currently Assigned Assets */}
      {/* {assignedAssets.length > 0 && (
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
                      {asset.isEditing ? (
                        <Input
                          type="number"
                          min="1"
                          className="w-20"
                          value={asset.quantity}
                          onChange={(e) => handleUpdateAssignedAsset(asset.quantity)}
                        />
                      ) : (
                        asset.quantity
                      )}
                    </TableCell>
                    <TableCell>{asset.unit}</TableCell>
                    <TableCell>
                      {asset.isEditing ? (
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
                      ) : (
                        `₹${asset.price.toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleEditMode(asset.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAssignedAsset(asset.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )} */}
      {/* Quick Asset Assignment */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Asset Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-12 gap-4">
            <div className="md:col-span-5">
              <label className="text-sm font-medium mb-1 block">
                Select Asset
              </label>
              <Select
                value={
                  selectedAssignAsset
                    ? JSON.stringify(selectedAssignAsset)
                    : undefined
                }
                onValueChange={(value) => {
                  console.log("value: ", value);
                  const assetValue = JSON.parse(value) as Asset;
                  setSelectedAssignAsset(assetValue);
                  setSelectedAssignAssetPrice(+assetValue.price_per_unit);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an asset..." />
                </SelectTrigger>
                <SelectContent>
                  {
                    // assetsToAdd

                    allAssets.map((asset) => (
                      <SelectItem key={asset.id} value={JSON.stringify(asset)}>
                        {asset.name} ({asset.code})
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">Quantity</label>
              <Input
                type="number"
                min="1"
                value={selectedAssignAssetQuantity}
                onChange={(e) => {
                  setSelectedAssignAssetQuantity(+e.target.value);
                  setSelectedAssignAssetPrice(
                    +e.target.value * selectedAssignAsset?.price_per_unit ?? 0
                  );
                }}
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-sm font-medium mb-1 block">
                Price (₹) (Optional)
              </label>
              <Input
                type="number"
                min="0"
                step="1"
                value={selectedAssignAssetPrice}
                placeholder="Default price"
                onChange={(e) => setSelectedAssignAssetPrice(+e.target.value)}
              />
            </div>

            <div className="md:col-span-2 flex items-end">
              <Button
                onClick={handleQuickAdd}
                className="w-full"
                disabled={isAssignAssetLoading}
              >
              {!isAssignAssetLoading&&  <Plus className="h-4 w-4 mr-1" />}
                {isAssignAssetLoading ? "Assigning..." : "Add"}
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
                    <th className="py-3 px-4 text-left text-sm font-medium">
                      Asset Code
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium">
                      Asset Name
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium">
                      Category
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium">
                    UOM 
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium">
                      Unit Cost (₹)
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium">
                      Quantity
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium">
                      Total Price
                    </th>
                    <th className="py-3 px-4 text-center text-sm font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map((asset) => (
                      <tr key={asset.id} className="border-t">
                        <td className="py-3 px-4 text-sm">
                          {asset?.asset_code}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">
                          {asset.asset_name}
                        </td>
                        <td className="py-3 px-4 text-sm">{asset.category}</td>

                        <td className="py-3 px-4 text-sm">
                        {asset.unit_of_measurement??"NA"}
                        </td>
                        {/* <td className="py-3 px-4 text-sm">
                          ₹{Number(asset.price_per_unit ?? "0").toFixed(2)}
                        </td> */}
                         {isEditing && asset.id == editingItemId ? (
                          <td className="py-3 px-4">
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              className="w-24"
                              placeholder="Optional"
                              value={
                               
                                // asset.quantity *
                                  Number(asset.price_per_unit ?? "0")
                              }
                              onChange={(e) =>
                                handlePriceChange(
                                  asset.id,
                                  e.target.value === ""
                                    ? parseFloat(asset.price_per_unit)
                                    : parseFloat(e.target.value)
                                )
                              }
                            />
                          </td>
                        ) : (
                          <td className="py-3 px-4 text-sm">
                            {asset.customPrice ??
                              asset.quantity *
                                Number(asset.price_per_unit ?? "0")}
                          </td>
                        )}
                        {isEditing && asset.id == editingItemId ? (
                          <td className="py-3 px-4">
                            <Input
                              type="number"
                              min="1"
                              className="w-20"
                              value={asset.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  asset.id,
                                  parseInt(e.target.value) || 1
                                )
                              }
                            />
                          </td>
                        ) : (
                          <td className="py-3 px-4 text-sm">
                            {asset.quantity}
                          </td>
                        )}

                        {/* {isEditing && asset.id == editingItemId ? (
                          <td className="py-3 px-4">
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              className="w-24"
                              placeholder="Optional"
                              value={
                                asset.customPrice ??
                                asset.quantity *
                                  Number(asset.price_per_unit ?? "0")
                              }
                              onChange={(e) =>
                                handlePriceChange(
                                  asset.id,
                                  e.target.value === ""
                                    ? parseFloat(asset.price_per_unit)
                                    : parseFloat(e.target.value)
                                )
                              }
                            />
                          </td>
                        ) : (
                          <td className="py-3 px-4 text-sm">
                            {asset.customPrice ??
                              asset.quantity *
                                Number(asset.price_per_unit ?? "0")}
                          </td>
                        )} */}
                        <td>{asset.quantity *
                                  Number(asset.price_per_unit ?? "0")}</td>

                        <td className="py-3 px-4 text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isEditingLoading && asset.id == editingItemId&&isEditingLoading}
                            onClick={() => {
                              console.log("isEditing: ", isEditing);

                              if (isEditing) {
                                console.log(
                                  "=========saving=======: ",
                                  isEditing
                                );
                                // Save the changes to the assigned asset
                                handleUpdateAssignedAsset(asset);
                              } else {
                                console.log(
                                  "=========initiating=======: ",
                                  isEditing
                                );

                                setIsEditing(!isEditing);
                                setEditingItemId(asset.id);
                              }
                            }}
                          >
                            {/* <Plus className="h-4 w-4 mr-1" /> */}

                             { (isEditing && asset.id == editingItemId)&&(!isEditingLoading ) ? (
                              <Save className="h-4 w-4" />
                            ) : (
                              <Edit className="h-4 w-4" />
                            )}
                            {isEditingLoading && asset.id == editingItemId
                              ? "Saving..."
                              : isEditing && asset.id == editingItemId
                              ? "Save"
                              : "Edit"}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-6 text-center text-muted-foreground"
                      >
                        No assets found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => navigate(`/stores/${store.id}`)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || assignedAssets.length === 0}
            >
              {isLoading ? "Assigning..." : "Assign Assets"}
            </Button>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreAddAssets;
