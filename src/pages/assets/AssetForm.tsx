
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { getAssetById, generateId } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";

const assetFormSchema = z.object({
  code: z.string().min(1, { message: "Asset code is required" })
    .regex(/^[A-Za-z0-9-]+$/, { 
      message: "Asset code can only contain letters, numbers, and hyphens" 
    }),
  name: z.string().min(1, { message: "Asset name is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  unitOfMeasurement: z.string().min(1, { message: "Unit of measurement is required" }),
  pricePerUnit: z.coerce.number()
    .min(0.01, { message: "Price must be greater than 0" })
    .refine((val) => !isNaN(val), {
      message: "Price must be a valid number",
    }),
});

type AssetFormValues = z.infer<typeof assetFormSchema>;

const AssetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!id;

  // If editing, find the asset data
  const assetData = isEditing ? getAssetById(id) : null;

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      code: assetData?.code || "",
      name: assetData?.name || "",
      category: assetData?.category || "",
      unitOfMeasurement: assetData?.unitOfMeasurement || "",
      pricePerUnit: assetData?.pricePerUnit || 0,
    },
  });

  const onSubmit = async (values: AssetFormValues) => {
    setIsLoading(true);

    // Mock API call - would be replaced with real data persistence
    setTimeout(() => {
      if (isEditing) {
        // Mock update existing asset
        console.log("Updating asset:", { id, ...values });
        toast({
          title: "Asset updated",
          description: `${values.name} has been updated successfully.`,
        });
      } else {
        // Mock creating new asset
        const newAsset = {
          id: generateId(),
          ...values,
        };
        console.log("Creating asset:", newAsset);
        toast({
          title: "Asset created",
          description: `${values.name} has been created successfully.`,
        });
      }
      
      setIsLoading(false);
      navigate("/assets");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{isEditing ? "Edit Asset" : "Add New Asset"}</h1>
        <p className="text-muted-foreground">
          {isEditing ? "Update asset information" : "Create a new asset for your stores"}
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Asset Details" : "Asset Details"}</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Code</FormLabel>
                      <FormControl>
                        <Input placeholder="EQ-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="Kitchen Equipment" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Commercial Deep Fryer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="unitOfMeasurement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit of Measurement</FormLabel>
                      <FormControl>
                        <Input placeholder="pcs" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pricePerUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Unit ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          step="0.01" 
                          min="0"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/assets")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading 
                  ? (isEditing ? "Updating..." : "Creating...") 
                  : (isEditing ? "Update Asset" : "Create Asset")
                }
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AssetForm;
