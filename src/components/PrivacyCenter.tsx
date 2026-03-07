import React, { useState } from 'react';
import { Shield, Lock, Eye, Trash2, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const PrivacyCenter: React.FC = () => {
  const [settings, setSettings] = useState({
    tracking: true,
    personalizedAds: false,
    dataSharing: true,
    twoFactor: false
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
          <Shield size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black italic uppercase text-slate-900 tracking-tight">Privacy & Security Center</h2>
          <p className="text-sm text-slate-500">Manage your data and security preferences in the MJ NEXUS ecosystem.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Preferences */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Eye size={18} className="text-blue-500" />
            Data Preferences
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <div className="text-sm font-bold text-slate-800">Usage Tracking</div>
                <div className="text-[10px] text-slate-500">Help us improve by sharing anonymous usage data.</div>
              </div>
              <button 
                onClick={() => toggleSetting('tracking')}
                className={`w-10 h-5 rounded-full transition-all relative ${settings.tracking ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.tracking ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <div className="text-sm font-bold text-slate-800">Personalized Ads</div>
                <div className="text-[10px] text-slate-500">Show offers based on your interests.</div>
              </div>
              <button 
                onClick={() => toggleSetting('personalizedAds')}
                className={`w-10 h-5 rounded-full transition-all relative ${settings.personalizedAds ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.personalizedAds ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Lock size={18} className="text-amber-500" />
            Security Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <div className="text-sm font-bold text-slate-800">Two-Factor Auth</div>
                <div className="text-[10px] text-slate-500">Add an extra layer of security.</div>
              </div>
              <button 
                onClick={() => toggleSetting('twoFactor')}
                className={`w-10 h-5 rounded-full transition-all relative ${settings.twoFactor ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.twoFactor ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
              <RefreshCw size={14} /> Update Security Key
            </button>
          </div>
        </div>
      </div>

      {/* Data Actions */}
      <div className="bg-rose-50 border border-rose-100 p-8 rounded-[2.5rem] space-y-6">
        <div className="flex items-center gap-3 text-rose-600">
          <AlertCircle size={24} />
          <h3 className="text-lg font-black italic uppercase tracking-tight">Advanced Data Actions</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="p-4 bg-white rounded-2xl border border-rose-100 flex items-center gap-3 hover:bg-rose-100 transition-all group">
            <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center group-hover:bg-white transition-all">
              <Download size={20} />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-slate-900">Export My Data</div>
              <div className="text-[10px] text-slate-500">Download a copy of your MJ NEXUS data.</div>
            </div>
          </button>

          <button className="p-4 bg-white rounded-2xl border border-rose-100 flex items-center gap-3 hover:bg-rose-600 hover:text-white transition-all group">
            <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center group-hover:bg-white transition-all">
              <Trash2 size={20} />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold group-hover:text-white transition-all">Delete Account</div>
              <div className="text-[10px] group-hover:text-white/70 transition-all">Permanently remove all your data.</div>
            </div>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <CheckCircle size={12} className="text-emerald-500" />
        GDPR & CCPA Compliant Infrastructure
      </div>
    </div>
  );
};

const RefreshCw = ({ size, className }: any) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);
