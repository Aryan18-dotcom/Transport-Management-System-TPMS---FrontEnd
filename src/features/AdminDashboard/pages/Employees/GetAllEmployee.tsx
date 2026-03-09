import { useEffect, useState, useMemo } from "react"; // Added useState and useMemo
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, ChevronRight, Search, Plus, UserX } from "lucide-react";
import { useAdmin } from "../../hooks/adminHook";

export default function ManageEmployee() {
  const navigate = useNavigate();
  const { employees, refreshEmployees, adminLoading } = useAdmin();
  
  // 1. New state for the search input
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    refreshEmployees();
  }, []);

  // 2. Logic: Filter employees based on search term
  // We use useMemo so this calculation only runs when employees or searchTerm changes
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      const search = searchTerm.toLowerCase();
      
      return (
        fullName.includes(search) || 
        emp.username.toLowerCase().includes(search) ||
        emp.email.toLowerCase().includes(search)
      );
    });
  }, [employees, searchTerm]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Fleet Personnel</h1>
          <p className="text-zinc-500 text-sm">Manage access and profiles for all operational staff</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email, or ID..." 
              value={searchTerm} // 3. Bind value
              onChange={(e) => setSearchTerm(e.target.value)} // 4. Update state
              className="bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none w-64 transition-all text-white"
            />
          </div>
          <button 
            onClick={() => navigate("/admin-dashboard/employees/add")}
            className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Employee Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredEmployees.map((emp, index) => (
            <motion.div
              key={emp._id}
              layout // 5. Smooth transition when items move
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={() => navigate(`/admin-dashboard/employees/edit/${emp._id}`)}
              className="group relative bg-neutral-900 border border-neutral-800 rounded-[24px] p-6 cursor-pointer hover:border-indigo-500/50 hover:bg-neutral-800/50 transition-all shadow-xl"
            >
              {/* Status Dot */}
              <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${emp.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-red-600'}`} />
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-neutral-800 group-hover:bg-indigo-600 rounded-2xl flex items-center justify-center text-xl font-bold text-white transition-colors duration-300">
                  {emp.firstName[0]}{emp.lastName[0]}
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {emp.firstName} {emp.lastName}
                  </h3>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{emp.username}</p>
                </div>

                <div className="pt-2 w-full">
                  <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase">
                    <span>View Profile</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 6. Improved Empty State */}
      {filteredEmployees.length === 0 && !adminLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-neutral-900/30 rounded-[32px] border border-dashed border-neutral-800 flex flex-col items-center gap-4"
        >
          <UserX size={48} className="text-neutral-700" />
          <div className="space-y-1">
            <p className="text-zinc-200 font-bold">No results found</p>
            <p className="text-zinc-500 text-sm">We couldn't find any employees matching "{searchTerm}"</p>
          </div>
          <button 
            onClick={() => setSearchTerm("")}
            className="text-indigo-400 text-sm font-bold hover:underline"
          >
            Clear search
          </button>
        </motion.div>
      )}
    </div>
  );
}