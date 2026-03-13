import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Trash2, Power, ArrowLeft, Mail, Phone, Calendar, BadgeCheck } from "lucide-react";
import { useAdmin } from "../hooks/adminHook";
import DeleteConfirmModal from "./DeleteConfirmModel";

export default function EditEmployee() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  
  // Custom hook containing our global admin state and API handlers
  const { employees, refreshEmployees, toggleEmployeeStatus, handleDeleteEmployee, adminLoading } = useAdmin();
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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

  const handleStatusChange = async () => {
    if (!targetEmployee) return;
    await toggleEmployeeStatus(employeeId!, targetEmployee.isActive);
  };

  const onConfirmDelete = async () => {
    const res = await handleDeleteEmployee(employeeId!);
    if (res.success) {
      setIsDeleteModalOpen(false);
      navigate("/admin-dashboard/employees/edit");
    }
  };

  if (!targetEmployee) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-2 sm:space-y-4 px-2 sm:px-4">
      <div className="animate-spin h-8 w-8 sm:h-10 sm:w-10 border-4 border-indigo-500 border-t-transparent rounded-full shadow-lg shadow-indigo-500/20" />
      <p className="text-zinc-500 text-xs sm:text-sm font-medium animate-pulse">Syncing Personnel Data...</p>
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
        
        <button 
          onClick={() => setIsDeleteModalOpen(true)}
          className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-lg hover:shadow-red-600/20"
          title="Delete Employee"
        >
          <Trash2 size={20} />
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
              <InfoItem icon={<Mail size={16}/>} label="Work Email" value={targetEmployee.email} />
              <InfoItem icon={<Phone size={16}/>} label="Contact Number" value={targetEmployee.phoneNo} />
              <InfoItem icon={<Shield size={16}/>} label="Operational Role" value="Field Staff" />
              <InfoItem icon={<Calendar size={16}/>} label="Onboarded" value="March 2024" />
            </div>
          </motion.div>
        </div>

        {/* 3. Right Column: Account Control */}
        <div className="md:col-span-5 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-8 rounded-[32px] border h-full flex flex-col justify-between transition-all duration-500 ${
              targetEmployee.isActive 
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

            <button 
              onClick={handleStatusChange}
              disabled={adminLoading}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                targetEmployee.isActive 
                ? 'bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white' 
                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-500/20'
              }`}
            >
              <Power size={20} />
              {targetEmployee.isActive ? "Deactivate User" : "Activate User"}
            </button>
          </motion.div>
        </div>
      </div>

      {/* 4. The Critical Action Modal */}
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={onConfirmDelete}
        loading={adminLoading}
        title={`${targetEmployee.firstName} ${targetEmployee.lastName}`}
      />
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