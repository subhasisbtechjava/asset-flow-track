import { useEffect, useState,useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { storeAPI,brandAPI } from "../../api/storeAPI"; // ADDED ON 30-04-2025//////
import { Store } from "@/types";

import {
  Form,
  FormControl,
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getStoreById, generateId, mockStores } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";
import LabelMandatorySymbol from "@/components/ui/labeMandatorySymbol";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const storeFormSchema = z.object({
  name: z.string().min(1, { message: "Store name is required" }),
  brand: z.string().min(1, { message: "Brand is required" }),
  city: z.string().min(1, { message: "City is required" }),
  format: z.string().min(1, { message: "Format is required" }),
  code: z
    .string()
    .min(1, { message: "Store code is required" })
    .regex(/^[A-Za-z0-9-]+$/, {
      message: "Store code can only contain letters, numbers, and hyphens",
    }),
});

type StoreFormValues = z.infer<typeof storeFormSchema>;

const StoreForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [barnddata, setBrandData] = useState([]);
  const isEditing = !!id;
  const [storeData, setStoreData] = useState<Partial<StoreFormValues>>({});

  const [selectedOption, setSelectedOption] = useState('auto');  


  const fetchBrand = async()=>{
    const allBrands = await brandAPI.getStoreBrands();
    setBrandData(allBrands);
  }


 
  const fetchStoreMaster = async()=>{
    const allStoreMasterData = await storeAPI.getStoresMaster();
    setStoreMasterData(allStoreMasterData);
  } 
  const [storeMasterData, setStoreMasterData] = useState([]);
  const [searchTermStoreCode, setSearchTermStoreCode] = useState("");
  const filteredStoreCodes = storeMasterData.filter((allStoreMaster) =>
  allStoreMaster.outletcode.toLowerCase().includes(searchTermStoreCode.toLowerCase())
);

   const [searchTermStoreName, setSearchTermStoreName] = useState("");
  const filteredStoreName = storeMasterData.filter((allStoreMaster) =>
  allStoreMaster.outletname.toLowerCase().includes(searchTermStoreName.toLowerCase())
);



  
const inputRef = useRef(null);
  useEffect(() => {
  if (inputRef.current && inputRef.current != null && inputRef.current != undefined) {
    setTimeout(() => inputRef.current.focus(), 0);
  }
}, [searchTermStoreCode]);



const inputRef2 = useRef(null);
 useEffect(() => {
  if (inputRef2.current) {
    setTimeout(() => inputRef2.current.focus(), 0);
  }
}, [searchTermStoreName]);


  const [autoStoreName, setAutoStoreName] = useState("");
  const [autoStoreBrand, setAutoStoreBrand] = useState("");


  const [cityMasterData, setCityMasterData] = useState([]);
  const [searchTermCity, setSearchTermCity] = useState("");
  const fetchCityMaster = async()=>{
    const allCityMasterData = await storeAPI.getCityMaster();
    setCityMasterData(allCityMasterData);
  }
  const filteredCity = cityMasterData.filter((cmaster) =>
  cmaster.cityname.toLowerCase().includes(searchTermCity.toLowerCase())
);

const inputRef3 = useRef(null);
  useEffect(() => {
  if (inputRef3.current && inputRef3.current != null && inputRef3.current != undefined) {
    setTimeout(() => inputRef3.current.focus(), 0);
  }
}, [searchTermCity]);



  const [formatMasterData, setFormatMasterData] = useState([]);
  const [searchTermFormat, setSearchTermFormat] = useState("");
  const fetchFormatMaster = async()=>{
    const allFormatMasterData = await storeAPI.getFormatMaster();
    //console.log("yyyyyyyyyyyyyyyyyy"+allFormatMasterData);
    setFormatMasterData(allFormatMasterData);
  }

  const  filteredFormat = formatMasterData.filter((fmaster) =>
  fmaster.format_name.toLowerCase().includes(searchTermFormat.toLowerCase())
);



  useEffect(() => {
    fetchBrand();
    fetchStoreMaster();
    fetchCityMaster();
    fetchFormatMaster();
  }, []);

  console.log(barnddata);
  

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: "",
      brand: "",
      city: "",
      code: "",
      format: "",
    },
  });
  
  const { reset } = form;
  
  useEffect(() => {
    if (isEditing) {
      fetchStoreDetails();
    }
  }, []);
  
  async function fetchStoreDetails() {
    const res = await storeAPI.getStoreById(id);  
    setStoreData(res);  
    // Reset form values after fetching
    reset({
      name: res.name ?? "",
      brand: res.brand ?? "",
      city: res.city ?? "",
      code: res.code ?? "",
      format: res.format ?? "",
    });
  }

  const resetQuickAddForm = () => {
    //alert('lkdskd');
  };


  type newStore = Store;

  const onSubmit = async (values: StoreFormValues) => {
    setIsLoading(true);

    // Mock API call - would be replaced with real data persistence
    setTimeout(() => {
      if (isEditing && storeData) {
        // Mock update existing store
        const updateStoreValues = {
          name: values.name || "", // Fallback to empty string
          code: values.code || "",
          brand: values.brand || "",
          city: values.city || "",
          format: values.format || "",
          grnCompletionPercentage: 0,
          financeBookingPercentage: 0,
        };

        const updatedStore = storeAPI.updateStore(id, updateStoreValues);
        console.log("Updating store:", { id, ...values });
        toast({
          title: "Store updated",
          description: `Store has been updated successfully.`,
        });
      } else {
        // Mock creating new store
        const newStore: Store = {
          // id: generateId(),
          // ...values,
          // grnCompletionPercentage: 0, // THIS LINE WILL BE CHNAGED AFTER DISCUSSION
          // financeBookingPercentage: 0, // THIS LINE WILL BE CHNAGED AFTER DISCUSSION

          id: generateId(),
          name: values.name || "", // Fallback to empty string
          code: values.code || "",
          brand: values.brand || "",
          city: values.city || "",
          format: values.format || "",
          grnCompletionPercentage: 0,
          financeBookingPercentage: 0,
        };

        const newlycreatedStore = storeAPI.createStore(newStore);
        console.log(newStore);
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
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit Store" : "Add New Store"}
        </h1>
        <p className="text-muted-foreground">
          {isEditing
            ? "Update store information"
            : "Create a new store location"}
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>
            {isEditing ? "Edit Store Details" : "Store Details"}
          </CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">

              <FormField
  control={form.control}
  name="store_create_type"
  render={({ field }) => (
    <FormItem>
      <FormControl>
        <div className="flex items-center gap-6">
          <h4 className="flex items-center">
            Store Create Type
            <LabelMandatorySymbol />
          </h4>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="auto"                  
                checked={field.value === "auto" || selectedOption == "auto"}
                onChange={() => {
        field.onChange("auto");
        setSelectedOption('auto'); // Only if you really need both
        resetQuickAddForm();
      }}
              disabled={isEditing}
              />
              Auto
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="manual"
                checked={field.value === "manual"}
                  onChange={() => {
        field.onChange("manual");
        setSelectedOption('manual'); // Only if you really need both
        resetQuickAddForm();
      }}
            disabled={isEditing}
              />
              Manual
            </label>
          </div>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

              {/* <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
              <FormItem>
              <h4>
              Store Code
              <LabelMandatorySymbol />
              </h4>
              <FormControl>
              <Input placeholder="KOL001" {...field} />
              </FormControl>
              <FormMessage />
              </FormItem>
              )}
              /> */}


              { selectedOption == "auto" && !isEditing ? (
                <>
     <FormField
  control={form.control}
  name="code"
  render={({ field }) => (
    <FormItem>
      <h4>
        Store Code <LabelMandatorySymbol />
      </h4>
      <Select  onValueChange={(value) => {
          const storeMasterValue = JSON.parse(value);
          setAutoStoreName(storeMasterValue.outletname);
          setAutoStoreBrand(storeMasterValue.brand);
          //console.log("branndsm"+storeMasterValue.brand);
          //field.onChange(value); // Update form control
          form.setValue("code", storeMasterValue.outletcode);
          form.setValue("name", storeMasterValue.outletname);      // For the select field
          form.setValue("brand", storeMasterValue.brand); // For the brand field
          form.setValue("city", storeMasterValue.city); // For the brand field
          form.setValue("format", storeMasterValue.format); // For the brand field

        }}
        value={field.value ? JSON.stringify(filteredStoreCodes.find((c) => c.outletcode === field.value)) : ""}
      >


        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select Store Code" />
          </SelectTrigger>
        </FormControl>

        <SelectContent className="max-h-60 overflow-y-auto p-0">
          {/* Sticky search box */}
          <div className="sticky top-0 bg-white z-10 p-2 border-b">
            <input
              type="text"
              placeholder="Search..."
              value={searchTermStoreCode}
              ref={inputRef}
              onChange={(e) => setSearchTermStoreCode(e.target.value)}
              className="w-full border px-2 py-1 text-sm rounded"
            />
          </div>

          {/* Select options */}
          {filteredStoreCodes.length > 0 ? (
            filteredStoreCodes.map((code, index) => (
              <SelectItem key={index} value={JSON.stringify(code)}>
                {code.outletcode}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-gray-500 text-sm">No results found</div>
          )}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>


              {/* <FormField
                control={form.control}
                name="name"               
                render={ ({ field }) => (
                  <FormItem>
                    <h4>
                      Store Name
                      <LabelMandatorySymbol />
                    </h4>
                    <FormControl>
                      <Input 
          value={field.value}  // Use form value directly
          onChange={field.onChange}  // Let RHF handle changes
          placeholder="Accropolish" 
        />
                       
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}



             <FormField
  control={form.control}
  name="name"
  render={({ field }) => (
    <FormItem>
      <h4>
        Store Name <LabelMandatorySymbol />
      </h4>
      <Select  onValueChange={(value) => {
          const storeMasterValue = JSON.parse(value);
          setAutoStoreName(storeMasterValue.outletname);
          setAutoStoreBrand(storeMasterValue.brand);
          //console.log("branndsm"+storeMasterValue.brand);
          //field.onChange(value); // Update form control
          form.setValue("code", storeMasterValue.outletcode);
          form.setValue("name", storeMasterValue.outletname);      // For the select field
          form.setValue("brand", storeMasterValue.brand); // For the brand field
          form.setValue("city", storeMasterValue.city); // For the brand field
          form.setValue("format", storeMasterValue.format); // For the brand field

        }}
        value={field.value ? JSON.stringify(filteredStoreName.find((s) => s.outletname === field.value)) : ""}
      >


        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select Store Name" />
          </SelectTrigger>
        </FormControl>

        <SelectContent className="max-h-60 overflow-y-auto p-0">
          {/* Sticky search box */}
          <div className="sticky top-0 bg-white z-10 p-2 border-b">
            <input
              type="text"
              placeholder="Search..."
              value={searchTermStoreName}
              ref={inputRef2}
              onChange={(e) => setSearchTermStoreName(e.target.value)}
              className="w-full border px-2 py-1 text-sm rounded"
            />
          </div>

          {/* Select options */}
          {filteredStoreName.length > 0 ? (
            filteredStoreName.map((sname, index) => (
              <SelectItem key={index} value={JSON.stringify(sname)}>
                {sname.outletname}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-gray-500 text-sm">No results found</div>
          )}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>   






              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                { <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <h4>
                        Brand
                        <LabelMandatorySymbol />
                      </h4>
                      <FormControl>
                       <Input 
          value={field.value}  // Use form value directly
          onChange={field.onChange}  // Let RHF handle changes
          placeholder="WoW China" 
        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> }

                {/* <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                <FormItem>
                <h4>Brand<LabelMandatorySymbol /></h4>
                <FormControl>
                <select
                {...field}
                className="w-full border rounded px-3 py-2 text-sm"
                >
                <option value="">Select Brand</option>
                {barnddata.length>0 &&( 
                barnddata.map((barndval, index) => (
                <option value={barndval.id}>{barndval.name}</option>                
                )))}
                </select>
                </FormControl>
                <FormMessage />
                </FormItem>
                )}
                /> */}

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <h4>
                        City
                        <LabelMandatorySymbol />
                      </h4>
                      <FormControl>
                        {/* <Input   placeholder="Kolkata" {...field} /> */}

                         <Input 
          value={field.value}  // Use form value directly
          onChange={field.onChange}  // Let RHF handle changes
          placeholder="Kolkata" 
        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>


                <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <h4>
                      Format
                      <LabelMandatorySymbol />
                    </h4>
                    <FormControl>
                      {/* <Input placeholder="Format" {...field} /> */}
                       <Input 
          value={field.value}  // Use form value directly
          onChange={field.onChange}  // Let RHF handle changes
          placeholder="Format" 
        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> </>):(

                <>
               <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
              <FormItem>
              <h4>
              Store Code
              <LabelMandatorySymbol />
              </h4>
              <FormControl>
              <Input placeholder="KOL001" {...field} />
              </FormControl>
              <FormMessage />
              </FormItem>
              )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <h4>
                      Store Name
                      <LabelMandatorySymbol />
                    </h4>
                    <FormControl>
                      <Input placeholder="Accropolish Store" {...field} />
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
                <h4>Brand<LabelMandatorySymbol /></h4>
                <FormControl>
                <select
                {...field}
                className="w-full border rounded px-3 py-2 text-sm"
                >
                <option value="">Select Brand</option>
                {barnddata.length>0 &&( 
                barnddata.map((barndval, index) => (
                <option value={barndval.id}>{barndval.name}</option>                
                )))}
                </select>
                </FormControl>
                <FormMessage />
                </FormItem>
                )}
                />



                {/* <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <h4>
                        City
                        <LabelMandatorySymbol />
                      </h4>
                      <FormControl>
                        <Input placeholder="Kolkata" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}



                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <h4>
                              City <LabelMandatorySymbol />
                            </h4>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select City" />
                                </SelectTrigger>
                              </FormControl>

                              <SelectContent className="max-h-60 overflow-y-auto p-0">
                                {/* Sticky search box */}
                                <div className="sticky top-0 bg-white z-10 p-2 border-b">
                                  <input
                                    type="text"
                                    placeholder="Search..."                                   
                                    value={searchTermCity}
                                    ref={inputRef3}
                                    onChange={(e) => setSearchTermCity(e.target.value)}
                                    className="w-full border px-2 py-1 text-sm rounded"
                                  />
                                </div>

                                {/* Select options */}
                                {filteredCity.length > 0 ? (
                                  filteredCity.map((city_val, index) => (
                                    <SelectItem key={index} value={city_val.cityname}>
                                      {city_val.cityname}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-2 text-gray-500 text-sm">No results found</div>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
    




                </div>

                {isEditing ? (<FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <h4>
                      Format
                      <LabelMandatorySymbol />
                    </h4>
                    <FormControl>
                      <Input placeholder="Format" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />):     

                  (<FormField
                        control={form.control}
                        name="format"
                        render={({ field }) => (
                          <FormItem>
                            <h4>
                              Format <LabelMandatorySymbol />
                            </h4>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Format" />
                                </SelectTrigger>
                              </FormControl>

                              <SelectContent className="max-h-60 overflow-y-auto p-0">
                                {/* Sticky search box */}
                                <div className="sticky top-0 bg-white z-10 p-2 border-b">
                                  <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTermFormat}
                                    onChange={(e) => setSearchTermFormat(e.target.value)}
                                    className="w-full border px-2 py-1 text-sm rounded"
                                  />
                                </div>

                                {/* Select options */}
                                {filteredFormat.length > 0 ? (
                                  filteredFormat.map((format_val, index) => (
                                    <SelectItem key={index} value={format_val.format_name}>
                                      {format_val.format_name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-2 text-gray-500 text-sm">No results found</div>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />)}              
              
              </>
            
            
            ) }


              
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
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                  ? "Update Store"
                  : "Create Store"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default StoreForm;
