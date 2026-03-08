import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
    Save, ChevronLeft, LucideTruckElectric, Building2, 
    MapPin, Banknote, Upload, ClipboardList, ShieldCheck,
    Calculator, CalendarClock
} from 'lucide-react';

// Hooks
import { useTrips } from '../hooks/useTrips';
import { useTrucks } from '../../Trucks/hooks/TrucksHooks';
import { usePartner } from '../../Partner/hooks/usePartner';
import InputField from '../../AdminDashboard/helpers/InputField';

const AddTrip = () => {
    const navigate = useNavigate();
    const { handleCreateTrip, tripsLoading } = useTrips();
    const { partners, refreshPartners } = usePartner();
    const { trucks, refreshTrucks } = useTrucks();

    // Internal UI loading state to disable fields
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        partnerCompanyId: '',
        truckId: '',
        driverId: '', 
        lrNumber: '',
        tripStartDate: new Date().toISOString().split('T')[0],
        tripEndDate: '', // 🔥 Conditional Field
        origin: '',
        destination: '',
        materialDescription: '',
        weight: '',
        rate: '',
        diten: '0',
        advancePaymentReceived: '0',
        status: 'SCHEDULED',
    });

    const [podFile, setPodFile] = useState<File | null>(null);

    const calculations = useMemo(() => {
        const w = parseFloat(formData.weight) || 0;
        const r = parseFloat(formData.rate) || 0;
        const d = parseFloat(formData.diten) || 0;
        const adv = parseFloat(formData.advancePaymentReceived) || 0;

        const totalFreight = (w * r) + d;
        const balance = Math.max(0, totalFreight - adv);

        return { totalFreight, balance };
    }, [formData.weight, formData.rate, formData.diten, formData.advancePaymentReceived]);

    useEffect(() => {
        refreshPartners();
        refreshTrucks();
    }, []);

    const availableFleet = trucks.filter(t => t.assignedDriver);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        const numericFields = ['weight', 'rate', 'diten', 'advancePaymentReceived'];
        if (numericFields.includes(name)) {
            const cleanValue = value.replace(/[^0-9.]/g, '');
            if ((cleanValue.match(/\./g) || []).length > 1) return;
            setFormData(prev => ({ ...prev, [name]: cleanValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleTruckSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTruckId = e.target.value;
        const truckData = availableFleet.find(t => t._id === selectedTruckId);
        setFormData(prev => ({
            ...prev,
            truckId: selectedTruckId,
            driverId: truckData ? (truckData.assignedDriver) : ''
        }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.partnerCompanyId || !formData.truckId || !formData.lrNumber || !formData.weight) {
            return toast.error("Required: Partner, Truck, LR and Weight");
        }

        setIsSubmitting(true);
        const tid = toast.loading("Recording Trip Entry...");

        try {
            const data = new FormData();
            
            // 🔥 Conditional API Logic: Only send tripEndDate if status is DELIVERED
            Object.keys(formData).forEach(key => {
                if (key === 'tripEndDate' && formData.status !== 'DELIVERED') {
                    return; // Skip sending end date
                }
                data.append(key, (formData as any)[key]);
            });

            if (podFile) data.append("podFile", podFile);

            const res = await handleCreateTrip(data);
            const resData = await res.json();

            if (res.ok) {
                toast.success("Trip Ledger Updated", { id: tid });
                navigate('/admin-dashboard/trips/all');
            } else {
                toast.error(resData.message || "Entry failed", { id: tid });
                setIsSubmitting(false);
            }
        } catch (error) {
            toast.error("System sync error", { id: tid });
            setIsSubmitting(false);
        }
    };

    const isDisabled = isSubmitting || tripsLoading;

    return (
        <div className={`p-4 lg:p-8 max-w-[1400px] mx-auto min-h-screen bg-[#020202] text-zinc-400 ${isDisabled ? 'pointer-events-none opacity-80' : ''}`}>
            
            <header className="flex items-center justify-between mb-10 bg-neutral-900/40 border border-white/5 p-5 rounded-[24px] backdrop-blur-xl sticky top-6 z-50 shadow-2xl">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl hover:text-white transition-all shadow-lg" disabled={isDisabled}>
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-white uppercase tracking-tighter">New Trip Entry</h1>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mt-1">
                           <LucideTruckElectric size={12} className="text-indigo-500" /> Secure Input Mode V1.3
                        </p>
                    </div>
                </div>
                <button 
                    onClick={onSubmit} 
                    disabled={isDisabled}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all flex items-center gap-2 active:scale-95"
                >
                    {isDisabled ? <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" /> : <Save size={16} />}
                    {isSubmitting ? "Syncing..." : "Finalize Entry"}
                </button>
            </header>

            <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">
                <fieldset disabled={isDisabled} className="lg:col-span-8 space-y-6 contents">
                    <div className="lg:col-span-8 space-y-6">
                        {/* Assignment Card */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 space-y-8 shadow-xl">
                            <div className="flex items-center gap-2 text-zinc-500 border-b border-neutral-800 pb-4">
                                <Building2 size={18} className="text-indigo-500" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Assignment Context</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SelectField label="Partner Company" name="partnerCompanyId" value={formData.partnerCompanyId} onChange={handleInputChange} options={partners.map((p: any) => ({ label: p.partyName, value: p._id }))} />
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Assigned Fleet Asset</label>
                                    <div className="relative">
                                        <select name="truckId" value={formData.truckId} onChange={handleTruckSelect} className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-5 py-3.5 text-xs font-bold text-white outline-none focus:border-indigo-500 appearance-none transition-all">
                                            <option value="">Select Truck (with Driver)</option>
                                            {availableFleet.map((t: any) => (<option key={t._id} value={t._id}>{t.truckNumber}</option>))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-500"><ShieldCheck size={16} /></div>
                                    </div>
                                    {formData.driverId && <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest ml-2 animate-pulse">✓ Driver Linked</p>}
                                </div>
                            </div>
                        </div>

                        {/* Route Card */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 space-y-8 shadow-xl">
                            <div className="flex items-center gap-2 text-zinc-500 border-b border-neutral-800 pb-4">
                                <MapPin size={18} className="text-indigo-500" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Route & Cargo</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Origin (From)" name="origin" value={formData.origin} onChange={handleInputChange} />
                                <InputField label="Destination (To)" name="destination" value={formData.destination} onChange={handleInputChange} />
                                <InputField label="Material Description" name="materialDescription" value={formData.materialDescription} onChange={handleInputChange} />
                                <InputField label="Weight (Tons/Kg)" name="weight" type="text" value={formData.weight} onChange={handleInputChange} />
                                <InputField label="LR Number" name="lrNumber" value={formData.lrNumber} onChange={handleInputChange} className='col-span-2' />
                            </div>
                        </div>

                        {/* Pricing Card */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 space-y-6 shadow-xl border-t-indigo-500 border-t-4">
                            <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-zinc-500"><Banknote size={18} className="text-indigo-500" /><h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Freight Pricing</h3></div><Calculator size={16} className="text-zinc-700" /></div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <InputField label="Rate (₹)" name="rate" type="text" value={formData.rate} onChange={handleInputChange} />
                                <InputField label="Detention (₹)" name="diten" type="text" value={formData.diten} onChange={handleInputChange} />
                                <InputField label="Advance Paid (₹)" name="advancePaymentReceived" type="text" value={formData.advancePaymentReceived} onChange={handleInputChange} />
                            </div>
                            <div className="mt-4 p-5 bg-black/40 rounded-2xl border border-white/5 grid grid-cols-2 gap-8">
                                <div className="space-y-1"><span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">Calculated Freight</span><p className="text-xl font-black text-white tracking-tighter">₹{calculations.totalFreight.toLocaleString()}</p></div>
                                <div className="space-y-1"><span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">Estimated Balance</span><p className={`text-xl font-black tracking-tighter ${calculations.balance > 0 ? "text-amber-500" : "text-emerald-500"}`}>₹{calculations.balance.toLocaleString()}</p></div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                {/* RIGHT COLUMN: Sidebar (Sticky) */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 space-y-4 shadow-xl">
                        <div className="flex items-center gap-2 text-zinc-500 border-b border-neutral-800 pb-4 mb-2">
                             <ShieldCheck size={18} className="text-indigo-500" />
                             <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Trip Status</h3>
                        </div>
                        <SelectField label="Current Status" name="status" value={formData.status} onChange={handleInputChange} options={[{ label: 'Scheduled', value: 'SCHEDULED' }, { label: 'In Transit', value: 'IN_TRANSIT' }, { label: 'Delivered', value: 'DELIVERED' }, { label: 'Cancelled', value: 'CANCELLED' }]} />
                        <InputField label="Start Date" name="tripStartDate" type="date" value={formData.tripStartDate} onChange={handleInputChange} />
                        
                        {/* 🔥 Conditional UI Logic: Ending Date only for Delivered */}
                        {formData.status === 'DELIVERED' && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-2 border-t border-neutral-800 mt-2">
                                <InputField 
                                    label="Arrival / Ending Date" 
                                    name="tripEndDate" 
                                    type="date" 
                                    value={formData.tripEndDate} 
                                    onChange={handleInputChange}
                                    icon={<CalendarClock size={16} />}
                                />
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 text-center space-y-4 shadow-xl">
                        <div className="flex items-center justify-center gap-2 text-zinc-500"><ClipboardList size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Proof of Delivery (POD)</span></div>
                        <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-neutral-800 rounded-[24px] transition-all bg-black/20 text-zinc-600 group ${isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:border-indigo-500 cursor-pointer'}`}>
                            <Upload size={24} className="mb-2 group-hover:text-indigo-500 transition-colors" />
                            <span className="text-[9px] font-black uppercase tracking-widest leading-loose">{podFile ? podFile.name : "Drop POD Scan Here"}</span>
                            <input type="file" disabled={isDisabled} className="hidden" onChange={(e) => setPodFile(e.target.files ? e.target.files[0] : null)} />
                        </label>
                    </div>
                </div>
            </form>
        </div>
    );
};

const SelectField = ({ label, name, value, onChange, options }: any) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{label}</label>
        <select name={name} value={value} onChange={onChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-5 py-3.5 text-xs font-bold text-white outline-none focus:border-indigo-500 appearance-none transition-all cursor-pointer">
            <option value="">Select {label}</option>
            {options.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);

export default AddTrip;