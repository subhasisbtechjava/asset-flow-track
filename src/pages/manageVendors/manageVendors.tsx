import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, FileEdit, Trash2, AlertTriangle, Package, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { vendorAPI } from "../../api/storeAPI";
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
  const [filteredBrands, setVendor] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const loadintime = useLoadertime();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20); // You can make this configurable

  useEffect(() => {
    setLoading(true);
    const fetchAssets = async () => {
      try {
        const allVendors = await vendorAPI.getAllVendors();      
        setVendor(allVendors);
      } catch (error) {
        console.error("Failed to fetch stores", error);
      } finally {
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
        setVendor(allVendors);
      } catch (error) {
        console.error("Failed to fetch stores", error);
      }
    };

    fetchAssets();
  }, [filteredBrands, deletingId]);

  const searcResult = filteredBrands.filter((filterdata) => {
    const matchesSearch =
      searchTerm === "" || filterdata.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Calculate pagination
  const totalItems = searcResult.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searcResult.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const firstPage = () => setCurrentPage(1);
  const lastPage = () => setCurrentPage(totalPages);

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
                <CardDescription>
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} of {totalItems} vendors
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vendor..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page when searching
                  }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
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
                {currentItems.length > 0 ? (  
                  currentItems.map((vendorval, index) => (
                    <TableRow key={vendorval.id} className="h-[60px]">
                      <TableCell className="w-[80px] py-2">{indexOfFirstItem + index + 1}</TableCell>
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
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <AlertTriangle className="h-8 w-8 mb-2" />
                        <p>No vendor found</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() => navigate(`/stores/55d-assets`)}
                        >
                          <Package className="mr-2 h-4 w-4" />
                          Assign Vendor
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            { totalItems > itemsPerPage && (
              <div className="flex items-center justify-center gap-4 px-2 mt-4">
  <Button
    variant="outline"
    className="hidden h-8 w-8 p-0 lg:flex"
    onClick={firstPage}
    disabled={currentPage === 1}
  >
    <span className="sr-only">Go to first page</span>
    <ChevronsLeft className="h-4 w-4" />
  </Button>
  <Button
    variant="outline"
    className="h-8 w-8 p-0"
    onClick={prevPage}
    disabled={currentPage === 1}
  >
    <span className="sr-only">Go to previous page</span>
    <ChevronLeft className="h-4 w-4" />
  </Button>
  
  <span className="flex items-center justify-center text-sm font-medium mx-4">
    Page {currentPage} of {totalPages}
  </span>
  
  <Button
    variant="outline"
    className="h-8 w-8 p-0"
    onClick={nextPage}
    disabled={currentPage === totalPages}
  >
    <span className="sr-only">Go to next page</span>
    <ChevronRight className="h-4 w-4" />
  </Button>
  <Button
    variant="outline"
    className="hidden h-8 w-8 p-0 lg:flex"
    onClick={lastPage}
    disabled={currentPage === totalPages}
  >
    <span className="sr-only">Go to last page</span>
    <ChevronsRight className="h-4 w-4" />
  </Button>
</div>
            ) }

          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ManageVendors;