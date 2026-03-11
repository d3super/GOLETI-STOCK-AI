import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Globe, BarChart2 } from 'lucide-react';
import { StockCard } from './StockComponents';

interface MarketIndex {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  trend: 'up' | 'down' | 'neutral';
}

interface StockData {
  ticker: string;
  price: string;
  change: string;
  changePercent: string;
  trend: 'up' | 'down';
}

export const MarketOverview: React.FC = () => {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [gainers, setGainers] = useState<StockData[]>([]);
  const [losers, setLosers] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIndices([
        { symbol: 'IDX', name: 'IDX Composite', price: '7,328.15', change: '+42.30', changePercent: '0.58', trend: 'up' },
        { symbol: 'NASDAQ', name: 'NASDAQ', price: '16,273.38', change: '+154.55', changePercent: '0.96', trend: 'up' },
        { symbol: 'SPY', name: 'S&P 500', price: '5,157.36', change: '+52.60', changePercent: '1.03', trend: 'up' },
      ]);

      setGainers([
        { ticker: 'BBCA', price: '10,150', change: '+150', changePercent: '1.50', trend: 'up' },
        { ticker: 'BBRI', price: '6,125', change: '+125', changePercent: '2.08', trend: 'up' },
        { ticker: 'TLKM', price: '3,980', change: '+60', changePercent: '1.53', trend: 'up' },
        { ticker: 'BMRI', price: '7,250', change: '+175', changePercent: '2.47', trend: 'up' },
        { ticker: 'ASII', price: '5,250', change: '+100', changePercent: '1.94', trend: 'up' },
      ]);

      setLosers([
        { ticker: 'GOTO', price: '68', change: '-2', changePercent: '2.86', trend: 'down' },
        { ticker: 'UNVR', price: '2,750', change: '-50', changePercent: '1.79', trend: 'down' },
        { ticker: 'ADRO', price: '2,620', change: '-40', changePercent: '1.50', trend: 'down' },
        { ticker: 'BUKA', price: '152', change: '-3', changePercent: '1.94', trend: 'down' },
        { ticker: 'ANTM', price: '1,610', change: '-25', changePercent: '1.53', trend: 'down' },
      ]);

      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-secondary-bg/50 rounded-2xl border border-border-color" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto">
      {/* Indices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {indices.map((index) => (
          <div key={index.symbol} className="bg-secondary-bg border border-border-color rounded-2xl p-5 flex flex-col gap-3 shadow-lg hover:border-primary-green/50 transition-all group">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-green/10 flex items-center justify-center text-primary-green">
                  {index.symbol === 'IDX' ? <Activity size={18} /> : <Globe size={18} />}
                </div>
                <span className="font-bold text-text-primary">{index.name}</span>
              </div>
              <TrendingUp className="text-primary-green w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-text-primary">{index.price}</span>
              <div className="flex items-center gap-2 text-sm font-bold text-primary-green">
                <span>{index.change}</span>
                <span className="bg-primary-green/20 px-2 py-0.5 rounded text-[10px] uppercase tracking-tighter">+{index.changePercent}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Top Gainers */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <TrendingUp className="text-primary-green w-5 h-5" />
            <h3 className="font-bold text-text-primary uppercase tracking-widest text-sm">IDX Top Gainers</h3>
          </div>
          <div className="space-y-2">
            {gainers.map((stock) => (
              <div key={stock.ticker} className="flex items-center justify-between p-4 bg-secondary-bg/40 border border-border-color rounded-xl hover:bg-secondary-bg/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-green/10 flex items-center justify-center font-bold text-primary-green">
                    {stock.ticker[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-text-primary">{stock.ticker}</span>
                    <span className="text-xs text-text-secondary">${stock.price}</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-sm font-bold text-primary-green">{stock.change}</span>
                  <span className="text-[10px] font-bold text-primary-green/70">+{stock.changePercent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <TrendingDown className="text-red-500 w-5 h-5" />
            <h3 className="font-bold text-text-primary uppercase tracking-widest text-sm">IDX Top Losers</h3>
          </div>
          <div className="space-y-2">
            {losers.map((stock) => (
              <div key={stock.ticker} className="flex items-center justify-between p-4 bg-secondary-bg/40 border border-border-color rounded-xl hover:bg-secondary-bg/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center font-bold text-red-500">
                    {stock.ticker[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-text-primary">{stock.ticker}</span>
                    <span className="text-xs text-text-secondary">${stock.price}</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-sm font-bold text-red-500">{stock.change}</span>
                  <span className="text-[10px] font-bold text-red-500/70">{stock.changePercent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
