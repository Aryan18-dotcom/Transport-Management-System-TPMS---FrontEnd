import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, LucideTruckElectric, MapPin, 
    ArrowRight, Banknote, Clock, Building2, 
    User, Scale, ClipboardCheck, Edit3, Eye, AlertCircle,
    Phone, Mail, MapPinned, Info, IndianRupee, Timer
} from 'lucide-react';
import { useTrips } from '../hooks/useTrips';
import { toast } from 'react-hot-toast';

const ViewTripsDetails = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const { getTripDetails, tripsLoading } = useTrips();
    const [trip, setTrip] = useState<any>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            const res = await getTripDetails(tripId!);
            const data = await res.json();
            if (res.ok) {
                setTrip(data.trip);
            } else {
                toast.error("Trip record not found");
                navigate('/admin-dashboard/trips/all');
            }
        };
        fetchDetails();
    }, [tripId]);

    if (tripsLoading || !trip) return (
        <div className="min-h-screen bg-[#020202] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
    );

    // Calculation labels matching your auto-calculated model
    const freightAmount = Number(trip.weight) * Number(trip.rate);

    return (
        <div className="p-4 lg:p-8 max-w-[1600px] mx-auto min-h-screen bg-[#020202] space-y-6 text-zinc-400">
            
            {/* Header: Action Bar */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-neutral-900/40 p-6 rounded-[24px] border border-white/5 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin-dashboard/trips/all')} className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-zinc-500 hover:text-white transition-all shadow-lg">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                            LR: {trip.lrNumber}
                            <span className={`text-[9px] px-3 py-1 rounded-full tracking-[0.2em] border ${
                                trip.status === 'DELIVERED' ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/20' : 'bg-indigo-600/20 text-indigo-400 border-indigo-500/20'
                            }`}>
                                {trip.status.replace('_', ' ')}
                            </span>
                        </h1>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                            Registry ID: {trip._id} • Created {new Date(trip.createdAt).toLocaleDateString('en-IN')}
                        </p>
                    </div>
                </div>

                <button onClick={() => navigate(`/admin-dashboard/trips/manage/${trip._id}`)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/30 transition-all active:scale-95">
                    <Edit3 size={14} /> Edit Trip Ledger
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT COLUMN: PRIMARY TRIP DATA */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* Routing & Cargo Section */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 space-y-8 shadow-xl">
                        <SectionTitle icon={<MapPinned />} title="Route & Cargo Breakdown" />

                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-black/40 p-8 rounded-[24px] border border-neutral-800/50">
                            <div className="text-center md:text-left">
                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] block mb-2">Origin Point</span>
                                <h4 className="text-3xl font-black text-white uppercase tracking-tighter">{trip.origin}</h4>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <ArrowRight size={28} className="text-indigo-500" />
                                <div className="px-4 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.3em]">{trip.status}</span>
                                </div>
                            </div>
                            <div className="text-center md:text-right">
                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] block mb-2">Destination</span>
                                <h4 className="text-3xl font-black text-white uppercase tracking-tighter">{trip.destination}</h4>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                            <DetailBlock icon={<ClipboardCheck />} label="Material" value={trip.materialDescription} />
                            <DetailBlock icon={<Scale />} label="Weight" value={`${trip.weight} Units`} />
                            <DetailBlock icon={<IndianRupee />} label="Rate/Unit" value={`₹${trip.rate}`} />
                            <DetailBlock icon={<Clock />} label="Dispatch" value={new Date(trip.tripStartDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })} />
                        </div>
                    </div>

                    {/* Fleet & Personnel */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 shadow-xl flex items-center gap-5">
                            <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-500/10 shrink-0">
                                <LucideTruckElectric size={28} />
                            </div>
                            <div>
                                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Assigned Truck</span>
                                <h4 className="text-xl font-black text-white uppercase tracking-tighter">{trip.truckId?.truckNumber}</h4>
                            </div>
                        </div>
                        <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 shadow-xl space-y-4">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/10 shrink-0">
                                    <User size={28} />
                                </div>
                                <div>
                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Primary Driver</span>
                                    <h4 className="text-xl font-black text-white uppercase tracking-tighter">
                                        {trip.driverId ? `${trip.driverId.firstName} ${trip.driverId.lastName}` : 'N/A'}
                                    </h4>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 bg-black/20 p-2.5 rounded-xl border border-white/5">
                                <Phone size={14} className="text-emerald-500" />
                                {trip.driverId?.phoneNum || "No Contact Available"}
                            </div>
                        </div>
                    </div>

                    {/* Partner Details */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-xl space-y-6">
                        <SectionTitle icon={<Building2 />} title="Contractor / Partner Profile" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <DetailBlock icon={<Info />} label="Company Name" value={trip.partnerCompanyId?.partyName} />
                                <DetailBlock icon={<User />} label="Contact Person" value={trip.partnerCompanyId?.contactPerson} />
                            </div>
                            <div className="space-y-4">
                                <DetailBlock icon={<Phone />} label="Office Contact" value={trip.partnerCompanyId?.phone} />
                                <DetailBlock icon={<Mail />} label="Email Address" value={trip.partnerCompanyId?.email} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: FINANCIALS & DOCUMENTS */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* High-Visibility Payment Status */}
                    <div className={`p-8 rounded-[32px] border flex flex-col items-center justify-center space-y-2 shadow-2xl ${
                        trip.paymentStatus === 'COMPLETED' ? 'bg-emerald-600/10 border-emerald-500/30' : 
                        trip.paymentStatus === 'PARTIAL' ? 'bg-amber-600/10 border-amber-500/30' : 
                        'bg-red-600/10 border-red-500/30'
                    }`}>
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Payment Status</span>
                         <h2 className={`text-4xl font-black uppercase tracking-tighter ${
                            trip.paymentStatus === 'COMPLETED' ? 'text-emerald-500' : 
                            trip.paymentStatus === 'PARTIAL' ? 'text-amber-500' : 'text-red-500'
                         }`}>
                             {trip.paymentStatus}
                         </h2>
                    </div>

                    {/* Financial Ledger Breakdown */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 space-y-6 shadow-xl relative overflow-hidden">
                        <SectionTitle icon={<Banknote />} title="Freight Ledger" />

                        <div className="space-y-4 pt-4 relative z-10">
                            <FinancialRow label="Base Freight" value={freightAmount} />
                            <FinancialRow label="Detention (Diten)" value={trip.diten} icon={<Timer size={12} className="text-amber-500" />} />
                            
                            <div className="flex justify-between items-center bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20">
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Total Freight</span>
                                <span className="text-xl font-black text-white">₹{trip.totalFreightAmount?.toLocaleString('en-IN')}</span>
                            </div>

                            <div className="flex justify-between items-center px-4 py-2">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase">Advance Received</span>
                                <span className="text-sm font-bold text-emerald-500">- ₹{trip.advancePaymentReceived?.toLocaleString('en-IN')}</span>
                            </div>

                            <div className="pt-6 border-t border-neutral-800 flex justify-between items-center px-4">
                                <span className="text-[11px] font-black text-white uppercase tracking-tighter">Balance Due</span>
                                <span className={`text-3xl font-black ${Number(trip.toalBalanceAmount) > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                    ₹{trip.toalBalanceAmount?.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* POD Capture */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 space-y-4 shadow-xl">
                        <SectionTitle icon={<ClipboardCheck />} title="Proof of Delivery" />
                        {trip.podUrl ? (
                            <div className="relative group rounded-[24px] overflow-hidden aspect-[4/3] bg-black/40 border border-neutral-800">
                                <img src={trip.podUrl} alt="POD" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                                    <a href={trip.podUrl} target="_blank" rel="noreferrer" className="bg-indigo-600 p-3.5 rounded-full text-white shadow-2xl">
                                        <Eye size={24} />
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="py-12 text-center bg-black/20 rounded-[24px] border border-dashed border-neutral-800">
                                <AlertCircle className="mx-auto text-zinc-800 mb-3" size={32} />
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Awaiting POD</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- HELPER COMPONENTS ---

const FinancialRow = ({ label, value, icon }: any) => (
    <div className="flex justify-between items-center px-4">
        <span className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2">
            {icon} {label}
        </span>
        <span className="text-sm font-bold text-zinc-300">₹{value?.toLocaleString('en-IN') || 0}</span>
    </div>
);

const SectionTitle = ({ icon, title }: any) => (
    <div className="flex items-center gap-2 text-zinc-500">
        <span className="text-indigo-500">{React.cloneElement(icon, { size: 18 })}</span>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">{title}</h3>
    </div>
);

const DetailBlock = ({ icon, label, value }: any) => (
    <div className="flex items-start gap-3">
        <div className="p-2 bg-neutral-950 rounded-lg border border-neutral-800 text-indigo-400 shrink-0">
            {React.cloneElement(icon, { size: 14 })}
        </div>
        <div className="min-w-0">
            <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest block leading-none mb-1">{label}</span>
            <p className="text-[11px] font-bold text-zinc-200 uppercase truncate">{value || '---'}</p>
        </div>
    </div>
);

export default ViewTripsDetails;