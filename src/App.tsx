import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { PricingModal } from './components/PricingModal';
import { Message, chatWithGoletiStream } from './services/gemini';
import { auth, db, loginWithGoogle, logout, getUserProfile, createUserProfile, incrementAnalysisCount, updateUserPlan, UserProfile, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { onSnapshot, doc } from 'firebase/firestore';

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-dark-bg text-white p-6 text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Something went wrong</h2>
          <p className="text-text-secondary mb-6 max-w-md">
            The application encountered an unexpected error. This might be due to a connection issue or a temporary service disruption.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary-green text-dark-bg font-bold rounded-xl"
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [history, setHistory] = useState<{ id: string; title: string }[]>([
    { id: '1', title: 'NVIDIA Growth Analysis' },
    { id: '2', title: 'Apple vs Microsoft' },
    { id: '3', title: 'Tesla Risk Profile' },
  ]);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>('1');

  // Auth Listener
  useEffect(() => {
    let profileUnsubscribe: (() => void) | null = null;
    console.log("Setting up auth listener...");

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser ? `User logged in: ${firebaseUser.email}` : "User logged out");
      setUser(firebaseUser);
      
      // Cleanup previous snapshot listener if any
      if (profileUnsubscribe) {
        profileUnsubscribe();
        profileUnsubscribe = null;
      }

      if (firebaseUser) {
        try {
          console.log("Fetching profile for:", firebaseUser.uid);
          // Get or create profile
          let userProfile = await getUserProfile(firebaseUser.uid);
          if (!userProfile) {
            console.log("Profile not found, creating new profile...");
            userProfile = await createUserProfile(firebaseUser);
          }
          console.log("Profile loaded:", userProfile?.plan);
          setProfile(userProfile);

          // Listen for profile changes (real-time plan updates)
          profileUnsubscribe = onSnapshot(
            doc(db, 'users', firebaseUser.uid), 
            (snapshot) => {
              if (snapshot.exists()) {
                setProfile(snapshot.data() as UserProfile);
              }
            },
            (error) => {
              handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
            }
          );
        } catch (error) {
          console.error("Error loading user profile:", error);
          // Even if profile fails, we should let the user in (they might just be stuck on 'free')
        }
      } else {
        setProfile(null);
      }
      setIsAuthLoading(false);
    });

    return () => {
      unsubscribe();
      if (profileUnsubscribe) profileUnsubscribe();
    };
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    // Check Plan Limits
    if (!user) {
      alert("Please login to use Goleti.");
      return;
    }

    if (profile) {
      const today = new Date().toISOString().split('T')[0];
      const isNewDay = profile.lastAnalysisDate !== today;
      const currentCount = isNewDay ? 0 : profile.analysisCount;

      if (profile.plan === 'free' && currentCount >= 3) {
        alert("Free plan limit reached (3 analyses/day). Upgrade to Standard or Pro for more!");
        return;
      }
      if (profile.plan === 'standard' && currentCount >= 20) {
        alert("Standard plan limit reached (20 analyses/day). Upgrade to Pro for unlimited!");
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Create a placeholder for the AI message
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'model',
      content: '',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, aiMessage]);

    try {
      let fullContent = '';
      const stream = chatWithGoletiStream([...messages, userMessage]);
      
      for await (const chunk of stream) {
        fullContent += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId ? { ...msg, content: fullContent } : msg
        ));
      }
      
      // Increment analysis count in Firestore
      if (user && profile) {
        const today = new Date().toISOString().split('T')[0];
        const isNewDay = profile.lastAnalysisDate !== today;
        await incrementAnalysisCount(user.uid, isNewDay ? 0 : profile.analysisCount);
      }

      // Update history if it's a new chat
      if (messages.length === 0) {
        const newHistoryItem = {
          id: Date.now().toString(),
          title: content.length > 30 ? content.substring(0, 30) + '...' : content
        };
        setHistory(prev => [newHistoryItem, ...prev]);
        setCurrentChatId(newHistoryItem.id);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, content: "## Error\nI encountered an issue connecting to my financial data streams. Please check your API configuration and try again." } 
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  }, [messages, user, profile]);

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(undefined);
  };

  const handleSelectChat = (id: string) => {
    setCurrentChatId(id);
    // In a real app, we would load messages for this chat ID
    // For this demo, we'll just clear or show a sample
    setMessages([]);
  };

  const handleDeleteChat = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    if (currentChatId === id) {
      handleNewChat();
    }
  };

  const handleShareChat = (id: string) => {
    const chat = history.find(item => item.id === id);
    if (chat) {
      // In a real app, this would generate a shareable link
      const shareUrl = `${window.location.origin}/share/${id}`;
      navigator.clipboard.writeText(shareUrl);
      alert(`Share link for "${chat.title}" copied to clipboard!`);
    }
  };

  const handleUpgrade = async (plan: 'standard' | 'pro') => {
    if (!user) return;
    try {
      await updateUserPlan(user.uid, plan);
      setIsPricingOpen(false);
      alert(`Successfully upgraded to ${plan.toUpperCase()} Plan!`);
    } catch (error) {
      console.error("Upgrade Error:", error);
      alert("Failed to upgrade. Please try again.");
    }
  };

  const handleLogin = async () => {
    console.log("Login button clicked");
    try {
      await loginWithGoogle();
      console.log("Login successful");
    } catch (error: any) {
      console.error("Login Error:", error);
      if (error.code === 'auth/popup-blocked') {
        alert("Login popup was blocked by your browser. Please allow popups for this site.");
      } else if (error.code === 'auth/cancelled-popup-request') {
        // User closed the popup, no need to alert
      } else {
        alert(`Failed to login with Google: ${error.message}`);
      }
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen overflow-hidden bg-[#050505] text-white">
        <Sidebar 
          onNewChat={handleNewChat} 
          history={history} 
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          onShareChat={handleShareChat}
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          user={user}
          profile={profile}
          onLogin={handleLogin}
          onLogout={logout}
          onOpenPricing={() => setIsPricingOpen(true)}
        />
        <main className="flex-1 relative">
          {isAuthLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
            </div>
          ) : (
            <ChatArea 
              messages={messages} 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading} 
              user={user}
              onLogin={loginWithGoogle}
            />
          )}
        </main>

        <PricingModal 
          isOpen={isPricingOpen} 
          onClose={() => setIsPricingOpen(false)} 
          currentPlan={profile?.plan}
          onUpgrade={handleUpgrade}
        />
      </div>
    </ErrorBoundary>
  );
}
