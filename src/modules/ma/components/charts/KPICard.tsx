import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  change?: number; // Pourcentage de changement
  formatValue?: (value: number | string) => string;
  className?: string;
  variant?: "default" | "success" | "warning" | "danger";
}

const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return String(value);
  
  return numValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
};

const getVariantStyles = (variant: KPICardProps["variant"]) => {
  switch (variant) {
    case "success":
      return {
        card: "border-green-200 dark:border-green-800",
        icon: "text-green-600 dark:text-green-400",
        title: "text-green-800 dark:text-green-200",
      };
    case "warning":
      return {
        card: "border-yellow-200 dark:border-yellow-800",
        icon: "text-yellow-600 dark:text-yellow-400",
        title: "text-yellow-800 dark:text-yellow-200",
      };
    case "danger":
      return {
        card: "border-red-200 dark:border-red-800",
        icon: "text-red-600 dark:text-red-400",
        title: "text-red-800 dark:text-red-200",
      };
    default:
      return {
        card: "border-gray-200 dark:border-gray-700",
        icon: "text-blue-600 dark:text-blue-400",
        title: "text-gray-700 dark:text-gray-300",
      };
  }
};

export function KPICard({
  title,
  value,
  icon: Icon,
  change,
  formatValue = formatCurrency,
  className = "",
  variant = "default",
}: KPICardProps) {
  const styles = getVariantStyles(variant);
  const formattedValue = typeof value === "number" || (typeof value === "string" && !isNaN(parseFloat(value)))
    ? formatValue(value)
    : String(value);

  const isPositiveChange = change !== undefined && change > 0;
  const isNegativeChange = change !== undefined && change < 0;

  return (
    <Card className={`${styles.card} ${className} hover:shadow-md transition-shadow`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              {Icon && <Icon className={`h-4 w-4 ${styles.icon}`} />}
              <h3 className={`text-sm font-medium ${styles.title}`}>
                {title}
              </h3>
            </div>
            
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formattedValue}
              </p>
              
              {change !== undefined && (
                <div className="flex items-center gap-1">
                  {isPositiveChange && (
                    <>
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <Badge variant="outline" className="text-xs px-1 py-0 border-green-600 text-green-600">
                        +{change.toFixed(1)}%
                      </Badge>
                    </>
                  )}
                  {isNegativeChange && (
                    <>
                      <TrendingDown className="h-3 w-3 text-red-600" />
                      <Badge variant="outline" className="text-xs px-1 py-0 border-red-600 text-red-600">
                        {change.toFixed(1)}%
                      </Badge>
                    </>
                  )}
                  {change === 0 && (
                    <Badge variant="outline" className="text-xs px-1 py-0 border-gray-500 text-gray-500">
                      0.0%
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}