import React, { useState } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_FINANCIAL_PREP_KEY;

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

export function AnalystSection() {
  const [ticker, setTicker] = useState("AAPL");
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
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

      // --- 3. Croissance moyenne ---
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
      
      // Filtrer les peers pour ne garder que les symboles autorisés pour les ratios
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
          
          if (pe > 0 && pe < 100) { // Filtrer les ratios aberrants
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
    }
    setLoading(false);
  };

  return (
    <div className="p-6 mx-auto bg-white shadow rounded-2xl">
      <h1 className="text-2xl font-bold mb-4">Valuation Challenge</h1>

      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <select
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="border p-2 rounded w-40 bg-white"
          >
            {ALLOWED_SYMBOLS.map((symbol) => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </select>
          <button
            onClick={fetchData}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow"
          >
            Analyser
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Sélectionnez un symbole parmi les {ALLOWED_SYMBOLS.length} disponibles avec la version gratuite
        </p>
      </div>

      {loading && <p>⏳ Chargement...</p>}

      {data && (
        <div>
          {/* Profil */}
          <h2 className="text-xl font-semibold mt-4">Profil</h2>
          <p>
            <strong>{data.profile.companyName}</strong> ({data.profile.symbol})
          </p>
          <p>Prix actuel : ${data.profile.price}</p>
          <p>Market Cap : ${(data.profile.mktCap || data.profile.marketCap)?.toLocaleString()}</p>
          <p>Secteur : {data.profile.sector}</p>
          <p>Industrie : {data.profile.industry}</p>

          {/* Historique FCF et croissance */}
          <h2 className="text-xl font-semibold mt-4">Free Cash Flow</h2>
          <p>
            Historique :{" "}
            {data.fcfHistory.map((f: number, i: number) => (
              <span key={i} className="mr-2">
                {f.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                })}
              </span>
            ))}
          </p>
          <p>Croissance moyenne estimée : {(data.avgGrowth * 100).toFixed(2)}%</p>

          {/* Projections DCF */}
          <h2 className="text-xl font-semibold mt-4">Projections DCF</h2>
          <ul className="list-disc pl-5">
            {data.projectedFCF.map((fcf: number, i: number) => (
              <li key={i}>
                Année {i + 1} :{" "}
                {fcf.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                })}{" "}
                (actualisé:{" "}
                {data.discountedFCF[i].toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                })}
                )
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold mt-4">Résultats</h2>
          <p>
            Valeur d’entreprise estimée :{" "}
            {data.enterpriseValue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
          </p>
          <p>
            Valeur théorique par action :{" "}
            {data.fairValue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 2,
            })}{" "}
            vs Prix actuel : ${data.profile.price}
          </p>

          {/* Comparables sectoriels */}
          <h2 className="text-xl font-semibold mt-4">Comparables sectoriels</h2>
          <table className="table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border px-2 py-1">Entreprise</th>
                <th className="border px-2 py-1">P/E</th>
                <th className="border px-2 py-1">EV/EBITDA</th>
                <th className="border px-2 py-1">EV/Sales</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-100">
                <td className="border px-2 py-1">{data.profile.symbol} ({data.profile.companyName})</td>
                <td className="border px-2 py-1">{data.currentSymbolRatios?.priceToEarningsRatio?.toFixed(2) || "-"}</td>
                <td className="border px-2 py-1">{data.currentSymbolRatios?.enterpriseValueMultiple?.toFixed(2) || "-"}</td>
                <td className="border px-2 py-1">{data.currentSymbolRatios?.priceToSalesRatio?.toFixed(2) || "-"}</td>
              </tr>
              {data.peersRatios.map((p: any) => (
                <tr key={p.peer} className={!p.hasData ? "bg-red-50" : ""}>
                  <td className="border px-2 py-1">
                    {p.peer}
                    {!p.hasData && (
                      <span className="text-xs text-red-600 ml-1">(version gratuite)</span>
                    )}
                  </td>
                  <td className="border px-2 py-1">
                    {p.hasData ? (p.ratios?.priceToEarningsRatio?.toFixed(2) || "-") : "N/A"}
                  </td>
                  <td className="border px-2 py-1">
                    {p.hasData ? (p.ratios?.enterpriseValueMultiple?.toFixed(2) || "-") : "N/A"}
                  </td>
                  <td className="border px-2 py-1">
                    {p.hasData ? (p.ratios?.priceToSalesRatio?.toFixed(2) || "-") : "N/A"}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-200 font-semibold">
                <td className="border px-2 py-1">Moyenne secteur</td>
                <td className="border px-2 py-1">{data.sectorAverages.pe.toFixed(2)}</td>
                <td className="border px-2 py-1">{data.sectorAverages.evToEbitda.toFixed(2)}</td>
                <td className="border px-2 py-1">{data.sectorAverages.evToSales.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
