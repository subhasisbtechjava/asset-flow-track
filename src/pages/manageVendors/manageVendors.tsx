import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, FileEdit, Trash2, AlertTriangle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { vendorAPI } from "../../api/storeAPI"; // ADDED ON 30-04-2025//////
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

import Loader from '../../components/loader/Loader';
import { useLoadertime } from "../../contexts/loadertimeContext";

const ManageVendors = () => {
  let pagedata = [];
  
  const [filteredBrands, setVendor] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
   const [loading, setLoading] = useState(false);
   const loadintime = useLoadertime();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchAssets = async () => {
      try {
        const allVendors = await vendorAPI.getAllVendors();      
        setVendor(allVendors);
      } catch (error) {
        console.error("Failed to fetch stores", error);
      }finally{
         setTimeout(() => {
          setLoading(false)
      }, loadintime); 
      }
    };

    fetchAssets();
  }, []);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const allVendors = await vendorAPI.getAllVendors();
        //console.log(allBrands);
        //const  allBrands = []
        setVendor(allVendors);
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
  const handleDeleteVendor = async (id: string) => {
    console.log("Deleting vendor:", id);

    const deleteAssets = await vendorAPI.deleteVendor(id);
    toast({
      title: "Vendor deleted",
      description: "Vendor has been deleted successfully.",
    });
    setDeletingId(id);
    navigate("/manage-vendors");
  };

  return (
    <>
      <Loader loading={loading} />
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Vendors</h1>
          <p className="text-muted-foreground">Manage your vendor master list</p>
        </div>
        <Button asChild>
          <Link to="/vendor/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Vendor
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Vendor Master List</CardTitle>
              {/* <CardDescription>All available brands</CardDescription> */}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendor..."
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
                  <TableHead className="w-[120px]">Name</TableHead>
                  <TableHead className="w-[120px]">Addess</TableHead>
                  <TableHead className="w-[120px]">Phone No.</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
               
                </TableRow>
              </TableHeader>
              <TableBody>

{ pagedata.length>0?(  

pagedata.map((vendorval, index) => (
  <TableRow key={vendorval.id} className="h-[60px]"> {/* Decreased row height */}
  <TableCell className="w-[80px] py-2">{index + 1}</TableCell>
   
  <TableCell className="w-[120px] py-2">{vendorval.name}</TableCell>
    <TableCell className="w-[120px] py-2">{vendorval.address}</TableCell>
    <TableCell className="w-[120px] py-2">{vendorval.phno}</TableCell>
  <TableCell
  className={`w-[100px] py-2 capitalize font-bold ${
    vendorval.status?.toLowerCase() === "active"
      ? "text-green-600"
      : "text-red-400"
  }`}
>
  {vendorval.status}
</TableCell>
  <TableCell className="w-[120px] py-2">
    <Button variant="ghost" size="icon" asChild>
      <Link to={`/vendor/edit/${vendorval.id}`}>
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
                                              This will delete the {vendorval.name} vendor from vendor master list.
                                              This action cannot be undone.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => handleDeleteVendor(vendorval.id)}
                                              disabled={deletingId === vendorval.id}
                                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                              {deletingId === vendorval.id ? "Deleting..." : "Delete"}
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
    </>
  );
};

export default ManageVendors;
