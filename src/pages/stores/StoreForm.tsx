import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Store } from "@/types";
import { storeAPI } from "@/api/storeAPI";
import { generateId } from "@/data/mockData";

const storeFormSchema = z.object({
  name: z.string().min(2, {
    message: "Store name must be at least 2 characters.",
  }),
  code: z.string().min(3, {
    message: "Store code must be at least 3 characters.",
  }),
  brand: z.string().min(2, {
    message: "Brand name must be at least 2 characters.",
  }),
  city: z.string().min(2, {
    message: "City name must be at least 2 characters.",
  }),
  status: z.string().optional(),
  grnCompletionPercentage: z.number().optional(),
  financeBookingPercentage: z.number().optional(),
});

type StoreFormValues = z.infer<typeof storeFormSchema>;

const StoreForm = () => {
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [store, setStore] = useState<Store>({
    id: "",
    name: "",
    code: "",
    brand: "",
    city: "",
    status: "in_progress",
    grnCompletionPercentage: 0,
    financeBookingPercentage: 0,
    erp_progress: 0,
    grn_progress: 0,
  });

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: "",
      code: "",
      brand: "",
      city: "",
      status: "in_progress",
      grnCompletionPercentage: 0,
      financeBookingPercentage: 0,
    },
  });

  useEffect(() => {
    if (id) {
      setIsUpdate(true);
      fetchStoreData(id);
    }
  }, [id]);

  const fetchStoreData = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await storeAPI.getStoreById(id);
      setStore(response);
      form.setValue("name", response.name);
      form.setValue("code", response.code);
      form.setValue("brand", response.brand);
      form.setValue("city", response.city);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch store data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  async function onSubmit(data: StoreFormValues) {
    setIsLoading(true);
    try {
      const storeData: Store = {
        id: id || generateId(),
        name: data.name,
        code: data.code,
        brand: data.brand,
        city: data.city,
        status: data.status || "in_progress",
        grnCompletionPercentage: data.grnCompletionPercentage || 0,
        financeBookingPercentage: data.financeBookingPercentage || 0,
        erp_progress: 0,
        grn_progress: 0,
      };

      if (isUpdate) {
        await storeAPI.updateStore(id, storeData);
        toast({
          title: "Success",
          description: "Store updated successfully.",
        });
      } else {
        const newStore = await storeAPI.createStore(storeData);
        toast({
          title: "Success",
          description: "Store created successfully.",
        });
        setStore(newStore);
      }

      navigate("/stores", {
        state: {
          id: store.id,
          name: store.name,
          code: store.code,
          brand: store.brand,
          city: store.city,
          status: store.status || 'in_progress', // Adding missing property
          grn_progress: store.grn_progress || 0, // Adding missing property
          erp_progress: store.erp_progress || 0, // Adding missing property
          grnCompletionPercentage: store.grnCompletionPercentage,
          financeBookingPercentage: store.financeBookingPercentage,
        },
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save store. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              to="/stores"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 inline mr-1" />
              Back to Stores
            </Link>
          </div>
          <h1 className="text-3xl font-bold">
            {isUpdate ? "Edit Store" : "New Store"}
          </h1>
          <p className="text-muted-foreground">
            {isUpdate
              ? "Update store details."
              : "Create a new store to track."}
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{isUpdate ? "Edit Store" : "Create Store"}</CardTitle>
            <CardDescription>
              {isUpdate
                ? "Modify store details and save changes."
                : "Enter the store information to create a new store."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Store Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <div className="flex justify-end">
                  <Button disabled={isLoading} type="submit">
                    {isLoading ? "Saving..." : "Save Store"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StoreForm;
