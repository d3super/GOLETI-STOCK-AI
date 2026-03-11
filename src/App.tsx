import React from 'react';
import ChatInterface from './components/ChatInterface';
import { TrendingUp, TrendingDown, BarChart3, PieChart, LayoutDashboard, Settings, LogOut, Search, Bell, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#f8f9fa] text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-black/5 p-6 space-y-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <TrendingUp size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Finora</h1>
        </div>

        <nav className="flex-1 space-y-1">
          {[
            { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: true },
            { icon: <BarChart3 size={20} />, label: 'Market Analysis' },
            { icon: <PieChart size={20} />, label: 'Portfolio' },
            { icon: <TrendingUp size={20} />, label: 'Watchlist' },
            { icon: <Settings size={20} />, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.active 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-black/5">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-black/5 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 md:hidden">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold">Finora</h1>
          </div>

          <div className="hidden md:flex items-center bg-gray-50 border border-black/5 rounded-xl px-3 py-2 w-96">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search stocks, news, analysis..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg text-gray-500">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-black/5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">User Account</p>
                <p className="text-xs text-gray-500">Premium Plan</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-500/20 overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/user/100/100" 
                  alt="User" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden p-6 md:p-8 flex gap-8">
          {/* Chat Section */}
          <div className="flex-1 flex flex-col min-w-0">
            <ChatInterface />
          </div>

          {/* Market Sidebar (Desktop Only) */}
          <div className="hidden xl:flex flex-col w-80 space-y-6 overflow-y-auto">
            <div className="card p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Market Overview</h3>
              <div className="space-y-4">
                {[
                  { name: 'IHSG', value: '7,321.45', change: '+1.24%', up: true },
                  { name: 'NASDAQ', value: '16,234.12', change: '-0.45%', up: false },
                  { name: 'S&P 500', value: '5,123.56', change: '+0.12%', up: true },
                ].map((index) => (
                  <div key={index.name} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">{index.name}</p>
                      <p className="text-xs text-gray-500">{index.value}</p>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                      index.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {index.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {index.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Top Gainers</h3>
              <div className="space-y-4">
                {[
                  { symbol: 'BBCA', price: '10,250', change: '+2.5%' },
                  { symbol: 'TLKM', price: '3,840', change: '+1.8%' },
                  { symbol: 'ASII', price: '5,125', change: '+1.2%' },
                ].map((stock) => (
                  <div key={stock.symbol} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] font-bold">
                        {stock.symbol.substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{stock.symbol}</p>
                        <p className="text-xs text-gray-500">{stock.price}</p>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-emerald-600">{stock.change}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                View All Market
              </button>
            </div>

            <div className="card p-6 bg-emerald-900 text-white border-none relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-2">Upgrade to Pro</h3>
                <p className="text-xs text-emerald-100/80 mb-4">Dapatkan analisis mendalam tanpa batas dan fitur eksklusif lainnya.</p>
                <button className="px-4 py-2 bg-white text-emerald-900 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-all">
                  Upgrade Now
                </button>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <TrendingUp size={120} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
