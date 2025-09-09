import React, { useState } from "react";
import axios from "axios";
import { 
  FinancialLineChart, 
  FinancialBarChart, 
  ValuationGauge, 
  KPICard, 
  ComparableTable 
} from "../charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2, Building2, DollarSign, TrendingUp, BarChart3, FileDown } from "lucide-react";
import { usePDF } from 'react-to-pdf';

const API_KEY = import.meta.env.VITE_FINANCIAL_PREP_KEY;

// moved inside component to respect hooks rules

// Symboles autorisés pour la version gratuite
const ALLOWED_SYMBOLS = [
  'AAPL', 'TSLA', 'AMZN', 'MSFT', 'NVDA', 'GOOGL', 'META', 'NFLX', 'JPM', 'V', 'BAC', 'AMD', 'PYPL', 'DIS', 'T', 'PFE', 
  'COST', 'INTC', 'KO', 'TGT', 'NKE', 'SPY', 'BA', 'BABA', 'XOM', 'WMT', 'GE', 'CSCO', 'VZ', 'JNJ', 'CVX', 'PLTR', 'SQ', 
  'SHOP', 'SBUX', 'SOFI', 'HOOD', 'RBLX', 'SNAP', 'UBER', 'FDX', 'ABBV', 'ETSY', 'MRNA', 'LMT', 'GM', 'F', 'RIVN', 'LCID', 
  'CCL', 'DAL', 'UAL', 'AAL', 'TSM', 'SONY', 'ET', 'NOK', 'MRO', 'COIN', 'SIRI', 'RIOT', 'CPRX', 'VWO', 'SPYG', 'ROKU', 
  'VIAC', 'ATVI', 'BIDU', 'DOCU', 'ZM', 'PINS', 'TLRY', 'WBA', 'MGM', 'NIO', 'C', 'GS', 'WFC', 'ADBE', 'PEP', 'UNH', 
  'CARR', 'FUBO', 'HCA', 'TWTR', 'BILI', 'RKT'
];

interface AnalysisData {
  profile: any;
  fcfHistory: number[];
  avgGrowth: number;
  projectedFCF: number[];
  discountedFCF: number[];
  enterpriseValue: number;
  fairValue: number;
  peersRatios: any[];
  sectorAverages: {
    pe: number;
    evToEbitda: number;
    evToSales: number;
  };
  currentSymbolRatios: any;
}

const LoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          </CardContent>
        </Card>
      ))}
    </div>
    <Card className="animate-pulse">
      <CardContent className="p-6">
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </CardContent>
    </Card>
  </div>
);

