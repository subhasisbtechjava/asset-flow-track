
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Package, 
  FileEdit, 
  Trash2, 
  ChevronRight,
  AlertTriangle,
  Upload,
  Check,
  X,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBadge } from "@/components/ui/progress-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { getStoreById, getStoreAssetsByStoreId } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";

const StoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [storeAssetsList, setStoreAssetsList] = useState(() => 
    id ? getStoreAssetsByStoreId(id) : []
  );
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [documentType, setDocumentType] = useState<'po' | 'invoice' | 'grn' | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch store details
  const store = id ? getStoreById(id) : null;
  
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

  // Handle delete store
  const handleDeleteStore = () => {
    setIsDeleting(true);
    
    // Mock API call - would be replaced with real data deletion
    setTimeout(() => {
      console.log("Deleting store:", id);
      setIsDeleting(false);
      
      toast({
        title: "Store deleted",
        description: `${store.name} has been deleted successfully.`,
      });
      
      navigate("/stores");
    }, 1000);
  };

  // Calculate some summary statistics
  const totalAssets = storeAssetsList.length;
  const assetsInProgress = storeAssetsList.filter(
    sa => sa.poNumber && (!sa.isGrnDone || !sa.isFinanceBooked)
  ).length;
  const assetsCompleted = storeAssetsList.filter(
    sa => sa.isGrnDone && sa.isFinanceBooked
  ).length;

  // Open document dialog
  const openDocumentDialog = (assetId: string, type: 'po' | 'invoice' | 'grn') => {
    setSelectedAsset(assetId);
    setDocumentType(type);
    
    // Pre-fill with existing value
    const asset = storeAssetsList.find(a => a.id === assetId);
    if (asset) {
      if (type === 'po') setInputValue(asset.poNumber || '');
      if (type === 'invoice') setInputValue(asset.invoiceNumber || '');
      if (type === 'grn') setInputValue(asset.grnNumber || '');
    }
  };

  // Close document dialog
  const closeDocumentDialog = () => {
    setSelectedAsset(null);
    setDocumentType(null);
    setInputValue('');
  };

  // Save document number
  const saveDocumentNumber = () => {
    if (!selectedAsset || !documentType || !inputValue) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setStoreAssetsList(prev => 
        prev.map(asset => {
          if (asset.id === selectedAsset) {
            const updatedAsset = { ...asset };
            
            if (documentType === 'po') {
              updatedAsset.poNumber = inputValue;
            } else if (documentType === 'invoice') {
              updatedAsset.invoiceNumber = inputValue;
            } else if (documentType === 'grn') {
              updatedAsset.grnNumber = inputValue;
            }
            
            return updatedAsset;
          }
          return asset;
        })
      );
      
      toast({
        title: "Update successful",
        description: `${documentType.toUpperCase()} number updated successfully.`,
      });
      
      setIsLoading(false);
      closeDocumentDialog();
    }, 800);
  };

  // Toggle status
  const toggleStatus = (assetId: string, field: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setStoreAssetsList(prev => 
        prev.map(asset => {
          if (asset.id === assetId) {
            const updatedAsset = { ...asset };
            
            if (field === 'isGrnDone') {
              updatedAsset.isGrnDone = !asset.isGrnDone;
            } else if (field === 'isTaggingDone') {
              updatedAsset.isTaggingDone = !asset.isTaggingDone;
            } else if (field === 'isProjectHeadApproved') {
              // For approval, convert null to true and toggle between true/false
              if (asset.isProjectHeadApproved === null) {
                updatedAsset.isProjectHeadApproved = true;
              } else {
                updatedAsset.isProjectHeadApproved = !asset.isProjectHeadApproved;
              }
            } else if (field === 'isAuditDone') {
              updatedAsset.isAuditDone = !asset.isAuditDone;
            } else if (field === 'isFinanceBooked') {
              updatedAsset.isFinanceBooked = !asset.isFinanceBooked;
            }
            
            return updatedAsset;
          }
          return asset;
        })
      );
      
      toast({
        title: "Status updated",
        description: `Asset status has been updated successfully.`,
      });
      
      setIsLoading(false);
    }, 500);
  };

  // Status display components
  const StatusDisplay = ({ isDone }: { isDone: boolean | null }) => {
    if (isDone === null) return <Badge variant="outline">Pending</Badge>;
    return isDone ? 
      <Badge className="bg-green-500 hover:bg-green-600">Done</Badge> : 
      <Badge variant="destructive">Not Done</Badge>;
  };
  
  const ApprovalDisplay = ({ isApproved }: { isApproved: boolean | null }) => {
    if (isApproved === null) return <Badge variant="outline">Pending</Badge>;
    return isApproved ? 
      <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge> : 
      <Badge variant="destructive">Not Approved</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/stores" className="text-muted-foreground hover:text-foreground">
              Stores
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span>{store.name}</span>
          </div>
          <h1 className="text-3xl font-bold mt-1">{store.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge>{store.brand}</Badge>
            <Badge variant="outline">{store.code}</Badge>
            <span className="text-sm text-muted-foreground">{store.city}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/stores/edit/${store.id}`}>
              <FileEdit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  store and all of its associated assets and purchase records.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteStore}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{assetsInProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{assetsCompleted}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Status</CardTitle>
          <CardDescription>
            Track the progress of your store setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">GRN Completion</div>
              <ProgressBadge percentage={store.grnCompletionPercentage} />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Finance Booking</div>
              <ProgressBadge percentage={store.financeBookingPercentage} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Store Assets</CardTitle>
          <CardDescription>
            Manage store assets and track purchasing progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead className="w-[100px]">Quantity</TableHead>
                    <TableHead className="w-[120px]">PO</TableHead>
                    <TableHead className="w-[120px]">Invoice</TableHead>
                    <TableHead className="w-[120px]">GRN</TableHead>
                    <TableHead className="w-[100px]">Tagging</TableHead>
                    <TableHead className="w-[100px]">Approval</TableHead>
                    <TableHead className="w-[100px]">Audit</TableHead>
                    <TableHead className="w-[100px]">Booking</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {storeAssetsList.length > 0 ? (
                    storeAssetsList.map((storeAsset) => (
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
                        
                        {/* PO Number */}
                        <TableCell>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button 
                                variant={storeAsset.poNumber ? "secondary" : "outline"} 
                                size="sm" 
                                className="w-full"
                              >
                                {storeAsset.poNumber || "Not Done"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="grid gap-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium leading-none">PO Number</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Enter the purchase order number for {storeAsset.asset?.name}
                                  </p>
                                </div>
                                <div className="grid gap-2">
                                  <Input 
                                    placeholder="Enter PO number"
                                    defaultValue={storeAsset.poNumber || ""}
                                    onChange={(e) => setInputValue(e.target.value)}
                                  />
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="w-full"
                                      onClick={() => {
                                        toast({
                                          title: "Upload feature",
                                          description: "File upload will be implemented soon"
                                        });
                                      }}
                                    >
                                      <Upload className="mr-2 h-4 w-4" /> 
                                      Upload File
                                    </Button>
                                  </div>
                                  <Button 
                                    onClick={() => {
                                      if (inputValue) {
                                        openDocumentDialog(storeAsset.id, 'po');
                                        saveDocumentNumber();
                                      } else {
                                        toast({
                                          title: "Error",
                                          description: "Please enter a PO number",
                                          variant: "destructive"
                                        });
                                      }
                                    }}
                                  >
                                    Save
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                        
                        {/* Invoice Number */}
                        <TableCell>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button 
                                variant={storeAsset.invoiceNumber ? "secondary" : "outline"} 
                                size="sm" 
                                className="w-full"
                              >
                                {storeAsset.invoiceNumber || "Not Done"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="grid gap-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium leading-none">Invoice Number</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Enter the invoice number for {storeAsset.asset?.name}
                                  </p>
                                </div>
                                <div className="grid gap-2">
                                  <Input 
                                    placeholder="Enter invoice number"
                                    defaultValue={storeAsset.invoiceNumber || ""}
                                    onChange={(e) => setInputValue(e.target.value)}
                                  />
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="w-full"
                                      onClick={() => {
                                        toast({
                                          title: "Upload feature",
                                          description: "File upload will be implemented soon"
                                        });
                                      }}
                                    >
                                      <Upload className="mr-2 h-4 w-4" /> 
                                      Upload File
                                    </Button>
                                  </div>
                                  <Button 
                                    onClick={() => {
                                      if (inputValue) {
                                        openDocumentDialog(storeAsset.id, 'invoice');
                                        saveDocumentNumber();
                                      } else {
                                        toast({
                                          title: "Error",
                                          description: "Please enter an invoice number",
                                          variant: "destructive"
                                        });
                                      }
                                    }}
                                  >
                                    Save
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                        
                        {/* GRN Number */}
                        <TableCell>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button 
                                variant={storeAsset.grnNumber ? "secondary" : "outline"} 
                                size="sm" 
                                className="w-full"
                              >
                                {storeAsset.grnNumber || "Not Done"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="grid gap-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium leading-none">GRN Number</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Enter the GRN number for {storeAsset.asset?.name}
                                  </p>
                                </div>
                                <div className="grid gap-2">
                                  <Input 
                                    placeholder="Enter GRN number"
                                    defaultValue={storeAsset.grnNumber || ""}
                                    onChange={(e) => setInputValue(e.target.value)}
                                  />
                                  <Button 
                                    onClick={() => {
                                      if (inputValue) {
                                        openDocumentDialog(storeAsset.id, 'grn');
                                        saveDocumentNumber();
                                      } else {
                                        toast({
                                          title: "Error",
                                          description: "Please enter a GRN number",
                                          variant: "destructive"
                                        });
                                      }
                                    }}
                                  >
                                    Save
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                        
                        {/* Tagging Status */}
                        <TableCell>
                          <Button
                            size="sm" 
                            variant={storeAsset.isTaggingDone ? "default" : "outline"}
                            className="w-full"
                            onClick={() => toggleStatus(storeAsset.id, 'isTaggingDone')}
                            disabled={isLoading}
                          >
                            {storeAsset.isTaggingDone ? (
                              <>
                                <Check className="mr-1 h-4 w-4" /> Done
                              </>
                            ) : "Not Done"}
                          </Button>
                        </TableCell>
                        
                        {/* Approval Status */}
                        <TableCell>
                          <Button
                            size="sm" 
                            variant={
                              storeAsset.isProjectHeadApproved === null
                                ? "outline"
                                : storeAsset.isProjectHeadApproved
                                  ? "default"
                                  : "destructive"
                            }
                            className="w-full"
                            onClick={() => toggleStatus(storeAsset.id, 'isProjectHeadApproved')}
                            disabled={isLoading}
                          >
                            {storeAsset.isProjectHeadApproved === null ? (
                              "Pending"
                            ) : storeAsset.isProjectHeadApproved ? (
                              <>
                                <Check className="mr-1 h-4 w-4" /> Approved
                              </>
                            ) : (
                              <>
                                <X className="mr-1 h-4 w-4" /> Not Approved
                              </>
                            )}
                          </Button>
                        </TableCell>
                        
                        {/* Audit Status */}
                        <TableCell>
                          <Button
                            size="sm" 
                            variant={storeAsset.isAuditDone ? "default" : "outline"}
                            className="w-full"
                            onClick={() => toggleStatus(storeAsset.id, 'isAuditDone')}
                            disabled={isLoading}
                          >
                            {storeAsset.isAuditDone ? (
                              <>
                                <Check className="mr-1 h-4 w-4" /> Done
                              </>
                            ) : "Not Done"}
                          </Button>
                        </TableCell>
                        
                        {/* Finance Booking Status */}
                        <TableCell>
                          <Button
                            size="sm" 
                            variant={storeAsset.isFinanceBooked ? "default" : "outline"}
                            className="w-full"
                            onClick={() => toggleStatus(storeAsset.id, 'isFinanceBooked')}
                            disabled={isLoading}
                          >
                            {storeAsset.isFinanceBooked ? (
                              <>
                                <Check className="mr-1 h-4 w-4" /> Done
                              </>
                            ) : "Not Done"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <AlertTriangle className="h-8 w-8 mb-2" />
                          <p>No assets found for this store</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-4"
                            onClick={() => navigate(`/stores/${store.id}/assets`)}
                          >
                            <Package className="mr-2 h-4 w-4" />
                            Add Assets
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/stores/${store.id}/assets`)}
          >
            <Package className="mr-2 h-4 w-4" />
            Manage Assets
          </Button>
          <Button
            onClick={() => {
              toast({
                title: "Changes saved",
                description: "All updates have been saved successfully"
              });
            }}
          >
            <FileCheck className="mr-2 h-4 w-4" />
            Save All Changes
          </Button>
        </CardFooter>
      </Card>

      {/* Document Entry Dialog */}
      <Dialog open={!!selectedAsset && !!documentType} onOpenChange={() => selectedAsset && closeDocumentDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {documentType === 'po' && 'Enter PO Number'}
              {documentType === 'invoice' && 'Enter Invoice Number'}
              {documentType === 'grn' && 'Enter GRN Number'}
            </DialogTitle>
            <DialogDescription>
              {documentType === 'po' && 'Enter the purchase order number for this asset'}
              {documentType === 'invoice' && 'Enter the invoice number for this asset'}
              {documentType === 'grn' && 'Enter the goods receipt note number for this asset'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                placeholder={
                  documentType === 'po'
                    ? 'e.g. PO-2023-001'
                    : documentType === 'invoice'
                    ? 'e.g. INV-2023-001'
                    : 'e.g. GRN-2023-001'
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            {(documentType === 'po' || documentType === 'invoice') && (
              <div>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Upload feature",
                      description: "File upload will be implemented soon"
                    });
                  }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File (PDF/JPG)
                </Button>
                <div className="text-xs text-muted-foreground mt-2">
                  Max file size: 5MB. Only PDF or JPG formats allowed.
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={closeDocumentDialog}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={saveDocumentNumber}
              disabled={!inputValue || isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoreDetail;
