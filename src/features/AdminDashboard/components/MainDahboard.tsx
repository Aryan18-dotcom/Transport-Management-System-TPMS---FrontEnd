import { Truck, Wrench, Wallet, Search, Bell, AlertTriangle, Activity } from "lucide-react";

const MainDashboard = () => {
    return (
        <>
            <header className="sticky top-0 z-30 bg-[#070707]/80 backdrop-blur-md border-b border-neutral-800 px-8 py-5 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-white tracking-tight">Enterprise Overview</h1>
                    <p className="text-zinc-500 text-xs">Managing Logistic Operations & Financials</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                        <input type="text" placeholder="Cmd + K to search truck..." className="bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500/50 w-64 outline-none transition-all" />
                    </div>
                    <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-xl text-zinc-400 cursor-pointer hover:text-white transition-colors relative">
                        <Bell size={18} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-neutral-900" />
                    </div>
                </div>
            </header>

            <div className="p-8 space-y-8 pb-20">
                {/* Top 4 Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Today's Est. Revenue" value="₹74,200" change="+8.2%" icon={<Activity size={20} />} color="indigo" />
                    <StatCard title="Pending Payment" value="₹12,40,000" change="-1.5%" icon={<Wallet size={20} />} color="amber" />

                    {/* Active Trips Card (Modified) */}
                    <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl relative overflow-hidden group">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 font-bold flex items-center gap-2">
                            <Truck size={12} /> Active Trips
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h4 className="text-2xl font-bold text-white">10 <span className="text-zinc-600 font-medium text-sm">/ 15</span></h4>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1 italic">Company Fleet Utilization</p>
                        <div className="absolute right-0 bottom-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Truck size={64} />
                        </div>
                    </div>

                    {/* Ready for Trip Card (New) */}
                    <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl border-l-4 border-l-emerald-500 shadow-lg shadow-emerald-500/5">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 font-bold">Ready for Trip</p>
                        <h4 className="text-3xl font-bold text-emerald-400">5 <span className="text-xs font-normal text-zinc-500 ml-1">Trucks Available</span></h4>
                        <p className="text-[10px] text-zinc-500 mt-1">Excludes maintenance & unloading</p>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-6 items-start">
                    {/* Vehicle Tracking - Focus on Available Trucks (60%) */}
                    <div className="col-span-12 lg:col-span-8 bg-neutral-900/50 border border-neutral-800 rounded-3xl p-6 min-h-[500px]">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-bold">Ready Truck Inventory</h3>
                                <p className="text-xs text-zinc-500">Real-time status of trucks awaiting assignment</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 bg-neutral-800 text-[10px] rounded-lg border border-neutral-700 hover:text-indigo-400 transition-colors">Filters</button>
                                <button className="px-3 py-1.5 bg-indigo-600 text-[10px] rounded-lg font-bold">Assign Trip</button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <ReadyTruckRow id="GJ-01-TA-8890" model="Tata Prima 4025" driver="Deepak Sharma" location="Ahmedabad Hub" lastTrip="2 days ago" />
                            <ReadyTruckRow id="RJ-14-GH-4432" model="Ashok Leyland 3518" driver="Vikram Singh" location="Jaipur Yard" lastTrip="Today" />
                            <ReadyTruckRow id="HR-38-XY-1209" model="BharatBenz 4223R" driver="Rajesh G." location="Gurgaon Depot" lastTrip="1 week ago" />
                            <ReadyTruckRow id="MH-43-BE-7701" model="Mahindra Blazo X" driver="Amit P." location="Vashi" lastTrip="Yesterday" />
                            <ReadyTruckRow id="KA-01-MJ-5500" model="Tata Signa 2823" driver="S. Murthy" location="Bangalore" lastTrip="3 days ago" />
                        </div>
                    </div>

                    {/* Sidebar Column (40%) */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        {/* Comprehensive System Alerts */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
                            <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                                <Bell size={16} className="text-indigo-500" /> Critical Compliance
                            </h4>
                            <div className="space-y-4">
                                <AlertItem type="PUC" vehicle="GJ-01-TA-8890" days={5} />
                                <AlertItem type="License" person="Vikram Singh (Driver)" days={10} />
                                <AlertItem type="Fitness" vehicle="HR-38-XY-1209" days={3} />
                                <AlertItem type="Insurance" vehicle="MH-43-BE-7701" days={12} />
                            </div>
                        </div>

                        {/* Maintenance Ledger Preview */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-sm flex items-center gap-2">
                                    <Wrench size={16} className="text-zinc-500" /> Recent Service
                                </h4>
                                <button className="text-[10px] text-indigo-400 font-bold hover:underline">View Ledger</button>
                            </div>
                            <div className="space-y-4">
                                <ServiceItem vehicle="PB-10-XX-1122" work="Brake Pad Replacement" status="Completed" cost="₹4,200" />
                                <ServiceItem vehicle="DL-01-G-9900" work="Engine Oil Change" status="Scheduled" cost="Est. ₹8,500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MainDashboard

function StatCard({ title, value, change, icon, color }: any) {
  const colorMap: any = { indigo: 'text-indigo-400', amber: 'text-amber-400' };
  return (
    <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl hover:border-neutral-700 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 bg-neutral-800 rounded-xl ${colorMap[color] || 'text-indigo-400'} group-hover:scale-110 transition-transform`}>{icon}</div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>{change}</span>
      </div>
      <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 font-bold">{title}</p>
      <p className="text-2xl font-bold text-white font-mono">{value}</p>
    </div>
  );
}

function ReadyTruckRow({ id, model, driver, location, lastTrip }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-neutral-900/30 border border-neutral-800 rounded-2xl hover:bg-neutral-800/40 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-neutral-800 rounded-xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
          <Truck size={18} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-zinc-100">{id}</h4>
          <p className="text-[10px] text-zinc-500">{model} • <span className="text-zinc-400 italic">Ready</span></p>
        </div>
      </div>
      <div className="text-center px-4">
        <p className="text-xs font-medium text-zinc-300">{driver}</p>
        <p className="text-[10px] text-zinc-500">{location}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-tighter mb-1">Last Trip</p>
        <span className="text-xs text-indigo-400 font-medium">{lastTrip}</span>
      </div>
    </div>
  );
}

function AlertItem({ type, vehicle, person, days }: any) {
  return (
    <div className="flex items-center gap-4 p-3 bg-zinc-950/50 border border-neutral-800 rounded-xl group hover:border-amber-500/30 transition-all">
      <div className={`p-2 rounded-lg ${days <= 5 ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
        <AlertTriangle size={14} />
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold text-zinc-200">{type} Expiry</p>
        <p className="text-[10px] text-zinc-500">{vehicle || person}</p>
      </div>
      <div className="text-right">
        <p className={`text-xs font-bold ${days <= 5 ? 'text-red-500' : 'text-amber-500'}`}>{days} Days</p>
        <p className="text-[9px] text-zinc-600 uppercase">Remains</p>
      </div>
    </div>
  );
}

function ServiceItem({ vehicle, work, status, cost }: any) {
  return (
    <div className="flex items-center justify-between p-3 border-l-2 border-indigo-500 bg-neutral-800/20 rounded-r-xl">
      <div>
        <h5 className="text-xs font-bold text-zinc-200">{vehicle}</h5>
        <p className="text-[10px] text-zinc-500">{work}</p>
      </div>
      <div className="text-right">
        <p className="text-xs font-mono font-bold text-emerald-500">{cost}</p>
        <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest">{status}</p>
      </div>
    </div>
  );
}