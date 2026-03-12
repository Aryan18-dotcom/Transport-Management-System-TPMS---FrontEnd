import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, Mail, Phone, Calendar, BadgeCheck, ArrowUpRightIcon, ArrowUpRight } from "lucide-react";
import { useAdmin } from "../hooks/adminHook";

export default function EmployeeProfile() {
  const { employeeId } = useParams();
  const navigate = useNavigate();

  // Custom hook containing our global admin state and API handlers
  const { employees, refreshEmployees } = useAdmin();

  const [targetEmployee, setTargetEmployee] = useState<any>(null);

  // Initial Data Fetch
  useEffect(() => {
    if (employees.length === 0) {
      refreshEmployees();
    }
  }, []);

  // Filter for specific employee from global state
  useEffect(() => {
    const found = employees.find((emp) => emp._id === employeeId);
    if (found) {
      setTargetEmployee(found);
    }
  }, [employees, employeeId]);

  if (!targetEmployee) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full shadow-lg shadow-indigo-500/20" />
      <p className="text-zinc-500 text-sm font-medium animate-pulse">Syncing Personnel Data...</p>
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* 1. Header & Quick Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold uppercase text-[10px] tracking-[0.2em]">Fleet Directory</span>
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* 2. Left Column: Personal Profile */}
        <div className="md:col-span-7 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl overflow-hidden relative"
          >
            {/* Background Branding */}
            <div className="absolute -top-10 -right-10 opacity-[0.03] text-white pointer-events-none">
              <Shield size={240} />
            </div>

            <div className="flex items-center gap-6 mb-10 relative z-10">
              <div className="w-24 h-24 bg-indigo-600 rounded-[28px] flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-indigo-600/20">
                {targetEmployee.firstName[0]}{targetEmployee.lastName[0]}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  {targetEmployee.firstName} {targetEmployee.lastName}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-indigo-400 font-mono text-xs tracking-widest uppercase">
                    {targetEmployee.username}
                  </p>
                  <BadgeCheck size={14} className="text-indigo-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-6 py-10 border-t border-neutral-800 relative z-10">
              <InfoItem icon={<Mail size={16} />} label="Work Email" value={targetEmployee.email} />
              <InfoItem icon={<Phone size={16} />} label="Contact Number" value={targetEmployee.phoneNo} />
              <InfoItem icon={<Shield size={16} />} label="Operational Role" value="Field Staff" />
              <InfoItem icon={<Calendar size={16} />} label="Onboarded" value="March 2024" />
            </div>
          </motion.div>
        </div>

        {/* 3. Right Column: Account Control */}
        <div className="md:col-span-5 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-8 rounded-[32px] border h-full flex flex-col justify-between transition-all duration-500 ${targetEmployee.isActive
                ? 'bg-emerald-500/5 border-emerald-500/20 shadow-emerald-500/5 shadow-2xl'
                : 'bg-red-500/5 border-red-500/20 shadow-red-500/5 shadow-2xl'
              }`}
          >
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white text-lg tracking-tight">Security Access</h3>
                <div className={`w-3 h-3 rounded-full ${targetEmployee.isActive ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-red-500'}`} />
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                Deactivating this user will revoke all active session tokens immediately. They will be unable to access trip logs or vehicle data until re-authorized.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "rgb(79, 70, 229)" }} // Indigo-600
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/admin-dashboard/employees/edit/${employeeId}`)}
              className="group flex items-center justify-center gap-2 px-6 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-zinc-200 text-sm font-bold cursor-pointer transition-all shadow-lg hover:shadow-indigo-500/20 hover:text-white"
            >
              Manage Employee
              <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight size={16} className="text-zinc-500 group-hover:text-white" />
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="space-y-1 group">
      <div className="flex items-center gap-2 text-zinc-500 group-hover:text-zinc-300 transition-colors">
        {icon} <span className="text-[10px] uppercase font-bold tracking-[0.15em]">{label}</span>
      </div>
      <p className="text-white font-medium text-sm break-all">{value}</p>
    </div>
  );
}