export function AnalystSection() {
  const [ticker, setTicker] = useState("AAPL");
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toPDF, targetRef } = usePDF({ filename: `valuation-${ticker}.pdf`, page: { margin: 12 } });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // --- 1. Profil de l'entreprise ---
      const profileRes = await axios.get(
        `https://financialmodelingprep.com/stable/profile?symbol=${ticker}&apikey=${API_KEY}`
      );
      const profile = profileRes.data[0];

      // --- 2. Historique Cash Flow (5 ans) ---
      const cashFlowRes = await axios.get(
        `https://financialmodelingprep.com/stable/cash-flow-statement?symbol=${ticker}&limit=5&apikey=${API_KEY}`
      );
      const fcfHistory = cashFlowRes.data
        .map((y: any) => y.freeCashFlow)
        .filter((fcf: any) => fcf != null && !isNaN(fcf))
        .reverse();

      // --- 3. Calcul de croissance avec validation ---
      const growthRates = fcfHistory
        .slice(1)
        .map((v: number, i: number) => {
          const prevFcf = fcfHistory[i];
          if (prevFcf === 0) return 0;
          return (v - prevFcf) / Math.abs(prevFcf);
        })
        .filter((rate: number) => !isNaN(rate) && isFinite(rate));
      
      const avgGrowth = growthRates.length > 0
        ? growthRates.reduce((a: number, b: number) => a + b, 0) / growthRates.length
        : 0.05; // Croissance par défaut de 5%

      // --- 4. DCF simplifié ---
      const WACC = 0.08;
      const terminalGrowth = 0.025;
      const years = 5;

      let projectedFCF = [];
      let lastFCF = fcfHistory[fcfHistory.length - 1];
      for (let i = 1; i <= years; i++) {
        lastFCF = lastFCF * (1 + avgGrowth);
        projectedFCF.push(lastFCF);
      }
      const discountedFCF = projectedFCF.map(
        (fcf, i) => fcf / Math.pow(1 + WACC, i + 1)
      );
      const terminalValue =
        (projectedFCF[projectedFCF.length - 1] * (1 + terminalGrowth)) /
        (WACC - terminalGrowth);
      const discountedTV = terminalValue / Math.pow(1 + WACC, years);
      const enterpriseValue =
        discountedFCF.reduce((a, b) => a + b, 0) + discountedTV;
      
      // Calcul plus précis du nombre d'actions
      const marketCap = profile.mktCap || profile.marketCap;
      const sharesOutstanding = profile.sharesOutstanding || (marketCap / profile.price);
      const fairValue = enterpriseValue / sharesOutstanding;

      // --- 5. Peers sectoriels ---
      const peersRes = await axios.get(
        `https://financialmodelingprep.com/stable/stock-peers?symbol=${ticker}&apikey=${API_KEY}`
      );
      // Récupération et validation des peers - nouvelle structure API
      const peersList = peersRes.data?.slice(0, 5)?.map((peer: any) => peer.symbol) || []; // limiter à 5 peers

      // --- 6. Récupérer ratios du symbole analysé et des peers autorisés ---
      // D'abord récupérer les ratios du symbole en cours
      const currentSymbolRatios = await axios.get(
        `https://financialmodelingprep.com/stable/ratios?symbol=${ticker}&apikey=${API_KEY}`
      );
      
      // Filtrer les peers pour ne garder que les symboles autorisés
      const allowedPeers = peersList.filter((peer: string) => 
        ALLOWED_SYMBOLS.includes(peer.toUpperCase())
      );
      
      const peersRatios = await Promise.all(
        allowedPeers.map(async (peer: string) => {
          try {
            const r = await axios.get(
              `https://financialmodelingprep.com/stable/ratios?symbol=${peer}&apikey=${API_KEY}`
            );
            return { peer, ratios: r.data[0], hasData: true };
          } catch {
            return { peer, ratios: null, hasData: false };
          }
        })
      );
      
      // Ajouter tous les autres peers sans données
      const allPeersRatios = [
        ...peersRatios,
        ...peersList
          .filter((peer: string) => !ALLOWED_SYMBOLS.includes(peer.toUpperCase()))
          .map((peer: string) => ({ peer, ratios: null, hasData: false }))
      ];

      // --- 7. Calcul moyenne sectorielle ---
      const sectorAverages = { pe: 0, evToEbitda: 0, evToSales: 0 };
      let count = 0;
      
      peersRatios.forEach((p) => {
        if (p.ratios && p.hasData) {
          const pe = p.ratios.priceToEarningsRatio || 0;
          const evToEbitda = p.ratios.enterpriseValueMultiple || 0;
          const evToSales = p.ratios.priceToSalesRatio || 0;
          
          if (pe > 0 && pe < 100) {
            sectorAverages.pe += pe;
            count++;
          }
          if (evToEbitda > 0 && evToEbitda < 50) {
            sectorAverages.evToEbitda += evToEbitda;
          }
          if (evToSales > 0 && evToSales < 20) {
            sectorAverages.evToSales += evToSales;
          }
        }
      });
      
      if (count > 0) {
        sectorAverages.pe /= count;
        sectorAverages.evToEbitda /= count;
        sectorAverages.evToSales /= count;
      }

      setData({
        profile,
        fcfHistory,
        avgGrowth,
        projectedFCF,
        discountedFCF,
        enterpriseValue,
        fairValue,
        peersRatios: allPeersRatios,
        sectorAverages,
        currentSymbolRatios: currentSymbolRatios.data[0],
      });
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des données. Veuillez réessayer.");
    }
    setLoading(false);
  };

  // Préparation des données pour les charts
  const fcfChartData = data ? data.fcfHistory.map((value, index) => ({
    year: `Année ${index + 1}`,
    value
  })) : [];

  const dcfChartData = data ? data.projectedFCF.map((projected, index) => ({
    year: `An ${index + 1}`,
    projected,
    discounted: data.discountedFCF[index]
  })) : [];

  return (
    <div className="mx-auto dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Challenge de Valorisation
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Analyse DCF avancée avec visualisations interactives
              </p>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              Version Gratuite
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <Select value={ticker} onValueChange={setTicker}>
                <SelectTrigger className="w-full sm:w-48 bg-white">
                  <SelectValue placeholder="Sélectionner un symbole" />
                </SelectTrigger>
                <SelectContent>
                  {ALLOWED_SYMBOLS.map((symbol) => (
                    <SelectItem key={symbol} value={symbol}>
                      {symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={fetchData} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyse...
                </>
              ) : (
                <>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analyser
                </>
              )}
            </Button>
            {data && !loading && (
              <Button
                variant="outline"
                onClick={() => toPDF()}
                className="px-6 py-2"
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            )}
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {ALLOWED_SYMBOLS.length} symboles disponibles avec l'API gratuite
          </p>
        </div>

        <div className="p-6">
          {loading && <LoadingSkeleton />}
          
          {error && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/50">
              <CardContent className="p-6">
                <div className="text-red-800 dark:text-red-200">
                  {error}
                </div>
              </CardContent>
            </Card>
          )}

          {data && !loading && (
            <div className="space-y-8">
              {/* Profil de l'entreprise */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-6 w-6 text-blue-600" />
                    <div>
                      <CardTitle className="text-xl">
                        {data.profile.companyName} ({data.profile.symbol})
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{data.profile.sector}</Badge>
                        <Badge variant="outline">{data.profile.industry}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {data.profile.description?.substring(0, 200)}...
                  </p>
                </CardContent>
              </Card>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard
                  title="Prix Actuel"
                  value={data.profile.price}
                  icon={DollarSign}
                  variant="default"
                />
                <KPICard
                  title="Market Cap"
                  value={data.profile.mktCap || data.profile.marketCap}
                  icon={Building2}
                  variant="default"
                />
                <KPICard
                  title="Croissance FCF"
                  value={`${(data.avgGrowth * 100).toFixed(1)}%`}
                  icon={TrendingUp}
                  variant={data.avgGrowth > 0 ? "success" : "danger"}
                  formatValue={(v) => String(v)}
                />
              </div>

              {/* Gauge de Valorisation */}
              <ValuationGauge
                currentPrice={data.profile.price}
                fairValue={data.fairValue}
                companyName={data.profile.companyName}
              />

              <Separator />

              {/* Tabs pour les analyses */}
              <Tabs defaultValue="cashflow" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
                  <TabsTrigger value="projections">Projections DCF</TabsTrigger>
                  <TabsTrigger value="comparables">Comparables</TabsTrigger>
                </TabsList>
                
                <TabsContent value="cashflow" className="space-y-4">
                  <FinancialLineChart
                    data={fcfChartData}
                    title="Historique du Free Cash Flow (5 ans)"
                    color="#3b82f6"
                  />
                </TabsContent>

                <TabsContent value="projections" className="space-y-4">
                  <FinancialBarChart
                    data={dcfChartData}
                    title="Projections DCF - FCF Projeté vs Actualisé"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Paramètres du Modèle</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>WACC:</span>
                            <span>8.0%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Croissance terminale:</span>
                            <span>2.5%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Période de projection:</span>
                            <span>5 ans</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Résultats DCF</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Valeur d'entreprise:</span>
                            <span className="font-semibold">
                              {data.enterpriseValue.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 0,
                              })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Fair Value par action:</span>
                            <span className="font-semibold">
                              {data.fairValue.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="comparables" className="space-y-4">
                  <ComparableTable
                    currentSymbol={data.profile.symbol}
                    currentCompanyName={data.profile.companyName}
                    currentSymbolRatios={{
                      priceToEarningsRatio: data.currentSymbolRatios?.priceToEarningsRatio,
                      enterpriseValueMultiple: data.currentSymbolRatios?.enterpriseValueMultiple,
                      priceToSalesRatio: data.currentSymbolRatios?.priceToSalesRatio,
                    }}
                    peersRatios={data.peersRatios}
                    sectorAverages={data.sectorAverages}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
      {/* Offscreen export container to include ALL charts (even those hidden by tabs) */}
      {data && !loading && (
        <div
          ref={targetRef}
          style={{ position: "absolute", left: "-10000px", top: 0, width: 1024, background: "white", padding: 24 }}
        >
          {/* PDF-only styles to control page breaks and alignment */}
          <style>
            {`
              .pdf-export * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
              .pdf-export .avoid-break { break-inside: avoid; page-break-inside: avoid; }
              .pdf-export table { width: 100%; border-collapse: collapse; }
              .pdf-export th, .pdf-export td { text-align: left !important; vertical-align: top; }
              .pdf-export h1, .pdf-export h2, .pdf-export h3 { text-align: left !important; }
            `}
          </style>
          <div className="space-y-8 pdf-export">
            <h1 className="text-3xl font-bold mb-2">Challenge de Valorisation</h1>
            <div>
              <h2 className="text-xl font-semibold">
                {data.profile.companyName} ({data.profile.symbol})
              </h2>
              <p className="text-sm text-gray-600">
                {data.profile.sector} • {data.profile.industry}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 avoid-break">
              <KPICard
                title="Prix Actuel"
                value={data.profile.price}
                icon={DollarSign}
                variant="default"
              />
              <KPICard
                title="Market Cap"
                value={data.profile.mktCap || data.profile.marketCap}
                icon={Building2}
                variant="default"
              />
              <KPICard
                title="Croissance FCF"
                value={`${(data.avgGrowth * 100).toFixed(1)}%`}
                icon={TrendingUp}
                variant={data.avgGrowth > 0 ? "success" : "danger"}
                formatValue={(v) => String(v)}
              />
            </div>

            <div className="avoid-break">
              <ValuationGauge
                currentPrice={data.profile.price}
                fairValue={data.fairValue}
                companyName={data.profile.companyName}
              />
            </div>

            <div className="space-y-6">
              <div className="avoid-break">
                <FinancialLineChart
                  data={fcfChartData}
                  title="Historique du Free Cash Flow (5 ans)"
                  color="#3b82f6"
                />
              </div>

              <div className="avoid-break">
                <FinancialBarChart
                  data={dcfChartData}
                  title="Projections DCF - FCF Projeté vs Actualisé"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="avoid-break">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Paramètres du Modèle</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>WACC:</span>
                        <span>8.0%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Croissance terminale:</span>
                        <span>2.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Période de projection:</span>
                        <span>5 ans</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="avoid-break">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Résultats DCF</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Valeur d'entreprise:</span>
                        <span className="font-semibold">
                          {data.enterpriseValue.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fair Value par action:</span>
                        <span className="font-semibold">
                          {data.fairValue.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Force a new PDF page before the comparables section to avoid splitting */}
              <div style={{ pageBreakBefore: "always" }} />

              <ComparableTable
                currentSymbol={data.profile.symbol}
                currentCompanyName={data.profile.companyName}
                currentSymbolRatios={{
                  priceToEarningsRatio: data.currentSymbolRatios?.priceToEarningsRatio,
                  enterpriseValueMultiple: data.currentSymbolRatios?.enterpriseValueMultiple,
                  priceToSalesRatio: data.currentSymbolRatios?.priceToSalesRatio,
                }}
                peersRatios={data.peersRatios}
                sectorAverages={data.sectorAverages}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
