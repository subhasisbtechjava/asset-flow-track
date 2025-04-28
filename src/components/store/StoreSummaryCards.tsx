
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StoreSummaryCardsProps {
  totalAssets: number;
  assetsInProgress: number;
  assetsCompleted: number;
}

export const StoreSummaryCards = ({ 
  totalAssets, 
  assetsInProgress, 
  assetsCompleted 
}: StoreSummaryCardsProps) => {
  return (
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
  );
};
