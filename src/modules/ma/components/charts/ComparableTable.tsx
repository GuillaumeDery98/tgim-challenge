import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ComparableData {
  peer: string;
  ratios?: {
    priceToEarningsRatio?: number;
    enterpriseValueMultiple?: number;
    priceToSalesRatio?: number;
  } | null;
  hasData: boolean;
}

interface ComparableTableProps {
  currentSymbol: string;
  currentCompanyName: string;
  currentSymbolRatios?: {
    priceToEarningsRatio?: number;
    enterpriseValueMultiple?: number;
    priceToSalesRatio?: number;
  };
  peersRatios: ComparableData[];
  sectorAverages: {
    pe: number;
    evToEbitda: number;
    evToSales: number;
  };
  className?: string;
}

const formatRatio = (value: number | undefined): string => {
  if (value === undefined || value === null || isNaN(value)) return "-";
  return value.toFixed(2);
};

const getRatioColor = (value: number | undefined, average: number): string => {
  if (value === undefined || value === null || isNaN(value)) return "text-gray-500";
  
  const diff = Math.abs(value - average) / average;
  if (diff > 0.3) return "text-red-600 font-semibold"; // Très différent de la moyenne
  if (diff > 0.15) return "text-yellow-600 font-medium"; // Modérément différent
  return "text-green-600 font-medium"; // Proche de la moyenne
};

export function ComparableTable({
  currentSymbol,
  currentCompanyName,
  currentSymbolRatios,
  peersRatios,
  sectorAverages,
  className,
}: ComparableTableProps) {
  // Séparer les peers avec et sans données
  const peersWithData = peersRatios.filter(p => p.hasData);
  const peersWithoutData = peersRatios.filter(p => !p.hasData);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Comparables Sectoriels</CardTitle>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Ratios de valorisation par rapport aux pairs du secteur
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="w-[200px] font-semibold">Entreprise</TableHead>
                <TableHead className="text-center font-semibold">P/E</TableHead>
                <TableHead className="text-center font-semibold">EV/EBITDA</TableHead>
                <TableHead className="text-center font-semibold">EV/Sales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Ligne pour le symbole analysé */}
              <TableRow className="bg-blue-50 dark:bg-blue-950/50 border-b-2 border-blue-200 dark:border-blue-800">
                <TableCell className="font-semibold">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-blue-600">
                      {currentSymbol}
                    </Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {currentCompanyName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center font-medium">
                  <span className={getRatioColor(currentSymbolRatios?.priceToEarningsRatio, sectorAverages.pe)}>
                    {formatRatio(currentSymbolRatios?.priceToEarningsRatio)}
                  </span>
                </TableCell>
                <TableCell className="text-center font-medium">
                  <span className={getRatioColor(currentSymbolRatios?.enterpriseValueMultiple, sectorAverages.evToEbitda)}>
                    {formatRatio(currentSymbolRatios?.enterpriseValueMultiple)}
                  </span>
                </TableCell>
                <TableCell className="text-center font-medium">
                  <span className={getRatioColor(currentSymbolRatios?.priceToSalesRatio, sectorAverages.evToSales)}>
                    {formatRatio(currentSymbolRatios?.priceToSalesRatio)}
                  </span>
                </TableCell>
              </TableRow>

              {/* Peers avec données */}
              {peersWithData.map((peer) => (
                <TableRow key={peer.peer} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableCell>
                    <Badge variant="outline">
                      {peer.peer}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={getRatioColor(peer.ratios?.priceToEarningsRatio, sectorAverages.pe)}>
                      {formatRatio(peer.ratios?.priceToEarningsRatio)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={getRatioColor(peer.ratios?.enterpriseValueMultiple, sectorAverages.evToEbitda)}>
                      {formatRatio(peer.ratios?.enterpriseValueMultiple)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={getRatioColor(peer.ratios?.priceToSalesRatio, sectorAverages.evToSales)}>
                      {formatRatio(peer.ratios?.priceToSalesRatio)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}

              {/* Peers sans données (version gratuite) */}
              {peersWithoutData.map((peer) => (
                <TableRow key={peer.peer} className="opacity-60 bg-gray-50/50 dark:bg-gray-800/30">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-gray-500 border-gray-400">
                        {peer.peer}
                      </Badge>
                      <span className="text-xs text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                        Version gratuite
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-gray-400">N/A</TableCell>
                  <TableCell className="text-center text-gray-400">N/A</TableCell>
                  <TableCell className="text-center text-gray-400">N/A</TableCell>
                </TableRow>
              ))}

              {/* Ligne des moyennes sectorielles */}
              <TableRow className="bg-gray-100 dark:bg-gray-800 border-t-2 border-gray-300 dark:border-gray-600 font-semibold">
                <TableCell>
                  <Badge className="bg-gray-600">
                    Moyenne Secteur
                  </Badge>
                </TableCell>
                <TableCell className="text-center text-gray-900 dark:text-gray-100">
                  {sectorAverages.pe.toFixed(2)}
                </TableCell>
                <TableCell className="text-center text-gray-900 dark:text-gray-100">
                  {sectorAverages.evToEbitda.toFixed(2)}
                </TableCell>
                <TableCell className="text-center text-gray-900 dark:text-gray-100">
                  {sectorAverages.evToSales.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Légende */}
        <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
              <span>Proche de la moyenne sectorielle</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-600 rounded-sm"></div>
              <span>Modérément différent</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
              <span>Très différent de la moyenne</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}