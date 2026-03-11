import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, TrendingUp, BarChart2, Activity, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { getGeminiResponse } from '../services/gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Halo! Saya Finora, asisten cerdas analisis saham Anda. Saham apa yang ingin Anda analisis hari ini? Anda bisa menanyakan analisis fundamental, teknikal, atau sentimen pasar.',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Use Gemini 3.1 Pro for analysis
      const response = await getGeminiResponse(input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || 'Maaf, saya tidak dapat memproses permintaan Anda saat ini.',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching Gemini response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Terjadi kesalahan saat menghubungi server. Pastikan API Key Anda sudah dikonfigurasi dengan benar.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-3xl shadow-sm overflow-hidden border border-black/5">
      {/* Header */}
      <div className="px-6 py-4 border-bottom border-black/5 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-sm">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Finora Chat</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-muted font-medium uppercase tracking-wider">Online</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex gap-4",
                message.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                message.role === 'user' ? "bg-gray-100 text-gray-600" : "bg-emerald-100 text-emerald-600"
              )}>
                {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={cn(
                "max-w-[80%] p-4 rounded-2xl",
                message.role === 'user' 
                  ? "bg-gray-900 text-white rounded-tr-none" 
                  : "bg-gray-50 text-gray-800 rounded-tl-none border border-black/5"
              )}>
                <div className="markdown-body">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
                <div className={cn(
                  "mt-2 text-[10px] font-medium uppercase tracking-wider",
                  message.role === 'user' ? "text-gray-400" : "text-gray-400"
                )}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-black/5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-6 border-t border-black/5 bg-white">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tanyakan tentang saham (misal: Analisis BBCA)..."
            className="w-full pl-4 pr-14 py-4 bg-gray-50 border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={cn(
              "absolute right-2 p-2.5 rounded-xl transition-all",
              input.trim() && !isLoading 
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            <Send size={18} />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { label: 'Analisis BBCA', icon: <TrendingUp size={12} /> },
            { label: 'Fundamental GOTO', icon: <BarChart2 size={12} /> },
            { label: 'Sentimen TLKM', icon: <Activity size={12} /> },
          ].map((suggestion) => (
            <button
              key={suggestion.label}
              onClick={() => setInput(suggestion.label)}
              className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-black/5 rounded-full text-xs font-medium text-gray-600 flex items-center gap-1.5 transition-colors"
            >
              {suggestion.icon}
              {suggestion.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
