
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Asset } from "@/types";
import { assetAPI } from "@/api/storeAPI";
import { generateId } from "@/data/mockData";
import LabelMandatorySymbol from "@/components/ui/labeMandatorySymbol";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Asset name must be at least 2 characters.",
  }),
  category: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  code: z.string().min(2, {
    message: "Asset code must be at least 2 characters.",
  }),
  pricePerUnit: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  }, {
    message: "Price per unit must be a valid number greater than 0.",
  }),
  unitOfMeasurement: z.string().min(1, {
    message: "Unit of measurement is required.",
  }),
});

interface FormValues extends z.infer<typeof formSchema> {}

const AssetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isUpdate, setIsUpdate] = useState(false);
  const [asset, setAsset] = useState<Asset>({
    id: "",
    name: "",
    category: "",
    code: "",
    pricePerUnit: 0,
    unitOfMeasurement: "",
    unit_of_measurement: "",
    price_per_unit: 0,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      code: "",
      pricePerUnit: "",
      unitOfMeasurement: "",
    },
  });

  useEffect(() => {
    if (id) {
      setIsUpdate(true);
      fetchAssetData(id);
    }
  }, [id]);

  async function fetchAssetData(id: string) {
    try {
      const res = await assetAPI.getAssetById(id);
      form.reset({
        name: res.name,
        category: res.category,
        code: res.code,
        pricePerUnit: String(res.pricePerUnit),
        unitOfMeasurement: res.unitOfMeasurement,
      });
      
      // Update the asset state with all required properties
      setAsset({
        id: res.id,
        name: res.name,
        category: res.category,
        code: res.code,
        pricePerUnit: res.pricePerUnit,
        price_per_unit: res.pricePerUnit,
        unitOfMeasurement: res.unitOfMeasurement,
        unit_of_measurement: res.unitOfMeasurement,
        // Only include these properties if they exist in the response
        created_at: res.created_at,
        updated_at: res.updated_at,
      });
    } catch (error) {
      console.error("Error fetching asset data:", error);
    }
  }

  async function onFormSubmit(data: FormValues) {
    try {
      const assetData: Asset = {
        id: id || generateId(),
        code: data.code,
        name: data.name,
        category: data.category,
        unitOfMeasurement: data.unitOfMeasurement,
        unit_of_measurement: data.unitOfMeasurement, // Adding this for compatibility
        pricePerUnit: Number(data.pricePerUnit),
        price_per_unit: Number(data.pricePerUnit), // Adding this for compatibility
      };

      if (isUpdate) {
        // For updates, preserve the created_at and updated_at if they exist
        if (asset.created_at) {
          assetData.created_at = asset.created_at;
        }
        assetData.updated_at = new Date().toISOString();
        
        await assetAPI.updateAsset(id, assetData);
        toast({
          title: "Asset updated",
          description: `${assetData.name} has been updated successfully.`,
        });
      } else {
        assetData.created_at = new Date().toISOString();
        assetData.updated_at = new Date().toISOString();
        
        await assetAPI.createAsset(assetData);
        toast({
          title: "Asset created",
          description: `${assetData.name} has been created successfully.`,
        });
      }
      navigate("/assets");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to submit the form.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link to="/assets" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 inline mr-1" />
            Back to Assets
          </Link>
        </div>
        <h1 className="text-3xl font-bold">{isUpdate ? "Edit Asset" : "New Asset"}</h1>
        <p className="text-muted-foreground">
          {isUpdate ? "Update asset details" : "Create a new asset"}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{isUpdate ? "Edit Asset" : "Create New Asset"}</CardTitle>
          <CardDescription>
            {isUpdate ? "Update the asset details" : "Fill in the details below to create a new asset"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Name<LabelMandatorySymbol /></FormLabel>
                    <FormControl>
                      <Input placeholder="Asset Name" {...field} />
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
                    <FormLabel>Category<LabelMandatorySymbol /></FormLabel>
                    <FormControl>
                      <Input placeholder="Category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Code<LabelMandatorySymbol /></FormLabel>
                    <FormControl>
                      <Input placeholder="Asset Code" {...field} />
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
                    <FormLabel>Price Per Unit<LabelMandatorySymbol /></FormLabel>
                    <FormControl>
                      <Input placeholder="Price Per Unit" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unitOfMeasurement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit of Measurement<LabelMandatorySymbol /></FormLabel>
                    <FormControl>
                      <Input placeholder="Unit of Measurement" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                {isUpdate ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Update Asset
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Create Asset
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetForm;
