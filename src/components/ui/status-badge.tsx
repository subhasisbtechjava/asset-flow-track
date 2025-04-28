
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'not-started' | 'pending' | 'in-progress' | 'approved' | 'completed';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusClasses = {
    'not-started': 'status-badge-not-started',
    'pending': 'status-badge-pending',
    'in-progress': 'status-badge-in-progress',
    'approved': 'status-badge-approved',
    'completed': 'status-badge-completed',
  };

  const statusLabels = {
    'not-started': 'Not Started',
    'pending': 'Pending',
    'in-progress': 'In Progress',
    'approved': 'Approved',
    'completed': 'Completed',
  };

  return (
    <span className={cn('status-badge', statusClasses[status], className)}>
      {statusLabels[status]}
    </span>
  );
}
