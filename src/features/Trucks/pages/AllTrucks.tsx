import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Truck, Gauge, ChevronRight, Filter } from "lucide-react";
import { useTrucks } from "../hooks/TrucksHooks";

export default function AllTrucks() {
  const navigate = useNavigate();
  const { trucks, refreshTrucks, truckLoading } = useTrucks();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    refreshTrucks();
    console.log(trucks);
    
  }, []);

  const filteredTrucks = useMemo(() => {
    return trucks.filter((t) =>
      t.truckNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.model?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [trucks, searchTerm]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Fleet Inventory</h1>
          <p className="text-zinc-500 text-sm">Monitor and manage all registered company vehicles</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500" size={18} />
            <input 
              type="text" 
              placeholder="Search plate number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none w-64 text-white"
            />
          </div>
          <button onClick={() => navigate("/admin-dashboard/truck/add")} className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/20">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTrucks.map((t, idx) => (
            <motion.div
              key={t._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/admin-dashboard/truck/${t._id}`)}
              className="group bg-neutral-900 border border-neutral-800 rounded-[28px] p-6 cursor-pointer hover:border-indigo-500/50 transition-all shadow-xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-neutral-800 group-hover:bg-indigo-600 rounded-2xl flex items-center justify-center text-white transition-colors">
                  <Truck size={24} />
                </div>
              <StatusBadge status={t.status} />
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="text-xl font-bold text-white tracking-tight">{t.truckNumber}</h3>
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{t.truckType}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-neutral-800/50">
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Capacity</p>
                  <p className="text-sm text-zinc-200">{t.capacity} Tons</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Health</p>
                  <p className="text-sm text-emerald-500">Optimal</p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-indigo-400 font-bold text-[10px] uppercase tracking-widest">
                <span>Detailed Stats</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    AVAILABLE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    ON_TRIP: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    MAINTENANCE: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    IDLE: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    IN_PARKING: "bg-red-500/10 text-red-400 border-red-500/20", // Distinct for yard location
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border ${styles[status] || "bg-neutral-500/10 text-neutral-500 border-neutral-800"}`}>
      {status.replace('_', ' ')}
    </span>
  );
}