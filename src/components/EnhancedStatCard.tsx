import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface EnhancedStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "indigo" | "orange";
  className?: string;
}

export const EnhancedStatCard: React.FC<EnhancedStatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  color = "blue",
  className,
}) => {
  const colorClasses = {
    blue: "bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-600 dark:text-blue-400",
    green:
      "bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 text-green-600 dark:text-green-400",
    red: "bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20 text-red-600 dark:text-red-400",
    yellow:
      "bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20 text-yellow-600 dark:text-yellow-400",
    purple:
      "bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-600 dark:text-purple-400",
    indigo:
      "bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-500/20 text-indigo-600 dark:text-indigo-400",
    orange:
      "bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 text-orange-600 dark:text-orange-400",
  };

  const iconBgClasses = {
    blue: "bg-blue-500/10 group-hover:bg-blue-500/20",
    green: "bg-green-500/10 group-hover:bg-green-500/20",
    red: "bg-red-500/10 group-hover:bg-red-500/20",
    yellow: "bg-yellow-500/10 group-hover:bg-yellow-500/20",
    purple: "bg-purple-500/10 group-hover:bg-purple-500/20",
    indigo: "bg-indigo-500/10 group-hover:bg-indigo-500/20",
    orange: "bg-orange-500/10 group-hover:bg-orange-500/20",
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        colorClasses[color],
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {title}
            </p>
            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="text-4xl font-bold tracking-tight">{value}</h3>
              {trend && (
                <span
                  className={cn(
                    "text-sm font-semibold flex items-center gap-1",
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {trend.isPositive ? "↗" : "↘"}
                  {Math.abs(trend.value)}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <div
            className={cn(
              "p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
              iconBgClasses[color]
            )}
          >
            <Icon className="h-7 w-7" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedStatCard;
