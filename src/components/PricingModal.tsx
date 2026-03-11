import React from 'react';
import { Check, X, Zap, Crown, ShieldCheck } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
  onUpgrade: (plan: 'standard' | 'pro') => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, currentPlan, onUpgrade }) => {
  if (!isOpen) return null;

  const plans = [
    {
      name: 'Free',
      id: 'free',
      price: '$0',
      description: 'Perfect for casual investors',
      features: [
        '3 analyses per day',
        'Fundamental analysis',
        'Technical indicators',
        'Community support'
      ],
      notIncluded: [
        'News sentiment analysis',
        'Unlimited analyses',
        'Priority data streams',
        'Advanced risk modeling'
      ],
      icon: <Zap size={24} className="text-text-secondary" />,
      buttonText: 'Current Plan',
      buttonClass: 'bg-secondary-bg text-text-secondary cursor-default'
    },
    {
      name: 'Standard',
      id: 'standard',
      price: '$19',
      description: 'For active traders',
      features: [
        '20 analyses per day',
        'Fundamental analysis',
        'Technical indicators',
        'News sentiment analysis',
        'Priority data streams'
      ],
      notIncluded: [
        'Unlimited analyses',
        'Advanced risk modeling',
        'Personal portfolio advisor'
      ],
      icon: <Zap size={24} className="text-blue-400" />,
      buttonText: 'Upgrade to Standard',
      buttonClass: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20'
    },
    {
      name: 'Pro',
      id: 'pro',
      price: '$49',
      description: 'Institutional grade tools',
      features: [
        'Unlimited analyses',
        'Fundamental analysis',
        'Technical indicators',
        'News sentiment analysis',
        'Advanced risk modeling',
        'Priority data streams',
        'Personal portfolio advisor'
      ],
      notIncluded: [],
      icon: <Crown size={24} className="text-amber-400" />,
      buttonText: 'Upgrade to Pro',
      buttonClass: 'bg-amber-500 hover:bg-amber-600 text-dark-bg font-bold shadow-lg shadow-amber-500/20'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-dark-bg border border-border-color w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-border-color flex justify-between items-center bg-secondary-bg/30">
          <div>
            <h2 className="text-3xl font-bold text-text-primary mb-1">Choose Your Plan</h2>
            <p className="text-text-secondary">Scale your investment intelligence with Goleti Pro.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-border-color rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={cn(
                "relative p-8 rounded-3xl border transition-all duration-300 flex flex-col",
                currentPlan === plan.id 
                  ? "bg-emerald-500/5 border-emerald-500/50 ring-1 ring-emerald-500/20" 
                  : "bg-secondary-bg/20 border-border-color hover:border-text-secondary/30"
              )}
            >
              {currentPlan === plan.id && (
                <div className="absolute top-4 right-4 bg-emerald-500 text-dark-bg text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  Current
                </div>
              )}
              
              <div className="mb-6">
                <div className="w-12 h-12 bg-dark-bg border border-border-color rounded-2xl flex items-center justify-center mb-4">
                  {plan.icon}
                </div>
                <h3 className="text-xl font-bold text-text-primary">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-bold text-text-primary">{plan.price}</span>
                  <span className="text-text-secondary text-sm">/month</span>
                </div>
                <p className="text-text-secondary text-sm mt-2">{plan.description}</p>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm">
                    <Check size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-text-primary">{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm opacity-40">
                    <X size={16} className="text-text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-text-secondary">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                disabled={currentPlan === plan.id}
                onClick={() => plan.id !== 'free' && onUpgrade(plan.id as any)}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold transition-all active:scale-95",
                  plan.buttonClass
                )}
              >
                {currentPlan === plan.id ? 'Current Plan' : plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="p-6 bg-secondary-bg/30 border-t border-border-color flex items-center justify-center gap-8">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Secure payment via Stripe</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>24/7 Priority Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};
