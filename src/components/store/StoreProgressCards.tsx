
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBadge } from "@/components/ui/progress-badge";

interface StoreProgressCardsProps {
  grnCompletionPercentage: number;
  financeBookingPercentage: number;
}

export const StoreProgressCards = ({
  grnCompletionPercentage,
  financeBookingPercentage,
}: StoreProgressCardsProps) => {
  return (
    <Card className="border-2 border-muted overflow-hidden card-hover">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent1 to-accent2"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Purchase Status</CardTitle>
        <CardDescription className="text-muted-foreground">
          Track the progress of your store setup
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-sm font-medium">GRN Completion</div>
            <ProgressBadge percentage={grnCompletionPercentage} size="lg" />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Finance Booking</div>
            <ProgressBadge percentage={financeBookingPercentage} size="lg" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
