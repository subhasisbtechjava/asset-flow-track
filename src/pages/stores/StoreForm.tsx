
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { storeAPI } from '../../api/storeAPI';  // ADDED ON 30-04-2025//////
import { Store} from '@/types';

import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoreById, generateId, mockStores } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";

const storeFormSchema = z.object({
  name: z.string().min(1, { message: "Store name is required" }),
  brand: z.string().min(1, { message: "Brand is required" }),
  city: z.string().min(1, { message: "City is required" }),
  code: z.string().min(1, { message: "Store code is required" })
    .regex(/^[A-Za-z0-9-]+$/, { 
      message: "Store code can only contain letters, numbers, and hyphens" 
    }),
});

type StoreFormValues = z.infer<typeof storeFormSchema>;

const StoreForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!id;

  // If editing, find the store data

  //const editStoreDetails = storeAPI.getStoreById(id);  

  const storeData = isEditing ? getStoreById(id) : null;
  //const storeData = isEditing ? editStoreDetails : null;
console.log(storeData);
  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: storeData?.name || "",
      brand: storeData?.brand || "",
      city: storeData?.city || "",
      //code: storeData?.code || `KOL${String(mockStores.length + 1).padStart(3, '0')}`,
      code: storeData?.code || "",
    },
  });
  
  type newStore = Store;

  const onSubmit = async (values: StoreFormValues) => {
    setIsLoading(true);

    // Mock API call - would be replaced with real data persistence
    setTimeout(() => {
      if (isEditing && storeData) {
        // Mock update existing store
        const updateStoreValues= {                   
          name: values.name || '', // Fallback to empty string
          code: values.code || '',
          brand: values.brand || '',
          city: values.city || '',
          grnCompletionPercentage: 0,
          financeBookingPercentage: 0
        };

        const updatedStore = storeAPI.updateStore(id,updateStoreValues);
        console.log("Updating store:", { id, ...values });
        toast({
          title: "Store updated",
          description: `Store has been updated successfully.`,
        });
      } else {
        // Mock creating new store
        const newStore:Store = {
          // id: generateId(),
          // ...values,
          // grnCompletionPercentage: 0, // THIS LINE WILL BE CHNAGED AFTER DISCUSSION
          // financeBookingPercentage: 0, // THIS LINE WILL BE CHNAGED AFTER DISCUSSION


          id: generateId(),
          name: values.name || '', // Fallback to empty string
          code: values.code || '',
          brand: values.brand || '',
          city: values.city || '',
          grnCompletionPercentage: 0,
          financeBookingPercentage: 0
        };

        const newlycreatedStore = storeAPI.createStore(newStore);
      
        console.log("Creating store:", newlycreatedStore);
        toast({
          title: "Store created",
          description: `${values.name} has been created successfully.`,
        });
      }
      
      setIsLoading(false);
      navigate("/stores");
    }, 1000);    
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{isEditing ? "Edit Store" : "Add New Store"}</h1>
        <p className="text-muted-foreground">
          {isEditing ? "Update store information" : "Create a new store location"}
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Store Details" : "Store Details"}</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Store Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input placeholder="Brand" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Code</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="KOL001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/stores")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading 
                  ? (isEditing ? "Updating..." : "Creating...") 
                  : (isEditing ? "Update Store" : "Create Store")
                }
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default StoreForm;
