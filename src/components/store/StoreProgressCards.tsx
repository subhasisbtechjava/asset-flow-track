
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
            <ProgressBadge percentage={grnCompletionPercentage} />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Finance Booking</div>
            <ProgressBadge percentage={financeBookingPercentage} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
