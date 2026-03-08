import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    Save, ChevronLeft, Building2, User, MapPin, Briefcase
} from 'lucide-react';
import { usePartner } from '../hooks/usePartner';
import InputField from '../../AdminDashboard/helpers/InputField';

const AddPartner = () => {
    const navigate = useNavigate();
    const { handleAddPartner, partnerLoading } = usePartner();

    // --- Form State ---
    const [formData, setFormData] = useState({
        partyName: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        gstNumber: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.partyName || !formData.phone) {
            return toast.error("Party Name and Phone are required");
        }

        const tid = toast.loading("Registering Partner Company...");

        try {
            // 🔥 Change: Send formData state directly as a JSON object
            const res = await handleAddPartner(formData);
            const data = await res.json()

            if (res.ok) {
                toast.success("Partner Registry Synchronized", { id: tid });
                navigate('/admin-dashboard/partner/all');
            } else {
                toast.error(data.message || "Registration Failed", { id: tid });
            }
        } catch (error) {
            toast.error("Internal System Error", { id: tid });
        }
    };

    return (
        <div className="p-4 lg:p-8 max-w-[1000px] mx-auto min-h-screen bg-[#020202] text-zinc-400 font-sans">
            {/* Header section consistent with Truck/Maintenance module */}
            <header className="flex items-center justify-between mb-10 bg-neutral-900/40 border border-white/5 p-5 rounded-[24px] backdrop-blur-xl sticky top-6 z-50 shadow-2xl">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl hover:text-white transition-all shadow-lg"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-white uppercase tracking-tighter">Add Partner Company</h1>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mt-1">
                            <Briefcase size={12} className="text-indigo-500" /> Entity Onboarding V1.0
                        </p>
                    </div>
                </div>
                <button
                    onClick={onSubmit}
                    disabled={partnerLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/30 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                    {partnerLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" /> : <Save size={16} />}
                    Save Partner
                </button>
            </header>

            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Section 1: Identity */}
                <div className="md:col-span-2 bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 space-y-8 shadow-xl">
                    <div className="flex items-center gap-2 text-zinc-500">
                        <Building2 size={18} className="text-indigo-500" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Company Identity</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            label="Party Name / Company Name *"
                            name="partyName"
                            value={formData.partyName}
                            onChange={handleInputChange}
                            placeholder="e.g. Reliance Logistics"
                        />
                        <InputField
                            label="GST Number"
                            name="gstNumber"
                            value={formData.gstNumber}
                            onChange={handleInputChange}
                            placeholder="24AAAAA0000A1Z5"
                        />
                    </div>
                </div>

                {/* Section 2: Contact Details */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 space-y-8 shadow-xl">
                    <div className="flex items-center gap-2 text-zinc-500">
                        <User size={18} className="text-indigo-500" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Primary Contact</h3>
                    </div>

                    <div className="space-y-4">
                        <InputField
                            label="Contact Person Name"
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Phone Number *"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Section 3: Location */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 space-y-8 shadow-xl">
                    <div className="flex items-center gap-2 text-zinc-500">
                        <MapPin size={18} className="text-indigo-500" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Office Address</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Full Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-5 py-3.5 text-xs font-bold text-white outline-none focus:border-indigo-500 h-32 resize-none transition-all"
                                placeholder="Street, City, State, PIN..."
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddPartner;