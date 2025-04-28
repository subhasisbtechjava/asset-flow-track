
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBadge } from "@/components/ui/progress-badge";
import { Badge } from "@/components/ui/badge";
import { mockStores } from "@/data/mockData";

const StoreList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStores = mockStores.filter(store => {
    const searchLower = searchTerm.toLowerCase();
    return (
      store.name.toLowerCase().includes(searchLower) ||
      store.code.toLowerCase().includes(searchLower) ||
      store.brand.toLowerCase().includes(searchLower) ||
      store.city.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Stores</h1>
          <p className="text-muted-foreground">
            Manage your QSR store locations
          </p>
        </div>
        <Button asChild>
          <Link to="/stores/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Store
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
            <CardTitle>Store Locations</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stores..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStores.length > 0 ? (
              filteredStores.map((store) => (
                <Link
                  key={store.id}
                  to={`/stores/${store.id}`}
                  className="group"
                >
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm transition-all group-hover:shadow-md">
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className="text-xs font-normal">{store.brand}</Badge>
                        <span className="text-sm font-medium">{store.code}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{store.name}</h3>
                        <p className="text-sm text-muted-foreground">{store.city}</p>
                      </div>
                      <div className="space-y-3">
                        <ProgressBadge 
                          percentage={store.grnCompletionPercentage} 
                          label="GRN Completion" 
                          size="sm"
                        />
                        <ProgressBadge 
                          percentage={store.financeBookingPercentage} 
                          label="Finance Booking" 
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-6 text-center text-muted-foreground">
                No stores found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreList;
