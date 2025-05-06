
import { useState, useMemo,useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, MoreHorizontal } from "lucide-react";
import { authAPI } from '../api/authAPI';  // ADDED ON 30-04-2025//////
import { storeAPI } from '../api/storeAPI';  // ADDED ON 30-04-2025//////
import { User, Store } from "@/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProgressBadge } from "@/components/ui/progress-badge";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
//import { mockStores } from "@/data/mockData";





const Dashboard = () => {
  const highProgressValue = 140 ;
  const [stores, setStores] = useState<Store[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState<string | null>(null);
  const [cityFilter, setCityFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>("in_progress");
  const randomPercentage = (min: number, max: number) => 
    Math.floor(Math.random() * (max - min + 1) + min);

  const fetchStores = async () => {
    try {
      const allStores = await storeAPI.getAllStores();
      const storedata = allStores.map((store) => ({
        ...store,
        grnCompletionPercentage: randomPercentage(50, 100),
        financeBookingPercentage: randomPercentage(50, 90),
      }));

      setStores(storedata);
    } catch (error) {
      console.error("Failed to fetch stores", error);
    }
  };
  useEffect(() => {
  
    fetchStores();
  }, []);


  const brands = useMemo(() => 
    Array.from(new Set(stores.map(store => store.brand))),
  [stores]
  );
  
  // const brands = stores.map(store => {
  //   return store.brand
  // });
  //console.log(brands);
  const cities = useMemo(() => 
    Array.from(new Set(stores.map(store => store.city))),
  [stores]
  );
  const [statuses] =useState<string[]>(["in_progress","closed",]);

  const filteredStores = stores.filter(store => {
    const matchesSearch = 
      searchTerm === "" || 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBrand = !brandFilter || store.brand === brandFilter;
    const matchesCity = !cityFilter || store.city === cityFilter;
    const matchesStatus = !statusFilter || store.status === statusFilter;
    
    return matchesSearch && matchesBrand && matchesCity &&matchesStatus;
  });

  
  
  // const totalProgress = (grnCompletionPercentage + financeBookingPercentage) / 2 || 0;
  
  
  
  const totalStores = filteredStores.length;
  
  const highProgressStores = filteredStores.filter((store)=>{
  const tempTotalCount = store.total_assets_cnt || 0; // Avoid division by zero
  console.log('tempTotalCount: ', tempTotalCount);
const grnCompletionPercentage =  store.grn_progress / tempTotalCount * 100 || 0;

const erpCompletionPercentage =  store.erp_progress / tempTotalCount * 100 || 0;
const totalProgress = grnCompletionPercentage + erpCompletionPercentage;
 const isHighProgress = totalProgress > highProgressValue;

    return isHighProgress;
  }  
  );
const highProgressStoresCount = highProgressStores.length;
const lowProgressStoresCount = filteredStores.length - highProgressStoresCount;
  
  // const highProgressStores = filteredStores.filter(store => 
  //   store.grnCompletionPercentage > 75 && store.financeBookingPercentage > 75
  // ).length;
  // const lowProgressStores = filteredStores.filter(store => 
  //   store.grnCompletionPercentage < 25 || store.financeBookingPercentage < 25
  // ).length;
  
  const exportToCSV = () => {
    console.log("Exporting data to CSV...");
    alert("Export to CSV functionality will be implemented in the next phase.");
  };





  const handleStoreMarkAsComplete =async (storeId: string) => {
try{
  const res =await storeAPI.storeMarkAsComplete(storeId);
  console.log('res: ', res);
  if(res.data.length>0){
    toast({
      title: "Success",
      description: `${res.data[0].name} has been marked as complete.`,
    });
  fetchStores(); // Refresh the store list after marking as complete
  }else{
    toast({
      title: "Error",
      description: `Failed to mark store as complete.`,
    });
  }
}catch(error){

  toast({
    title: "Error",
    description: `Failed to mark store as complete.`,
    variant: "destructive",
  });
}


  }
    // Mock API call - would be replaced with real data deletion
  return (
    // <div className="space-y-6">
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Store Tracking Overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Stores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStores}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">High Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{highProgressStoresCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{lowProgressStoresCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Store Progress</CardTitle>
              <CardDescription>Track progress of all your QSR store setups</CardDescription>
            </div>
            <Button asChild>
              <Link to="/stores/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Store
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search stores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 md:w-1/2">
                <Select onValueChange={(value) => setBrandFilter(value === "all" ? null : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={(value) => setCityFilter(value === "all" ? null : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

         
                <Select onValueChange={(value) =>{
                   setStatusFilter(value === "all" ? null : value)
                }}>
                     
                  <SelectTrigger>
                    <SelectValue placeholder="In Progress" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="all">Status</SelectItem> */}
                    {statuses.map((item,i) => (
                      <SelectItem key={item} value={item}>
                        {/* {item} */}
                        {item==="in_progress"?"In Progress":item==="closed"?"Closed":item}
                        
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="py-3 px-4 text-left text-sm font-medium">Store Code</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Store Name</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Brand</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">City</th>
                      {/* <th className="py-3 px-4 text-left text-sm font-medium">Status</th> */}
                      <th className="py-3 px-4 text-left text-sm font-medium">GRN Progress</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">ERP Progress</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStores.length > 0 ? (
                      filteredStores.map((store) => {

                        const tempTotalCount = store.total_assets_cnt || 0; // Avoid division by zero
                        const grnCompletionPercentage =  store.grn_progress / tempTotalCount * 100 || 0;
                        const erpCompletionPercentage =  store.erp_progress / tempTotalCount * 100 || 0;
                        return (
                          <tr key={store.id} className="border-t">
                            <td className="py-3 px-4 text-sm">{store.code}</td>
                            <td className="py-3 px-4 text-sm font-medium">
                              <Link to={`/stores/${store.id}`} className="hover:underline">
                                {store.name}
                              </Link>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="outline">{store.brand}</Badge>
                            </td>
                            <td className="py-3 px-4 text-sm">{store.city}</td>
                            {/* <td className="py-3 px-4 text-sm">{store.status}</td> */}
                            <td className="py-3 px-4 min-w-[160px]">
  
                              
                              <ProgressBadge 
                                percentage={+grnCompletionPercentage.toFixed(2)} 
                                size="sm"
                              />
                            </td>
                            <td className="py-3 px-4 min-w-[160px]">
                              <ProgressBadge 
                                percentage={+erpCompletionPercentage.toFixed(2)} 
                                size="sm"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <DropdownMenu >
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link to={`/stores/${store.id}`}>View Details</Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link to={`/stores/edit/${store.id}`}>Edit</Link>
                                  </DropdownMenuItem>
                                
                                  <DropdownMenuItem  onClick={() => handleStoreMarkAsComplete(store.id)}>
                                    Mark as Complete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-muted-foreground">
                          No stores found matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Showing {stores.length} of {stores.length} stores
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Dashboard;
