import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Save, Plus, Trash2, ChevronLeft, Wrench, 
    FileText, CreditCard, Upload, Eye, History, 
    BadgeCheck, Activity, Lightbulb, AlertTriangle, X 
} from 'lucide-react';
import { useMaintenance } from '../hooks/useMaintenance';
import { useTrucks } from '../../Trucks/hooks/TrucksHooks';
import InputField from '../../AdminDashboard/helpers/InputField';

const EditMaintenance = () => {
    const { recordId } = useParams();
    const navigate = useNavigate();
    const { getMaintenanceById, handleUpdateMaintenance, handleDeleteRecord, maintLoading } = useMaintenance();
    const { trucks, refreshTrucks } = useTrucks();

    // --- State Management ---
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState<any>({
        vehicleId: '',
        category: 'MECHANICAL',
        workshopName: '',
        odometerReading: '',
        serviceDate: '',
        workshopLocation: '',
        invoiceNumber: '',
        description: '',
        completionDate: '',
        nextServiceOdo: '',
        isPreventive: false,
        laborCost: 0,
        otherCharges: 0,
        paymentMethod: 'CASH',
        paymentStatus: 'PENDING',
        paidAmount: 0,
        status: 'COMPLETED',
    });

    const [items, setItems] = useState([{ name: '', quantity: 1, unitPrice: 0 }]);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [existingReceipt, setExistingReceipt] = useState("");

    // --- Dynamic Preview logic for replacing the bill ---
    const newFilePreview = useMemo(() => {
        return receiptFile ? URL.createObjectURL(receiptFile) : null;
    }, [receiptFile]);

    // --- Initial Fetch & Data Normalization ---
    useEffect(() => {
        const loadInitialData = async () => {
            const tid = toast.loading("Syncing with ledger...");
            await refreshTrucks();
            const res = await getMaintenanceById(recordId!);
            
            if (res.success) {
                const data = res.data;
                setFormData({
                    vehicleId: data.vehicleId?._id || data.vehicleId || '',
                    category: data.category || 'MECHANICAL',
                    workshopName: data.workshopName || '',
                    odometerReading: data.odometerReading || '',
                    serviceDate: data.serviceDate ? new Date(data.serviceDate).toISOString().split('T')[0] : '',
                    workshopLocation: data.workshopLocation || '',
                    invoiceNumber: data.invoiceNumber || '',
                    description: data.description || '',
                    completionDate: data.completionDate ? new Date(data.completionDate).toISOString().split('T')[0] : '',
                    nextServiceOdo: data.nextServiceOdo || '',
                    isPreventive: data.isPreventive || false,
                    laborCost: data.laborCost || 0,
                    otherCharges: data.otherCharges || 0,
                    paymentMethod: data.paymentMethod || 'CASH',
                    paymentStatus: data.paymentStatus || 'PENDING',
                    paidAmount: data.paidAmount || 0,
                    status: data.status || 'COMPLETED',
                });
                setItems(data.items || []);
                setExistingReceipt(data.receiptUrl || "");
                toast.dismiss(tid);
            } else {
                toast.error("Record access failed", { id: tid });
                navigate('/admin-dashboard/truck/maintenance/manage');
            }
        };
        loadInitialData();
    }, [recordId]);

    // --- Real-time Financial Reconciliation ---
    const financialTotals = useMemo(() => {
        const itemsTotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const grandTotal = itemsTotal + Number(formData.laborCost) + Number(formData.otherCharges);
        const currentPaid = formData.paymentStatus === 'PAID' ? grandTotal : Number(formData.paidAmount);
        const balance = grandTotal - currentPaid;
        return { itemsTotal, grandTotal, balance };
    }, [items, formData.laborCost, formData.otherCharges, formData.paidAmount, formData.paymentStatus]);

    // --- Form Handlers ---
    const handleInputChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleItemChange = (index: number, field: string, value: string | number) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const addItemRow = () => setItems([...items, { name: '', quantity: 1, unitPrice: 0 }]);
    const removeItemRow = (index: number) => setItems(items.filter((_, i) => i !== index));

    // --- Persistence Handlers ---
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const tid = toast.loading("Updating Digital Registry...");
        try {
            const data = new FormData();
            const { _id, companyId, addedBy, createdAt, updatedAt, __v, ...cleanData } = formData;
            Object.keys(cleanData).forEach(key => data.append(key, cleanData[key]));
            
            data.append("grandTotal", financialTotals.grandTotal.toString());
            data.append("items", JSON.stringify(items));
            if (receiptFile) data.append("receiptFile", receiptFile);

            const res = await handleUpdateMaintenance(recordId!, data);
            if (res.success) {
                toast.success("Ledger Synchronized", { id: tid });
                navigate('/admin-dashboard/truck/maintenance/manage');
            }
        } catch (error) { toast.error("System Failure", { id: tid }); }
    };

    const confirmDeletion = async () => {
        const tid = toast.loading("Purging Registry Entry...");
        const res = await handleDeleteRecord(recordId!);
        console.log(res);
        
        if (res.success) {
            toast.success("Record Purged Permanently", { id: tid });
            navigate('/admin-dashboard/truck/maintenance/manage');
        } else {
            toast.error("Purge Failed", { id: tid });
            setShowDeleteModal(false);
        }
    };

    return (
        <div className={`p-4 lg:p-8 max-w-[1500px] mx-auto min-h-screen bg-[#020202] text-zinc-400 transition-all ${maintLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            
            {/* DANGER ZONE: PURGE MODAL */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-md bg-neutral-900 border border-red-500/20 rounded-[32px] p-8 shadow-2xl overflow-hidden">
                            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-6"><AlertTriangle size={32} /></div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Purge Registry Entry?</h2>
                            <p className="text-xs text-zinc-500 font-bold mb-8 leading-relaxed">This will permanently remove the maintenance record for <span className="text-white">{formData.workshopName}</span> from the fleet history.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-6 py-3 rounded-xl bg-neutral-800 text-white text-[10px] font-black uppercase tracking-widest hover:bg-neutral-700">Cancel</button>
                                <button onClick={confirmDeletion} className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-500 shadow-xl shadow-red-600/20 active:scale-95 transition-all">Confirm Delete</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <header className="flex items-center justify-between mb-10 bg-neutral-900/40 border border-white/5 p-5 rounded-[24px] backdrop-blur-xl sticky top-6 z-50 shadow-2xl">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl hover:text-white transition-all shadow-lg"><ChevronLeft size={20} /></button>
                    <div>
                        <h1 className="text-xl font-black text-white uppercase tracking-tighter">Edit Service Record</h1>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mt-1">
                           <History size={12} className="text-indigo-500" /> REPAIR ID: {recordId?.slice(-8)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowDeleteModal(true)} className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-90" title="Delete Record"><Trash2 size={18} /></button>
                    <button onClick={handleUpdate} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/30 transition-all flex items-center gap-2 active:scale-95">
                        {maintLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" /> : <Save size={16} />}
                        Apply Changes
                    </button>
                </div>
            </header>

            <fieldset disabled={maintLoading} className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-none">
                
                {/* LEFT: Context & Breakdown */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 space-y-8 shadow-xl">
                        <SectionHeader title="Technical Context" icon={<Wrench size={18}/>} required />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Vehicle</label>
                                <select name="vehicleId" value={formData.vehicleId} onChange={handleInputChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-5 py-3.5 text-xs font-bold text-white outline-none">
                                    {trucks.map(t => <option key={t._id} value={t._id}>{t.truckNumber}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Operational State</label>
                                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-5 py-3.5 text-xs font-bold text-white outline-none">
                                    <option value="IN_PROGRESS">IN PROGRESS (Garage)</option>
                                    <option value="COMPLETED">COMPLETED (Released)</option>
                                </select>
                            </div>
                            <InputField label="Workshop Name" name="workshopName" value={formData.workshopName} onChange={handleInputChange} />
                            <InputField label="Odometer Reading" name="odometerReading" type="number" value={formData.odometerReading} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 space-y-8 shadow-xl">
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-6">
                            <SectionHeader title="Bill Itemization" icon={<FileText size={18}/>} required />
                            <button type="button" onClick={addItemRow} className="text-indigo-400 text-[10px] font-black uppercase flex items-center gap-2 hover:text-white transition-all"><Plus size={14} /> Add Line Item</button>
                        </div>
                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <div key={index} className="flex flex-col md:flex-row items-end gap-4 bg-black/30 p-4 rounded-2xl border border-neutral-800/50">
                                    <div className="flex-grow space-y-1.5 w-full">
                                        <input type="text" value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500" placeholder="Part Name" />
                                    </div>
                                    <div className="w-full md:w-32 space-y-1.5">
                                        <input type="number" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500" placeholder="Price" />
                                    </div>
                                    <button type="button" onClick={() => removeItemRow(index)} className="p-3 text-zinc-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Accounting & Proof */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-[120px]">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 space-y-6 shadow-2xl border-t-indigo-500 border-t-4">
                        <SectionHeader title="Accounting Sync" icon={<CreditCard size={16}/>} />
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Payment Method</label>
                                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none">
                                    <option value="CASH">CASH</option>
                                    <option value="UPI">UPI / G-PAY</option>
                                    <option value="CHEQUE">CHEQUE</option>
                                    <option value="NET_BANKING">NET BANKING</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Reconciliation State</label>
                                <select name="paymentStatus" value={formData.paymentStatus} onChange={handleInputChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none">
                                    <option value="PENDING">PENDING (Udhaar)</option>
                                    <option value="PARTIAL">PARTIAL PAYMENT</option>
                                    <option value="PAID">PAID (Clear)</option>
                                </select>
                            </div>
                            <InputField label="Paid Amount (₹)" name="paidAmount" type="number" value={formData.paidAmount} onChange={handleInputChange} />
                            
                            <div className="mt-6 p-5 bg-black/50 rounded-[24px] border border-neutral-800 space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-black text-zinc-500"><span>BILL TOTAL</span><span className="text-white font-bold">₹{financialTotals.grandTotal.toLocaleString()}</span></div>
                                <div className={`flex justify-between items-center text-[10px] font-black ${financialTotals.balance > 0 ? 'text-red-500' : 'text-emerald-500'}`}><span>BALANCE DUE</span><span>₹{financialTotals.balance.toLocaleString()}</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 space-y-4 shadow-xl">
                        <SectionHeader title="Proof of Repair" icon={<Upload size={16}/>} />
                        {existingReceipt && !receiptFile && (
                            <div className="relative group rounded-2xl overflow-hidden border border-neutral-800 aspect-video bg-black/20">
                                <img src={existingReceipt} alt="Existing" className="w-full h-full object-cover opacity-60 transition-all" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a href={existingReceipt} target="_blank" rel="noreferrer" className="bg-indigo-600 p-2.5 rounded-full text-white shadow-xl shadow-indigo-600/40"><Eye size={18} /></a>
                                </div>
                                <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-[7px] font-black text-zinc-400 uppercase">Registry Proof V1</div>
                            </div>
                        )}
                        {receiptFile && newFilePreview && (
                            <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-500/50 aspect-video">
                                <img src={newFilePreview} alt="New Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-4">
                                    <div className="flex items-center gap-2 overflow-hidden"><BadgeCheck size={16} className="text-emerald-500 shrink-0" /><p className="text-[10px] font-black text-white uppercase truncate">{receiptFile.name}</p></div>
                                </div>
                                <button type="button" onClick={() => setReceiptFile(null)} className="absolute top-2 right-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white p-1.5 rounded-lg"><Trash2 size={14} /></button>
                            </div>
                        )}
                        <label className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer group ${receiptFile ? 'border-indigo-500/30 bg-indigo-500/5' : 'border-neutral-800 hover:border-indigo-500'}`}>
                            <input type="file" className="hidden" onChange={(e) => setReceiptFile(e.target.files ? e.target.files[0] : null)} />
                            <Upload size={18} className="text-zinc-600 group-hover:text-indigo-400" />
                            <span className="text-[10px] font-black uppercase text-white">{receiptFile ? "Change Selection" : "Replace Receipt"}</span>
                        </label>
                    </div>
                </div>
            </fieldset>
        </div>
    );
};

const SectionHeader = ({ title, icon, required }: any) => (
    <div className="flex items-center gap-2 text-zinc-500">
        <span className="text-indigo-500">{icon}</span>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">{title} {required && "*"}</h3>
    </div>
);

export default EditMaintenance;