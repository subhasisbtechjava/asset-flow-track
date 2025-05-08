import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, FileEdit, Trash2, AlertTriangle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { assetAPI } from "../../api/storeAPI"; // ADDED ON 30-04-2025//////
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockAssets } from "@/data/mockData";
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
import { toast } from "@/components/ui/use-toast";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ManageBrands = () => {
  let pagedata = [];
  const [filteredAssets, setAssets] = useState([]);
  const [filteredBrands, setBrands] = useState([1,2,3,4]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const allAssets = await assetAPI.getAllAssets();
        //console.log(allAssets);
        setAssets(allAssets);
      } catch (error) {
        console.error("Failed to fetch stores", error);
      }
    };

    fetchAssets();
  }, [deletingId]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const allAssets = await assetAPI.getAllAssets();
        //console.log(allAssets);
        setAssets(allAssets);
      } catch (error) {
        console.error("Failed to fetch stores", error);
      }
    };

    fetchAssets();
  }, []);

  const searcResult = filteredAssets.filter((filterdata) => {
    const matchesSearch =
      searchTerm === "" ||
      filterdata.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filterdata.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filterdata.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  pagedata = searcResult.length > 0 ? searcResult : [];

  // Categories for grouping
  const categories = Array.from(
    new Set(pagedata.map((asset) => asset.category))
  );

  // Group assets by category
  const assetsByCategory = categories.map((category) => {
    return {
      category,
      assets: pagedata.filter((asset) => asset.category === category),
    };
  });

  // Handle delete asset
  const handleDeleteAsset = async (id: string) => {
    console.log("Deleting asset:", id);

    const deleteAssets = await assetAPI.deleteAsset(id);
    toast({
      title: "Asset deleted",
      description: "Asset has been deleted successfully.",
    });
    setDeletingId(id);
    navigate("/assets");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Brands</h1>
          <p className="text-muted-foreground">Manage your brand master list</p>
        </div>
        <Button asChild>
          <Link to="/assets/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Brand
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Brand Master List</CardTitle>
              <CardDescription>All available brands</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* ---------------- */}

          <Table>
              <TableHeader>
                <TableRow>
           
                  <TableHead className="w-[100px]">Sl No.</TableHead>
                  <TableHead className="w-[120px]">Image</TableHead>
                  <TableHead className="w-[120px]">Name</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
               
                </TableRow>
              </TableHeader>
              <TableBody>

{
  filteredBrands.length>0?(
    <TableRow></TableRow>
  ):(<TableRow>
    <TableCell colSpan={9} className="h-24 text-center">
      <div className="flex flex-col items-center justify-center text-muted-foreground">
        <AlertTriangle className="h-8 w-8 mb-2" />
        <p>No assets found for this store</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() =>
            navigate(`/stores/55d-assets`)
          }
        >
          <Package className="mr-2 h-4 w-4" />
          Assign Assets
        </Button>
      </div>

      {/* <div className="flex justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    asChild
                  >
                    <Link to={`/assets/edit/${asset.id}`}>
                      <FileEdit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will delete the {asset.name} asset from your assets master list and also delete the store assets of this item.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteAsset(asset.id)}
                          disabled={deletingId === asset.id}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deletingId === asset.id ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div> */}
    </TableCell>

  </TableRow>)
}


              
              </TableBody>
            </Table>
         
          
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageBrands;
