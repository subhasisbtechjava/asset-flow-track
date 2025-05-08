

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";


const PoListTable = () => {
  return (
    <div style={{ height: "300px" ,overflow:"scroll" }}>
      
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SL No</TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Attachment</TableHead>
                    <TableHead>Download</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody >
            
                  {Array.from({ length: 25 }).map((_, index) => (
                    <TableRow>
                      <TableCell>{index+1}</TableCell>
                      <TableCell>hh</TableCell>
                      <TableCell>1005</TableCell>
                      <TableCell>Attachmrnt</TableCell>
                      <TableCell align="center" ><Download className="h-3 w-3" /></TableCell>
                    </TableRow>
                  ))}
            
                </TableBody>
              </Table>
            </div>
  )
}

export default PoListTable