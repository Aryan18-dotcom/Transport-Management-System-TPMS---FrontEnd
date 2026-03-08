import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Search, UserPlus, Phone, CreditCard, 
  MapPin, ChevronRight, Filter, MoreHorizontal 
} from "lucide-react";
import { useDrivers } from "../hooks/DriversHook";

export default function DriversDirectory() {
  const navigate = useNavigate();
  const { drivers, driverLoading, refreshDrivers } = useDrivers();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    refreshDrivers();
  }, []);

  const filteredDrivers = drivers.filter(d => 
    `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.licenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Users className="text-indigo-500" size={32} /> Driver Directory
          </h1>
          <p className="text-zinc-500 font-medium text-sm mt-1">
            Managing {drivers.length} active personnel in your workforce.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or license..." 
              className="bg-neutral-900 border border-neutral-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:border-indigo-500 outline-none w-full md:w-80 transition-all shadow-xl"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => navigate("/admin-dashboard/driver/add")}
            className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
          >
            <UserPlus size={20} />
          </button>
        </div>
      </div>

      {/* Stats Quick Look */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Staff" value={drivers.length} color="text-indigo-500" />
        <StatCard label="Available" value={drivers.filter(d => d.status === 'AVAILABLE').length} color="text-emerald-500" />
        <StatCard label="On Trip" value={drivers.filter(d => d.status === 'ON_TRIP').length} color="text-blue-500" />
        <StatCard label="Off Duty" value={drivers.filter(d => d.status === 'OFF_DUTY').length} color="text-zinc-500" />
      </div>

      {/* Main Grid */}
      {driverLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Syncing Personnel Data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredDrivers.map((driver, index) => (
              <DriverCard 
                key={driver._id} 
                driver={driver} 
                index={index} 
                onClick={() => navigate(`/admin-dashboard/driver/details/${driver._id}`)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// Helper Components
function StatCard({ label, value, color }: any) {
  return (
    <div className="bg-neutral-900/50 border border-neutral-800 p-5 rounded-[24px]">
      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  )
}

function DriverCard({ driver, index, onClick }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 hover:border-indigo-500/50 transition-all cursor-pointer group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-indigo-600/10 transition-colors" />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="w-14 h-14 bg-neutral-800 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
          <Users size={28} />
        </div>
        <div className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest border ${
          driver.status === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
          driver.status === 'ON_TRIP' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
          'bg-neutral-800 text-zinc-500 border-neutral-700'
        }`}>
          {driver.status}
        </div>
      </div>

      <div className="mt-6 space-y-1 relative z-10">
        <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
          {driver.firstName} {driver.lastName}
        </h3>
        <div className="flex items-center gap-2 text-zinc-500">
          <Phone size={12} />
          <span className="text-xs font-medium">{driver.phoneNum}</span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-800 grid grid-cols-2 gap-4 relative z-10">
        <div>
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">License No.</p>
          <p className="text-xs font-bold text-zinc-300 mt-1 truncate">{driver.licenceNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Blood Group</p>
          <p className="text-xs font-bold text-zinc-300 mt-1">{driver.bloodGroup || 'N/A'}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between relative z-10">
         <span className="text-[10px] font-bold text-indigo-500/80 uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
            View Full Profile <ChevronRight size={12} />
         </span>
      </div>
    </motion.div>
  );
}