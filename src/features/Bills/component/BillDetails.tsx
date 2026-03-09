import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Loader2, ArrowLeft, Calendar, Building2, Truck, Printer, Trash2, 
  MapPin, ShieldCheck, ChevronRight, Scale, Info, Hash, User
} from 'lucide-react';
import useBills from '../hook/useBill';

const BillDetails = () => {
  const { billId } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState<any>(null);
  const { getBillDetailsById, actionLoading } = useBills();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getBillDetailsById(billId as string);
        setBill(res.data);
      } catch (err) {
        console.error("Error fetching bill details:", err);
      } 
    };
    fetchDetails();
  }, [billId]);

  if (actionLoading) return (
    <div className="h-screen flex items-center justify-center bg-[#09090b]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-[#4f46e5] w-12 h-12" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Decrypting Ledger Data...</p>
      </div>
    </div>
  );

  if (!bill) return <div className="p-20 text-center font-black uppercase text-neutral-500 bg-[#09090b] min-h-screen">Bill Not Found</div>;

  return (
    <div className="min-h-screen bg-[#09090b] p-4 md:p-10 font-sans text-neutral-100 selection:bg-[#4f46e5] selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP NAVIGATION & ACTIONS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
             <button 
                onClick={() => navigate('/admin-dashboard/bill/all')}
                className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-[#4f46e5] transition-all mb-3"
              >
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Bill Ledger
              </button>
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-black tracking-tighter uppercase text-white">{bill.billNumber}</h1>
                <span className={`px-4 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.2em] border ${
                  bill.status === 'FINALIZED' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-amber-500/10 border-amber-500/50 text-amber-400'
                }`}>
                  {bill.status}
                </span>
              </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-[#4f46e5] text-white px-8 py-4 rounded-xl font-bold uppercase text-[11px] tracking-widest hover:bg-[#4338ca] shadow-lg shadow-[#4f46e5]/20 transition-all active:scale-95"
              onClick={() => navigate(`/admin-dashboard/generate-invoice/${bill._id}`)}
            >
              <Printer className="w-4 h-4" /> Generate Invoice
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT CONTENT: PARTNER & TRIPS */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* PARTNER CARD */}
            <div className="bg-[#111111] p-8 rounded-2xl border border-neutral-800 relative overflow-hidden">
               <Building2 className="absolute -right-6 -top-6 w-32 h-32 text-white opacity-[0.02]" />
               <div className="relative z-10">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">Partner Entity</p>
                  <h2 className="text-3xl font-black text-white mb-2 leading-none">{bill.partnerCompanyId?.partyName}</h2>
                  <div className="flex flex-wrap gap-6 mt-6">
                    <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
                      <MapPin className="w-4 h-4 text-[#4f46e5]" /> {bill.partnerCompanyId?.address}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
                      <ShieldCheck className="w-4 h-4 text-[#4f46e5]" /> GSTIN: {bill.partnerCompanyId?.gstNumber}
                    </div>
                  </div>
               </div>
            </div>

            {/* TRIP LEDGER TABLE */}
            <div className="bg-[#111111] rounded-2xl border border-neutral-800 overflow-hidden">
              <div className="px-8 py-5 border-b border-neutral-800 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-[#4f46e5]" />
                  <h3 className="font-bold uppercase tracking-tight text-sm text-white">Consolidated Trip Records</h3>
                </div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                  {bill.trips?.length || 0} Batched Items
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-neutral-800 text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                      <th className="p-6">Trip ID / Date</th>
                      <th className="p-6">Route</th>
                      <th className="p-6 text-right">Freight Logic</th>
                      <th className="p-6 text-right">Net Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {bill.trips?.map((trip: any) => (
                      <tr key={trip._id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="p-6">
                           <p className="font-bold text-white text-sm leading-none mb-1.5">{trip.lrNumber}</p>
                           <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-tighter">
                             {new Date(trip.tripStartDate).toLocaleDateString('en-IN')} • {trip.truckId?.truckNumber}
                           </p>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2 text-xs font-bold text-neutral-300 mb-1">
                             {trip.origin} <ChevronRight className="w-3 h-3 text-[#4f46e5]" /> {trip.destination}
                          </div>
                          <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-widest">{trip.materialDescription}</p>
                        </td>
                        <td className="p-6 text-right">
                           <p className="text-xs font-bold text-neutral-300">₹{trip.totalFreightAmount?.toLocaleString()}</p>
                           <p className="text-[10px] font-medium text-red-400 mt-1 uppercase tracking-tighter">
                             -₹{trip.advancePaymentReceived?.toLocaleString()} Advance
                           </p>
                        </td>
                        <td className="p-8 text-right">
                          <span className="font-black text-white text-md">₹{trip.toalBalanceAmount?.toLocaleString()}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: FINANCIAL SUMMARY */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* MAIN BALANCE CARD */}
            <div className="bg-[#4f46e5] text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
              <Scale className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-10 rotate-12" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-6">Total Payable</p>
              <div className="mb-8">
                <p className="text-5xl font-black tracking-tighter">₹{bill.netBalanceDue?.toLocaleString('en-IN')}</p>
                <div className="flex items-center gap-2 text-[9px] font-bold uppercase text-white/70 mt-3">
                  <Info className="w-3 h-3" /> Auto-calculated from Trip Logs
                </div>
              </div>
              
              <div className="space-y-3 pt-6 border-t border-white/10">
                 <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-white/60 uppercase tracking-widest">Gross Freight</span>
                    <span>₹{bill.totalFreight?.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-white/60 uppercase tracking-widest">Halt Charges</span>
                    <span>₹{bill.totalHaltCharges?.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-white/60 uppercase tracking-widest">Total Advances</span>
                    <span className="text-red-200">-₹{bill.totalAdvancePaid?.toLocaleString()}</span>
                 </div>
              </div>
            </div>

            {/* METADATA BENTO CARD */}
            <div className="bg-[#111111] p-8 rounded-2xl border border-neutral-800">
               <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Processed By</p>
                    <p className="text-xs font-bold text-white uppercase">{bill.createdBy?.name || 'Admin'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Timestamp</p>
                    <p className="text-[10px] font-mono font-medium text-neutral-400">
                      {new Date(bill.createdAt).toLocaleDateString()}
                    </p>
                  </div>
               </div>
               
               {bill.remarks && (
                 <div className="mt-6 pt-6 border-t border-neutral-800">
                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Internal Remarks</p>
                    <p className="text-xs font-medium text-neutral-400 italic leading-relaxed">"{bill.remarks}"</p>
                 </div>
               )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillDetails;