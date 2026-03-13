import { Truck, Users, MapPin, AlertCircle, Clock, Loader2, ShieldCheck, LucideTruckElectric } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const DashboardContent = () => {
  // 🔥 Accessing live metrics from the EmployeeDashboard context
  const { metrics, opsLoading }: any = useOutletContext();

  const stats = metrics?.quickStats || { activeTrucks: 0, availableDrivers: 0, todayTrips: 0, pendingMaintenance: 0 };
  const liveTrips = metrics?.liveMonitor || [];
  const compliance = metrics?.compliance || [];

  if (opsLoading && !metrics) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-2 sm:gap-4 text-neutral-500 px-2 sm:px-4">
        <Loader2 className="animate-spin text-indigo-500 w-8 h-8 sm:w-10 sm:h-10" />
        <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em]">Synchronizing OPS Command...</p>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-6 md:p-10 text-neutral-100 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 sm:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <h1 className="text-xl sm:text-3xl font-black uppercase tracking-tighter text-white leading-none">Operations Command</h1>
            <p className="text-neutral-500 text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mt-2 border-l-2 border-indigo-500 pl-2 sm:pl-3">
              Fleet & Workforce Management System
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[8px] sm:text-[10px] font-black text-neutral-600 uppercase tracking-widest">System Status</p>
            <p className="text-[8px] sm:text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">● Online</p>
          </div>
        </header>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-10">
          <StatCard icon={<Truck className="text-indigo-500" />} label="Active Trucks" value={stats.activeTrucks} sub="Fleet in Motion" />
          <StatCard icon={<Users className="text-emerald-500" />} label="Available Units" value={stats.availableDrivers} sub="Ready for Dispatch" />
          <StatCard icon={<MapPin className="text-amber-500" />} label="Today's Freight" value={stats.todayTrips} sub="Confirmed Movements" />
          <StatCard icon={<Clock className="text-rose-500" />} label="Maintenance" value={stats.pendingMaintenance} sub="Service Required" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">

          {/* Main Activity: Live Trip Monitor */}
          <div className="lg:col-span-2 bg-[#111111] border border-neutral-800 rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-8 relative z-10 gap-2">
              <div>
                <h3 className="font-black uppercase text-xs tracking-[0.2em] text-white">Live Trip Monitor</h3>
                <p className="text-[8px] sm:text-[9px] text-neutral-500 uppercase font-bold mt-1">Real-time log of today's movements</p>
              </div>
              <span className="text-[8px] sm:text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 sm:px-3 py-1 rounded-full font-black uppercase tracking-tighter">Live Trace</span>
            </div>

            <div className="space-y-2 sm:space-y-3 relative z-10">
              {liveTrips.length > 0 ? liveTrips.map((trip: any, i: number) => (
                <div key={trip._id} className="bg-[#0d0d0f] border border-neutral-800 p-2 sm:p-5 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-center justify-between group hover:border-indigo-500/40 transition-all cursor-default gap-2 sm:gap-5">
                  <div className="flex items-center gap-2 sm:gap-5">
                    <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center font-black text-[10px] text-indigo-500 group-hover:bg-indigo-500/10 transition-colors">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-tight">{trip.truckId?.truckNumber || "N/A"}</p>
                      <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5 italic">
                        {trip.driverId?.firstName} {trip.driverId?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-neutral-300 uppercase truncate max-w-[150px] mb-1">{trip.partnerCompanyId?.partyName}</p>
                    <span className="text-[8px] font-black uppercase text-emerald-500 tracking-[0.2em] bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">In Transit</span>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center opacity-30">
                  <MapPin size={40} className="mx-auto mb-4 text-neutral-700" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">No trip activity recorded today</p>
                </div>
              )}
            </div>

            {/* Background Accent */}
            <div className="absolute -bottom-10 -right-10 opacity-[0.02] pointer-events-none">
              <LucideTruckElectric size={200} />
            </div>
          </div>

          {/* Compliance Sidebar */}
          <div className="bg-[#111111] border border-neutral-800 rounded-[32px] p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black uppercase text-sm tracking-[0.1em] text-white flex items-center gap-3">
                <AlertCircle size={20} className="text-rose-500 animate-pulse" />
                Document Compliance
              </h3>
              {compliance.length > 0 && (
                <span className="bg-rose-500/10 text-rose-500 text-[10px] font-black px-3 py-1 rounded-full border border-rose-500/20">
                  {compliance.length} ISSUES
                </span>
              )}
            </div>

            <div className="space-y-5">
              {compliance.length > 0 ? compliance.slice(0, 6).map((item: any) => (
                <div
                  key={item.truckId}
                  className="p-5 bg-[#0d0d0f] border-l-4 border-rose-500 rounded-r-2xl shadow-lg hover:bg-neutral-900 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-base font-black text-white uppercase tracking-tight">
                      {item.truck}
                    </p>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-rose-500 uppercase">Urgent</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {item.alerts.map((a: any, idx: number) => {
                      const daysLeft = Math.ceil((new Date(a.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      return (
                        <div key={idx} className="flex items-center justify-between bg-rose-500/5 p-2 rounded-lg border border-rose-500/10">
                          <span className="text-xs font-bold text-neutral-300 uppercase tracking-wide">
                            {a.type}
                          </span>
                          <span className="text-[11px] font-black text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                            {daysLeft <= 0 ? "EXPIRED" : `${daysLeft} Days Left`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )) : (
                <div className="space-y-6 text-center py-24 bg-[#0d0d0f] rounded-[24px] border border-dashed border-neutral-800">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                    <ShieldCheck size={32} className="text-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-black text-white uppercase tracking-widest">System Clear</p>
                    <p className="text-xs font-medium text-neutral-500 leading-relaxed px-8">
                      All fleet documents are currently synchronized and compliant.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub }: any) => (
  <div className="bg-[#111111] border border-neutral-800 p-7 rounded-[32px] shadow-xl hover:border-indigo-500/30 transition-all group relative overflow-hidden">
    <div className="flex justify-between items-start mb-6 relative z-10">
      <div className="p-3.5 bg-neutral-900 rounded-2xl border border-neutral-800 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all">
        {icon}
      </div>
    </div>
    <div className="relative z-10">
      <p className="text-[9px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-4xl font-black text-white tracking-tighter tabular-nums">{value}</h4>
        <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">{sub}</span>
      </div>
    </div>
  </div>
);

export default DashboardContent;