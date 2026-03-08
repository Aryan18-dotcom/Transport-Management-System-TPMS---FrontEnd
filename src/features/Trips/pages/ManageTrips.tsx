import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, LucideTruckElectric, TrendingUp, AlertCircle,
    Clock, ChevronRight, CheckCircle2, Wallet, AlertTriangle,
    Info, X
} from 'lucide-react';

// Hooks
import { useTrips } from '../hooks/useTrips';
import { toast } from 'react-hot-toast';

const ManageTrips = () => {
    const navigate = useNavigate();
    const { trips, tripsLoading, refreshTrips, handleUpdateStatus, handleUpdatePayment } = useTrips();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // --- State for Confirmation Logic ---
    const [confirmAction, setConfirmAction] = useState<{ 
        show: boolean, 
        tripId: string, 
        lr: string, 
        newStatus: string,
        type: 'SHIPMENT' | 'PAYMENT'
    }>({
        show: false,
        tripId: '',
        lr: '',
        newStatus: '',
        type: 'SHIPMENT'
    });

    useEffect(() => {
        refreshTrips();
    }, [refreshTrips]);

    // --- Stats calculation remained same ---
    const stats = useMemo(() => {
        const totalFreight = trips.reduce((acc: number, t: any) => acc + (t.totalFreightAmount || 0), 0);
        const totalPending = trips.reduce((acc: number, t: any) => acc + (t.toalBalanceAmount || 0), 0);
        return {
            total: trips.length,
            inTransit: trips.filter((t: any) => t.status === 'IN_TRANSIT').length,
            totalFreight,
            totalPending
        };
    }, [trips]);

    // --- Intercepting Updates for Confirmation ---
    const triggerConfirm = (tripId: string, lr: string, newStatus: string, type: 'SHIPMENT' | 'PAYMENT') => {
        setConfirmAction({ show: true, tripId, lr, newStatus, type });
    };

    const executeUpdate = async () => {
        const { tripId, newStatus, type } = confirmAction;
        const tid = toast.loading(`Processing update...`);
        
        try {
            const res = type === 'SHIPMENT' 
                ? await handleUpdateStatus(tripId, newStatus)
                : await handleUpdatePayment(tripId, newStatus);

            if (res.ok) {
                toast.success("Record Synchronized", { id: tid });
                refreshTrips();
            } else {
                toast.error("Update failed", { id: tid });
            }
        } catch (error) {
            toast.error("Network error", { id: tid });
        } finally {
            setConfirmAction({ ...confirmAction, show: false });
        }
    };

    const filteredTrips = useMemo(() => {
        return trips.filter((t: any) => {
            const matchesSearch = t.lrNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.destination?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [trips, searchTerm, statusFilter]);

    if (tripsLoading) {
        return (
            <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-8 animate-pulse">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-neutral-900/50 border border-neutral-800 rounded-[28px]" />)}
                </div>
                <div className="h-16 bg-neutral-900/40 rounded-[24px] border border-white/5" />
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-8 max-w-[1600px] mx-auto min-h-screen bg-[#020202] text-zinc-400 space-y-8">
            
            {/* 🔥 UNIFIED CONFIRMATION MODAL */}
            <AnimatePresence>
                {confirmAction.show && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className={`bg-neutral-900 border p-8 rounded-[32px] max-w-sm w-full shadow-2xl space-y-6 text-center
                            ${confirmAction.newStatus === 'CANCELLED' ? 'border-red-500/20' : 'border-indigo-500/20'}`}
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto
                                ${confirmAction.newStatus === 'CANCELLED' ? 'bg-red-500/10 text-red-500' : 
                                  confirmAction.newStatus === 'DELIVERED' || confirmAction.newStatus === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                                {confirmAction.newStatus === 'CANCELLED' ? <AlertTriangle size={32} /> : <Info size={32} />}
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Confirm Change</h2>
                                <p className="text-xs font-bold text-zinc-500 uppercase leading-relaxed">
                                    Update <span className="text-white">{confirmAction.type}</span> of LR <span className="text-white">{confirmAction.lr}</span> to <span className="text-indigo-400">{confirmAction.newStatus}</span>?
                                </p>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setConfirmAction({ ...confirmAction, show: false })} className="flex-1 py-3 rounded-xl bg-neutral-800 text-zinc-400 text-[9px] font-black uppercase tracking-widest">Abort</button>
                                <button onClick={executeUpdate} className={`flex-1 py-3 rounded-xl text-white text-[9px] font-black uppercase tracking-widest shadow-lg
                                    ${confirmAction.newStatus === 'CANCELLED' ? 'bg-red-600 shadow-red-600/20' : 'bg-indigo-600 shadow-indigo-600/20'}`}>
                                    Apply Update
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header section with Stats */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                        Operations
                        <span className="text-[10px] bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full tracking-[0.2em] border border-indigo-500/20">SYSTEM LIVE</span>
                    </h1>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-loose">Fleet movement control for AK Roadways</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 xl:w-[60%]">
                    <StatCard label="Total Trips" value={stats.total} icon={<LucideTruckElectric size={16} />} color="indigo" />
                    <StatCard label="Active" value={stats.inTransit} icon={<Clock size={16} />} color="amber" />
                    <StatCard label="Revenue" value={`₹${(stats.totalFreight / 1000).toFixed(1)}k`} icon={<TrendingUp size={16} />} color="emerald" />
                    <StatCard label="Balance" value={`₹${(stats.totalPending / 1000).toFixed(1)}k`} icon={<AlertCircle size={16} />} color="red" />
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-neutral-900/40 p-4 rounded-[24px] border border-white/5 flex flex-col md:flex-row items-center gap-4 sticky top-4 z-50 backdrop-blur-xl">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" size={16} />
                    <input type="text" placeholder="Search by LR#, City..." className="w-full bg-black/40 border border-neutral-800 rounded-xl pl-12 pr-4 py-3 text-xs text-white outline-none focus:border-indigo-500/40 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 outline-none cursor-pointer" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="ALL">All Status</option>
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="IN_TRANSIT">In Transit</option>
                        <option value="DELIVERED">Delivered</option>
                    </select>
                    <button onClick={() => navigate('/admin-dashboard/trips/add')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 transition-all"><Plus size={16} /> Add Entry</button>
                </div>
            </div>

            {/* Managed List */}
            <div className="grid grid-cols-1 gap-4 pb-20">
                <AnimatePresence mode='popLayout'>
                    {filteredTrips.map((trip: any) => (
                        <motion.div layout key={trip._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="group bg-neutral-900/80 border border-neutral-800 rounded-[28px] p-5 hover:border-indigo-500/30 transition-all flex flex-col md:flex-row items-center gap-6 cursor-pointer relative overflow-hidden" onClick={() => navigate(`/admin-dashboard/trips/manage/${trip._id}`)}>
                            
                            <div className="flex items-center gap-4 w-full md:w-64 shrink-0">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${trip.status === 'DELIVERED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500'}`}><LucideTruckElectric size={24} /></div>
                                <div className="min-w-0">
                                    <h3 className="text-sm font-black text-white uppercase truncate tracking-tighter">{trip.truckId?.truckNumber || 'N/A'}</h3>
                                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest truncate">LR: {trip.lrNumber}</p>
                                </div>
                            </div>

                            <div className="flex-1 grid grid-cols-2 gap-4 w-full border-x border-neutral-800/50 px-6">
                                <div className="space-y-1"><span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">Origin</span><p className="text-xs font-bold text-zinc-300 uppercase truncate">{trip.origin}</p></div>
                                <div className="space-y-1"><span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">Destination</span><p className="text-xs font-bold text-zinc-300 uppercase truncate">{trip.destination}</p></div>
                            </div>

                            {/* 🔥 QUICK UPDATE ZONE */}
                            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto shrink-0 bg-black/30 p-3 rounded-2xl border border-white/5">
                                <div className="flex flex-col gap-1.5 min-w-[120px]">
                                    <span className="text-[7px] font-black text-zinc-600 uppercase flex items-center gap-1"><CheckCircle2 size={8} /> Shipment</span>
                                    <select 
                                        className="bg-neutral-900 border border-neutral-800 text-[9px] font-black text-indigo-400 rounded-lg px-2 py-1.5 outline-none cursor-pointer"
                                        value={trip.status}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => triggerConfirm(trip._id, trip.lrNumber, e.target.value, 'SHIPMENT')}
                                    >
                                        <option value="SCHEDULED">Scheduled</option>
                                        <option value="IN_TRANSIT">In Transit</option>
                                        <option value="DELIVERED">Delivered</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5 min-w-[120px]">
                                    <span className="text-[7px] font-black text-zinc-600 uppercase flex items-center gap-1"><Wallet size={8} /> Payment</span>
                                    <select 
                                        className={`bg-neutral-900 border border-neutral-800 text-[9px] font-black rounded-lg px-2 py-1.5 outline-none cursor-pointer
                                        ${trip.paymentStatus === 'COMPLETED' ? 'text-emerald-500' : trip.paymentStatus === 'PARTIAL' ? 'text-amber-500' : 'text-red-500'}`}
                                        value={trip.paymentStatus}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => triggerConfirm(trip._id, trip.lrNumber, e.target.value, 'PAYMENT')}
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="PARTIAL">Partial</option>
                                        <option value="COMPLETED">Completed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 ml-auto text-right">
                                <div>
                                    <span className="text-[8px] font-black text-zinc-600 uppercase block tracking-tighter">Balance Due</span>
                                    <p className={`text-sm font-black tracking-tighter ${trip.toalBalanceAmount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>₹{trip.toalBalanceAmount?.toLocaleString()}</p>
                                </div>
                                <ChevronRight className="text-zinc-700 group-hover:text-indigo-500 transition-all" size={20} />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, color }: any) => {
    const colorMap: any = {
        indigo: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
        amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        red: 'text-red-500 bg-red-500/10 border-red-500/20',
    };
    return (
        <div className="bg-neutral-900/60 border border-neutral-800 p-5 rounded-[28px] space-y-3 shadow-xl group hover:border-white/10 transition-all">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorMap[color]}`}>{icon}</div>
            <div>
                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{label}</p>
                <h4 className="text-xl font-black text-white tracking-tighter mt-1 group-hover:scale-105 transition-transform origin-left">{value}</h4>
            </div>
        </div>
    );
};

export default ManageTrips;