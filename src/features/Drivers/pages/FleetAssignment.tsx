import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Key, Search, Truck, User, 
  ChevronRight, CheckCircle2, XCircle, 
  RotateCcw
} from "lucide-react";
import { useDrivers } from "../hooks/DriversHook";

export default function FleetAssignment() {
  const navigate = useNavigate();
  const { drivers, driverLoading, refreshDrivers } = useDrivers();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    refreshDrivers(); // Ensure your backend .populate('assignedTruck') here
  }, []);

  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    // Match schema field: assignedTruck
    if (filter === "ASSIGNED") return matchesSearch && d.assignedTruck;
    if (filter === "UNASSIGNED") return matchesSearch && !d.assignedTruck;
    return matchesSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header with Search and Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Key className="text-indigo-500" size={32} /> Fleet Assignments
          </h1>
          <p className="text-zinc-500 font-medium text-sm mt-1">
            Populating real-time handover data from the registry.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Search driver..." 
              className="bg-neutral-900 border border-neutral-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:border-indigo-500 outline-none w-full md:w-64 transition-all shadow-xl"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex bg-neutral-900 p-1 rounded-2xl border border-neutral-800">
            {["ALL", "ASSIGNED", "UNASSIGNED"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                  filter === f ? "bg-indigo-600 text-white shadow-lg" : "text-zinc-500 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button 
            onClick={() => refreshDrivers()} 
            className="p-3 bg-neutral-900 border border-neutral-800 text-zinc-400 rounded-2xl hover:text-white transition-all"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Grid Rendering */}
      {driverLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Syncing Fleet Status...</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredDrivers.map((driver) => (
              <AssignmentCard 
                key={driver._id} 
                driver={driver} 
                onClick={() => navigate(`/admin-dashboard/driver/manage-assignment/${driver._id}`)} 
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

function AssignmentCard({ driver, onClick }: any) {
  // Use 'assignedTruck' to match your Mongoose Schema populate logic
  const truck = driver.assignedTruck; 

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="bg-neutral-900 border border-neutral-800 rounded-[36px] p-6 cursor-pointer group hover:border-indigo-500/50 transition-all relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] rounded-full -mr-16 -mt-16 transition-colors ${
        truck ? "bg-emerald-500/10" : "bg-red-500/10"
      }`} />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
              <User size={24} />
           </div>
           <div>
              <h3 className="text-base font-bold text-white leading-tight">
                {driver.firstName} {driver.lastName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${driver.status === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`} />
                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">{driver.status}</p>
              </div>
           </div>
        </div>
        <div className={`p-2.5 rounded-xl border ${
          truck 
          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
          : 'bg-red-500/10 text-red-500 border-red-500/20'
        }`}>
           {truck ? <CheckCircle2 size={18}/> : <XCircle size={18}/>}
        </div>
      </div>

      {/* Assignment Display Slot - Pulling data from populated object */}
      <div className={`p-6 rounded-[28px] border-2 border-dashed transition-all relative z-10 ${
          truck 
          ? 'bg-neutral-950/50 border-indigo-500/30' 
          : 'bg-neutral-950 border-neutral-800'
      }`}>
        <div className="flex items-center gap-4">
           <div className={`p-3 rounded-2xl ${truck ? "bg-indigo-600/20 text-indigo-400" : "bg-neutral-900 text-zinc-700"}`}>
              <Truck size={24} />
           </div>
           {truck ? (
             <div className="space-y-0.5">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Active Fleet</p>
                <p className="text-lg font-black text-white tracking-tighter uppercase">{truck.truckNumber}</p>
                <p className="text-[10px] text-zinc-500 font-bold uppercase">{truck.truckType}</p>
             </div>
           ) : (
             <div className="space-y-0.5">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Status</p>
                <p className="text-sm font-bold text-zinc-500 italic">No Fleet Assigned</p>
             </div>
           )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between relative z-10">
         <div className="flex flex-col">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Handover Action</span>
            <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
               {truck ? "Modify Assignment" : "Initialize Link"}
            </span>
         </div>
         <div className="w-10 h-10 bg-neutral-950 border border-neutral-800 rounded-full flex items-center justify-center text-zinc-500 group-hover:text-indigo-400 group-hover:border-indigo-500/50 transition-all">
            <ChevronRight size={18} />
         </div>
      </div>
    </motion.div>
  );
}