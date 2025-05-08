

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const GrnListTable = () => {
  return (
    <div style={{ height: "300px" ,overflow:"scroll" }}>
      
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SL No</TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>GRN Number</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody >
            
                  {Array.from({ length: 25 }).map((_, index) => (
                    <TableRow>
                      <TableCell>{index+1}</TableCell>
                      <TableCell>hh</TableCell>
                      <TableCell>1005</TableCell>
                    </TableRow>
                  ))}
            
                </TableBody>
              </Table>
            </div>
  )
}

export default GrnListTable