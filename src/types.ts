export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  summary: string;
  fundamental: {
    peRatio: number;
    marketCap: string;
    dividendYield: string;
  };
  technical: {
    rsi: number;
    movingAverage: string;
  };
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
}
