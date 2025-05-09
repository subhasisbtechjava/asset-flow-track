import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, FileEdit, Trash2, AlertTriangle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { brandAPI } from "../../api/storeAPI"; // ADDED ON 30-04-2025//////
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
  
  const [filteredBrands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchAssets = async () => {
  //     try {
  //       //const allBrands = await brandAPI.getAllBrands();
  //       const  allBrands = []
  //       console.log(allBrands);
  //       setBrands(allBrands);
  //     } catch (error) {
  //       console.error("Failed to fetch stores", error);
  //     }
  //   };

  //   fetchAssets();
  // }, [deletingId]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const allBrands = await brandAPI.getAllBrands();
        //console.log(allBrands);
        //const  allBrands = []
        setBrands(allBrands);
      } catch (error) {
        console.error("Failed to fetch stores", error);
      }
    };

    fetchAssets();
  }, [filteredBrands,deletingId]);

  const searcResult = filteredBrands.filter((filterdata) => {
    const matchesSearch =
      searchTerm === "" ||filterdata.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  pagedata = (searcResult.length) > 0 ? searcResult : [];
  
 // (searcResult.length > 0)? pagedata = searcResult : pagedata = filteredBrands;

  // Categories for grouping
  

  // Handle delete asset
  const handleDeleteAsset = async (id: string) => {
    console.log("Deleting asset:", id);

    const deleteAssets = await brandAPI.deleteBrand(id);
    toast({
      title: "Brand deleted",
      description: "Brand has been deleted successfully.",
    });
    setDeletingId(id);
    navigate("/manage-brands");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Brands</h1>
          <p className="text-muted-foreground">Manage your brand master list</p>
        </div>
        <Button asChild>
          <Link to="/brand/new">
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

{ pagedata.length>0?(  

pagedata.map((barndval, index) => (
  <TableRow key={barndval.id} className="h-[60px]"> {/* Decreased row height */}
  <TableCell className="w-[80px] py-2">{index + 1}</TableCell>
  
  <TableCell className="w-[100px] py-2">
    <div className="h-[70px] w-[70px] flex items-center justify-center overflow-hidden">
      <img
        src={barndval.image}
        alt="Brand"
        className="object-contain max-h-[70px]" // Ensures image is not too large
      />
    </div>
  </TableCell>

  <TableCell className="w-[120px] py-2">{barndval.name}</TableCell>
  <TableCell
  className={`w-[100px] py-2 capitalize font-bold ${
    barndval.brand_status?.toLowerCase() === "active"
      ? "text-green-600"
      : "text-red-400"
  }`}
>
  {barndval.brand_status}
</TableCell>
  <TableCell className="w-[120px] py-2">
    <Button variant="ghost" size="icon" asChild>
      <Link to={`/brand/edit/${barndval.id}`}>
        <FileEdit className="h-4 w-4" />
      </Link>
    </Button>
    {/* <Button variant="ghost" size="icon">
      <Trash2 className="h-4 w-4" />
    </Button> */}
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
                                              This will delete the {barndval.name} brand from brand master list.
                                              This action cannot be undone.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => handleDeleteAsset(barndval.id)}
                                              disabled={deletingId === barndval.id}
                                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                              {deletingId === barndval.id ? "Deleting..." : "Delete"}
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
  </TableCell>
</TableRow>
))

  ):(<TableRow>
    <TableCell colSpan={9} className="h-24 text-center">
      <div className="flex flex-col items-center justify-center text-muted-foreground">
        <AlertTriangle className="h-8 w-8 mb-2" />
        <p>No brand found</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() =>
            navigate(`/stores/55d-assets`)
          }
        >
          <Package className="mr-2 h-4 w-4" />
          Assign Brand
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

  </TableRow>
)}


              
              </TableBody>
            </Table>
         
          
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageBrands;
