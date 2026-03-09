import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Truck, Search, Info, Building2, ArrowRight, ArrowLeft, FilePlus, Hash } from 'lucide-react';
import { usePartner } from '../../Partner/hooks/usePartner';
import { useTrips } from '../../Trips/hooks/useTrips';
import toast from 'react-hot-toast';
import useBills from '../hook/useBill';

const GenerateBill = () => {
    const { createNewBill, actionLoading } = useBills();
    const { partners, partnerLoading, refreshPartners } = usePartner();
    const { getTripForThePartnerCompany } = useTrips();

    const [step, setStep] = useState(1);
    const [selectedPartner, setSelectedPartner] = useState<any>(null);
    const [trips, setTrips] = useState([]);
    const [selectedTrips, setSelectedTrips] = useState<string[]>([]);
    const [loadingTrips, setLoadingTrips] = useState(false);
    const [remarks, setRemarks] = useState("");
    const [billNumber, setBillNumber] = useState(`BILL/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`);

    useEffect(() => { refreshPartners(); }, []);

    const handlePartnerSelect = async (partner: any) => {
        setSelectedPartner(partner);
        setLoadingTrips(true);
        try {
            const res = await getTripForThePartnerCompany(partner._id);
            const TripsData = await res.json();

            let rawTrips = [];
            if (Array.isArray(TripsData.data)) {
                rawTrips = TripsData.data;
            } else if (TripsData.data && typeof TripsData.data === 'object') {
                rawTrips = [TripsData.data];
            }

            // Filter for compliance: only delivered and unbilled trips
            const available = rawTrips.filter((t: any) => 
                t.status === 'DELIVERED' && t.billingStatus !== 'BILLED'
            );

            setTrips(available);
            setStep(2);
        } catch (err) {
            console.error("Error fetching partner trips:", err);
        } finally {
            setLoadingTrips(false);
        }
    };

    const toggleTrip = (id: string) => {
        setSelectedTrips(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
    };

    const selectedTripData = trips.filter((t: any) => selectedTrips.includes(t._id));
    const totals = selectedTripData.reduce((acc, curr: any) => ({
        freight: acc.freight + (curr.totalFreightAmount || 0),
        advance: acc.advance + (curr.advancePaymentReceived || 0),
        halt: acc.halt + (curr.diten || 0),
    }), { freight: 0, advance: 0, halt: 0 });

    const finalNetBalance = (totals.freight + totals.halt) - totals.advance;

    const handleCreateBill = async () => {
        if (selectedTrips.length === 0) return toast.error("Select at least one trip.");
        try {
            const data = await createNewBill({
                billNumber,
                partnerCompanyId: selectedPartner._id,
                trips: selectedTrips,
                remarks: remarks || `Consolidated bill for ${selectedTrips.length} trips.`
            });
            console.log("Bill Created:", data);
            toast.success("Bill successfully generated.");
            setStep(1); // Reset to step 1
            setSelectedTrips([]);
        } catch (err) { console.error(err); }
    };

    if (loadingTrips) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#09090b]">
                <div className="text-center">
                    <Loader2 className="animate-spin text-[#4f46e5] w-12 h-12 mx-auto mb-4" />
                    <h1 className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">Syncing Partner Ledger...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090b] p-6 md:p-12 font-sans text-neutral-100 selection:bg-[#4f46e5]">
            <div className="max-w-6xl mx-auto">

                {/* Header & Stepper Progress */}
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase text-white">Generate Bill</h1>
                        <p className="text-neutral-500 text-sm font-medium mt-1">
                            Step {step}: {step === 1 ? "Select Partner Entity" : `Batched Billing for ${selectedPartner?.partyName}`}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <div className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-[#4f46e5]' : 'bg-neutral-800'}`} />
                        <div className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-[#4f46e5]' : 'bg-neutral-800'}`} />
                    </div>
                </header>

                {/* STEP 1: COMPANY SELECTION */}
                {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {partnerLoading ? (
                            <div className="col-span-full py-20 text-center">
                                <Loader2 className="animate-spin text-neutral-700 w-10 h-10 mx-auto" />
                            </div>
                        ) : (
                            partners.map((p: any) => (
                                <button
                                    key={p._id}
                                    onClick={() => handlePartnerSelect(p)}
                                    className="bg-[#111111] p-8 rounded-2xl border border-neutral-800 text-left group hover:border-[#4f46e5]/50 transition-all relative overflow-hidden"
                                >
                                    <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                        <Building2 className="w-24 h-24 text-white" />
                                    </div>
                                    <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center mb-6 border border-neutral-800 group-hover:bg-[#4f46e5] group-hover:border-[#4f46e5] transition-colors">
                                        <Building2 className="w-6 h-6 text-neutral-500 group-hover:text-white" />
                                    </div>
                                    <h3 className="font-black text-xl text-white mb-2">{p.partyName}</h3>
                                    <p className="text-xs text-neutral-500 mb-6 line-clamp-1 uppercase tracking-wider font-bold">{p.address}</p>
                                    <div className="flex justify-between items-center pt-5 border-t border-neutral-800/50">
                                        <span className="text-[9px] font-black text-neutral-500 uppercase tracking-[0.2em]">Begin Batching</span>
                                        <ArrowRight className="w-4 h-4 text-neutral-700 group-hover:text-[#4f46e5] transition-all" />
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                )}

                {/* STEP 2: TRIP SELECTION & SUMMARY */}
                {step === 2 && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 space-y-6">
                            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Switch Partner
                            </button>

                            <div className="bg-[#111111] rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl">
                                <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-white/[0.02]">
                                    <div className="flex items-center gap-3">
                                        <Truck className="w-5 h-5 text-[#4f46e5]" />
                                        <h3 className="font-bold text-sm uppercase tracking-tight text-white">Pending Loads</h3>
                                    </div>
                                    <span className="bg-[#4f46e5]/10 text-[#4f46e5] text-[9px] px-3 py-1 rounded-md border border-[#4f46e5]/20 font-black uppercase tracking-widest">
                                        {trips.length} Available
                                    </span>
                                </div>

                                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                                    <table className="w-full text-left">
                                        <thead className="sticky top-0 bg-[#111111] border-b border-neutral-800 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500">
                                            <tr>
                                                <th className="p-6">LR Identity</th>
                                                <th className="p-6">Vehicle</th>
                                                <th className="p-6 text-right">Balance</th>
                                                <th className="p-6 text-center">Batch</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-800/50">
                                            {trips.map((t: any) => (
                                                <tr key={t._id} 
                                                    onClick={() => toggleTrip(t._id)}
                                                    className={`hover:bg-white/[0.02] cursor-pointer transition-colors ${selectedTrips.includes(t._id) ? 'bg-[#4f46e5]/5' : ''}`}>
                                                    <td className="p-6">
                                                        <p className="font-bold text-white text-sm leading-none mb-1.5">{t.lrNumber}</p>
                                                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-tighter">{new Date(t.tripStartDate).toLocaleDateString()}</p>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className="bg-neutral-900 border border-neutral-800 px-3 py-1 rounded font-mono text-[10px] font-bold text-[#4f46e5]">
                                                            {t.truckId?.truckNumber || "N/A"}
                                                        </span>
                                                    </td>
                                                    <td className="p-6 text-right font-black text-white text-sm">₹{(t.toalBalanceAmount || 0).toLocaleString()}</td>
                                                    <td className="p-6 text-center">
                                                        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mx-auto transition-all ${selectedTrips.includes(t._id) ? 'bg-[#4f46e5] border-[#4f46e5] text-white' : 'border-neutral-800 text-transparent hover:border-neutral-600'}`}>
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {trips.length === 0 && (
                                        <div className="p-20 text-center">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600">No delivered trips pending for this partner.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* FINAL SUMMARY SIDEBAR */}
                        <div className="lg:col-span-4">
                            <div className="bg-[#111111] text-white rounded-2xl p-8 shadow-2xl sticky top-8 border border-neutral-800">
                                <h3 className="text-sm font-black mb-8 border-b border-neutral-800 pb-6 flex items-center gap-3 uppercase tracking-widest text-white/90">
                                    <FilePlus className="w-5 h-5 text-[#4f46e5]" /> Billing Protocol
                                </h3>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold uppercase text-neutral-500 tracking-widest flex items-center gap-2"><Hash className="w-3 h-3"/> Bill Number</label>
                                        <input value={billNumber} onChange={e => setBillNumber(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-xs font-bold text-white focus:border-[#4f46e5] outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold uppercase text-neutral-500 tracking-widest flex items-center gap-2"><Info className="w-3 h-3"/> Remarks</label>
                                        <textarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="System billing notes..." className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-xs font-bold text-white h-24 focus:border-[#4f46e5] outline-none transition-all resize-none" />
                                    </div>

                                    <div className="pt-6 border-t border-neutral-800 space-y-4">
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-neutral-500 uppercase tracking-widest">Trips Selected</span>
                                            <span className="text-white">{selectedTrips.length} Items</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-neutral-500 uppercase tracking-widest">Gross Freight</span>
                                            <span className="text-white font-mono">₹{totals.freight.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] font-bold text-red-400">
                                            <span className="uppercase tracking-widest">Advances</span>
                                            <span className="font-mono">-₹{totals.advance.toLocaleString()}</span>
                                        </div>
                                        <div className="mt-8 pt-6 border-t border-neutral-800">
                                            <p className="text-[9px] font-black uppercase text-neutral-600 mb-1 tracking-widest">Consolidated Balance</p>
                                            <p className="text-4xl font-black text-white tracking-tighter">₹{finalNetBalance.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <button
                                        disabled={actionLoading || selectedTrips.length === 0}
                                        onClick={handleCreateBill}
                                        className="w-full bg-[#4f46e5] text-white py-5 rounded-xl font-black uppercase text-[11px] tracking-[0.2em] shadow-lg shadow-[#4f46e5]/20 hover:bg-[#4338ca] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:grayscale"
                                    >
                                        {actionLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Authorize Bill Generation"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerateBill;