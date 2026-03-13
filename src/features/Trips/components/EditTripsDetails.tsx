import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    Save, ChevronLeft, LucideTruckElectric, Building2,
    MapPin, Banknote, Upload, ClipboardList, ShieldCheck,
    Calculator, CalendarClock, History, CheckCircle2,
    Eye, Trash2, AlertTriangle, X, Wallet
} from 'lucide-react';

// Hooks
import { useTrips } from '../hooks/useTrips';
import InputField from '../../AdminDashboard/helpers/InputField';

const EditTripsDetails = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const { getTripDetails, handleUpdateDetails, deleteTripDetsById, tripsLoading } = useTrips();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [formData, setFormData] = useState({
        lrNumber: '',
        tripStartDate: '',
        tripEndDate: '',
        origin: '',
        destination: '',
        materialDescription: '',
        weight: '',
        rate: '',
        diten: '0',
        advancePaymentReceived: '0',
        status: '',
        paymentStatus: '', // 🔥 Added to priority UI
        partnerCompanyId: '',
        truckId: '',
        driverId: '',
    });

    const [podFile, setPodFile] = useState<File | null>(null);
    const [existingPod, setExistingPod] = useState("");

    // --- Load Data ---
    useEffect(() => {
        const fetchTrip = async () => {
            const res = await getTripDetails(tripId!);
            const data = await res.json();
            if (res.ok && data.trip) {
                const t = data.trip;
                setFormData({
                    lrNumber: t.lrNumber || '',
                    tripStartDate: t.tripStartDate ? t.tripStartDate.split('T')[0] : '',
                    tripEndDate: t.tripEndDate ? t.tripEndDate.split('T')[0] : '',
                    origin: t.origin || '',
                    destination: t.destination || '',
                    materialDescription: t.materialDescription || '',
                    weight: t.weight?.toString() || '',
                    rate: t.rate?.toString() || '',
                    diten: t.diten?.toString() || '0',
                    advancePaymentReceived: t.advancePaymentReceived?.toString() || '0',
                    status: t.status || 'SCHEDULED',
                    paymentStatus: t.paymentStatus || 'PENDING',
                    partnerCompanyId: t.partnerCompanyId?._id || t.partnerCompanyId,
                    truckId: t.truckId?._id || t.truckId,
                    driverId: t.driverId?._id || t.driverId,
                });
                if (t.podUrl) setExistingPod(t.podUrl);
            }
        };
        fetchTrip();
    }, [tripId]);

    const calculations = useMemo(() => {
        const w = parseFloat(formData.weight) || 0;
        const r = parseFloat(formData.rate) || 0;
        const d = parseFloat(formData.diten) || 0;
        const adv = parseFloat(formData.advancePaymentReceived) || 0;
        const totalFreight = (w * r) + d;
        const balance = Math.max(0, totalFreight - adv);
        return { totalFreight, balance };
    }, [formData.weight, formData.rate, formData.diten, formData.advancePaymentReceived]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    const onUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const tid = toast.loading("Syncing Trip Ledger...");
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'tripEndDate' && formData.status !== 'DELIVERED') return;
                data.append(key, (formData as any)[key]);
            });
            if (podFile) data.append("podFile", podFile);
            const res = await handleUpdateDetails(tripId!, data);
            if (res.ok) {
                toast.success("Ledger Updated", { id: tid });
                navigate(`/admin-dashboard/trips/manage`);
            } else {
                toast.error("Update failed", { id: tid });
                setIsSubmitting(false);
            }
        } catch (error) {
            toast.error("Network error", { id: tid });
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        const tid = toast.loading("Purging Record...");
        try {
            const res = await deleteTripDetsById(tripId!);
            if (res.ok) {
                toast.success("Record Deleted", { id: tid });
                navigate('/admin-dashboard/trips/manage');
            }
        } catch (error) {
            toast.error("Deletion error", { id: tid });
        } finally {
            setShowDeleteConfirm(false);
        }
    };

    const isDisabled = isSubmitting || tripsLoading;

    return (
        <div className={`p-4 lg:p-8 max-w-[1400px] mx-auto min-h-screen bg-[#020202] text-zinc-400 ${isDisabled ? 'opacity-80' : ''}`}>

            {/* Delete Modal remained same for safety */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-[32px] max-w-md w-full shadow-2xl space-y-6">
                        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto"><AlertTriangle size={32} /></div>
                        <div className="text-center space-y-2">
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Confirm Deletion</h2>
                            <p className="text-xs font-bold text-zinc-500 uppercase leading-relaxed">Remove LR <span className="text-white">{formData.lrNumber}</span>? This is permanent.</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3.5 rounded-xl bg-neutral-800 text-[10px] font-black uppercase">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 py-3.5 rounded-xl bg-red-600 text-white text-[10px] font-black uppercase">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="flex items-center justify-between mb-10 bg-neutral-900/40 border border-white/5 p-5 rounded-[24px] backdrop-blur-xl sticky top-6 z-50 shadow-2xl">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl hover:text-white transition-all shadow-lg"><ChevronLeft size={20} /></button>
                    <div>
                        <h1 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2"><History size={18} className="text-indigo-500" /> Operational Update</h1>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">LR Registry: {formData.lrNumber}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setShowDeleteConfirm(true)} className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-zinc-600 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                    <button onClick={onUpdate} disabled={isDisabled} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        {isDisabled ? <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" /> : <Save size={16} />} Finalize Changes
                    </button>
                </div>
            </header>

            <form onSubmit={onUpdate} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">

                {/* 1. PRIORITY BLOCK: PAYMENT & DELIVERY */}
                <div className="lg:col-span-12 space-y-6">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-xl border-t-indigo-500 border-t-4">
                        <div className="flex items-center gap-2 text-zinc-500 border-b border-neutral-800 pb-4 mb-6">
                            <ShieldCheck size={18} className="text-indigo-500" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Priority Execution Controls</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className='space-y-4'>
                                {/* LR Number */}
                                <InputField label="LR Number" name="lrNumber" type="text" value={formData.lrNumber} onChange={handleInputChange} icon={<Wallet size={16} />} />

                                {/* Delivery Status */}
                                <div className="space-y-4">
                                    <SelectField
                                        label="Trip Progress"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        options={[{ label: 'Scheduled', value: 'SCHEDULED' }, { label: 'In Transit', value: 'IN_TRANSIT' }, { label: 'Delivered', value: 'DELIVERED' }, { label: 'Cancelled', value: 'CANCELLED' }]}
                                    />
                                    {formData.status === 'DELIVERED' && (
                                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                            <InputField label="Arrival Date" name="tripEndDate" type="date" value={formData.tripEndDate} onChange={handleInputChange} icon={<CalendarClock size={16} />} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Payment Status */}
                            <div className="space-y-4">
                                <SelectField
                                    label="Accounting Status"
                                    name="paymentStatus"
                                    value={formData.paymentStatus}
                                    onChange={handleInputChange}
                                    options={[{ label: 'Pending', value: 'PENDING' }, { label: 'Partial', value: 'PARTIAL' }, { label: 'Completed', value: 'COMPLETED' }]}
                                />
                                <InputField label="Advance Rec. (₹)" name="advancePaymentReceived" type="text" value={formData.advancePaymentReceived} onChange={handleInputChange} icon={<Wallet size={16} />} />
                            </div>

                            {/* Live Financial Snapshot */}
                            <div className="bg-black/40 rounded-[24px] p-6 border border-white/5 space-y-4">
                                <div className="flex items-center gap-2 text-zinc-600 mb-2">
                                    <Calculator size={14} />
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">Ledger Preview</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Total Freight</span>
                                    <span className="text-lg font-black text-white">₹{calculations.totalFreight.toLocaleString()}</span>
                                </div>
                                <div className="pt-4 border-t border-neutral-800 flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Balance Due</span>
                                    <span className={`text-2xl font-black ${calculations.balance > 0 ? "text-red-500" : "text-emerald-500"}`}>
                                        ₹{calculations.balance.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. SECONDARY: LOGISTICS DETAILS */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 space-y-8 shadow-xl">
                        <div className="flex items-center gap-2 text-zinc-500 border-b border-neutral-800 pb-4">
                            <MapPin size={18} className="text-indigo-500" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Route & Pricing Specs</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Origin" name="origin" value={formData.origin} onChange={handleInputChange} />
                            <InputField label="Destination" name="destination" value={formData.destination} onChange={handleInputChange} />
                            <InputField label="Material" name="materialDescription" value={formData.materialDescription} onChange={handleInputChange} className="col-span-2" />
                            <InputField label="Weight (Tons)" name="weight" type="text" value={formData.weight} onChange={handleInputChange} />
                            <InputField label="Rate per Ton (₹)" name="rate" type="text" value={formData.rate} onChange={handleInputChange} />
                            <InputField label="Detention (₹)" name="diten" type="text" value={formData.diten} onChange={handleInputChange} />
                            <InputField label="Start Date" name="tripStartDate" type="date" value={formData.tripStartDate} onChange={handleInputChange} />
                        </div>
                    </div>
                </div>

                {/* 3. TERTIARY: DOCUMENTS & NOTICES */}
                <div className="lg:col-span-4 space-y-6">
                    {/* POD Section */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 text-center space-y-4 shadow-xl">
                        <div className="flex items-center justify-center gap-2 text-zinc-500"><ClipboardList size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Document Update</span></div>
                        <div className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-[24px] transition-all relative overflow-hidden ${existingPod && !podFile ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-neutral-800 bg-black/20'}`}>
                            {existingPod && !podFile ? (
                                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300 z-10">
                                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mb-2 border border-emerald-500/20"><CheckCircle2 size={20} /></div>
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Document on File</span>
                                    <div className="flex flex-col gap-2 mt-3">
                                        <a href={existingPod} target="_blank" rel="noreferrer" className="text-[9px] font-black bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg"><Eye size={12} /> View POD</a>
                                        <label className={`text-[8px] font-bold text-zinc-500 hover:text-indigo-400 cursor-pointer transition-colors uppercase tracking-widest ${isDisabled ? 'hidden' : 'block'}`}>Or Replace File<input type="file" disabled={isDisabled} className="hidden" onChange={(e) => setPodFile(e.target.files ? e.target.files[0] : null)} /></label>
                                    </div>
                                </div>
                            ) : (
                                <label className={`flex flex-col items-center justify-center w-full h-full cursor-pointer group ${isDisabled ? 'cursor-not-allowed' : ''}`}>
                                    <Upload size={20} className={`mb-2 transition-colors ${podFile ? 'text-indigo-400' : 'text-zinc-600 group-hover:text-indigo-500'}`} />
                                    <span className="text-[9px] font-black uppercase tracking-widest px-4 truncate w-full text-zinc-400">{podFile ? podFile.name : "Upload New POD Scan"}</span>
                                    <input type="file" disabled={isDisabled} className="hidden" onChange={(e) => setPodFile(e.target.files ? e.target.files[0] : null)} />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl">
                        <Building2 size={20} className="text-indigo-400 shrink-0" />
                        <p className="text-[8px] font-bold text-zinc-500 uppercase leading-relaxed">Asset assignments are locked to maintain registry integrity. Create new trip for vehicle changes.</p>
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

export default EditTripsDetails;