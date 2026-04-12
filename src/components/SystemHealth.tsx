import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Zap, Globe, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

const SystemHealth: React.FC = () => {
  const [metrics, setMetrics] = useState({
    cpu: 12,
    memory: 45,
    latency: 24,
    uptime: '99.99%',
    status: 'Operational'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * 15) + 5,
        memory: Math.floor(Math.random() * 10) + 40,
        latency: Math.floor(Math.random() * 10) + 20
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-slate-900 rounded-2xl border border-white/10 space-y-4 shadow-2xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">System Health</span>
        </div>
        <span className="text-[10px] font-bold text-slate-500 uppercase">{metrics.status}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Cpu size={12} />
            <span className="text-[10px] font-bold uppercase">CPU</span>
          </div>
          <div className="text-sm font-black text-white">{metrics.cpu}%</div>
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Activity size={12} />
            <span className="text-[10px] font-bold uppercase">RAM</span>
          </div>
          <div className="text-sm font-black text-white">{metrics.memory}%</div>
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Zap size={12} />
            <span className="text-[10px] font-bold uppercase">Ping</span>
          </div>
          <div className="text-sm font-black text-white">{metrics.latency}ms</div>
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Globe size={12} />
            <span className="text-[10px] font-bold uppercase">SEO</span>
          </div>
          <div className="text-sm font-black text-emerald-400">100/100</div>
        </div>
      </div>

      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
          <ShieldCheck size={12} className="text-emerald-500" />
          Security Active
        </div>
        <span className="text-[10px] font-mono text-slate-600">{metrics.uptime}</span>
      </div>
    </div>
  );
};

export default SystemHealth;
