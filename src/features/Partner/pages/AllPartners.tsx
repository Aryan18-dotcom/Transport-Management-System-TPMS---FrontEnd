import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    Search, Plus, Building2, User, Phone, 
    Mail, MapPin, ExternalLink, Briefcase
} from 'lucide-react';
import { usePartner } from '../hooks/usePartner';

const AllPartners = () => {
    const navigate = useNavigate();
    const { partners, partnerLoading, refreshPartners } = usePartner();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        refreshPartners();
    }, []);

    const filteredPartners = useMemo(() => {
        return partners.filter((p: any) => 
            p.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.gstNumber?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [partners, searchTerm]);

    return (
        <div className="p-4 lg:p-8 max-w-[1600px] mx-auto min-h-screen bg-[#020202] space-y-8">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Partner Directory</h1>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Registry Navigation & Ledger Access</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search Name, Contact or GST..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500 w-72 transition-all"
                        />
                    </div>
                    <button 
                        onClick={() => navigate('/admin-dashboard/partner/add')}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
                    >
                        <Plus size={16} /> Register Partner
                    </button>
                </div>
            </div>

            {/* Partners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode='popLayout'>
                    {filteredPartners.map((partner: any) => (
                        <PartnerCard 
                            key={partner._id} 
                            partner={partner} 
                            onClick={() => navigate(`/admin-dashboard/partner/${partner._id}`)}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {!partnerLoading && filteredPartners.length === 0 && (
                <div className="py-20 text-center bg-neutral-900/30 border border-dashed border-neutral-800 rounded-[32px]">
                    <Building2 className="mx-auto text-zinc-800 mb-4" size={48} />
                    <p className="text-zinc-500 font-bold uppercase text-xs tracking-[0.2em]">No matches found in directory</p>
                </div>
            )}
        </div>
    );
};

const PartnerCard = ({ partner, onClick }: any) => {
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5, borderColor: 'rgba(99, 102, 241, 0.4)' }}
            onClick={onClick}
            className="group bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 space-y-6 transition-all shadow-xl relative overflow-hidden cursor-pointer"
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-500/10 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors">
                            {partner.partyName}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[8px] font-black bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded tracking-widest uppercase">
                                GST: {partner.gstNumber || 'URD'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="p-2 bg-neutral-800/50 rounded-xl text-zinc-600 group-hover:text-indigo-500 transition-colors">
                    <ExternalLink size={14} />
                </div>
            </div>

            <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-zinc-400">
                    <User size={14} className="text-indigo-500" />
                    <span className="text-[11px] font-medium">{partner.contactPerson || 'No Primary Contact'}</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                    <Phone size={14} className="text-indigo-500" />
                    <span className="text-[11px] font-medium">{partner.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                    <Mail size={14} className="text-indigo-500" />
                    <span className="text-[11px] font-medium truncate">{partner.email || 'N/A'}</span>
                </div>
            </div>

            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-500">
                    <MapPin size={12} />
                    <span className="text-[9px] font-bold uppercase truncate w-40">{partner.address}</span>
                </div>
                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Open File
                </span>
            </div>
        </motion.div>
    );
};

export default AllPartners;