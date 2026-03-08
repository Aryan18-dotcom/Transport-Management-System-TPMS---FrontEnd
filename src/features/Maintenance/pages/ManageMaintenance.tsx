import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Wrench, IndianRupee, MapPin, ExternalLink, AlertCircle, CreditCard, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMaintenance } from '../hooks/useMaintenance';

const ManageMaintenance = () => {
    const navigate = useNavigate();
    const { records, maintLoading, refreshAnalytics, handleQuickPaymentUpdate } = useMaintenance();
    
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory] = useState("ALL");

    useEffect(() => {
        refreshAnalytics();
    }, []);

    const filteredRecords = useMemo(() => {
        return records.filter(r => {
            const matchesSearch = 
                r.vehicleId?.truckNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.workshopName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = activeCategory === "ALL" || r.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [records, searchTerm, activeCategory]);

    return (
        <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-8 min-h-screen bg-[#020202]">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Maintenance Manager</h1>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Registry Control & Payment Reconciliation</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search Truck..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white outline-none focus:border-indigo-500 w-64"
                        />
                    </div>
                    <button onClick={() => navigate('/admin-dashboard/truck/maintenance/add')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Plus size={16} /> New Entry
                    </button>
                </div>
            </div>

            {/* Records Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filteredRecords.map((record) => (
                        <MaintenanceManageCard 
                            key={record._id} 
                            record={record} 
                            onQuickPay={handleQuickPaymentUpdate}
                            onEdit={() => navigate(`/admin-dashboard/truck/maintenance/manage/${record._id}`)} // Fixed navigation path
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

const MaintenanceManageCard = ({ record, onEdit }: any) => {
    const paymentStyles: any = {
        PAID: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        PARTIAL: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        PENDING: "bg-red-500/10 text-red-400 border-red-500/20",
    };

    return (
        <motion.div 
            layout
            className="group bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 space-y-5 transition-all hover:border-indigo-500/30 shadow-xl"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 cursor-pointer" onClick={onEdit}>
                    <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-500">
                        <Wrench size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors">
                            {record.vehicleId?.truckNumber}
                        </h3>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{record.category}</p>
                    </div>
                </div>
                {/* Quick Payment Toggle */}
                <div className="flex flex-col gap-2">
                   <button 
                    className={`px-3 py-1.5 rounded-xl text-[8px] font-black border transition-all flex items-center gap-2 ${paymentStyles[record.paymentStatus]}`}
                   >
                    {record.paymentStatus === 'PAID' ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                    {record.paymentStatus}
                   </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2 border-y border-neutral-800/50">
                <div className="space-y-1">
                    <span className="text-[8px] font-black text-zinc-600 uppercase">Workshop</span>
                    <p className="text-xs font-bold text-zinc-200 truncate">{record.workshopName}</p>
                </div>
                <div className="space-y-1 text-right">
                    <span className="text-[8px] font-black text-zinc-600 uppercase">Grand Total</span>
                    <p className="text-xs font-black text-white">₹{record.grandTotal?.toLocaleString('en-IN')}</p>
                </div>
            </div>

            <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                    <div className="text-[10px] font-bold text-zinc-500 flex items-center gap-1">
                        <MapPin size={12}/> {record.workshopLocation || 'N/A'}
                    </div>
                </div>
                <button 
                    onClick={onEdit}
                    className="flex items-center gap-1 text-[9px] font-black text-indigo-400 hover:text-white uppercase tracking-widest"
                >
                    Edit Details <ExternalLink size={12} />
                </button>
            </div>
        </motion.div>
    );
};

export default ManageMaintenance;