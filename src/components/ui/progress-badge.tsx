
import { cn } from "@/lib/utils";

interface ProgressBadgeProps {
  percentage: number;
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const getColorClass = (percentage: number): string => {
  if (percentage === 0) return "bg-gray-300";
  if (percentage < 25) return "bg-red-500";
  if (percentage < 50) return "bg-yellow-500";
  if (percentage < 75) return "bg-blue-500";
  return "bg-green-500";
};

export function ProgressBadge({ 
  percentage, 
  label,
  className,
  size = "md" 
}: ProgressBadgeProps) {
  const sizeClasses = {
    sm: "h-1.5 text-xs",
    md: "h-2 text-sm",
    lg: "h-3 text-base"
  };
  
  return (
    <div className={cn("flex flex-col w-full gap-1", className)}>
      {label && <div className="text-xs text-muted-foreground">{label}</div>}
      <div className="w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={cn(
            "transition-all duration-300 rounded-full", 
            getColorClass(percentage),
            sizeClasses[size]
          )} 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-right text-xs font-medium">{percentage}%</div>
    </div>
  );
}
