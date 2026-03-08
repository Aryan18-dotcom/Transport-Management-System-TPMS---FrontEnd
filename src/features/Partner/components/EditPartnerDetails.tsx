import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
    ChevronLeft, Save, Building2, User, MapPin, History,
    Trash2, AlertTriangle
} from 'lucide-react';
import { usePartner } from '../hooks/usePartner';
import InputField from '../../AdminDashboard/helpers/InputField';

const EditPartnerDetails = () => {
    const { partnerId } = useParams();
    const navigate = useNavigate();
    const { getPartnerDetails, handleUpdatePartner, handleDeletePartner, partnerLoading } = usePartner();

    // --- State Management ---
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({
        partyName: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        gstNumber: '',
    });

    // --- Load Existing Data ---
    useEffect(() => {
        const loadPartner = async () => {
            const tid = toast.loading("Accessing Registry...");
            const res = await getPartnerDetails(partnerId!);
            const responseData = await res.json()
            
            // Your hook returns the response directly
            if (res.ok) {
                const data = responseData.partnerCompany;
                setFormData({
                    partyName: data.partyName || '',
                    contactPerson: data.contactPerson || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    address: data.address || '',
                    gstNumber: data.gstNumber || '',
                });
                toast.dismiss(tid);
            } else {
                toast.error("Partner not found", { id: tid });
                navigate('/admin-dashboard/partner/manage');
            }
        };
        loadPartner();
    }, [partnerId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.partyName || !formData.phone) {
            return toast.error("Name and Phone are required");
        }

        const tid = toast.loading("Updating Partner Profile...");

        try {
            const res = await handleUpdatePartner(partnerId!, formData);
            const data = await res.json()

            if (res.ok) {
                toast.success("Profile Updated Successfully", { id: tid });
                navigate(`/admin-dashboard/partner/${partnerId}`);
            } else {
                toast.error(data.message || "Update failed", { id: tid });
            }
        } catch (error) {
            toast.error("Internal connection error", { id: tid });
        }
    };

    const confirmDeletion = async () => {
        const tid = toast.loading("Purging Partner Record...");
        try {
            const res = await handleDeletePartner(partnerId!);
            const data = await res.json()
            if (res.ok) {
                toast.success("Partner Removed Permanently", { id: tid });
                navigate('/admin-dashboard/partner/all');
            } else {
                toast.error(data.message || "Deletion Failed", { id: tid });
                setShowDeleteModal(false);
            }
        } catch (error) {
            toast.error("Process Failed", { id: tid });
            console.log(error);
            
        }
    };

    return (
        <div className={`p-4 lg:p-8 max-w-[1000px] mx-auto min-h-screen bg-[#020202] text-zinc-400 transition-all ${partnerLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            
            {/* DANGER ZONE: PURGE MODAL */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowDeleteModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-neutral-900 border border-red-500/20 rounded-[32px] p-8 shadow-2xl overflow-hidden"
                        >
                            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-6">
                                <AlertTriangle size={32} />
                            </div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Purge Partner File?</h2>
                            <p className="text-xs text-zinc-500 font-bold mb-8 leading-relaxed">
                                This will permanently remove <span className="text-white">{formData.partyName}</span> from your business directory. This action cannot be reversed.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-6 py-3 rounded-xl bg-neutral-800 text-white text-[10px] font-black uppercase tracking-widest hover:bg-neutral-700">Cancel</button>
                                <button onClick={confirmDeletion} className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-500 shadow-xl shadow-red-600/20 active:scale-95 transition-all">Confirm Delete</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Header Section */}
            <header className="flex items-center justify-between mb-10 bg-neutral-900/40 border border-white/5 p-5 rounded-[24px] backdrop-blur-xl sticky top-6 z-50 shadow-2xl">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl hover:text-white transition-all shadow-lg"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-white uppercase tracking-tighter">Edit Partner</h1>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mt-1">
                           <History size={12} className="text-indigo-500" /> Modifying ID: {partnerId?.slice(-8)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setShowDeleteModal(true)}
                        className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-90"
                    >
                        <Trash2 size={18} />
                    </button>
                    <button 
                        onClick={onSubmit} 
                        disabled={partnerLoading}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/30 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                        {partnerLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" /> : <Save size={16} />}
                        Apply Changes
                    </button>
                </div>
            </header>

            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sections 1, 2, and 3 remain as previously defined in your structure */}
                <div className="md:col-span-2 bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 space-y-8 shadow-xl">
                    <div className="flex items-center gap-2 text-zinc-500">
                        <Building2 size={18} className="text-indigo-500" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Company Identity</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Party Name" name="partyName" value={formData.partyName} onChange={handleInputChange} />
                        <InputField label="GST Number" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} />
                    </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 space-y-8 shadow-xl">
                    <div className="flex items-center gap-2 text-zinc-500">
                        <User size={18} className="text-indigo-500" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Primary Contact</h3>
                    </div>
                    <div className="space-y-4">
                        <InputField label="Name" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} />
                        <InputField label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                        <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                    </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 space-y-8 shadow-xl">
                    <div className="flex items-center gap-2 text-zinc-500">
                        <MapPin size={18} className="text-indigo-500" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Address Details</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Full Address</label>
                            <textarea 
                                name="address" 
                                value={formData.address} 
                                onChange={handleInputChange}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-5 py-3.5 text-xs font-bold text-white outline-none focus:border-indigo-500 h-32 resize-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

const SectionHeader = ({ title, icon, required }: any) => (
    <div className="flex items-center gap-2 text-zinc-500">
        <span className="text-indigo-500">{icon}</span>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">{title} {required && "*"}</h3>
    </div>
);

export default EditPartnerDetails;