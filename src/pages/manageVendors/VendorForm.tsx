
import { useState,useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { vendorAPI } from "../../api/storeAPI"; // ADDED ON 30-04-2025//////
import { Vendor} from '@/types';

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

const VendorFormSchema = z.object({  
  vname: z.string().min(1, { message: "Vendor name is required" }),   
  vaddress: z.string().nullable(),  
  vphone: z.string().nullable(),  
  vstatus: z.string().nullable()
});
const vendorFormEditSchema = z.object({  
 vname: z.string().min(1, { message: "Vendor name is required" }),  
 vaddress: z.string().nullable(),  
 vphone: z.string().nullable(), 
 vstatus: z.string().nullable(),
});

type VendorFormValues = z.infer<typeof VendorFormSchema>;

const VendorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [vendorData, setVendorData] = useState<Vendor | null>(null);
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


    const form = useForm<VendorFormValues>({
    resolver: zodResolver(isEditing ? vendorFormEditSchema : VendorFormSchema),
    defaultValues: {  
    vname: '',
    vaddress: '',
    vphone: '',
    vstatus: ''
    },
    });
  


  useEffect(() => {
    if (vendorData) {
      form.reset({        
        vname: vendorData.vname || "",       
        vphone: vendorData.vphone || "",       
        vaddress: vendorData.vaddress || "",       
        vstatus: vendorData.vstatus || "",       
      });
    }
  }, [vendorData, form]);

  useEffect(() => {
    const fetchAsset = async () => {
      if (isEditing) {
        try {
          const data = await vendorAPI.getVendorById(id);
          // console.log('************');
          // console.log(data);
           const edited_data:Vendor = {           
            "vname":data.name,           
            "vphone":data.phno,           
            "vaddress":data.address,           
            "vstatus":data.status   
          }
          // console.log('++++++++++++++++++');
          // console.log(edited_data);
          setVendorData(edited_data);
        } catch (err) {
          console.error("Error fetching asset:", err);
        }
      }
    };
    fetchAsset();
  }, [id]);  

  //const assetData = isEditing ? getAssetById(id) : null;



  const onSubmit = async (values: VendorFormValues) => {
    setIsLoading(true);
    
    // Mock API call - would be replaced with real data persistence
    
      if (isEditing) {       
        /*
        const editData = new FormData();  
        editformData.append("name", values.vname || '');
        editformData.append("address", values.vaddress || '');
        editformData.append("phno", values.vphone || '');
        editformData.append("status", values.vstatus ?? '');
        */
       const editData:Vendor = {           
            "name":values.vname,           
            "phno":values.vphone,           
            "address":values.vaddress,           
            "status":values.vstatus   
          }

        const updatedAssets = vendorAPI.updateVendor(id,editData);
        console.log("Updating vendor:", { id, ...values });
        toast({
          title: "Vendor updated",
          description: `${values.vname} has been updated successfully.`,
        });
        
      } else {
        // Mock creating new asset
          /*
          const formData = new FormData();       
          formData.append("name", values.vname || '');
          formData.append("address", values.vaddress || '');
          formData.append("phno", values.vphone || '');
          formData.append("status", values.vstatus ?? '');   
          */  
         const insertdata:Vendor = {           
            "name":values.vname,           
            "phno":values.vphone,           
            "address":values.vaddress,           
            "status":values.vstatus   
          }


        const newlycreatedVendor = vendorAPI.createVendor(insertdata);
        console.log("Creating brand:", newlycreatedVendor);
        toast({
          title: "Vendor created",
          description: `${values.vname} has been created successfully.`,
        });
      }
      
      setIsLoading(false);
      navigate("/manage-vendors");
   
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{isEditing ? "Edit Vendor" : "Add New Vendor"}</h1>
        <p className="text-muted-foreground">
          {isEditing ? "Update vendor information" : "Create a new vendor"}
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Vendor Details" : "Vendor Details"}</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="vname"
                  render={({ field }) => (
                    <FormItem>
                      <h4>Vendor Name<LabelMandatorySymbol/></h4>
                      <FormControl>
                        <Input placeholder="Vendor Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                  <FormField
                  control={form.control}
                  name="vphone"
                  render={({ field }) => (
                    <FormItem>
                      <h4>Phone No.</h4>
                      <FormControl>
                        <Input placeholder="Phone No" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               
              </div>

              <FormField
                  control={form.control}
                  name="vaddress"
                  render={({ field }) => (
                    <FormItem>
                      <h4>Address</h4>
                      <FormControl>
                        <Input placeholder="Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                  { isEditing &&(
                          <FormField
              control={form.control}
              name="vstatus"
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
                  : (isEditing ? "Update Vendor" : "Create Vendor")
                }
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default VendorForm;
