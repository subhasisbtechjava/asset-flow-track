import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Store, ArrowRight, Download, Plus } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
import { mockStores } from "@/data/mockData";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState<string | null>(null);
  const [cityFilter, setCityFilter] = useState<string | null>(null);

  const brands = useMemo(() => 
    Array.from(new Set(mockStores.map(store => store.brand))),
    []
  );
  
  const cities = useMemo(() => 
    Array.from(new Set(mockStores.map(store => store.city))),
    []
  );

  const filteredStores = mockStores.filter(store => {
    const matchesSearch = 
      searchTerm === "" || 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBrand = !brandFilter || store.brand === brandFilter;
    const matchesCity = !cityFilter || store.city === cityFilter;
    
    return matchesSearch && matchesBrand && matchesCity;
  });

  const totalStores = filteredStores.length;
  const highProgressStores = filteredStores.filter(store => 
    store.grnCompletionPercentage > 75 && store.financeBookingPercentage > 75
  ).length;
  const lowProgressStores = filteredStores.filter(store => 
    store.grnCompletionPercentage < 25 || store.financeBookingPercentage < 25
  ).length;
  
  const exportToCSV = () => {
    console.log("Exporting data to CSV...");
    alert("Export to CSV functionality will be implemented in the next phase.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">QSR Asset Purchase Tracking Overview</p>
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
            <div className="text-3xl font-bold text-green-600">{highProgressStores}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{lowProgressStores}</div>
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Store
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
              <div className="grid grid-cols-2 gap-4 md:w-1/2">
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
                      <th className="py-3 px-4 text-left text-sm font-medium">GRN Progress</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Finance Progress</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStores.length > 0 ? (
                      filteredStores.map((store) => (
                        <tr key={store.id} className="border-t">
                          <td className="py-3 px-4 text-sm">{store.code}</td>
                          <td className="py-3 px-4 text-sm font-medium">{store.name}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">{store.brand}</Badge>
                          </td>
                          <td className="py-3 px-4 text-sm">{store.city}</td>
                          <td className="py-3 px-4 min-w-[160px]">
                            <ProgressBadge 
                              percentage={store.grnCompletionPercentage} 
                              size="sm"
                            />
                          </td>
                          <td className="py-3 px-4 min-w-[160px]">
                            <ProgressBadge 
                              percentage={store.financeBookingPercentage} 
                              size="sm"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              asChild
                            >
                              <Link to={`/stores/${store.id}`}>
                                Details
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))
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
            Showing {filteredStores.length} of {mockStores.length} stores
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Dashboard;
