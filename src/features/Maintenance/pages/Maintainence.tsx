import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Plus, ChevronLeft, ChevronRight,
    Wrench, Calendar, IndianRupee, MapPin, ExternalLink,
    AlertCircle, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMaintenance } from '../../Maintenance/hooks/useMaintenance';

const Maintenance = () => {
    const navigate = useNavigate();
    const { records, maintLoading, refreshAnalytics, handleQuickPaymentUpdate } = useMaintenance();

    // --- State Management ---
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [activeCategory, setActiveCategory] = useState("ALL");

    useEffect(() => {
        refreshAnalytics();
    }, []);

    // --- Logic: Search & Filter ---
    const filteredRecords = useMemo(() => {
        return records.filter(r => {
            const matchesSearch =
                r.vehicleId?.truckNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.workshopName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = activeCategory === "ALL" || r.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [records, searchTerm, activeCategory]);

    // --- Logic: Pagination ---
    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
    const paginatedData = filteredRecords.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-8 min-h-screen bg-[#020202]">

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Maintenance Ledger</h1>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Fleet Health & Expense Tracking</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search Truck or Workshop..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500 w-64 transition-all"
                        />
                    </div>

                    <select
                        value={itemsPerPage}
                        onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                        className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase text-zinc-400 outline-none cursor-pointer hover:border-zinc-600 transition-all"
                    >
                        <option value={10}>10 Per Page</option>
                        <option value={15}>15 Per Page</option>
                        <option value={20}>20 Per Page</option>
                    </select>

                    <button onClick={() => navigate('/admin-dashboard/truck/maintenance/add')} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all active:scale-95">
                        <Plus size={16} /> Log Entry
                    </button>
                </div>
            </div>

            {/* Category Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['ALL', 'MECHANICAL', 'ELECTRICAL', 'TYRE', 'BODY_ACCESSORIES', 'ROUTINE_SERVICE'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                        className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap border transition-all ${activeCategory === cat
                                ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30'
                                : 'bg-neutral-900 text-zinc-500 border-neutral-800 hover:text-zinc-300'
                            }`}
                    >
                        {cat.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Records Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {paginatedData.map((record) => (
                        <MaintenanceCard
                            key={record._id}
                            record={record}
                            onTransition={handleQuickPaymentUpdate}
                            isLoading={maintLoading}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State & Pagination remain the same... */}
        </div>
    );
};

const MaintenanceCard = ({ record, onTransition, isLoading }: { record: any, onTransition: any, isLoading: boolean }) => {
    const navigate = useNavigate();

    // 🔥 Local state for the dropdown
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(record.paymentStatus || 'PENDING');

    // 🔥 Detect if the selected status differs from the SAVED record status
    const hasChanged = selectedPaymentStatus !== record.paymentStatus;

    const statusStyles: any = {
        PAID: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        PARTIAL: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        PENDING: "bg-red-500/10 text-red-400 border-red-500/20",
    };

    // Keep local state in sync if the parent records change (e.g. from a global refresh)
    useEffect(() => {
        setSelectedPaymentStatus(record.paymentStatus);
    }, [record.paymentStatus]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 space-y-5 transition-all hover:border-indigo-500/30 hover:shadow-2xl shadow-indigo-500/5 relative overflow-hidden"
        >
            {/* ACCOUNTING CONTROL BAR */}
            <div className="flex items-center justify-between bg-black/40 p-2 rounded-2xl border border-neutral-800/50">
                <div className="flex items-center gap-2 flex-grow">
                    <div className={`w-1.5 h-1.5 rounded-full ${selectedPaymentStatus === 'PAID' ? 'bg-emerald-500' : 'bg-red-500'} ${isLoading ? 'animate-ping' : 'animate-pulse'}`} />
                    <select
                        value={selectedPaymentStatus}
                        disabled={isLoading}
                        onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                        className={`bg-transparent text-[9px] font-black uppercase tracking-widest outline-none cursor-pointer px-2 py-1 rounded-lg transition-colors ${statusStyles[selectedPaymentStatus]} w-full`}
                    >
                        <option value="PENDING" className="bg-neutral-900 text-red-500">PENDING</option>
                        <option value="PARTIAL" className="bg-neutral-900 text-orange-500">PARTIAL</option>
                        <option value="PAID" className="bg-neutral-900 text-emerald-500">PAID</option>
                    </select>
                </div>

                <AnimatePresence>
                    {hasChanged && (
                        <motion.button
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            onClick={() => onTransition(record._id, selectedPaymentStatus)}
                            disabled={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white p-1.5 ml-2 rounded-lg shadow-lg shadow-indigo-600/20 disabled:opacity-50 shrink-0"
                        >
                            {isLoading ? (
                                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                            ) : (
                                <Check size={14} />
                            )}
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* TRUCK HEADER */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-500">
                        <Wrench size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-tight">{record.vehicleId?.truckNumber}</h3>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{record.category?.replace('_', ' ')}</p>
                    </div>
                </div>
                <div className={`px-2 py-0.5 rounded text-[7px] font-black tracking-tighter border uppercase transition-colors ${record.paymentMethod === 'UPI' ? 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5' :
                        record.paymentMethod === 'CASH' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' :
                            record.paymentMethod === 'CHEQUE' ? 'text-amber-400 border-amber-500/20 bg-amber-500/5' :
                                record.paymentMethod === 'NET_BANKING' ? 'text-blue-400 border-blue-500/20 bg-blue-500/5' :
                                    'text-zinc-500 border-zinc-800'
                    }`}>
                    {record.paymentMethod?.replace('_', ' ') || 'UNSPECIFIED'}
                </div>
            </div>

            {/* FINANCE DATA */}
            <div className="grid grid-cols-2 gap-4 py-2 border-y border-neutral-800/50">
                <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase text-zinc-600">Workshop</span>
                    <p className="text-xs font-bold text-zinc-200 truncate">{record.workshopName}</p>
                </div>
                <div className="space-y-1 text-right">
                    <span className="text-[8px] font-black uppercase text-zinc-600">Grand Total</span>
                    <p className="text-xs font-black text-white">₹{record.grandTotal?.toLocaleString('en-IN')}</p>
                </div>
            </div>

            {/* BALANCE ALERT */}
            {record.balanceAmount > 0 && (
                <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-2 flex justify-between items-center">
                    <span className="text-[7px] font-black text-red-500/60 uppercase tracking-widest">Outstanding</span>
                    <span className="text-[10px] font-black text-red-400">₹{record.balanceAmount.toLocaleString('en-IN')}</span>
                </div>
            )}

            <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-500">
                    <Calendar size={12} />
                    {new Date(record.serviceDate).toLocaleDateString()}
                </div>
                <button
                    onClick={() => navigate(`/admin-dashboard/truck/maintenance/${record._id}`)}
                    className="flex items-center gap-1.5 text-[9px] font-black text-indigo-400 hover:text-white uppercase tracking-widest transition-colors"
                >
                    Details <ExternalLink size={10} />
                </button>
            </div>
        </motion.div>
    );
};

export default Maintenance;