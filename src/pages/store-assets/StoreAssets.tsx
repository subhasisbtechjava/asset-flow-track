
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StatusBadge } from "@/components/ui/status-badge";
import { toast } from "@/components/ui/use-toast";

import { 
  getStoreById, 
  getAssetById, 
  mockAssets,
  getStoreAssetsByStoreId,
  generateId
} from "@/data/mockData";
import { ArrowLeft, Check, ChevronRight, File, Upload } from "lucide-react";

const assetAssignmentSchema = z.object({
  assetId: z.string({
    required_error: "Please select an asset",
  }),
  quantity: z.coerce.number()
    .min(1, { message: "Quantity must be at least 1" })
    .refine((val) => !isNaN(val), {
      message: "Quantity must be a valid number",
    }),
});

type AssetAssignmentValues = z.infer<typeof assetAssignmentSchema>;

const workflowStepSchema = z.object({
  poNumber: z.string().optional(),
  poAttachment: z.any().optional(),
  invoiceNumber: z.string().optional(),
  invoiceAttachment: z.any().optional(),
  grnNumber: z.string().optional(),
  isGrnDone: z.boolean().optional(),
  isTaggingDone: z.boolean().optional(),
  isProjectHeadApproved: z.boolean().optional().nullable(),
  isAuditDone: z.boolean().optional(),
  isFinanceBooked: z.boolean().optional(),
});

type WorkflowStepValues = z.infer<typeof workflowStepSchema>;

