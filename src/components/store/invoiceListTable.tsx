

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { getFileNameFromUrl } from "@/utility/get_file_type";

interface AssetTableRow {
  invoiceDetails: [];

}
const InvoiceListTable = ({ invoiceDetails }:AssetTableRow) => {


  // const handleDownload = (fileUrl: string, fileName: string) => {
  //   const link = document.createElement("a");
  //   link.href = fileUrl;
  //   link.download = fileName; // optional, to set a custom file name
  //   link.target = "_blank"; // optional
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   // window.open(invoice?.invoice_attachment_url)
  // };

  const handleDownload = async (fileUrl: string, ) => {
    try {
      const fileName = getFileNameFromUrl(fileUrl)
      const response = await fetch(fileUrl, {
        method: 'GET',
        // Uncomment and set token if needed
        // headers: {
        //   Authorization: `Bearer YOUR_TOKEN`,
        // },
      });
  
      if (!response.ok) throw new Error("Network response was not ok");
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // force download
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      // Cleanup
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };
  


  return (
    <div style={{ height: "300px", overflow: "scroll", marginTop: "10px" }}>
      {/* fwf{invoiceDetails.length} */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[90px]">SL No</TableHead>
            <TableHead className="min-w-[140px]">Invoice Number</TableHead>
            <TableHead className="min-w-[140px]">Invoice Date</TableHead>
            <TableHead className="min-w-[140px]">Invoice Amount</TableHead>
            <TableHead>Download</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          weweg
     
          {invoiceDetails.map((invoice, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{invoice?.invoice_no}</TableCell>
              <TableCell>{invoice?.invoice_date}</TableCell>
              <TableCell>{invoice?.invoice_amount}</TableCell>
              <TableCell align="start">
              <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6"
        onClick={() =>handleDownload(invoice?.invoice_attachment_url) }
      >
        <Download className="h-3 w-3" />
      </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};


export default InvoiceListTable
