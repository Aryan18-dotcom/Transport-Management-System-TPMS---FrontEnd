import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Loader2, ArrowLeft, ShieldCheck, FileText, 
  Percent, Calculator, Receipt, Info, Sparkles,
  ArrowRight, CheckCircle2, Building2, Hash
} from 'lucide-react';
import toast from 'react-hot-toast'; // Ensure react-hot-toast is installed
import useInvoice from '../hooks/useInvoice';
import { useBillContext } from '../../Bills/billContext';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { createInvoice, invoiceActionLoading } = useInvoice();
  const { bills, loading: billsLoading, refreshBills } = useBillContext();
  
  const [step, setStep] = useState(1);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [gstRate, setGstRate] = useState(5);
  const [tdsRate, setTdsRate] = useState(2);
  const [isRCM, setIsRCM] = useState(false);

  useEffect(() => {
    refreshBills();
  }, []);

  const netAmount = selectedBill?.netBalanceDue || 0;
  const gstTotal = isRCM ? 0 : (netAmount * gstRate) / 100;
  const tdsAmount = (netAmount * tdsRate) / 100;
  const grandTotal = (netAmount + gstTotal) - tdsAmount;

  const handleGenerate = async () => {
    // 1. Initialize Toast ID for state tracking
    const toastId = toast.loading("Initializing Document Engine...");
    
    try {
      // 2. Trigger API
      const result = await createInvoice({
        billId: selectedBill._id,
        gstRate,
        tdsRate,
        isRCM
      });

      const data = await result.json();
      
      if (result.ok) {
        // 3. Success state transition
        toast.success("Invoice PNG Generated & Uploaded", { id: toastId });
        
        // Brief delay for the user to see the success before redirecting
        setTimeout(() => {
            navigate(`/admin-dashboard/invoice/${data.data._id}`);
        }, 1000);
      } else {
        toast.error(data.message || "Generation Failed", { id: toastId });
        navigate('/admin-dashboard/bills/manage');
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Critical System Error: " + err.message, { id: toastId });
    }
  };

  // Helper to disable UI during processing
  const isProcessing = invoiceActionLoading;

  return (
    <div className="min-h-screen bg-[#09090b] p-6 md:p-12 font-sans text-neutral-100">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase text-white">Generate Invoice</h1>
            <p className="text-neutral-500 text-sm mt-1 uppercase tracking-widest font-bold">
              Step {step}: {step === 1 ? "Select Source Bill" : "Apply Taxation Protocols"}
            </p>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= s ? 'bg-[#4f46e5]' : 'bg-neutral-800'}`} />
            ))}
          </div>
        </header>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#111111] rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/[0.02] border-b border-neutral-800 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500">
                    <tr>
                      <th className="p-6">Bill Number</th>
                      <th className="p-6">Partner Company</th>
                      <th className="p-6 text-right">Net Balance</th>
                      <th className="p-6 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/50">
                    {bills.filter((b: any) => b.status !== 'INVOICED').map((bill: any) => (
                      <tr key={bill._id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="p-6">
                           <p className="font-bold text-white text-sm leading-none">{bill.billNumber}</p>
                           <p className="text-[10px] text-neutral-500 mt-1 uppercase font-bold tracking-tighter">Finalized Ledger</p>
                        </td>
                        <td className="p-6 font-bold text-neutral-300 text-xs">
                          {bill.partnerCompanyId?.partyName}
                        </td>
                        <td className="p-6 text-right font-black text-white text-sm">
                          ₹{bill.netBalanceDue?.toLocaleString()}
                        </td>
                        <td className="p-6 text-center">
                          <button 
                            disabled={isProcessing}
                            onClick={() => { setSelectedBill(bill); setStep(2); }}
                            className="bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl text-neutral-400 group-hover:bg-[#4f46e5] group-hover:text-white group-hover:border-[#4f46e5] transition-all disabled:opacity-30"
                          >
                            <ArrowRight size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in zoom-in-95 duration-500">
            <div className={`lg:col-span-7 space-y-6 ${isProcessing ? 'pointer-events-none opacity-60 grayscale' : ''}`}>
              <button 
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-all"
              >
                <ArrowLeft className="w-3 h-3" /> Change Bill Selection
              </button>

              <div className="bg-[#111111] p-8 rounded-3xl border border-neutral-800 space-y-8 shadow-2xl">
                <div className="flex items-center gap-3 pb-6 border-b border-neutral-800/50">
                  <ShieldCheck className="text-[#4f46e5] w-6 h-6" />
                  <h3 className="font-bold uppercase tracking-tight text-white text-sm">Taxation Configuration</h3>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-neutral-500 tracking-[0.2em] flex items-center gap-2">
                    <Percent className="w-3 h-3" /> GST Rate Applied
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {[0, 5, 12, 18].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setGstRate(rate)}
                        className={`py-4 rounded-xl font-black text-xs transition-all border ${
                          gstRate === rate ? 'bg-[#4f46e5] border-[#4f46e5] text-white shadow-lg shadow-[#4f46e5]/20' : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-600'
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-neutral-500 tracking-[0.2em] flex items-center gap-2">
                    <Calculator className="w-3 h-3" /> TDS Deduction
                  </label>
                  <div className="flex gap-3">
                    {[1, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setTdsRate(rate)}
                        className={`flex-1 py-4 rounded-xl font-black text-xs transition-all border ${
                          tdsRate === rate ? 'bg-[#4f46e5] border-[#4f46e5] text-white shadow-lg shadow-[#4f46e5]/20' : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-600'
                        }`}
                      >
                        {rate}% (TDS)
                      </button>
                    ))}
                  </div>
                </div>

                <div 
                  onClick={() => setIsRCM(!isRCM)}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    isRCM ? 'bg-amber-500/10 border-amber-500/50' : 'bg-neutral-900/50 border-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${isRCM ? 'bg-amber-500 text-black' : 'bg-neutral-800 text-neutral-500'}`}>
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-black text-xs uppercase tracking-widest text-white">RCM Protocol</p>
                      <p className="text-[9px] text-neutral-500 font-bold mt-1 uppercase">GST is zeroed for reverse charge mechanism</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isRCM ? 'bg-amber-500 border-amber-500 text-black' : 'border-neutral-700'}`}>
                    {isRCM && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-8 sticky top-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-xs font-black text-neutral-500 uppercase tracking-widest border-b border-neutral-800 pb-4 font-mono">
                    <Hash className="w-4 h-4 text-[#4f46e5]" /> {selectedBill?.billNumber}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-neutral-500 uppercase tracking-widest font-mono">Base Bill</span>
                      <span className="text-white">₹{netAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-neutral-500 uppercase tracking-widest font-mono">GST ({gstRate}%)</span>
                      <span className={`${isRCM ? 'line-through text-neutral-700' : 'text-emerald-500'}`}>
                        {isRCM ? '₹0' : `+₹${gstTotal.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-neutral-500 uppercase tracking-widest font-mono">TDS ({tdsRate}%)</span>
                      <span className="text-red-500">-₹{tdsAmount.toLocaleString()}</span>
                    </div>

                    <div className="pt-6 mt-6 border-t border-neutral-800">
                      <p className="text-[10px] font-black uppercase text-neutral-600 mb-2 tracking-[0.2em]">Grand Total Payable</p>
                      <p className="text-5xl font-black text-white tracking-tighter">₹{Math.round(grandTotal).toLocaleString()}</p>
                    </div>

                    <button
                      onClick={handleGenerate}
                      disabled={isProcessing}
                      className="w-full mt-8 bg-[#4f46e5] text-white py-5 rounded-xl font-black uppercase text-[11px] tracking-[0.2em] shadow-lg shadow-[#4f46e5]/20 hover:bg-[#4338ca] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <><Loader2 className="animate-spin w-4 h-4" /> System Processing...</>
                      ) : (
                        "Authorize & Generate PNG"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateInvoice;