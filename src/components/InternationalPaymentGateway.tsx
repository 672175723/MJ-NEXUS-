import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  CreditCard, 
  Info, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Zap,
  DollarSign,
  Euro,
  Coins
} from 'lucide-react';

interface FeeBreakdown {
  processing: string;
  international: string;
  conversion: string;
  fixed: string;
  total: string;
}

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', icon: <DollarSign className="w-4 h-4" /> },
  { code: 'EUR', name: 'Euro', symbol: '€', icon: <Euro className="w-4 h-4" /> },
  { code: 'GBP', name: 'British Pound', symbol: '£', icon: <Coins className="w-4 h-4" /> },
  { code: 'XAF', name: 'CFA Franc', symbol: 'FCFA', icon: <Coins className="w-4 h-4" /> },
  { code: 'NGN', name: 'Naira', symbol: '₦', icon: <Coins className="w-4 h-4" /> },
  { code: 'AED', name: 'Dirham', symbol: 'DH', icon: <Coins className="w-4 h-4" /> },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', icon: <DollarSign className="w-4 h-4" /> },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', icon: <DollarSign className="w-4 h-4" /> },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', icon: <Coins className="w-4 h-4" /> },
];

const PAYMENT_METHODS = [
  { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard className="w-5 h-5" />, description: 'Visa, Mastercard, Amex' },
  { id: 'apple_pay', name: 'Apple Pay', icon: <Zap className="w-5 h-5" />, description: 'Fast & Secure with Apple' },
  { id: 'google_pay', name: 'Google Pay', icon: <Zap className="w-5 h-5" />, description: 'Fast & Secure with Google' },
  { id: 'ideal', name: 'iDEAL', icon: <Globe className="w-5 h-5" />, description: 'Dutch Bank Transfer' },
];

interface InternationalPaymentGatewayProps {
  initialCurrency?: { code: string; symbol: string; name: string };
  savedMethods?: any[];
  onSelectSavedMethod?: (method: any) => void;
}

export const InternationalPaymentGateway: React.FC<InternationalPaymentGatewayProps> = ({ 
  initialCurrency, 
  savedMethods = [],
  onSelectSavedMethod 
}) => {
  const [amount, setAmount] = useState<string>('100');
  const [currency, setCurrency] = useState(initialCurrency || CURRENCIES[0]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [fees, setFees] = useState<FeeBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCurrency) {
      setCurrency(initialCurrency);
    }
  }, [initialCurrency]);

  useEffect(() => {
    calculateFees();
  }, [amount, currency]);

  const calculateFees = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setFees(null);
      return;
    }

    const processingFeePercent = 0.029;
    const fixedFee = 0.30;
    const internationalFeePercent = 0.01;
    const conversionFeePercent = 0.01;

    const processing = (val * processingFeePercent).toFixed(2);
    const international = (val * internationalFeePercent).toFixed(2);
    const conversion = (val * conversionFeePercent).toFixed(2);
    const fixed = fixedFee.toFixed(2);
    const total = (parseFloat(processing) + parseFloat(international) + parseFloat(conversion) + parseFloat(fixed)).toFixed(2);

    setFees({
      processing,
      international,
      conversion,
      fixed,
      total
    });
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency: currency.code,
          paymentMethodTypes: [paymentMethod.id === 'card' ? 'card' : paymentMethod.id],
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        window.location.href = data.url;
      } else {
        throw new Error(data.message || 'Failed to create checkout session');
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Globe className="text-emerald-500 w-6 h-6" />
            International Payment Gateway
          </h2>
          <p className="text-zinc-400 text-sm mt-1">Secure multi-currency deposits for MJ WorldBet</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-medium text-emerald-500 uppercase tracking-wider">PCI-DSS Compliant</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Configuration */}
        <div className="space-y-8">
          {/* Amount & Currency */}
          <section>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
              Deposit Amount & Currency
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  {currency.symbol}
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-4 pl-10 pr-4 text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  placeholder="0.00"
                />
              </div>
              <div className="relative w-32">
                <select
                  value={currency.code}
                  onChange={(e) => {
                    const selected = CURRENCIES.find(c => c.code === e.target.value);
                    if (selected) setCurrency(selected);
                  }}
                  className="w-full h-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-white font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
                >
                  {/* Ensure initial currency is in the list if not already */}
                  {!CURRENCIES.find(c => c.code === currency.code) && (
                    <option value={currency.code}>{currency.code}</option>
                  )}
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.code}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>
          </section>

          {/* Saved Methods */}
          {savedMethods.length > 0 && (
            <section>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
                Saved Payment Methods
              </label>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {savedMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => {
                      if (onSelectSavedMethod) onSelectSavedMethod(method);
                      // Also update local state to reflect selection if it matches a type
                      const matchingMethod = PAYMENT_METHODS.find(m => m.id === method.type.toLowerCase());
                      if (matchingMethod) setPaymentMethod(matchingMethod);
                    }}
                    className="flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-emerald-500 transition-all min-w-[100px]"
                  >
                    <div className={`p-2 rounded-lg bg-${method.color}-500/10 text-${method.color}-500`}>
                      <method.icon size={18} />
                    </div>
                    <div className="text-[10px] font-bold text-white truncate w-full text-center">{method.label}</div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Payment Method */}
          <section>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
              Select Payment Method
            </label>
            <div className="grid grid-cols-1 gap-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    paymentMethod.id === method.id
                      ? 'bg-emerald-500/10 border-emerald-500 text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${paymentMethod.id === method.id ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                      {method.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-sm">{method.name}</div>
                      <div className="text-xs opacity-60">{method.description}</div>
                    </div>
                  </div>
                  {paymentMethod.id === method.id && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Summary & Fees */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Info className="w-5 h-5 text-zinc-400" />
            Transaction Summary
          </h3>

          <div className="space-y-4 flex-1">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Deposit Amount</span>
              <span className="text-white font-medium">{currency.symbol}{parseFloat(amount || '0').toFixed(2)}</span>
            </div>

            <div className="pt-4 border-t border-zinc-800 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500 flex items-center gap-1">
                  Stripe Processing Fee (2.9% + {currency.symbol}0.30)
                </span>
                <span className="text-zinc-300">+{currency.symbol}{fees?.processing}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">International Transaction Fee (1%)</span>
                <span className="text-zinc-300">+{currency.symbol}{fees?.international}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Currency Conversion Fee (1%)</span>
                <span className="text-zinc-300">+{currency.symbol}{fees?.conversion}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 font-bold">Total Service Fees</span>
                <span className="text-emerald-500 font-bold">{currency.symbol}{fees?.total}</span>
              </div>
              <p className="text-[10px] text-zinc-600 mt-2 italic">
                * Fees are calculated based on international banking standards and Stripe's cross-border pricing.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Total to be Charged</div>
                  <div className="text-3xl font-black text-white">
                    {currency.symbol}{(parseFloat(amount || '0') + parseFloat(fees?.total || '0')).toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Settlement</div>
                  <div className="text-sm font-bold text-emerald-500">Instant</div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handlePayment}
              disabled={isLoading || !amount || parseFloat(amount) <= 0}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                isLoading || !amount || parseFloat(amount) <= 0
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  : 'bg-emerald-500 text-black hover:bg-emerald-400 active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Proceed to Payment
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
            
            <div className="flex items-center justify-center gap-4 opacity-40 grayscale">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" referrerPolicy="no-referrer" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" referrerPolicy="no-referrer" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