const StoreAssets = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [isUpdatingWorkflow, setIsUpdatingWorkflow] = useState(false);
  
  // Fetch store details
  const store = id ? getStoreById(id) : null;
  
  // Fetch store assets
  const storeAssets = id ? getStoreAssetsByStoreId(id) : [];
  
  // Get assigned asset IDs to filter out from dropdown
  const assignedAssetIds = new Set(storeAssets.map(sa => sa.assetId));
  
  // Available assets (not yet assigned to this store)
  const availableAssets = mockAssets.filter(asset => 
    !assignedAssetIds.has(asset.id)
  );

  const assetAssignmentForm = useForm<AssetAssignmentValues>({
    resolver: zodResolver(assetAssignmentSchema),
    defaultValues: {
      assetId: "",
      quantity: 1,
    },
  });

  const workflowStepForm = useForm<WorkflowStepValues>({
    resolver: zodResolver(workflowStepSchema),
    defaultValues: {
      poNumber: "",
      invoiceNumber: "",
      grnNumber: "",
      isGrnDone: false,
      isTaggingDone: false,
      isProjectHeadApproved: null,
      isAuditDone: false,
      isFinanceBooked: false,
    },
  });

  if (!store) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Store Not Found</CardTitle>
            <CardDescription className="text-center">
              The store you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link to="/stores">Back to Stores</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const onAssignAsset = (values: AssetAssignmentValues) => {
    setIsAddingAsset(true);
    
    // Mock API call - would be replaced with real data persistence
    setTimeout(() => {
      // Get asset details
      const asset = getAssetById(values.assetId);
      
      console.log("Assigning asset to store:", {
        storeId: id,
        assetId: values.assetId,
        quantity: values.quantity,
        asset
      });
      
      toast({
        title: "Asset assigned",
        description: `${asset?.name} has been assigned to ${store.name}.`,
      });
      
      // Reset form and state
      assetAssignmentForm.reset();
      setIsAddingAsset(false);
      
      // Refresh store assets (in a real app, this would fetch updated data)
      // For now, we'll just fake a refresh by forcing a reload
      window.location.reload();
    }, 1000);
  };

  const onUpdateWorkflow = (values: WorkflowStepValues) => {
    if (!selectedAsset) return;
    
    setIsUpdatingWorkflow(true);
    
    // Mock API call - would be replaced with real data persistence
    setTimeout(() => {
      console.log("Updating asset workflow:", {
        storeAssetId: selectedAsset,
        ...values
      });
      
      const assetName = storeAssets.find(sa => sa.id === selectedAsset)?.asset?.name || "Asset";
      
      toast({
        title: "Workflow updated",
        description: `${assetName} workflow has been updated successfully.`,
      });
      
      setIsUpdatingWorkflow(false);
      setSelectedAsset(null);
      
      // Refresh store assets (in a real app, this would fetch updated data)
      // For now, we'll just fake a refresh by forcing a reload
      window.location.reload();
    }, 1000);
  };

  const handleSelectAssetForWorkflow = (assetId: string) => {
    setSelectedAsset(assetId);
    
    // Find the asset to populate form
    const storeAsset = storeAssets.find(sa => sa.id === assetId);
    
    if (storeAsset) {
      workflowStepForm.reset({
        poNumber: storeAsset.poNumber || "",
        invoiceNumber: storeAsset.invoiceNumber || "",
        grnNumber: storeAsset.grnNumber || "",
        isGrnDone: storeAsset.isGrnDone,
        isTaggingDone: storeAsset.isTaggingDone,
        isProjectHeadApproved: storeAsset.isProjectHeadApproved,
        isAuditDone: storeAsset.isAuditDone,
        isFinanceBooked: storeAsset.isFinanceBooked,
      });
    }
  };

  // Helper function to get asset status
  const getAssetStatus = (storeAsset: any) => {
    if (!storeAsset.poNumber) return 'not-started';
    if (storeAsset.isFinanceBooked) return 'completed';
    if (storeAsset.isProjectHeadApproved) return 'approved';
    if (storeAsset.poNumber) return 'in-progress';
    return 'pending';
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link to={`/stores/${store.id}`} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 inline mr-1" />
            Back to Store
          </Link>
        </div>
        <h1 className="text-3xl font-bold">Store Assets</h1>
        <div className="flex items-center gap-2 mt-1">
          <Link to="/stores" className="text-muted-foreground hover:text-foreground">
            Stores
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link to={`/stores/${store.id}`} className="text-muted-foreground hover:text-foreground">
            {store.name}
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span>Assets</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Assign Asset</CardTitle>
              <CardDescription>
                Add new assets to this store
              </CardDescription>
            </CardHeader>
            <Form {...assetAssignmentForm}>
              <form onSubmit={assetAssignmentForm.handleSubmit(onAssignAsset)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={assetAssignmentForm.control}
                    name="assetId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asset</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an asset" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableAssets.length > 0 ? (
                              availableAssets.map((asset) => (
                                <SelectItem key={asset.id} value={asset.id}>
                                  {asset.name} ({asset.code})
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>
                                All assets already assigned
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={assetAssignmentForm.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    disabled={isAddingAsset || availableAssets.length === 0}
                    className="w-full"
                  >
                    {isAddingAsset ? "Assigning..." : "Assign Asset"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Assets</CardTitle>
              <CardDescription>
                {storeAssets.length} assets assigned to this store
              </CardDescription>
            </CardHeader>
            <CardContent>
              {storeAssets.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {storeAssets.map((storeAsset) => (
                      <TableRow key={storeAsset.id}>
                        <TableCell>
                          <div className="font-medium">
                            {storeAsset.asset?.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {storeAsset.asset?.code}
                          </div>
                        </TableCell>
                        <TableCell>
                          {storeAsset.quantity} {storeAsset.asset?.unitOfMeasurement}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={getAssetStatus(storeAsset)} />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSelectAssetForWorkflow(storeAsset.id)}
                          >
                            Update Status
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No assets assigned to this store yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedAsset && (
        <Card>
          <CardHeader>
            <CardTitle>Update Asset Workflow</CardTitle>
            <CardDescription>
              Track the purchase workflow for this asset
            </CardDescription>
          </CardHeader>
          <Form {...workflowStepForm}>
            <form onSubmit={workflowStepForm.handleSubmit(onUpdateWorkflow)}>
              <CardContent className="space-y-6">
                <Accordion type="single" collapsible defaultValue="po" className="w-full">
                  <AccordionItem value="po">
                    <AccordionTrigger>PO Generation</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <FormField
                        control={workflowStepForm.control}
                        name="poNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PO Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. PO-2023-001" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormItem>
                        <FormLabel>PO Attachment</FormLabel>
                        <div className="flex items-center gap-4">
                          <Button type="button" variant="outline" className="w-full">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload PDF/JPG
                          </Button>
                        </div>
                        <FormDescription>
                          Max file size: 5MB. Only PDF or JPG formats allowed.
                        </FormDescription>
                      </FormItem>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="invoice">
                    <AccordionTrigger>Invoice Generation</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <FormField
                        control={workflowStepForm.control}
                        name="invoiceNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Invoice Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. INV-2023-001" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormItem>
                        <FormLabel>Invoice Attachment</FormLabel>
                        <div className="flex items-center gap-4">
                          <Button type="button" variant="outline" className="w-full">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload PDF/JPG
                          </Button>
                        </div>
                        <FormDescription>
                          Max file size: 5MB. Only PDF or JPG formats allowed.
                        </FormDescription>
                      </FormItem>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="grn">
                    <AccordionTrigger>GRN Generation</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <FormField
                        control={workflowStepForm.control}
                        name="grnNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GRN Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. GRN-2023-001" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={workflowStepForm.control}
                        name="isGrnDone"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Mark GRN as Done
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="tagging">
                    <AccordionTrigger>Tagging</AccordionTrigger>
                    <AccordionContent>
                      <FormField
                        control={workflowStepForm.control}
                        name="isTaggingDone"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Mark Tagging as Done
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="approval">
                    <AccordionTrigger>Project Head Approval</AccordionTrigger>
                    <AccordionContent>
                      <FormField
                        control={workflowStepForm.control}
                        name="isProjectHeadApproved"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    id="approved"
                                    checked={field.value === true}
                                    onChange={() => field.onChange(true)}
                                    className="h-4 w-4 border border-input"
                                  />
                                  <label
                                    htmlFor="approved"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    Approved
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    id="not-approved"
                                    checked={field.value === false}
                                    onChange={() => field.onChange(false)}
                                    className="h-4 w-4 border border-input"
                                  />
                                  <label
                                    htmlFor="not-approved"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    Not Approved
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    id="pending"
                                    checked={field.value === null}
                                    onChange={() => field.onChange(null)}
                                    className="h-4 w-4 border border-input"
                                  />
                                  <label
                                    htmlFor="pending"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    Pending Review
                                  </label>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="audit">
                    <AccordionTrigger>Audit</AccordionTrigger>
                    <AccordionContent>
                      <FormField
                        control={workflowStepForm.control}
                        name="isAuditDone"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Mark Audit as Done
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="finance">
                    <AccordionTrigger>ERP Booking</AccordionTrigger>
                    <AccordionContent>
                      <FormField
                        control={workflowStepForm.control}
                        name="isFinanceBooked"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Mark ERP Booking as Done
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setSelectedAsset(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdatingWorkflow}>
                  {isUpdatingWorkflow ? (
                    "Saving..."
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Update Workflow
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default StoreAssets;
