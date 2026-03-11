import React from 'react';
import { Plus, MessageSquare, Bookmark, Settings, LogOut, TrendingUp, Trash2, Share2, User as UserIcon, ShieldCheck, Zap, Crown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { User } from 'firebase/auth';
import { UserProfile } from '../firebase';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  onNewChat: () => void;
  history: { id: string; title: string }[];
  currentChatId?: string;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onShareChat: (id: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
  user: User | null;
  profile: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  onNewChat, 
  history, 
  currentChatId, 
  onSelectChat,
  onDeleteChat,
  onShareChat,
  isCollapsed,
  onToggle,
  user,
  profile,
  onLogin,
  onLogout,
}) => {
  return (
    <div className={cn(
      "bg-dark-bg border-r border-border-color h-screen flex flex-col transition-all duration-300 ease-in-out relative",
      isCollapsed ? "w-20" : "w-72"
    )}>
      <div className={cn("p-6 flex items-center gap-3", isCollapsed && "justify-center px-4")}>
        <div className="w-10 h-10 bg-white rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg overflow-hidden border border-border-color">
          <img 
            src="/logo.png" 
            alt="Goleti Logo" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/initials/svg?seed=Goleti&backgroundColor=059669";
            }}
          />
        </div>
        {!isCollapsed && <h1 className="text-2xl font-bold tracking-tight text-text-primary">Goleti</h1>}
      </div>

      <div className={cn("px-4 mb-6", isCollapsed && "px-2")}>
        <button
          onClick={onNewChat}
          className={cn(
            "flex items-center justify-center gap-2 bg-secondary-bg hover:bg-border-color border border-border-color text-text-primary font-medium transition-all active:scale-95",
            isCollapsed ? "w-12 h-12 mx-auto rounded-xl" : "w-full py-3 rounded-xl"
          )}
          title={isCollapsed ? "New Analysis" : undefined}
        >
          <Plus size={18} />
          {!isCollapsed && <span>New Analysis</span>}
        </button>
      </div>

      <div className={cn("flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar", isCollapsed && "px-2")}>
        {!isCollapsed && <div className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-2 px-2">Recent History</div>}
        {history.map((item) => (
          <div key={item.id} className="group relative">
            <button
              onClick={() => onSelectChat(item.id)}
              title={isCollapsed ? item.title : undefined}
              className={cn(
                "flex items-center transition-colors text-left w-full",
                isCollapsed ? "w-12 h-12 mx-auto justify-center rounded-xl" : "gap-3 px-3 py-3 rounded-xl text-sm pr-20",
                currentChatId === item.id ? "bg-secondary-bg text-primary-green" : "text-text-secondary hover:bg-secondary-bg/50 hover:text-text-primary"
              )}
            >
              <MessageSquare size={16} className={cn("flex-shrink-0", currentChatId === item.id ? "text-primary-green" : "text-text-secondary group-hover:text-text-primary")} />
              {!isCollapsed && <span className="truncate">{item.title}</span>}
            </button>
            
            {!isCollapsed && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); onShareChat(item.id); }}
                  className="p-1.5 text-text-secondary hover:text-primary-green transition-colors"
                  title="Share Analysis"
                >
                  <Share2 size={14} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteChat(item.id); }}
                  className="p-1.5 text-text-secondary hover:text-red-500 transition-colors"
                  title="Delete Analysis"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={cn("p-4 border-t border-border-color space-y-1", isCollapsed && "p-2")}>
        <button 
          title={isCollapsed ? "Saved Analyses" : undefined}
          className={cn(
            "flex items-center transition-colors",
            isCollapsed ? "w-12 h-12 mx-auto justify-center rounded-xl" : "w-full gap-3 px-3 py-3 rounded-xl text-sm text-text-secondary hover:bg-secondary-bg/50 hover:text-text-primary"
          )}
        >
          <Bookmark size={18} className="flex-shrink-0" />
          {!isCollapsed && <span>Saved Analyses</span>}
        </button>
        
        <div className={cn("pt-4 mt-4 border-t border-border-color", isCollapsed ? "flex justify-center" : "px-3")}>
          {user ? (
            <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
              {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full flex-shrink-0" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-green/20 flex-shrink-0 flex items-center justify-center text-primary-green font-bold text-xs uppercase">
                  {user.email?.substring(0, 2)}
                </div>
              )}
              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-primary truncate">{user.displayName || user.email}</div>
                    <div className="text-[10px] font-bold uppercase text-text-secondary">
                      Member
                    </div>
                  </div>
                  <button onClick={onLogout} className="text-text-secondary hover:text-red-500 transition-colors" title="Logout">
                    <LogOut size={16} />
                  </button>
                </>
              )}
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className={cn(
                "flex items-center justify-center gap-2 bg-primary-green hover:bg-emerald-600 text-dark-bg font-bold transition-all active:scale-95",
                isCollapsed ? "w-10 h-10 rounded-full" : "w-full py-2.5 rounded-xl text-sm"
              )}
            >
              <UserIcon size={16} />
              {!isCollapsed && <span>Login</span>}
            </button>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-secondary-bg border border-border-color rounded-full flex items-center justify-center text-text-secondary hover:text-primary-green transition-all z-20 shadow-md"
      >
        <div className={cn("transition-transform duration-300", isCollapsed ? "rotate-180" : "rotate-0")}>
          <ChevronLeft size={14} />
        </div>
      </button>
    </div>
  );
};

const ChevronLeft = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m15 18-6-6 6-6"/>
  </svg>
);
