import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileUser, Search, Edit3,
  CheckCircle2, Clock, UserMinus
} from "lucide-react";
import { useDrivers } from "../hooks/DriversHook";
import { toast } from "react-hot-toast";

export default function PersonnelFiles() {
  const navigate = useNavigate();
  const { drivers, driverLoading, refreshDrivers, handleUpdateDriver } = useDrivers();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    refreshDrivers();
  }, []);

  const filteredDrivers = drivers.filter(d => 
    `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.licenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to update status directly from the card
  const toggleStatus = async (driverId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "AVAILABLE" ? "OFF_DUTY" : "AVAILABLE";
    const tid = toast.loading(`Updating status to ${nextStatus}...`);
    
    // We send a FormData since your hook/backend expects Multipart for updates
    const formData = new FormData();
    formData.append("status", nextStatus);

    const res = await handleUpdateDriver(driverId, formData);
    if (res.success) {
      toast.success(`Driver is now ${nextStatus}`, { id: tid });
    } else {
      toast.error("Failed to update status", { id: tid });
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <FileUser className="text-indigo-500" size={32} /> Personnel Files
          </h1>
          <p className="text-zinc-500 font-medium text-sm mt-1">
            Review compliance, update status, and modify driver records.
          </p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or license..." 
            className="bg-neutral-900 border border-neutral-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:border-indigo-500 outline-none w-full md:w-80 transition-all shadow-xl"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Management Grid */}
      {driverLoading && drivers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Accessing Registry...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredDrivers.map((driver) => (
              <motion.div
                key={driver._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-neutral-900 border border-neutral-800 rounded-[36px] p-8 space-y-6 relative group overflow-hidden"
              >
                {/* Status Indicator Bar */}
                <div className={`absolute top-0 left-0 w-full h-1 ${
                  driver.status === 'AVAILABLE' ? 'bg-emerald-500' : 
                  driver.status === 'ON_TRIP' ? 'bg-blue-500' : 'bg-red-500'
                }`} />

                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {driver.firstName} {driver.lastName}
                    </h3>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                      UID: {driver._id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate(`/admin-dashboard/driver/edit/${driver._id}`)}
                    className="p-3 bg-neutral-800 text-zinc-400 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-lg"
                  >
                    <Edit3 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-neutral-950 rounded-2xl border border-neutral-800">
                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">License</p>
                    <p className="text-xs text-white font-bold truncate">{driver.licenceNumber}</p>
                  </div>
                  <div className="p-3 bg-neutral-950 rounded-2xl border border-neutral-800">
                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Contact</p>
                    <p className="text-xs text-white font-bold">{driver.phoneNum}</p>
                  </div>
                </div>

                <div className="space-y-3">
                   <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-1">Quick Actions</p>
                   <div className="flex gap-2">
                      <button 
                        disabled={driver.status === 'ON_TRIP'}
                        onClick={() => toggleStatus(driver._id, driver.status)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[11px] font-black tracking-widest transition-all border ${
                          driver.status === 'AVAILABLE' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-white' 
                          : 'bg-neutral-800 text-zinc-400 border-neutral-700 hover:text-white'
                        }`}
                      >
                        {driver.status === 'AVAILABLE' ? <CheckCircle2 size={14}/> : <Clock size={14}/>}
                        {driver.status === 'AVAILABLE' ? 'GO OFF-DUTY' : 'GO AVAILABLE'}
                      </button>
                      
                   </div>
                </div>

                {driver.status === 'ON_TRIP' && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Locked: Currently on Trip</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}