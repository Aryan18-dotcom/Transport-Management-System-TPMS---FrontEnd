import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, ChevronRight, Search, Plus, UserX } from "lucide-react";
import { useAdmin } from "../../hooks/adminHook";

export default function ManageEmployee() {
  const navigate = useNavigate();
  const { employees, refreshEmployees, adminLoading } = useAdmin();

  // 1. Add state for the search query
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    refreshEmployees();
  }, []);

  // 2. Memoize the filtered employees to optimize performance
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const searchStr = searchQuery.toLowerCase();
      return (
        emp.firstName.toLowerCase().includes(searchStr) ||
        emp.lastName.toLowerCase().includes(searchStr) ||
        emp.username.toLowerCase().includes(searchStr) ||
        emp.email.toLowerCase().includes(searchStr) ||
        emp.phoneNo.includes(searchStr)
      );
    });
  }, [employees, searchQuery]);

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
              placeholder="Search by name, email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
      {/* 3. Wrap with AnimatePresence for smooth entry/exit during filtering */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredEmployees.map((emp, index) => (
            <motion.div
              key={emp._id}
              layout // Smoothly animate cards changing positions
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              onClick={() => navigate(`/admin-dashboard/employees/edit/${emp._id}`)}
              className="group relative bg-neutral-900 border border-neutral-800 rounded-[24px] p-6 cursor-pointer hover:border-indigo-500/50 hover:bg-neutral-800/50 transition-all shadow-xl hover:shadow-indigo-500/10"
            >
              {/* Status Dot */}
              <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${emp.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`} />
              
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

                <div className="w-full space-y-2 pt-2 border-t border-neutral-800/50">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Mail size={12} className="text-indigo-500" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Phone size={12} className="text-indigo-500" />
                    <span>{emp.phoneNo}</span>
                  </div>
                </div>

                <div className="pt-2 w-full">
                  <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase">
                    <span>Manage Profile</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 4. Empty Search State */}
      {filteredEmployees.length === 0 && !adminLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-neutral-900/30 rounded-[32px] border border-dashed border-neutral-800 flex flex-col items-center gap-4"
        >
          <UserX size={48} className="text-zinc-600" />
          <div>
            <p className="text-zinc-200 font-bold text-lg">No personnel found</p>
            <p className="text-zinc-500">We couldn't find any results matching "{searchQuery}"</p>
          </div>
          <button 
            onClick={() => setSearchQuery("")}
            className="text-indigo-500 text-sm font-bold hover:underline"
          >
            Clear search
          </button>
        </motion.div>
      )}
    </div>
  );
}