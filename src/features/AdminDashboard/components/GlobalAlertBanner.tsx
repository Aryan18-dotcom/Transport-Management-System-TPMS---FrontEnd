import React, { useState, useMemo } from "react";
import { AlertTriangle, X, ArrowRight, ShieldAlert, CalendarClock, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface GlobalAlertBannerProps {
  alerts: any[]; // The array passed from DashboardContent
}

function GlobalAlertBanner({ alerts }: GlobalAlertBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // 🔥 Fix 1: Use the 'alerts' prop directly for the count
  const count = alerts?.length || 0;

  // 🔥 Fix 2: If no alerts exist, don't render the banner
  if (count === 0) return null;

  return (
    <>
      {/* 1. SLEEK MINI BANNER (Sticky Top) */}
      <div className="sticky top-0 z-[100] bg-[#020202] border-b border-amber-500/20 px-4 lg:px-12 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-6 h-6 bg-amber-500/10 rounded-full">
            <AlertTriangle size={14} className="text-amber-500 animate-pulse" />
          </div>
          <p className="text-[10px] text-amber-200 font-black uppercase tracking-[0.2em]">
            System Alert: <span className="text-white">{count} Urgent Compliance</span> items pending review
          </p>
        </div>
        
        <button 
          onClick={() => setIsOpen(true)}
          className="text-[10px] font-black text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-[0.2em] flex items-center gap-2 group"
        >
          Review Now <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 2. FULL SCREEN REPORT OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#020202] overflow-y-auto font-sans p-6 lg:p-12"
          >
            <div className="max-w-7xl mx-auto">
              {/* Header area - Highly formal layout */}
              <div className="flex items-start justify-between mb-16">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500">
                    <ShieldAlert size={12} />
                    <span className="text-[8px] font-black uppercase tracking-widest text-amber-200">Critical Audit</span>
                  </div>
                  <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Registry Discrepancies</h2>
                  <p className="text-zinc-600 text-xs font-bold uppercase tracking-[0.3em]">Fleet Paperwork Synchronization Required</p>
                </div>
                
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-zinc-500 hover:text-white transition-all hover:rotate-90 shadow-xl"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Reports Grid - Mapping correctly from props */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {alerts.map((alert: any, idx: number) => {
                  // 🔥 Fix 3: Ensure status logic matches your 15-day requirement
                  const isExpired = alert.status === 'EXPIRED';
                  
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => {
                        setIsOpen(false);
                        navigate(`/admin-dashboard/truck/edit/${alert.vehicleId}`);
                      }}
                      className="group cursor-pointer bg-neutral-900/40 border border-neutral-800 p-6 rounded-[32px] hover:border-amber-500/40 transition-all flex flex-col gap-8 shadow-sm relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isExpired ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                          <CalendarClock size={20} />
                        </div>
                        <div className="text-right">
                           <p className={`text-2xl font-black tracking-tighter ${isExpired ? 'text-red-500' : 'text-amber-500'}`}>
                             {isExpired ? `-${alert.daysLeft}` : alert.daysLeft}d
                           </p>
                           <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest">Time Rem.</p>
                        </div>
                      </div>

                      <div className="relative z-10">
                        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1 truncate">{alert.truck}</h4>
                        <div className="flex items-center gap-2">
                           <div className={`w-1 h-1 rounded-full ${isExpired ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
                           <span className={`text-[9px] uppercase font-black tracking-widest ${isExpired ? 'text-red-500' : 'text-amber-500'}`}>
                             {alert.type} • {isExpired ? 'Expired' : 'Update Due'}
                           </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                        <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest italic">{new Date(alert.date).toLocaleDateString()}</span>
                        <div className="p-2 rounded-lg bg-neutral-950 group-hover:bg-amber-500 group-hover:text-black transition-all">
                           <ArrowRight size={12} />
                        </div>
                      </div>
                      
                      {/* Subtle background watermark */}
                      <div className="absolute -bottom-4 -right-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                         <ShieldAlert size={120} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Formal Exit Area */}
              <div className="mt-32 text-center border-t border-neutral-900 pt-16 flex flex-col items-center gap-6">
                 <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.5em]">AK Roadways Registry Auditor v1.0</p>
                 <button 
                  onClick={() => setIsOpen(false)}
                  className="px-16 py-5 bg-neutral-900 border border-neutral-800 text-zinc-400 hover:text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] hover:border-amber-500/40 transition-all shadow-2xl"
                 >
                   Back to Operations
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default GlobalAlertBanner;