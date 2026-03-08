import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, Building2, User, Phone, 
    Mail, MapPin, Hash, Edit3, Trash2, Briefcase, Calendar, Receipt
} from 'lucide-react';
import { usePartner } from '../hooks/usePartner';
import { toast } from 'react-hot-toast';

const PartnerDetails = () => {
    const { partnerId } = useParams();
    const navigate = useNavigate();
    const { getPartnerDetails, handleDeletePartner, partnerLoading } = usePartner();
    const [partner, setPartner] = useState<any>(null);

    useEffect(() => {
        const fetchPartner = async () => {
            const res = await getPartnerDetails(partnerId!);
            const data = await res.json()
            
            if (res.ok) {
                setPartner(data.partnerCompany);
            } else {
                toast.error("Partner not found in registry");
                navigate('/admin-dashboard/partner/all');
            }
        };
        fetchPartner();
    }, [partnerId]);

    if (!partner || partnerLoading) return (
        <div className="min-h-screen bg-[#020202] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-4 lg:p-8 max-w-[1400px] mx-auto min-h-screen bg-[#020202] space-y-8">
            
            {/* Header / Action Bar */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/admin-dashboard/partner/all')} 
                        className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-zinc-500 hover:text-white transition-all shadow-lg"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                            {partner.partyName}
                            <span className="text-[10px] bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full tracking-[0.2em] border border-indigo-500/20">
                                ACTIVE PARTNER
                            </span>
                        </h1>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                            Registered on {new Date(partner.createdAt).toLocaleDateString('en-IN')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate(`/admin-dashboard/partner/manage/${partner._id}`)}
                        className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 text-zinc-400 hover:text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                        <Edit3 size={14} /> Update Profile
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Essential Data Cards */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Identity Bento Card */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 space-y-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Building2 size={80} />
                        </div>
                        
                        <div className="space-y-6 relative z-10">
                            <DetailItem icon={<Hash size={16}/>} label="GST Identification" value={partner.gstNumber || 'Unregistered'} isCopyable />
                            <DetailItem icon={<User size={16}/>} label="Primary Contact" value={partner.contactPerson || 'N/A'} />
                            <DetailItem icon={<Phone size={16}/>} label="Contact Number" value={partner.phone} />
                            <DetailItem icon={<Mail size={16}/>} label="Email Address" value={partner.email || 'No email provided'} />
                        </div>
                    </div>

                    {/* Address Card */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 space-y-4 shadow-xl">
                        <div className="flex items-center gap-2 text-zinc-500 mb-2">
                            <MapPin size={18} className="text-indigo-500" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Office HQ</h3>
                        </div>
                        <p className="text-sm font-bold text-zinc-200 leading-relaxed italic">
                            "{partner.address}"
                        </p>
                    </div>
                </div>

                {/* Right Column: Dynamic Statistics & Ledger Summary */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard icon={<Briefcase />} label="Total Trips" value="0" sub="Active engagement" color="indigo" />
                        <StatCard icon={<Receipt />} label="Total Revenue" value="₹0" sub="Billed to date" color="emerald" />
                        <StatCard icon={<Calendar />} label="Last Activity" value="N/A" sub="Registry update" color="amber" />
                    </div>

                    {/* Placeholder for Associated Data */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-12 text-center space-y-4 border-dashed">
                        <div className="w-16 h-16 bg-neutral-950 rounded-2xl flex items-center justify-center mx-auto text-zinc-800 border border-neutral-800">
                            <Receipt size={32} />
                        </div>
                        <div>
                            <h4 className="text-white font-black uppercase text-xs tracking-widest">Transaction History</h4>
                            <p className="text-zinc-600 text-[10px] font-bold mt-1">No associated bills or trips found for this partner yet.</p>
                        </div>
                        <button className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] hover:text-white transition-colors">
                            Initialize Ledger +
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Helper Components ---

const DetailItem = ({ icon, label, value, isCopyable }: any) => (
    <div className="space-y-1 group">
        <div className="flex items-center gap-1.5 text-zinc-500">
            <span className="text-indigo-500/80">{icon}</span>
            <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-zinc-200">{value}</p>
            {isCopyable && value !== 'Unregistered' && (
                <button 
                    onClick={() => { navigator.clipboard.writeText(value); toast.success("Copied to clipboard"); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-black text-indigo-400 uppercase"
                >
                    Copy
                </button>
            )}
        </div>
    </div>
);

const StatCard = ({ icon, label, value, sub, color }: any) => {
    const colors: any = {
        indigo: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
        emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        amber: "text-amber-500 bg-amber-500/10 border-amber-500/20"
    };
    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 space-y-4 shadow-xl">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
                {React.cloneElement(icon, { size: 20 })}
            </div>
            <div>
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{label}</p>
                <h3 className="text-2xl font-black text-white mt-1">{value}</h3>
                <p className="text-[9px] font-bold text-zinc-600 uppercase mt-1 tracking-tighter">{sub}</p>
            </div>
        </div>
    );
};

export default PartnerDetails;