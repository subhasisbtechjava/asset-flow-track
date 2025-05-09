
import { useState,useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { brandAPI } from "../../api/storeAPI"; // ADDED ON 30-04-2025//////
import { Brand} from '@/types';

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
import LabelMandatorySymbol from "@/components/ui/labeMandatorySymbol";

const brandFormSchema = z.object({  
  bname: z.string().min(1, { message: "Brand name is required" }), 

   bimage: z.any().refine((fileList) => fileList instanceof FileList && fileList.length > 0, {
  message: "Image is required",
}),

  bstatus: z.string().nullable(),
});
const brandFormEditSchema = z.object({  
  bname: z.string().min(1, { message: "Brand name is required" }), 
  bstatus: z.string().nullable(),
});

type BrandFormValues = z.infer<typeof brandFormSchema>;

const BrandForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [brandData, setBrandData] = useState<Brand | null>(null);
  const isEditing = !!id;
  
 

//  if (isEditing) {

//    form = useForm<BrandFormValues>({
//       resolver: zodResolver(brandFormEditSchema),
//       defaultValues: {      
//         bname: '', 
//         bimage: '', 
//         bstatus: '',
//       },
//     });
//  }else{
//  form = useForm<BrandFormValues>({
//     resolver: zodResolver(brandFormSchema),
//     defaultValues: {      
//       bname: '', 
//       bimage: '', 
//       bstatus: '',
//     },
//   });
//  }


const form = useForm<BrandFormValues>({
  resolver: zodResolver(isEditing ? brandFormEditSchema : brandFormSchema),
  defaultValues: {
    bname: '',
    bimage: '',
    bstatus: '',
  },
});
  


  useEffect(() => {
    if (brandData) {
      form.reset({        
        bname: brandData.bname || "",       
        bimage: brandData.bimage || "",       
        bstatus: brandData.bstatus || "",       
      });
    }
  }, [brandData, form]);

  useEffect(() => {
    const fetchAsset = async () => {
      if (isEditing) {
        try {
          const data = await brandAPI.getBrandById(id);
          // console.log('************');
          // console.log(data);
           const edited_data:Brand = {           
            "bname":data.name,           
            "bstatus":data.brand_status,          
            "bimage":data.image           
          }
          // console.log('++++++++++++++++++');
          // console.log(edited_data);
          setBrandData(edited_data);
        } catch (err) {
          console.error("Error fetching asset:", err);
        }
      }
    };
    fetchAsset();
  }, [id]);  

  //const assetData = isEditing ? getAssetById(id) : null;



  const onSubmit = async (values: BrandFormValues) => {
    setIsLoading(true);
    
    // Mock API call - would be replaced with real data persistence
    
      if (isEditing) {
        
        const updateBrandValues= {                   
                  name: values.bname, // Fallback to empty string
                  attachment: values.bimage,  
                  status:values.bstatus 
                };
        const editformData = new FormData();  
        editformData.append("name", values.bname || '');
        editformData.append("brand_status", values.bstatus ?? '');

        if (values.bimage && values.bimage.length > 0) {
        editformData.append("attachment", values.bimage[0]);
        } 

        const updatedAssets = brandAPI.updateBrand(id,editformData);
        console.log("Updating asset:", { id, ...values });
        toast({
          title: "Brand updated",
          description: `${values.bname} has been updated successfully.`,
        });
        
      } else {
        // Mock creating new asset
      const formData = new FormData(); 
        formData.append("name", values.bname || '');
        formData.append("brand_status", values.bstatus ?? '');

        if (values.bimage && values.bimage.length > 0) {
        formData.append("attachment", values.bimage[0]);
        }

      // for (const [key, value] of formData.entries()) {
      //    console.log('***********************');
      // console.log(key, value);
      // }


        const newlycreatedBrand = brandAPI.createBrand(formData);
        console.log("Creating brand:", newlycreatedBrand);
        toast({
          title: "Brand created",
          description: `${values.bname} has been created successfully.`,
        });
      }
      
      setIsLoading(false);
      navigate("/manage-brands");
   
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{isEditing ? "Edit Brand" : "Add New Brand"}</h1>
        <p className="text-muted-foreground">
          {isEditing ? "Update brand information" : "Create a new brand for your stores"}
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Brand Details" : "Brand Details"}</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bname"
                  render={({ field }) => (
                    <FormItem>
                      <h4>Brand Name<LabelMandatorySymbol/></h4>
                      <FormControl>
                        <Input placeholder="Wow Momo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                control={form.control}
                name="bimage"
                render={({ field }) => (
                <FormItem>
                <h4>Image <LabelMandatorySymbol /></h4>
                <FormControl>
                <Input
                type="file"
                onChange={(e) => field.onChange(e.target.files)}
                />
                </FormControl>
                <FormMessage />
                </FormItem>
                )}
                />
              </div>

                  { isEditing &&(
                          <FormField
              control={form.control}
              name="bstatus"
              render={({ field }) => (
                <FormItem>
                  <h4>Status<LabelMandatorySymbol /></h4>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full border rounded px-3 py-2 text-sm"
                    >
                      <option value="">Select status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            )}

            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/manage-brands")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading 
                  ? (isEditing ? "Updating..." : "Creating...") 
                  : (isEditing ? "Update Asset" : "Create Brand")
                }
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default BrandForm;
