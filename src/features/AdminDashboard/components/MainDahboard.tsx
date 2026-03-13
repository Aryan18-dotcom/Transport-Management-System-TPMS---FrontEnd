import React, { useEffect, useMemo } from 'react';
import {
  Truck, Bell, Activity, TrendingUp,
  FileWarning, Gauge, ShieldCheck,
  AlertCircle, ClipboardList, BarChart3, ArrowRight
} from "lucide-react";
import { useAdmin } from '../hooks/adminHook';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';

const MainDashboard = () => {
  const { fetchMetrics, metrics, adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchMetrics();
  }, []);

  const coreData = useMemo(() => {
    if (!metrics || !metrics.metrics) return null;

    const company = metrics.company;
    const stats = metrics.metrics;
    const financials = stats.financials;

    const toLakhs = (val: number) => (val / 100000).toFixed(2);
    const toK = (val: number) => (val / 1000).toFixed(1) + "k";

    const allIndividualAlerts = stats.compliance.flatMap((vehicle: any) =>
      vehicle.alerts.map((alert: any) => ({
        truck: vehicle.truck,
        type: alert.type,
        date: alert.date,
        vehicleId: vehicle.truckId
      }))
    );

    // 🔥 Calculate Total Fleet for Percentages
    const fleetBreakdown = stats.fleet?.breakdown || {};
    const totalFleetCount = Object.values(fleetBreakdown).reduce((a: any, b: any) => a + b, 0) as number;

    return {
      companyName: company?.companyName || "Operational Hub",
      gst: company?.gstNumber || "N/A",
      revenueL: toLakhs(financials?.grossRevenue || 0),
      holdL: toLakhs(financials?.moneyOnHold || 0),
      monthlyRevK: toK(financials?.monthlyRevenue || 0),
      monthlyProfitK: toK(financials?.monthlyProfit || 0),
      todayVolume: (financials?.todayFreight || 0).toLocaleString('en-IN'),
      fleet: fleetBreakdown,
      totalFleetCount,
      recent: stats.recentActivity || [],
      allAlerts: allIndividualAlerts,
      growth: stats.growthChart || []
    };
  }, [metrics]);

  if (adminLoading || !coreData) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center space-y-4 px-2 sm:px-4 md:px-8">
        <Activity className="text-indigo-500 animate-pulse" size={48} />
        <p className="text-indigo-500 font-black tracking-[0.3em] uppercase text-xs sm:text-sm md:text-base">
          Syncing {user?.companyId?.companyName || "Company"} ERP Systems...
        </p>
      </div>
    );
  }

  const limitedAlerts = coreData.allAlerts.slice(0, 5);
  const limitedRecent = coreData.recent.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-400 p-2 sm:p-4 md:p-8 space-y-8 pb-24 font-sans selection:bg-indigo-500/30">

      {/* 1. EXECUTIVE HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-neutral-900/40 p-6 rounded-[32px] border border-white/5 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <TrendingUp size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
              {coreData.companyName}
            </h1>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              GST: {coreData.gst} • <span className="text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> ONLINE</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block border-r border-neutral-800 pr-6">
            <p className="text-[10px] font-black text-zinc-600 uppercase">Today's Freight</p>
            <p className="text-xl font-black text-white tracking-tighter">₹{coreData.todayVolume}</p>
          </div>
          <button className="p-3 bg-neutral-950 border border-neutral-800 rounded-2xl text-zinc-400 hover:text-indigo-500 transition-all relative">
            <Bell size={20} />
            <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-neutral-950" />
          </button>
        </div>
      </header>

      {/* 2. MONTHLY P&L SNAPSHOT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PLCard title="Monthly Revenue" value={`₹${coreData.monthlyRevK}`} icon={<TrendingUp size={18} />} color="indigo" sub="Performance" />
        <PLCard title="Est. Monthly Profit" value={`₹${coreData.monthlyProfitK}`} icon={<Activity size={18} />} color="emerald" sub="Earnings" />
        <PLCard title="Balance Hold" value={`₹${coreData.holdL}L`} icon={<AlertCircle size={18} />} color="red" sub="Risk Management" />
      </div>

      {/* 2.5 FLEET READINESS CONTROL - NEW SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-neutral-900 border border-neutral-800 rounded-[40px] p-8 flex flex-col justify-center items-center text-center shadow-xl">
          <Gauge className="text-indigo-500 mb-2" size={32} />
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Fleet Assets</p>
          <h3 className="text-4xl font-black text-white italic tracking-tighter">
            {coreData.totalFleetCount}
          </h3>
        </div>

        <div className="lg:col-span-3 bg-neutral-900 border border-neutral-800 rounded-[40px] p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Truck size={18} className="text-indigo-500" /> Operational Distribution
            </h3>
            <div className="flex gap-4">
              <StatusIndicator label="Available" count={coreData.fleet.AVAILABLE || 0} color="bg-emerald-500" />
              <StatusIndicator label="In Transit" count={coreData.fleet.IN_TRANSIT || 0} color="bg-indigo-500" />
              <StatusIndicator label="Maintenance" count={coreData.fleet.MAINTENANCE || 0} color="bg-amber-500" />
              <StatusIndicator label="On Trip" count={coreData.fleet.ON_TRIP || 0} color="bg-green-500" />
            </div>
          </div>

          <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden flex border border-white/5">
            <FleetBar count={coreData.fleet.AVAILABLE || 0} total={coreData.totalFleetCount} color="bg-emerald-500" />
            <FleetBar count={coreData.fleet.IN_TRANSIT || 0} total={coreData.totalFleetCount} color="bg-indigo-500" />
            <FleetBar count={coreData.fleet.MAINTENANCE || 0} total={coreData.totalFleetCount} color="bg-amber-500" />
          </div>

          <div className="grid grid-cols-3 mt-6 pt-6 border-t border-neutral-800/50">
            <div className="text-center">
              <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Ready</p>
              <p className="text-lg font-black text-white">
                {coreData.totalFleetCount > 0 ? ((coreData.fleet.AVAILABLE / coreData.totalFleetCount) * 100).toFixed(0) : 0}%
              </p>
            </div>
            <div className="text-center border-x border-neutral-800/50">
              <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Active</p>
              <p className="text-lg font-black text-white">
                {coreData.totalFleetCount > 0 ? ((coreData.fleet.IN_TRANSIT / coreData.totalFleetCount) * 100).toFixed(0) : 0}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Down</p>
              <p className="text-lg font-black text-white">
                {coreData.totalFleetCount > 0
                  ? (((coreData.fleet.MAINTENANCE || 0) / coreData.totalFleetCount) * 100).toFixed(0)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. YEARLY GROWTH TREND GRAPH */}
      <div className="lg:col-span-12 bg-neutral-900 border border-neutral-800 rounded-[48px] p-10 shadow-2xl relative overflow-hidden group">
        {/* ... (Graph logic remains the same) ... */}
        <div className="flex items-center justify-between mb-10 relative z-10">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
            <BarChart3 size={20} className="text-indigo-500" /> Revenue Growth Cycle
          </h3>
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/5">FY 2025-26</span>
        </div>

        <div className="h-64 w-full bg-black/20 rounded-[32px] border border-white/5 flex items-end p-8 gap-4 relative z-10">
          {(() => {
            const maxRev = Math.max(...(coreData.growth.map((d: any) => d.revenue) || []), 1000);
            return Array.from({ length: 12 }).map((_, i) => {
              const monthData = coreData.growth.find((d: any) => d._id === i + 1);
              const height = monthData ? (monthData.revenue / maxRev) * 90 + 5 : 2;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar h-full justify-end">
                  <div className="relative w-full flex items-end justify-center h-full">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ type: "spring", stiffness: 100, damping: 15, delay: i * 0.05 }}
                      className="w-full max-w-[45px] bg-indigo-500/20 group-hover/bar:bg-indigo-500/60 rounded-t-2xl transition-all relative"
                    >
                      {monthData && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all shadow-xl whitespace-nowrap z-20 pointer-events-none">
                          ₹{(monthData.revenue / 1000).toFixed(1)}k
                        </div>
                      )}
                    </motion.div>
                  </div>
                  <span className="text-[9px] font-black text-zinc-700 uppercase tracking-tighter">
                    {new Date(0, i).toLocaleString('en', { month: 'short' })}
                  </span>
                </div>
              )
            });
          })()}
        </div>
      </div>

      {/* 4. FLEET LOG & COMPLIANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ... (Movement log and Alert mapping remains the same) ... */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Fleet Movement Log</h3>
            <button onClick={() => navigate('/admin-dashboard/trips')} className="flex items-center gap-2 text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:underline group">
              View All <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="space-y-3">
            {limitedRecent.map((trip: any) => (
              <MovementRow key={trip._id} truck={trip.truckId?.truckNumber} tripId={trip._id} party={trip.partnerCompanyId?.partyName} origin={trip.origin} destination={trip.destination} status={trip.status} balance={trip.toalBalanceAmount} navigate={navigate} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-[40px] p-8 shadow-2xl flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <FileWarning size={18} className="text-amber-500" /> Compliance Criticals
            </h3>
          </div>
          <div className="space-y-4 flex-1">
            {limitedAlerts.map((alert: any, idx: number) => (
              <AlertItem key={idx} type={alert.type} target={alert.truck} date={alert.date} elementId={alert.vehicleId} navigate={navigate} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUBSIDIARY UI COMPONENTS ---

function PLCard({ title, value, icon, color, sub }: any) {
  const colorMap: any = {
    indigo: 'from-indigo-500/20 text-indigo-400 border-indigo-400/20',
    emerald: 'from-emerald-500/20 text-emerald-400 border-emerald-400/20',
    red: 'from-red-500/20 text-red-400 border-red-500/20',
  };
  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} bg-neutral-900 border p-8 rounded-[40px] shadow-xl hover:scale-[1.02] transition-all cursor-default`}>
      <div className="flex items-center gap-3 mb-4 opacity-70">
        {icon} <span className="text-[10px] font-black uppercase tracking-widest">{sub}</span>
      </div>
      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-4xl font-black text-white tracking-tighter">{value}</h4>
    </div>
  );
}

function MovementRow({ truck, tripId, party, origin, destination, status, balance, navigate }: any) {
  return (
    <button
      onClick={() => navigate(`/admin-dashboard/trips/${tripId}`)}
      className="w-full text-left group flex flex-col sm:flex-row items-center justify-between p-5 bg-neutral-900 border border-neutral-800 rounded-[28px] hover:border-indigo-500/30 transition-all gap-4"
    >
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center text-indigo-500 border border-white/5 group-hover:scale-110 transition-transform shadow-lg">
          <Truck size={22} />
        </div>
        <div>
          <h4 className="text-sm font-black text-white uppercase tracking-tighter leading-none mb-1.5">{truck || 'N/A'}</h4>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{party || 'Unknown Party'}</p>
        </div>
      </div>
      <div className="flex items-center gap-6 px-6 border-x border-neutral-800/50 hidden lg:flex">
        <div className="text-center">
          <p className="text-[8px] font-black text-zinc-600 uppercase mb-1 tracking-widest">Route</p>
          <p className="text-[11px] font-black text-zinc-300 uppercase tracking-tight">{origin} ➔ {destination}</p>
        </div>
      </div>
      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
        <div className="text-right">
          <p className="text-[8px] font-black text-zinc-600 uppercase mb-1 tracking-widest">Pending</p>
          <p className={`text-xs font-mono font-bold ${balance > 0 ? 'text-red-500' : 'text-emerald-500'}`}>₹{(balance || 0).toLocaleString()}</p>
        </div>
        <div className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-tighter
          ${status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse'}`}>
          {status}
        </div>
      </div>
    </button>
  );
}

function AlertItem({ type, target, date, elementId, navigate }: any) {
  const daysLeft = Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  const isUrgent = daysLeft <= 5;
  return (
    <button
      onClick={() => navigate(`/admin-dashboard/truck/edit/${elementId}`)}
      className={`w-full text-left flex items-center justify-between p-5 bg-black/40 border border-white/5 rounded-[24px] group transition-all hover:bg-black/60 ${isUrgent ? 'border-l-4 border-l-red-500' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isUrgent ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'} border border-white/5 shadow-inner`}>
          <ClipboardList size={18} />
        </div>
        <div>
          <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{type} EXPIRED</p>
          <p className="text-[11px] font-black text-zinc-500 uppercase">{target}</p>
        </div>
      </div>
      <div className="text-right leading-none">
        <p className={`text-lg font-black tracking-tighter ${isUrgent ? 'text-red-500 animate-pulse' : 'text-amber-500'}`}>{daysLeft}D</p>
        <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Left</p>
      </div>
    </button>
  );
}

function StatusIndicator({ label, count, color }: any) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-tighter">{label}: {count}</span>
    </div>
  );
}

function FleetBar({ count, total, color }: any) {
  const width = total > 0 ? (count / total) * 100 : 0;
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${width}%` }}
      transition={{ duration: 1, ease: "circOut" }}
      className={`h-full ${color} border-r border-black/20`}
    />
  );
}

export default MainDashboard;