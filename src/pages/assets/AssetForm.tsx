
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { assetAPI, brandAPI } from "../../api/storeAPI";
import { Asset } from "@/types";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAssetById, generateId } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";
import LabelMandatorySymbol from "@/components/ui/labeMandatorySymbol";
import { MultiSelect } from "@/components/ui/multi-select";


const assetFormSchema = z.object({
  code: z
    .string()
    .min(1, { message: "Asset code is required" })
    .regex(/^[A-Za-z0-9-]+$/, {
      message: "Asset code can only contain letters, numbers, and hyphens",
    }),
  name: z.string().min(1, { message: "Asset name is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  unitOfMeasurement: z.string().min(1, {
    message: "Unit of measurement is required",
  }),
  pricePerUnit: z
    .coerce.number()
    .min(0.01, { message: "Price must be greater than 0" })
    .refine((val) => !isNaN(val), {
      message: "Price must be a valid number",
    }),
  brands: z.array(z.unknown()).min(1, {
    message: "Select at least one brand",
  }),
});

type AssetFormValues = z.infer<typeof assetFormSchema>;

// const brandsList = [
//   { label: "Samsung", value: "samsung",id:1 },
//   { label: "LG", value: "lg",id:2 },
//   { label: "Bosch", value: "bosch",id:3 },
//   { label: "Whirlpool", value: "whirlpool",id:4 },
// ];

const AssetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [assetData, setAssetData] = useState<Asset | null>(null);
  const [brandsList, setBrandList] = useState([]);
  const isEditing = !!id;

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      code: "",
      name: "",
      category: "",
      unitOfMeasurement: "",
      pricePerUnit: 0,
      brands: [],
    },
  });
    const fetchBrand = async()=>{
    const allBrands = await brandAPI  .getStoreBrands();
    setBrandList(allBrands);
  }

  useEffect(() => {
    fetchBrand()
    if (assetData) {
      form.reset({
        code: assetData.code || "",
        name: assetData.name || "",
        category: assetData.category || "",
        unitOfMeasurement: assetData.unitOfMeasurement || "",
        pricePerUnit: assetData.pricePerUnit || 0,
        brands: assetData.brands || [],
      });
    }
  }, [assetData, form]);

  useEffect(() => {
    const fetchAsset = async () => {
      if (isEditing) {
        try {
          const data = await assetAPI.getAssetById(id);
          const edited_data = {
            id: data.id,
            name: data.name,
            category: data.category,
            code: data.code,
            pricePerUnit: data.price_per_unit,
            unitOfMeasurement: data.unit_of_measurement,
            created_at: data.created_at,
            updated_at: data.updated_at,
            brands: data.brands || [], // assuming API sends array
          };
          setAssetData(edited_data);
        } catch (err) {
          console.error("Error fetching asset:", err);
        }
      }
    };
    fetchAsset();
  }, [id]);

  const onSubmit = async (values: AssetFormValues) => {
    setIsLoading(true);

    if (isEditing) {
      const updateStoreValues = {
        name: values.name,
        code: values.code,
        category: values.category,
        price_per_unit: values.pricePerUnit,
        unit_of_measurement: values.unitOfMeasurement,
        brand: values.brands.join(""),
      };

      await assetAPI.updateAsset(id, updateStoreValues);
      toast({
        title: "Asset updated",
        description: `${values.name} has been updated successfully.`,
      });
    } else {
      const newAsset  = {
        id: generateId(),
        code: values.code,
        name: values.name,
        category: values.category,
        unitOfMeasurement: values.unitOfMeasurement,
        pricePerUnit: values.pricePerUnit,
        brand: values.brands.join(""),
      };

      const newlyCreated = await assetAPI.createAsset(newAsset);

      if (newlyCreated.message === "Assets code already exists") {
        toast({
          title: "Assets Error",
          description: newlyCreated.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Asset created",
          description: `${values.name} has been created successfully.`,
        });
      }
    }

    setIsLoading(false);
    navigate("/assets");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit Asset" : "Add New Asset"}
        </h1>
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
                      <h4>Asset Code<LabelMandatorySymbol /></h4>
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
                      <h4>Category<LabelMandatorySymbol /></h4>
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
                    <h4>Asset Name<LabelMandatorySymbol /></h4>
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
                      <h4>Unit of Measurement<LabelMandatorySymbol /></h4>
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
                      <h4>Price per Unit (₹)<LabelMandatorySymbol /></h4>
                      <FormControl>
                        <Input type="number" placeholder="0.00" step="0.01" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="brands"
                render={({ field }) => (
                  <FormItem>
                    <h4>Brands<LabelMandatorySymbol /></h4>
                    <FormControl>
                      <MultiSelect
                        // options={brandsList}
                       options={brandsList.map((b) => ({ label: b.name, value: b.id }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select brands"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => navigate("/assets")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                    ? "Update Asset"
                    : "Create Asset"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AssetForm;
