import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StockCardProps {
  ticker: string;
  price: string;
  change: string;
  changePercent: string;
  trend: 'up' | 'down' | 'neutral';
}

export const StockCard: React.FC<StockCardProps> = ({ ticker, price, change, changePercent, trend }) => {
  const isUp = trend === 'up';
  const isDown = trend === 'down';

  return (
    <div className="bg-secondary-bg border border-border-color rounded-xl p-4 flex flex-col gap-2 min-w-[200px] shadow-sm">
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-text-primary">{ticker}</span>
        {isUp && <TrendingUp className="text-primary-green w-5 h-5" />}
        {isDown && <TrendingDown className="text-red-500 w-5 h-5" />}
        {!isUp && !isDown && <Minus className="text-text-secondary w-5 h-5" />}
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-text-primary">${price}</span>
        <div className={`flex items-center gap-1 text-sm font-medium ${isUp ? 'text-primary-green' : isDown ? 'text-red-500' : 'text-text-secondary'}`}>
          <span>{isUp ? '+' : ''}{change}</span>
          <span>({isUp ? '+' : ''}{changePercent}%)</span>
        </div>
      </div>
    </div>
  );
};

interface RiskIndicatorProps {
  level: 'low' | 'medium' | 'high';
  label?: string;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({ level, label = "Risk Profile" }) => {
  const colors = {
    low: 'bg-primary-green',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  };

  return (
    <div className="flex items-center gap-3 bg-secondary-bg/50 border border-border-color rounded-lg px-3 py-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{label}</span>
      <div className="flex gap-1">
        <div className={`w-3 h-3 rounded-full ${level === 'low' || level === 'medium' || level === 'high' ? colors.low : 'bg-border-color'}`} />
        <div className={`w-3 h-3 rounded-full ${level === 'medium' || level === 'high' ? colors.medium : 'bg-border-color'}`} />
        <div className={`w-3 h-3 rounded-full ${level === 'high' ? colors.high : 'bg-border-color'}`} />
      </div>
      <span className={`text-xs font-bold uppercase ${colors[level].replace('bg-', 'text-')}`}>{level}</span>
    </div>
  );
};
