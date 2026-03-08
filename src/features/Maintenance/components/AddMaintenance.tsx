import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    Save, Plus, Trash2, ChevronLeft, Wrench,
    FileText, Activity, CreditCard, Upload,
    MapPin, Hash, Info, Lightbulb, BadgeCheck
} from 'lucide-react';
import { useMaintenance } from '../hooks/useMaintenance';
import { useTrucks } from '../../Trucks/hooks/TrucksHooks';
import InputField from '../../AdminDashboard/helpers/InputField';

const AddMaintenance = () => {
    const navigate = useNavigate();
    const { handleAddMaintenance, maintLoading } = useMaintenance();
    const { trucks, refreshTrucks } = useTrucks();

    useEffect(() => {
        refreshTrucks();
    }, []);

    // --- Form State ---
    const [formData, setFormData] = useState({
        // Required
        vehicleId: '',
        category: 'MECHANICAL',
        workshopName: '',
        odometerReading: '',
        serviceDate: new Date().toISOString().split('T')[0],

        // Optional Details
        workshopLocation: '',
        invoiceNumber: '',
        description: '',
        completionDate: '',
        nextServiceOdo: '',
        isPreventive: false,

        // Financials (Some required for GrandTotal)
        laborCost: 0,
        otherCharges: 0,
        paymentMethod: 'CASH',
        paidAmount: 0,
        status: 'COMPLETED',
    });

    const [items, setItems] = useState([{ name: '', quantity: 1, unitPrice: 0 }]);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);

    // --- Logic: Real-time Financials ---
    const financialTotals = useMemo(() => {
        const itemsTotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const grandTotal = itemsTotal + Number(formData.laborCost) + Number(formData.otherCharges);
        const balance = grandTotal - Number(formData.paidAmount);

        let paymentStatus: 'PAID' | 'PENDING' | 'PARTIAL' = 'PENDING';
        if (Number(formData.paidAmount) >= grandTotal) paymentStatus = 'PAID';
        else if (Number(formData.paidAmount) > 0) paymentStatus = 'PARTIAL';

        return { itemsTotal, grandTotal, balance, paymentStatus };
    }, [items, formData.laborCost, formData.otherCharges, formData.paidAmount]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        });
    };

    const handleItemChange = (index: number, field: string, value: string | number) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const addItemRow = () => setItems([...items, { name: '', quantity: 1, unitPrice: 0 }]);
    const removeItemRow = (index: number) => setItems(items.filter((_, i) => i !== index));

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validation for Required Fields
        if (!formData.vehicleId || !formData.workshopName || !formData.odometerReading) {
            return toast.error("Please fill all required fields marked with *");
        }

        const tid = toast.loading("Syncing with fleet ledger...");

        try {
            // 2. Initialize FormData for Multer & Controller compatibility
            const data = new FormData();

            // 3. Append core form fields
            // We iterate through formData to append all text/number fields
            Object.keys(formData).forEach((key) => {
                data.append(key, (formData as any)[key]);
            });

            // 4. Append Calculated Values (Accounting)
            data.append("paymentStatus", financialTotals.paymentStatus);
            data.append("balanceAmount", financialTotals.balance.toString());
            data.append("grandTotal", financialTotals.grandTotal.toString());

            // 5. Stringify Items Array 
            // Your controller uses JSON.parse(items), so we must stringify here
            const processedItems = items.map(item => ({
                ...item,
                totalPrice: Number(item.quantity) * Number(item.unitPrice)
            }));
            data.append("items", JSON.stringify(processedItems));

            // 6. Append the File (Physical Proof)
            if (receiptFile) {
                // Must match 'receiptFile' as expected by your controller/multer setup
                data.append("receiptFile", receiptFile);
            }

            // 7. Execute Request via Hook
            const res = await handleAddMaintenance(data);

            if (res.success) {
                toast.success("Entry Logged Successfully", { id: tid });
                navigate('/admin-dashboard/truck/maintenance');
            } else {
                toast.error(res.message || "Registry Update Failed", { id: tid });
            }
        } catch (error) {
            toast.error("An error occurred while saving", { id: tid });
            console.error(error);
        }
    };

    return (
        <div className={`p-4 lg:p-8 max-w-[1500px] mx-auto min-h-screen bg-[#020202] text-zinc-400 font-sans transition-opacity duration-300 ${maintLoading ? 'opacity-70 pointer-events-none' : 'opacity-100'}`}>

            <header className="flex items-center justify-between mb-10 bg-neutral-900/40 border border-white/5 p-5 rounded-[24px] backdrop-blur-xl sticky top-6 z-50 shadow-2xl">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        disabled={maintLoading}
                        className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl hover:text-white transition-all shadow-lg disabled:opacity-50"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-white uppercase tracking-tighter">Log Service Event</h1>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mt-1">
                            <Activity size={12} className={maintLoading ? "animate-pulse text-indigo-500" : "text-indigo-500"} />
                            {maintLoading ? "PROTOCOL UPLOADING..." : "Registry Protocol V2.2"}
                        </p>
                    </div>
                </div>

                <button
                    onClick={onSubmit}
                    disabled={maintLoading}
                    className="relative bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/30 transition-all flex items-center gap-2 active:scale-95 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none min-w-[180px] justify-center overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {maintLoading ? (
                            <motion.div
                                key="loader"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Processing...</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="text"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                <Save size={16} /> Finalize Entry
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </header>

            <fieldset disabled={maintLoading} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* LEFT: Core Registry & Billing */}
                <div className="lg:col-span-8 space-y-6">

                    {/* SECTION: REQUIRED DATA */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 space-y-8 shadow-xl">
                        <SectionHeader title="Essential Registry Data" icon={<Wrench size={18} />} required />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Vehicle *</label>
                                <select name="vehicleId" value={formData.vehicleId} onChange={handleInputChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-5 py-3.5 text-xs font-bold text-white outline-none focus:border-indigo-500 appearance-none disabled:cursor-not-allowed">
                                    <option value="">Select Plate...</option>
                                    {trucks.map(t => <option key={t._id} value={t._id}>{t.truckNumber}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Category *</label>
                                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-5 py-3.5 text-xs font-bold text-white outline-none focus:border-indigo-500 appearance-none disabled:cursor-not-allowed">
                                    <option value="MECHANICAL">MECHANICAL</option>
                                    <option value="ELECTRICAL">ELECTRICAL</option>
                                    <option value="TYRE">TYRE</option>
                                    <option value="BODY_ACCESSORIES">BODY ACCESSORIES</option>
                                    <option value="ROUTINE_SERVICE">ROUTINE SERVICE</option>
                                </select>
                            </div>
                            <InputField label="Workshop Name *" name="workshopName" value={formData.workshopName} onChange={handleInputChange} />
                            <InputField label="Current Odometer *" name="odometerReading" type="number" value={formData.odometerReading} onChange={handleInputChange} />
                        </div>
                    </div>

                    {/* SECTION: BILL ITEMIZATION */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 space-y-8 shadow-xl">
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-6">
                            <SectionHeader title="Bill Itemization" icon={<FileText size={18} />} required />
                            <button
                                type="button"
                                onClick={addItemRow}
                                disabled={maintLoading}
                                className="flex items-center gap-2 bg-indigo-600/10 text-indigo-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus size={14} /> Add Line Item
                            </button>
                        </div>
                        <div className="space-y-4 mt-6">
                            {items.map((item, index) => (
                                <div key={index} className="flex flex-col md:flex-row items-end gap-4 bg-black/30 p-4 rounded-2xl border border-neutral-800/50">
                                    <div className="flex-grow space-y-1.5 w-full">
                                        <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest ml-1">Part Description</label>
                                        <input type="text" value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500 disabled:opacity-50" placeholder="e.g. Engine Oil" />
                                    </div>
                                    <div className="w-full md:w-20 space-y-1.5">
                                        <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest ml-1">Qty</label>
                                        <input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500 disabled:opacity-50" />
                                    </div>
                                    <div className="w-full md:w-32 space-y-1.5">
                                        <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest ml-1">Price (₹)</label>
                                        <input type="number" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500 disabled:opacity-50" />
                                    </div>
                                    {items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItemRow(index)}
                                            disabled={maintLoading}
                                            className="p-3 text-zinc-600 hover:text-red-500 transition-colors disabled:opacity-50"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION: LIFECYCLE INTEL */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 space-y-8 shadow-xl border-l-4 border-l-indigo-500/30">
                        <SectionHeader title="Lifecycle Intelligence" icon={<Lightbulb size={18} />} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Workshop Location" name="workshopLocation" value={formData.workshopLocation} onChange={handleInputChange} />
                            <InputField label="Invoice Number" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleInputChange} />
                            <InputField label="Next Service (ODO)" name="nextServiceOdo" type="number" value={formData.nextServiceOdo} onChange={handleInputChange} />
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Completion Date</label>
                                <input name="completionDate" type="date" value={formData.completionDate} onChange={handleInputChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-5 py-3.5 text-xs font-bold text-white outline-none focus:border-indigo-500 disabled:opacity-50" />
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-black/40 rounded-2xl border border-neutral-800 md:col-span-2">
                                <input type="checkbox" name="isPreventive" checked={formData.isPreventive} onChange={handleInputChange} className="w-4 h-4 accent-indigo-500" />
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Mark as Preventive Maintenance</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Financials & Files */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-[120px]">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 space-y-6 shadow-2xl border-t-indigo-500 border-t-4">
                        <SectionHeader title="Reconciliation" icon={<CreditCard size={16} />} required />
                        <div className="space-y-4">
                            <InputField label="Labor Cost" name="laborCost" type="number" value={formData.laborCost} onChange={handleInputChange} />
                            <InputField label="Other Charges" name="otherCharges" type="number" value={formData.otherCharges} onChange={handleInputChange} />
                            <InputField label="Amount Paid" name="paidAmount" type="number" value={formData.paidAmount} onChange={handleInputChange} />

                            <div className="mt-6 p-5 bg-black/50 rounded-[24px] border border-neutral-800 space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                    <span>Bill Amount</span>
                                    <span className="text-white">₹{financialTotals.grandTotal.toLocaleString()}</span>
                                </div>
                                <div className={`flex justify-between items-center text-[10px] font-black uppercase tracking-widest ${financialTotals.balance > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                    <span>Balance Due</span>
                                    <span>₹{financialTotals.balance.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 space-y-4 shadow-xl">
                        <SectionHeader title="Physical Proof" icon={<Upload size={16} />} />
                        <label className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-neutral-800 rounded-3xl transition-all cursor-pointer group ${maintLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-500/50 hover:bg-indigo-500/5'}`}>
                            <input type="file" className="hidden" disabled={maintLoading} onChange={(e) => setReceiptFile(e.target.files ? e.target.files[0] : null)} />
                            <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center text-zinc-500">
                                {receiptFile ? <BadgeCheck className="text-emerald-500" /> : <Upload size={20} />}
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">{receiptFile ? "Bill Uploaded" : "Upload Receipt"}</p>
                            </div>
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
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">
            {title} {required && <span className="text-red-500">*</span>}
        </h3>
    </div>
);

export default AddMaintenance;