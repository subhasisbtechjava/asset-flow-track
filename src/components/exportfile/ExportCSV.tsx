import React from 'react';
import { Plus, Search, FileEdit, Trash2,Download,Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const ExportCSV = ({ data, fileName }) => {
  const downloadCSV = () => {
    // Convert the data array into a CSV string
    const csvString = [
      ["code", "name","category","unit_of_measurement","price_per_unit","gst_rate","hsn_code"], // Specify your headers here
      ...data.map(item => [item.code, item.name, item.category,item.unit_of_measurement,item.price_per_unit,item.gst_rate,item.hsn_code]) // Map your data fields accordingly
    ]
    .map(row => row.join(","))
    .join("\n");

    // Create a Blob from the CSV string
    const blob = new Blob([csvString], { type: 'text/csv' });

    // Generate a download link and initiate the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'download.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

//   return <button onClick={downloadCSV}>Export CSV</button>;
  return <Button variant="outline" onClick={downloadCSV}>
      <Download className="mr-2 h-4 w-4" />
      Export
    </Button>;
};

export default ExportCSV;