import { AlertTriangle, Check, FileCheck, Package, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StoreAsset } from "@/types";

interface StoreAssetsTableProps {
  storeId: string;
  storeAssets: StoreAsset[];
  isLoading: boolean;
  onToggleStatus: (assetId: string, field: string) => void;
  onDocumentDialogOpen: (assetId: string, type: 'po' | 'invoice' | 'grn') => void;
  onInputChange: (value: string) => void;
  onSaveDocument: () => void;
}

export const StoreAssetsTable = ({
  storeId,
  storeAssets,
  isLoading,
  onToggleStatus,
  onDocumentDialogOpen,
  onInputChange,
  onSaveDocument,
}: StoreAssetsTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Store Assets</CardTitle>
            <CardDescription>Manage store assets and track purchasing progress</CardDescription>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate(`/assets/new?storeId=${storeId}`)}
          >
            <Package className="mr-2 h-4 w-4" />
            Add Assets
          </Button>
        </div>
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
                {storeAssets.length > 0 ? (
                  storeAssets.map((storeAsset) => (
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
                                  onChange={(e) => onInputChange(e.target.value)}
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
                                <Button onClick={() => onDocumentDialogOpen(storeAsset.id, 'po')}>
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
                                  onChange={(e) => onInputChange(e.target.value)}
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
                                <Button onClick={() => onDocumentDialogOpen(storeAsset.id, 'invoice')}>
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
                                  onChange={(e) => onInputChange(e.target.value)}
                                />
                                <Button onClick={() => onDocumentDialogOpen(storeAsset.id, 'grn')}>
                                  Save
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      
                      {/* Status cells */}
                      <TableCell>
                        <Button
                          size="sm" 
                          variant={storeAsset.isTaggingDone ? "default" : "outline"}
                          className="w-full"
                          onClick={() => onToggleStatus(storeAsset.id, 'isTaggingDone')}
                          disabled={isLoading}
                        >
                          {storeAsset.isTaggingDone ? (
                            <>
                              <Check className="mr-1 h-4 w-4" /> Done
                            </>
                          ) : "Not Done"}
                        </Button>
                      </TableCell>
                      
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
                          onClick={() => onToggleStatus(storeAsset.id, 'isProjectHeadApproved')}
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
                      
                      <TableCell>
                        <Button
                          size="sm" 
                          variant={storeAsset.isAuditDone ? "default" : "outline"}
                          className="w-full"
                          onClick={() => onToggleStatus(storeAsset.id, 'isAuditDone')}
                          disabled={isLoading}
                        >
                          {storeAsset.isAuditDone ? (
                            <>
                              <Check className="mr-1 h-4 w-4" /> Done
                            </>
                          ) : "Not Done"}
                        </Button>
                      </TableCell>
                      
                      <TableCell>
                        <Button
                          size="sm" 
                          variant={storeAsset.isFinanceBooked ? "default" : "outline"}
                          className="w-full"
                          onClick={() => onToggleStatus(storeAsset.id, 'isFinanceBooked')}
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
                          onClick={() => navigate(`/stores/${storeId}/assets`)}
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
      <CardFooter>
        <Button 
          variant="outline" 
          onClick={() => navigate(`/assets?storeId=${storeId}`)}
        >
          <Package className="mr-2 h-4 w-4" />
          Manage Assets
        </Button>
      </CardFooter>
    </Card>
  );
};
