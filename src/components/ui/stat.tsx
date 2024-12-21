import { TrendingUp } from "lucide-react";

import { TrendingDown } from "lucide-react";

interface StatProps {
  label: string;
  value: string;
  trend?: "up" | "down";
}

export function Stat({ label, value, trend }: StatProps) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-lg font-medium flex items-center">
        {value}
        {trend && (
          <span className="ml-2">
            {trend === "up" ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </span>
        )}
      </p>
    </div>
  );
}
