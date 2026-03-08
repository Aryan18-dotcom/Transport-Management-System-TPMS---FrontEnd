import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
    Save, UserPlus, Truck, User, ShieldCheck,
    Edit3, Upload, RefreshCw, AlertCircle, FileText,
    BadgeCheck, ChevronLeft, Boxes, Zap, Fingerprint,
    Download
} from "lucide-react";
import { useTrucks } from "../../Trucks/hooks/TrucksHooks";
import { useDrivers } from "../../Drivers/hooks/DriversHook";
import InputField from "../../AdminDashboard/helpers/InputField";

export default function EditTruckDetail() {
    const { truckId } = useParams();
    const navigate = useNavigate();

    const { handleUpdateTruck, GetDriverAndTruckDetails, handleAssignDriver, truckLoading } = useTrucks();
    const { drivers, refreshDrivers, handleRevokeTruck } = useDrivers();

    const [formData, setFormData] = useState<any>(null);
    const [assignedDriver, setAssignedDriver] = useState<any>(null);
    const [quickAssignId, setQuickAssignId] = useState("");
    const [newFiles, setNewFiles] = useState<any>({ rcFile: null, insuranceFile: null, fitnessFile: null });

    const formatDate = (isoString: string) => isoString ? isoString.split("T")[0] : "";

    useEffect(() => {
        const loadInitialData = async () => {
            if (!truckId) return;
            const res = await GetDriverAndTruckDetails(truckId);
            if (res.success) {
                const v = res.truckDetails;
                setFormData({
                    ...v,
                    rcExpiryDate: formatDate(v.rcExpiryDate),
                    insuranceExpiryDate: formatDate(v.insuranceExpiryDate),
                    fitnessCertExpiryDate: formatDate(v.fitnessCertExpiryDate),
                    nationalPermitExpiryDate: formatDate(v.nationalPermitExpiryDate),
                });
                setAssignedDriver(res.driverDetails || null);
            }
            refreshDrivers();
        };
        loadInitialData();
    }, [truckId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewFiles({ ...newFiles, [e.target.name]: e.target.files[0] });
            toast.success("Document staged for synchronization");
        }
    };

    const onQuickAssign = async () => {
        if (!quickAssignId) return toast.error("Select personnel");
        const tid = toast.loading("Executing handover protocol...");
        const res = await handleAssignDriver(quickAssignId, truckId!);
        if (res.success) {
            toast.success("Assignment established", { id: tid });
            const updated = await GetDriverAndTruckDetails(truckId!);
            if (updated.success) setAssignedDriver(updated.driverDetails);
            setQuickAssignId("");
        } else {
            toast.error(res.message, { id: tid });
        }
    };

    const onRevokeCurrentDriver = async () => {
        if (!assignedDriver) return;
        const tid = toast.loading("Terminating vehicle access...");
        const res = await handleRevokeTruck(assignedDriver._id);
        if (res.success) {
            toast.success("Personnel unlinked", { id: tid });
            setAssignedDriver(null);
        } else {
            toast.error(res.message, { id: tid });
        }
    };

    const onUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const tid = toast.loading("Syncing Registry...");
        const data = new FormData();
        const allowedFields = [
            'truckNumber', 'truckType', 'capacityTons', 'status',
            'rcNumber', 'rcExpiryDate', 'insuranceNumber',
            'insuranceExpiryDate', 'fitnessCertExpiryDate', 'nationalPermitExpiryDate'
        ];

        allowedFields.forEach(key => {
            if (formData[key] !== undefined && formData[key] !== null) {
                data.append(key, formData[key]);
            }
        });

        if (newFiles.rcFile) data.append("rcFile", newFiles.rcFile);
        if (newFiles.insuranceFile) data.append("insuranceFile", newFiles.insuranceFile);
        if (newFiles.fitnessFile) data.append("fitnessFile", newFiles.fitnessFile);

        const res = await handleUpdateTruck(truckId!, data);
        if (res.success) {
            toast.success("Registry Synchronized", { id: tid });
            navigate("/admin-dashboard/truck/all");
        } else {
            toast.error(res.message || "Update failed", { id: tid });
        }
    };

    if (!formData) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#020202] gap-4">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <RefreshCw className="text-indigo-500" size={32} />
            </motion.div>
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Telemetry Handshake...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020202] text-zinc-400 p-4 lg:p-8 font-sans selection:bg-indigo-500/30 relative">
            
            {/* 1. EXECUTIVE COMMAND BAR */}
            <header className="max-w-[1700px] mx-auto mb-8 flex items-center justify-between bg-neutral-900/40 border border-white/5 p-4 rounded-[24px] backdrop-blur-md sticky top-0 z-50 shadow-2xl">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl hover:text-white transition-all shrink-0">
                        <ChevronLeft size={18} />
                    </button>
                    <div className="min-w-0">
                        <h1 className="text-lg font-black text-white uppercase tracking-tight truncate">{formData.truckNumber}</h1>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 truncate">
                            <Fingerprint size={10} className="text-indigo-500" /> UID: {formData._id.slice(-6).toUpperCase()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                    <button onClick={() => navigate(-1)} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all hidden sm:block">Discard</button>
                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={onUpdate} disabled={truckLoading}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2"
                    >
                        <Save size={14} /> Update Sync
                    </motion.button>
                </div>
            </header>

            <main className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                <div className="lg:col-span-2 space-y-6">
                    
                    {/* 🔥 2. TRACK RECORD GRID (NOW AT TOP) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        <DocItem label="Registration" url={formData.rcDocumentUrl} date={formData.rcExpiryDate} />
                        <DocItem label="Insurance" url={formData.insuranceDocumentUrl} date={formData.insuranceExpiryDate} />
                        <DocItem label="Fitness Cert" url={formData.fitnessCertExpiryDate} date={formData.fitnessCertExpiryDate} />
                        <DocItem label="Permit" url={formData.nationalPermitExpiryDate} date={formData.nationalPermitExpiryDate} />
                    </div>

                    {/* 3. OPERATIONAL STATE */}
                    <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-neutral-900/80 border border-neutral-800 rounded-[32px] p-6 space-y-6 shadow-xl">
                        <SectionHeader title="Deployment State" icon={<Zap size={14} />} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <StatusCard label="Active Status" name="status" value={formData.status} onChange={handleInputChange} options={['AVAILABLE', 'ON_TRIP', 'MAINTENANCE', 'IN_PARKING', 'IDLE']} />
                            <div className="p-4 bg-black/40 rounded-2xl border border-neutral-800 flex flex-col justify-center min-w-0">
                                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Registry Last Modified</span>
                                <p className="text-xs font-bold text-white truncate">{new Date(formData.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </motion.section>

                    {/* 4. DATA ENTRY FORM */}
                    <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={onUpdate} className="space-y-6">
                        <div className="bg-neutral-900 border border-neutral-800 rounded-[40px] p-8 shadow-xl">
                            <SectionHeader title="Technical Specifications" icon={<Boxes size={18} />} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <InputField label="License Plate" name="truckNumber" value={formData.truckNumber} onChange={handleInputChange} />
                                <StatusCard label="Body Type" name="truckType" value={formData.truckType} onChange={handleInputChange} options={['OPEN', 'CONTAINER', 'TRAILER', 'HALF_BODY']} />
                                <InputField label="Capacity (Tons)" name="capacityTons" type="number" value={formData.capacityTons} onChange={handleInputChange} />
                                <InputField label="RC Number" name="rcNumber" value={formData.rcNumber} onChange={handleInputChange} />
                            </div>

                            <div className="h-px bg-white/5 my-10" />

                            <SectionHeader title="Compliance Registry" icon={<ShieldCheck size={18} />} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <InputField label="RC Expiry" name="rcExpiryDate" type="date" value={formData.rcExpiryDate} onChange={handleInputChange} />
                                <InputField label="Permit Expiry" name="nationalPermitExpiryDate" type="date" value={formData.nationalPermitExpiryDate} onChange={handleInputChange} />
                                <InputField label="Insurance Expiry" name="insuranceExpiryDate" type="date" value={formData.insuranceExpiryDate} onChange={handleInputChange} />
                                <InputField label="Fitness Expiry" name="fitnessCertExpiryDate" type="date" value={formData.fitnessCertExpiryDate} onChange={handleInputChange} />
                            </div>
                        </div>

                        {/* VAULT */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-[40px] p-8 shadow-xl">
                            <SectionHeader title="Digital Vault" icon={<FileText size={18} />} />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <VaultSlot label="Registration" name="rcFile" file={newFiles.rcFile} url={formData.rcDocumentUrl} onChange={handleFileChange} />
                                <VaultSlot label="Insurance" name="insuranceFile" file={newFiles.insuranceFile} url={formData.insuranceDocumentUrl} onChange={handleFileChange} />
                                <VaultSlot label="Fitness" name="fitnessFile" file={newFiles.fitnessFile} url={formData.fitnessDocumentUrl} onChange={handleFileChange} />
                            </div>
                        </div>
                    </motion.form>
                </div>

                {/* SIDEBAR: PERSONNEL CONTROL */}
                <div className="lg:col-span-1 sticky top-24 space-y-6">
                    <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 space-y-6 border-t-indigo-500 border-t-4 shadow-2xl relative overflow-hidden">
                        <SectionHeader title="Operator Assignment" icon={<User size={14} />} />

                        <AnimatePresence mode="wait">
                            {assignedDriver ? (
                                <motion.div key="assigned" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="space-y-4">
                                    <div className="p-4 bg-black/40 border border-neutral-800 rounded-[20px] flex items-center gap-4 min-w-0">
                                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0">{assignedDriver.firstName[0]}</div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-black text-white uppercase truncate">{assignedDriver.firstName} {assignedDriver.lastName}</p>
                                            <p className="text-[9px] font-bold text-zinc-500 uppercase truncate">{assignedDriver.phoneNum}</p>
                                        </div>
                                    </div>
                                    <button onClick={onRevokeCurrentDriver} className="w-full py-2.5 bg-red-500/5 text-red-500 border border-red-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Terminate Link</button>
                                </motion.div>
                            ) : (
                                <div className="py-8 bg-black/20 border border-dashed border-neutral-800 rounded-[20px] flex flex-col items-center gap-2">
                                    <UserPlus size={20} className="text-zinc-800" />
                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Operator Unassigned</span>
                                </div>
                            )}
                        </AnimatePresence>

                        <div className="pt-6 border-t border-neutral-800 space-y-4">
                            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">New Handover</label>
                            <div className="relative">
                                <select
                                    value={quickAssignId}
                                    onChange={(e) => setQuickAssignId(e.target.value)}
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-[11px] text-white outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                                >
                                    <option value="">Personnel Registry...</option>
                                    {drivers.filter(d => d.status === 'AVAILABLE').map(d => (
                                        <option key={d._id} value={d._id}>{d.firstName} {d.lastName}</option>
                                    ))}
                                </select>
                                <Edit3 size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 pointer-events-none" />
                            </div>
                            <motion.button whileTap={{ scale: 0.95 }} onClick={onQuickAssign} disabled={!quickAssignId} className="w-full py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 disabled:bg-neutral-800 disabled:text-zinc-600">Assign Personnel</motion.button>
                        </div>
                    </motion.section>
                </div>
            </main>
        </div>
    );
}

/* --- UI HELPER COMPONENTS --- */

function DocItem({ label, url, date }: any) {
    const calculateDays = (expiryDate: string) => {
        if (!expiryDate) return { days: 0, status: 'MISSING' };
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiry = new Date(expiryDate);
        const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return { days: Math.abs(diffDays), status: 'EXPIRED' };
        if (diffDays <= 15) return { days: diffDays, status: 'CRITICAL' };
        return { days: diffDays, status: 'STABLE' };
    };

    const { days, status } = calculateDays(date);

    // Redesign: 15-day logic update
    const themes: any = {
        EXPIRED: { color: 'text-red-500', indicator: 'bg-red-500', label: 'Update Required' },
        CRITICAL: { color: 'text-amber-500', indicator: 'bg-amber-500', label: 'Urgent Sync' },
        STABLE: { color: 'text-emerald-500', indicator: 'bg-emerald-500', label: 'Compliant' },
        MISSING: { color: 'text-zinc-600', indicator: 'bg-zinc-800', label: 'No Data' }
    };
    const current = themes[status];

    return (
        <div className="bg-neutral-950 border border-neutral-800 rounded-[24px] p-4 flex flex-col gap-4 group hover:border-indigo-500/40 transition-all min-w-0">
            <div className="flex items-start justify-between min-w-0">
                <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center border border-neutral-800 text-zinc-500 group-hover:text-indigo-400 transition-all shrink-0">
                    <FileText size={18} strokeWidth={1.5} />
                </div>
                {url && (
                    <a href={url} target="_blank" rel="noreferrer" className="p-2 bg-neutral-900 text-zinc-500 hover:text-white rounded-lg border border-neutral-800 transition-all">
                        <Download size={12} />
                    </a>
                )}
            </div>
            
            <div className="min-w-0">
                <span className="block text-[11px] font-black text-white uppercase tracking-tight truncate leading-tight mb-1">{label}</span>
                <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${current.indicator} ${status === 'EXPIRED' ? 'animate-pulse' : ''} shrink-0`} />
                    <span className={`text-[8px] uppercase font-black tracking-widest truncate ${current.color}`}>
                        {current.label}
                    </span>
                </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-baseline justify-between">
                <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest">Time Remaining</p>
                <p className={`text-sm font-black tracking-tighter ${current.color}`}>
                    {status === 'MISSING' ? 'N/A' : (status === 'EXPIRED' ? `-${days}d` : `${days}d`)}
                </p>
            </div>
        </div>
    );
}

const SectionHeader = ({ title, icon }: any) => (
    <div className="flex items-center gap-2 text-zinc-500 mb-2 min-w-0">
        <span className="text-indigo-500 shrink-0">{icon}</span>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] truncate">{title}</h3>
    </div>
);

const StatusCard = ({ label, name, value, onChange, options }: any) => (
    <div className="space-y-1.5 flex-1 min-w-0">
        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1 truncate block">{label}</label>
        <div className="relative">
            <select name={name} value={value} onChange={onChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-indigo-500 appearance-none cursor-pointer transition-all">
                {options.map((opt: string) => <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>)}
            </select>
            <Edit3 size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 pointer-events-none" />
        </div>
    </div>
);

const VaultSlot = ({ label, name, file, url, onChange }: any) => (
    <div className="bg-black/50 border border-neutral-800/60 p-4 rounded-[24px] hover:border-indigo-500/20 transition-all group flex flex-col h-full min-w-0">
        <div className="flex items-center justify-between mb-4 min-w-0 gap-2">
            <span className="text-[9px] font-black text-zinc-500 uppercase truncate">{label}</span>
            {url && <a href={url} target="_blank" rel="noreferrer" className="text-[8px] text-indigo-500 font-black hover:text-white uppercase shrink-0">View</a>}
        </div>
        <label className={`flex-grow flex flex-col items-center justify-center gap-2 py-5 rounded-xl border-2 border-dashed text-[9px] font-black cursor-pointer transition-all ${file ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500' : 'bg-neutral-900 border-neutral-800 text-zinc-700'}`}>
            <input type="file" name={name} className="hidden" onChange={onChange} />
            {file ? <BadgeCheck size={18} /> : <Upload size={18} />}
            <span className="uppercase tracking-tight text-center px-2 truncate w-full">{file ? "Ready" : "Replace"}</span>
        </label>
    </div>
);