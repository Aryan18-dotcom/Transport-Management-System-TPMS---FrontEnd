import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Plus, LucideTruckElectric, 
    ArrowRight, Banknote, Clock,
    ChevronRight, MapPinned,
    Building2
} from 'lucide-react';
import { useTrips } from '../hooks/useTrips';

const ViewTrips = () => {
    const navigate = useNavigate();
    const { trips, tripsLoading, refreshTrips } = useTrips();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        refreshTrips();
    }, [refreshTrips]);

    const filteredTrips = useMemo(() => {
        return trips.filter((t: any) => 
            t.lrNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.destination?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [trips, searchTerm]);

    return (
        <div className="p-4 lg:p-6 max-w-[1600px] mx-auto min-h-screen bg-[#020202] space-y-6">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/40 p-5 rounded-[24px] border border-white/5 backdrop-blur-md sticky top-0 z-10">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                        Trip Registry
                        <span className="text-[8px] bg-indigo-600/20 text-indigo-400 px-2 py-0.5 rounded-full tracking-[0.1em] border border-indigo-500/20">
                            LIVE
                        </span>
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative group flex-1 md:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                        <input 
                            type="text" 
                            placeholder="LR # or City..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-black/40 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-[11px] text-white outline-none focus:border-indigo-500 w-full md:w-60 transition-all"
                        />
                    </div>
                    <button 
                        onClick={() => navigate('/admin-dashboard/trips/add')}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2 shrink-0"
                    >
                        <Plus size={14} /> New
                    </button>
                </div>
            </div>

            {/* Trips Grid with Loading Logic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                <AnimatePresence mode='popLayout'>
                    {tripsLoading ? (
                        // 🔥 Render 8 Skeletons during loading
                        [...Array(8)].map((_, i) => <TripSkeleton key={i} />)
                    ) : (
                        filteredTrips.map((trip: any) => (
                            <TripCard 
                                key={trip._id} 
                                trip={trip} 
                                onClick={() => navigate(`/admin-dashboard/trips/${trip._id}`)}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>

            {!tripsLoading && filteredTrips.length === 0 && (
                <div className="py-20 text-center bg-neutral-900/10 border border-dashed border-neutral-800 rounded-[32px]">
                    <MapPinned className="mx-auto text-zinc-800 mb-2" size={40} />
                    <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest">No trip records found</p>
                </div>
            )}
        </div>
    );
};

// 🔥 SKELETON COMPONENT
const TripSkeleton = () => (
    <div className="bg-neutral-900/40 border border-neutral-800 rounded-[28px] p-5 space-y-4 animate-pulse h-[180px] flex flex-col justify-between">
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-zinc-800/50 rounded-xl" />
                <div className="space-y-2">
                    <div className="h-3 w-24 bg-zinc-800/50 rounded" />
                    <div className="h-2 w-16 bg-zinc-800/50 rounded" />
                </div>
            </div>
            <div className="h-4 w-12 bg-zinc-800/50 rounded" />
        </div>
        <div className="h-12 w-full bg-zinc-800/30 rounded-2xl" />
        <div className="flex gap-2">
            <div className="h-8 flex-1 bg-zinc-800/50 rounded-xl" />
            <div className="h-8 flex-1 bg-zinc-800/50 rounded-xl" />
        </div>
    </div>
);

const TripCard = ({ trip, onClick }: any) => {
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'DELIVERED': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'IN_TRANSIT': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'CANCELLED': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
        }
    };

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -4, borderColor: 'rgba(99, 102, 241, 0.3)' }}
            onClick={onClick}
            className="group bg-neutral-900/80 border border-neutral-800 rounded-[28px] p-5 space-y-4 transition-all shadow-lg cursor-pointer relative overflow-hidden flex flex-col justify-between"
        >
            <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-9 h-9 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-500 shrink-0">
                        <LucideTruckElectric size={18} />
                    </div>
                    <div className="overflow-hidden">
                        <h3 className="text-[13px] font-black text-white uppercase truncate">
                            {trip.truckId?.truckNumber || 'N/A'}
                        </h3>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase truncate">
                            {trip.driverId?.firstName} {trip.driverId?.lastName}
                        </p>
                    </div>
                </div>
                <span className={`text-[7px] font-black px-2 py-0.5 rounded-md border uppercase tracking-widest shrink-0 ${getStatusColor(trip.status)}`}>
                    {trip.status?.replace('_', ' ')}
                </span>
            </div>

            <div className="bg-black/40 rounded-2xl p-3 flex items-center justify-between border border-neutral-800/40">
                <div className="flex-1 min-w-0">
                    <span className="text-[7px] font-black text-zinc-600 uppercase block mb-0.5">Origin</span>
                    <p className="text-[10px] font-bold text-zinc-300 uppercase truncate">{trip.origin}</p>
                </div>
                <div className="flex flex-col items-center px-3 shrink-0">
                    <ArrowRight size={12} className="text-indigo-500" />
                    <span className="text-[6px] font-black text-zinc-700 mt-1 uppercase whitespace-nowrap">LR: {trip.lrNumber?.split('/').pop()}</span>
                </div>
                <div className="flex-1 min-w-0 text-right">
                    <span className="text-[7px] font-black text-zinc-600 uppercase block mb-0.5">Destination</span>
                    <p className="text-[10px] font-bold text-zinc-300 uppercase truncate">{trip.destination}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="bg-neutral-950/40 p-2 rounded-xl border border-neutral-800/30 flex items-center gap-2">
                    <Banknote size={12} className="text-emerald-500 shrink-0" />
                    <div className="min-w-0">
                        <span className="text-[6px] font-black text-zinc-600 uppercase block leading-none">Freight</span>
                        <span className="text-[10px] font-bold text-zinc-200 truncate block">₹{trip.totalFreightAmount?.toLocaleString() || 0}</span>
                    </div>
                </div>
                <div className="bg-neutral-950/40 p-2 rounded-xl border border-neutral-800/30 flex items-center gap-2">
                    <Clock size={12} className="text-indigo-400 shrink-0" />
                    <div className="min-w-0">
                        <span className="text-[6px] font-black text-zinc-600 uppercase block leading-none">Started</span>
                        <span className="text-[10px] font-bold text-zinc-200 truncate block">
                            {new Date(trip.tripStartDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </span>
                    </div>
                </div>
            </div>

            <div className="pt-3 border-t border-neutral-800/50 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1.5 overflow-hidden">
                    <Building2 size={10} className="text-zinc-600 shrink-0" />
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-tighter truncate">
                        {trip.partnerCompanyId?.partyName || 'Private Trip'}
                    </span>
                </div>
                <div className="flex items-center gap-1 text-[8px] font-black text-indigo-400 uppercase tracking-widest whitespace-nowrap">
                    Go <ChevronRight size={10} />
                </div>
            </div>
        </motion.div>
    );
};

export default ViewTrips;