import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, BarChart3, ShieldAlert, Zap, LogIn, TrendingUp as TrendingUpIcon, User as UserIcon } from 'lucide-react';
import Markdown from 'react-markdown';
import { Message } from '../services/gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { User } from 'firebase/auth';
import { MarketOverview } from './MarketOverview';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  user: User | null;
  onLogin: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, onSendMessage, isLoading, user, onLogin }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-dark-bg relative">
      {/* Header */}
      <div className="h-16 border-b border-border-color flex items-center justify-between px-8 bg-dark-bg/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-green rounded-lg flex items-center justify-center shadow-md">
            <TrendingUpIcon className="w-5 h-5 text-dark-bg" />
          </div>
          <span className="font-bold text-lg tracking-tight text-text-primary">Goleti AI Analyst</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs font-medium text-text-secondary bg-secondary-bg px-2 py-1 rounded-md border border-border-color">
            <span>Powered by Gemini 1.5 Pro</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-5xl mx-auto space-y-12 py-12">
            <div className="flex flex-col items-center space-y-6">
              <div className="w-24 h-24 bg-primary-green rounded-3xl flex items-center justify-center shadow-2xl border border-border-color">
                <TrendingUpIcon className="w-12 h-12 text-dark-bg" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">How can I help your portfolio today?</h2>
                <p className="text-text-secondary text-lg max-w-2xl">
                  Ask me to analyze a stock, compare competitors, or explain complex financial concepts.
                </p>
              </div>
            </div>

            {/* Market Overview Feature */}
            <div className="w-full">
              <MarketOverview />
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex w-full",
              msg.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl p-6",
                msg.role === 'user' 
                  ? "bg-secondary-bg text-text-primary border border-border-color" 
                  : "bg-secondary-bg/30 text-text-primary border border-transparent"
              )}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  msg.role === 'user' ? "bg-primary-green/20 text-primary-green" : "bg-primary-green text-dark-bg"
                )}>
                  {msg.role === 'user' ? <UserIcon size={16} /> : <TrendingUpIcon className="w-5 h-5" />}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
                  {msg.role === 'user' ? 'You' : 'Goleti AI'}
                </span>
              </div>
              <div className="markdown-body">
                <Markdown>{msg.content}</Markdown>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary-bg/30 rounded-2xl p-6 border border-transparent max-w-[85%]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-green flex items-center justify-center">
                  <TrendingUpIcon className="w-5 h-5 text-dark-bg animate-pulse" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">Goleti AI is thinking...</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary-green rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-primary-green rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-primary-green rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-6 bg-dark-bg relative">
        {!user && (
          <div className="absolute inset-0 bg-dark-bg/60 backdrop-blur-sm z-20 flex items-center justify-center p-6">
            <div className="bg-secondary-bg border border-border-color p-6 rounded-2xl shadow-2xl max-w-md w-full text-center">
              <h3 className="text-xl font-bold mb-2">Unlock Full Analysis</h3>
              <p className="text-text-secondary text-sm mb-6">Login or create an account to start analyzing stocks with Goleti AI.</p>
              <button 
                onClick={onLogin}
                className="w-full py-3 bg-primary-green hover:bg-emerald-600 text-dark-bg font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <LogIn size={18} />
                Login / Sign Up
              </button>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <div className="flex items-center gap-3 bg-secondary-bg border border-border-color rounded-2xl p-2 focus-within:border-primary-green transition-colors shadow-2xl">
            <button type="button" className="p-3 text-text-secondary hover:text-primary-green transition-colors">
              <BarChart3 size={20} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter a ticker (e.g. AAPL) or ask a question..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-text-primary placeholder:text-text-secondary py-3 px-2"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                "p-3 rounded-xl transition-all active:scale-90",
                input.trim() && !isLoading ? "bg-primary-green text-dark-bg shadow-lg shadow-primary-green/20" : "bg-border-color text-text-secondary"
              )}
            >
              <Send size={20} />
            </button>
          </div>
        </form>
        <p className="text-[10px] text-center text-text-secondary mt-4 uppercase tracking-widest opacity-50">
          Goleti can make mistakes. Always verify financial data.
        </p>
      </div>
    </div>
  );
};

// Simple Icons removed as they are now imported from lucide-react or replaced
