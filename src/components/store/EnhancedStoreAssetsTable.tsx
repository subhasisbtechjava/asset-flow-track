
import React, { useState } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StoreAsset } from "@/types";
import AssetTableRowEnhanced from "./AssetTableRowEnhanced";

interface EnhancedStoreAssetsTableProps {
  storeId: string;
  storeAssets: StoreAsset[];
  isLoading: boolean;
  onToggleStatus: (assetId: string, updateParam: string, body: any) => void;
  onRefresh: () => void;
}

const EnhancedStoreAssetsTable: React.FC<EnhancedStoreAssetsTableProps> = ({
  storeId,
  storeAssets,
  isLoading,
  onToggleStatus,
  onRefresh,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>PO</TableHead>
            <TableHead>Invoice</TableHead>
            <TableHead>GRN</TableHead>
            <TableHead>Tagging</TableHead>
            <TableHead>Project Head</TableHead>
            <TableHead>Audit</TableHead>
            <TableHead>Finance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {storeAssets.length === 0 ? (
            <TableRow>
              <td colSpan={9} className="h-24 text-center">
                No assets assigned to this store.
              </td>
            </TableRow>
          ) : (
            storeAssets.map((asset) => (
              <AssetTableRowEnhanced
                key={asset.id}
                storeId={storeId}
                storeAsset={asset}
                isLoading={isLoading}
                onToggleStatus={onToggleStatus}
                onRefresh={onRefresh}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EnhancedStoreAssetsTable;
