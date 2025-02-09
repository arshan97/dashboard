import { cn } from "@/lib/utils";

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
  return (
    <div
      className={cn(
        "rounded-full",
        {
          "bg-green-500": status === "healthy",
          "bg-yellow-500": status === "warning",
          "bg-red-500": status === "critical",
          "bg-gray-300": status === "unknown",
          "h-2 w-2": size === "sm",
          "h-3 w-3": size === "md",
          "h-4 w-4": size === "lg",
        },
        className
      )}
    />
  );
}
