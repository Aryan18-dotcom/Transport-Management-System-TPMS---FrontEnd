import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Edit3, Search, Truck } from "lucide-react";
import { useTrucks } from "../../Trucks/hooks/TrucksHooks";

export default function ManageAllTrucks() {
  const navigate = useNavigate();
  const { trucks, refreshTrucks } = useTrucks();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    refreshTrucks();
  }, []);

  const filteredTrucks = trucks.filter(t => 
    t.truckNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Manage Fleet</h1>
          <p className="text-zinc-500 text-sm">Update specifications and driver assignments</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input 
            type="text" 
            placeholder="Search Plate..." 
            className="bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-indigo-500 outline-none w-64"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrucks.map((truck) => (
          <motion.div 
            key={truck._id}
            whileHover={{ y: -4 }}
            className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 relative group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-neutral-800 rounded-2xl text-indigo-400">
                <Truck size={24} />
              </div>
              <button 
                onClick={() => navigate(`/admin-dashboard/truck/edit/${truck._id}`)}
                className="p-2 bg-indigo-600/10 text-indigo-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
              >
                <Edit3 size={16} />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-white mb-1">{truck.truckNumber}</h3>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">{truck.truckType}</p>
            
            <div className="flex items-center gap-2 text-[10px] font-bold py-2 px-3 bg-neutral-950 rounded-lg border border-neutral-800 w-fit">
              <div className={`w-1.5 h-1.5 rounded-full ${truck.assignedDriver ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="text-zinc-400">
                {truck.assignedDriver ? "Driver Assigned" : "No Driver"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}