import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    Plus, Building2, Search, ExternalLink, 
    ArrowUpRight, Users, ShieldCheck, FileText 
} from 'lucide-react';
import { usePartner } from '../hooks/usePartner';

const ManagePartners = () => {
    const navigate = useNavigate();
    const { partners, partnerLoading, refreshPartners } = usePartner();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        refreshPartners();
    }, []);

    // --- Stats Logic ---
    const stats = useMemo(() => {
        const total = partners.length;
        const withGst = partners.filter((p: any) => p.gstNumber).length;
        const unregistered = total - withGst;
        return { total, withGst, unregistered };
    }, [partners]);

    const filteredPartners = useMemo(() => {
        return partners.filter((p: any) => 
            p.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.gstNumber?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [partners, searchTerm]);

    return (
        <div className="p-4 lg:p-8 max-w-[1600px] mx-auto min-h-screen bg-[#020202] space-y-8">
            
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Manage Partners</h1>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Operational Control & Vendor Registry</p>
                </div>
                <button 
                    onClick={() => navigate('/admin-dashboard/partner/add')}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                >
                    <Plus size={16} /> Add New Party
                </button>
            </div>

            {/* Quick Stats Bento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatBox icon={<Users />} label="Total Entities" value={stats.total} color="indigo" />
                <StatBox icon={<ShieldCheck />} label="GST Registered" value={stats.withGst} color="emerald" />
                <StatBox icon={<FileText />} label="Unregistered (URD)" value={stats.unregistered} color="amber" />
            </div>

            {/* Management Table Area */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Active Partner Registry</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search by company or GST..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-black/40 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-[11px] text-white outline-none focus:border-indigo-500 w-full md:w-64 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/20 text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                                <th className="px-6 py-4">Company Name</th>
                                <th className="px-6 py-4">GST Number</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/50">
                            {filteredPartners.map((partner: any) => (
                                <tr key={partner._id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-white uppercase tracking-tight">{partner.partyName}</p>
                                        <p className="text-[10px] text-zinc-500 font-medium">{partner.address?.slice(0, 30)}...</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-mono text-zinc-400">{partner.gstNumber || 'N/A'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs text-zinc-300 font-bold">{partner.contactPerson}</p>
                                        <p className="text-[10px] text-zinc-500">{partner.phone}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${partner.gstNumber ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                            <span className="text-[9px] font-black uppercase text-zinc-500">Active</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => navigate(`/admin-dashboard/partner/manage/${partner._id}`)}
                                            className="inline-flex items-center gap-1.5 text-[9px] font-black text-indigo-400 hover:text-white uppercase tracking-widest transition-all"
                                        >
                                            Edit Details <ArrowUpRight size={12} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Loading / Empty State */}
                {partnerLoading && (
                    <div className="py-20 text-center animate-pulse">
                        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Fetching Ledger...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- StatBox Helper ---
const StatBox = ({ icon, label, value, color }: any) => {
    const colors: any = {
        indigo: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
        emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        amber: "text-amber-500 bg-amber-500/10 border-amber-500/20"
    };
    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 flex items-center gap-6 shadow-xl">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colors[color]}`}>
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</p>
                <h3 className="text-3xl font-black text-white tracking-tighter mt-1">{value}</h3>
            </div>
        </div>
    );
};

export default ManagePartners;