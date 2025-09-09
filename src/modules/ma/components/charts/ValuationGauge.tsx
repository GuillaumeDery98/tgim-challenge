import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ValuationGaugeProps {
  currentPrice: number;
  fairValue: number;
  companyName: string;
  className?: string;
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
};

const getRecommendation = (percentDiff: number) => {
  if (percentDiff > 20) return { text: "STRONG BUY", color: "bg-green-600", icon: TrendingUp };
  if (percentDiff > 10) return { text: "BUY", color: "bg-green-500", icon: TrendingUp };
  if (percentDiff > -10) return { text: "HOLD", color: "bg-yellow-500", icon: Minus };
  if (percentDiff > -20) return { text: "SELL", color: "bg-red-500", icon: TrendingDown };
  return { text: "STRONG SELL", color: "bg-red-600", icon: TrendingDown };
};

export function ValuationGauge({
  currentPrice,
  fairValue,
  companyName,
  className,
}: ValuationGaugeProps) {
  const percentDiff = ((fairValue - currentPrice) / currentPrice) * 100;
  const isUndervalued = fairValue > currentPrice;
  const recommendation = getRecommendation(percentDiff);
  const Icon = recommendation.icon;

  // Calcul pour l'indicateur visuel (gauge)
  const maxDeviation = 50; // ±50% pour l'échelle
  const normalizedValue = Math.max(-maxDeviation, Math.min(maxDeviation, percentDiff));
  const gaugePosition = ((normalizedValue + maxDeviation) / (2 * maxDeviation)) * 100;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Analyse de Valorisation</CardTitle>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {companyName}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Gauge visuel */}
        <div className="relative">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Sous-évalué</span>
            <span>Juste prix</span>
            <span>Surévalué</span>
          </div>
          
          {/* Barre de gauge */}
          <div className="relative h-4 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full">
            <div 
              className="absolute top-0 w-1 h-4 bg-white border-2 border-gray-800 rounded-full transform -translate-x-1/2"
              style={{ left: `${gaugePosition}%` }}
            />
          </div>
          
          {/* Labels de pourcentage */}
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>-50%</span>
            <span>0%</span>
            <span>+50%</span>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">Prix Actuel</div>
            <div className="text-lg font-semibold">{formatCurrency(currentPrice)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">Fair Value</div>
            <div className="text-lg font-semibold">{formatCurrency(fairValue)}</div>
          </div>
        </div>

        {/* Écart et recommandation */}
        <div className="text-center space-y-3">
          <div className="space-y-1">
            <div className="text-sm text-gray-600 dark:text-gray-400">Écart</div>
            <div className={`text-2xl font-bold ${
              isUndervalued ? 'text-green-600' : 'text-red-600'
            }`}>
              {percentDiff > 0 ? '+' : ''}{percentDiff.toFixed(1)}%
            </div>
          </div>
          
          <Badge className={`${recommendation.color} text-white hover:${recommendation.color} px-4 py-2`}>
            <Icon className="w-4 h-4 mr-1" />
            {recommendation.text}
          </Badge>
        </div>

        {/* Interprétation */}
        <div className="text-xs text-gray-600 dark:text-gray-400 text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {isUndervalued ? (
            <>L'action semble <strong>sous-évaluée</strong> de {Math.abs(percentDiff).toFixed(1)}% selon notre analyse DCF.</>
          ) : (
            <>L'action semble <strong>surévaluée</strong> de {Math.abs(percentDiff).toFixed(1)}% selon notre analyse DCF.</>
          )}
        </div>
      </CardContent>
    </Card>
  );
}