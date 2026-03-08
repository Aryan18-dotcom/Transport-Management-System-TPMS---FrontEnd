import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, Wrench, Calendar, MapPin, Hash, FileText, Printer, 
    ExternalLink, CreditCard, Download,
    Toolbox,
    PenIcon
} from 'lucide-react';
import { useMaintenance } from '../hooks/useMaintenance';
import { toast } from 'react-hot-toast';

const MaintenanceDetails = () => {
    const { recordId } = useParams();
    const navigate = useNavigate();
    const { getMaintenanceById } = useMaintenance();
    const [record, setRecord] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            const data = await getMaintenanceById(recordId!);
            
            if (data.success) {
                setRecord(data.data);
            } else {
                toast.error("Failed to retrieve maintenance registry");
                navigate(-1);
            }
            setLoading(false);
        };
        fetchDetails();
    }, [recordId]);

    if (loading) return (
        <div className="min-h-screen bg-[#020202] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
    );

    const paymentStyles: any = {
        PAID: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        PARTIAL: "text-orange-400 bg-orange-500/10 border-orange-500/20",
        PENDING: "text-red-400 bg-red-500/10 border-red-500/20",
    };

    return (
        <div className="p-4 lg:p-8 max-w-[1200px] mx-auto min-h-screen bg-[#020202] text-zinc-300">
            
            {/* Action Header */}
            <header className="flex items-center justify-between mb-8">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all"
                >
                    <ChevronLeft size={16} /> Back to Ledger
                </button>
                <div className="flex gap-3">
                    <button className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl hover:text-white transition-all">
                        <Printer size={18} />
                    </button>
                    <button onClick={()=>{navigate(`/admin-dashboard/truck/maintenance/manage/${recordId}`)}} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2">
                        <PenIcon size={16} /> Update Report
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT: Core Bill Info */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* Header Info Card */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border uppercase ${paymentStyles[record.paymentStatus]}`}>
                                {record.paymentStatus}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                                <Wrench size={28} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-white uppercase tracking-tighter">{record.vehicleId?.truckNumber}</h1>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{record.category?.replace('_', ' ')} Service</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-neutral-800">
                            <DataPoint icon={<Calendar size={14}/>} label="Service Date" value={new Date(record.serviceDate).toLocaleDateString()} />
                            <DataPoint icon={<MapPin size={14}/>} label="Workshop" value={record.workshopName} />
                            <DataPoint icon={<Hash size={14}/>} label="Invoice #" value={record.invoiceNumber || 'N/A'} />
                            <DataPoint icon={<Toolbox size={14}/>} label="Odometer" value={`${record.odometerReading?.toLocaleString()} KM`} />
                        </div>
                    </div>

                    {/* Itemized Table */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] overflow-hidden">
                        <div className="p-8 border-b border-neutral-800">
                            <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <FileText size={16} className="text-indigo-500" /> Parts & Labor Breakdown
                            </h3>
                        </div>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black/20 text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                                    <th className="px-8 py-4">Description</th>
                                    <th className="px-8 py-4">Qty</th>
                                    <th className="px-8 py-4 text-right">Unit Price</th>
                                    <th className="px-8 py-4 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {record.items?.map((item: any, i: number) => (
                                    <tr key={i} className="border-b border-neutral-800/50 hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-4 text-zinc-300 font-medium">{item.name}</td>
                                        <td className="px-8 py-4 text-zinc-500">{item.quantity}</td>
                                        <td className="px-8 py-4 text-right text-zinc-500">₹{item.unitPrice.toLocaleString()}</td>
                                        <td className="px-8 py-4 text-right text-white font-bold">₹{item.totalPrice.toLocaleString()}</td>
                                    </tr>
                                ))}
                                <tr className="text-zinc-500">
                                    <td colSpan={3} className="px-8 py-3 text-right text-[10px] font-black uppercase">Labor Charges</td>
                                    <td className="px-8 py-3 text-right font-bold text-zinc-300">₹{record.laborCost?.toLocaleString()}</td>
                                </tr>
                                <tr className="text-zinc-500">
                                    <td colSpan={3} className="px-8 py-3 text-right text-[10px] font-black uppercase">Other Charges</td>
                                    <td className="px-8 py-3 text-right font-bold text-zinc-300">₹{record.otherCharges?.toLocaleString()}</td>
                                </tr>
                                <tr className="bg-indigo-600/5">
                                    <td colSpan={3} className="px-8 py-6 text-right text-[12px] font-black uppercase text-indigo-400">Grand Total</td>
                                    <td className="px-8 py-6 text-right text-xl font-black text-white">₹{record.grandTotal?.toLocaleString('en-IN')}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* RIGHT: Status & Physical Proof */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Financial Summary */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 space-y-6 shadow-xl border-t-indigo-500 border-t-4">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                            <CreditCard size={16} className="text-indigo-500" /> Reconciliation
                        </h3>
                        <div className="space-y-4 bg-black/40 p-5 rounded-2xl border border-neutral-800">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500">Payment Method</span>
                                <span className="font-bold text-white uppercase">{record.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500">Amount Paid</span>
                                <span className="font-bold text-emerald-400">₹{record.paidAmount?.toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-neutral-800" />
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-zinc-500 uppercase">Balance Due</span>
                                <span className={`text-lg font-black ${record.balanceAmount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                    ₹{record.balanceAmount?.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Receipt Preview */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 space-y-4 shadow-xl">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                            <FileText size={16} className="text-indigo-500" /> Physical Proof
                        </h3>
                        {record.receiptUrl ? (
                            <div className="relative group rounded-2xl overflow-hidden border border-neutral-800 aspect-[3/4]">
                                <img src={record.receiptUrl} alt="Bill Scan" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <a href={record.receiptUrl} target="_blank" rel="noreferrer" className="bg-indigo-600 p-3 rounded-full text-white hover:bg-indigo-500 transition-colors shadow-xl">
                                        <ExternalLink size={20} />
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="aspect-[3/4] rounded-2xl border-2 border-dashed border-neutral-800 flex flex-col items-center justify-center text-zinc-600 gap-2">
                                <FileText size={40} />
                                <p className="text-[10px] font-black uppercase tracking-widest">No Receipt Uploaded</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DataPoint = ({ icon, label, value }: any) => (
    <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-zinc-500">
            <span className="text-indigo-500/80">{icon}</span>
            <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <p className="text-xs font-bold text-zinc-200">{value}</p>
    </div>
);

export default MaintenanceDetails;