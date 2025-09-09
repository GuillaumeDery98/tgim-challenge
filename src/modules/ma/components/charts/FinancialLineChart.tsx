import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FinancialLineChartProps {
  data: Array<{
    year: string;
    value: number;
  }>;
  title: string;
  color?: string;
  formatValue?: (value: number) => string;
  className?: string;
}

const defaultFormatter = (value: number): string => {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
};

const CustomTooltip = ({ 
  active, 
  payload, 
  label, 
  formatValue = defaultFormatter 
}: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 dark:text-gray-100">
          {label}
        </p>
        <p className="text-blue-600 dark:text-blue-400 font-semibold">
          {formatValue(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export function FinancialLineChart({
  data,
  title,
  color = "#3b82f6",
  formatValue = defaultFormatter,
  className,
}: FinancialLineChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="year" 
              className="text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                // Formatter plus compact pour l'axe Y
                if (Math.abs(value) >= 1e9) {
                  return `$${(value / 1e9).toFixed(1)}B`;
                }
                if (Math.abs(value) >= 1e6) {
                  return `$${(value / 1e6).toFixed(1)}M`;
                }
                return `$${(value / 1e3).toFixed(0)}K`;
              }}
            />
            <Tooltip content={<CustomTooltip formatValue={formatValue} />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={3}
              dot={{
                fill: color,
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                r: 6,
                stroke: color,
                strokeWidth: 2,
                fill: "#fff",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}