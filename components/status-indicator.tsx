import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, XCircle, HelpCircle } from "lucide-react";

interface StatusIndicatorProps {
  status: "healthy" | "warning" | "critical" | "unknown";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatusIndicator({
  status,
  size = "md",
  className,
}: StatusIndicatorProps) {
  const icons = {
    healthy: CheckCircle,
    warning: AlertTriangle,
    critical: XCircle,
    unknown: HelpCircle,
  };

  const flashingAnimation = {
    healthy: "animate-pulse-green",
    warning: "animate-pulse-yellow",
    critical: "animate-pulse-red",
    unknown: "animate-pulse-gray",
  };

  const Icon = icons[status];

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const colors = {
    healthy: "text-green-500",
    warning: "text-yellow-500",
    critical: "text-red-500",
    unknown: "text-gray-500",
  };

  return (
    <div className={cn("flex items-center", className)}>
      <Icon
        className={cn(
          sizeClasses[size],
          colors[status],
          flashingAnimation[status]
        )}
      />
    </div>
  );
}
