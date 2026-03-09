import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Loader2, ArrowLeft, Save, Trash2, Truck, 
  Plus, CheckCircle2, Hash, Info, Building2 
} from 'lucide-react';
import { useTrips } from '../../Trips/hooks/useTrips';
import toast from 'react-hot-toast';
import useBills from '../hook/useBill';

const UpdateBillDetails = () => {
  const { billId } = useParams();
  const navigate = useNavigate();
  const { getBillDetailsById, updateExistingBill, actionLoading } = useBills();
  const { getTripForThePartnerCompany } = useTrips();

  const [bill, setBill] = useState<any>(null);
  const [availableTrips, setAvailableTrips] = useState([]);
  const [selectedTripIds, setSelectedTripIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Editable Fields
  const [billNumber, setBillNumber] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Current Bill Details
        const res = await getBillDetailsById(billId as string);
        const billData = res.data;
        setBill(billData);
        setBillNumber(billData.billNumber);
        setRemarks(billData.remarks || "");
        
        // Initial selected trips
        const currentIds = billData.trips.map((t: any) => t._id);
        setSelectedTripIds(currentIds);

        // 2. Fetch all available trips for this partner to allow "Adding" new ones
        const tripRes = await getTripForThePartnerCompany(billData.partnerCompanyId._id);
        const tripData = await tripRes.json();
        
        // We show trips that are:
        // Already in this bill OR (Delivered AND not in any other bill)
        const allPossibleTrips = tripData.data.filter((t: any) => 
            currentIds.includes(t._id) || (t.status === 'DELIVERED' && t.billingStatus !== 'BILLED')
        );
        setAvailableTrips(allPossibleTrips);

      } catch (err) {
        console.error("Update Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [billId]);

  const toggleTrip = (id: string) => {
    setSelectedTripIds(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleUpdate = async () => {
    if (selectedTripIds.length === 0) return toast.error("A bill must have at least one trip.");
    
    try {
      await updateExistingBill(billId as string, {
        billNumber,
        remarks,
        trips: selectedTripIds
      });
      toast.success("Bill updated successfully");
      navigate(`/admin-dashboard/bill/${billId}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#09090b] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#4f46e5] w-12 h-12" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] p-6 md:p-12 font-sans text-neutral-100 selection:bg-[#4f46e5]">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 flex justify-between items-center">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-3 h-3" /> Cancel Changes
            </button>
            <h1 className="text-3xl font-black tracking-tighter uppercase text-white">Update Bill Configuration</h1>
          </div>
          <button 
            onClick={handleUpdate}
            disabled={actionLoading}
            className="bg-[#4f46e5] text-white px-8 py-4 rounded-xl font-black uppercase text-[11px] tracking-widest hover:bg-[#4338ca] shadow-lg shadow-[#4f46e5]/20 transition-all flex items-center gap-3"
          >
            {actionLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
            Save Modifications
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Metadata Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#111111] p-8 rounded-2xl border border-neutral-800 space-y-6">
              <div className="flex items-center gap-3 text-[#4f46e5] mb-2">
                <Building2 className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-300">
                  {bill?.partnerCompanyId?.partyName}
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase text-neutral-500 tracking-widest flex items-center gap-2">
                  <Hash className="w-3 h-3"/> Bill Number
                </label>
                <input 
                  value={billNumber} 
                  onChange={e => setBillNumber(e.target.value)} 
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-xs font-bold text-white focus:border-[#4f46e5] outline-none transition-all" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase text-neutral-500 tracking-widest flex items-center gap-2">
                  <Info className="w-3 h-3"/> Remarks
                </label>
                <textarea 
                  value={remarks} 
                  onChange={e => setRemarks(e.target.value)} 
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-xs font-bold text-white h-32 focus:border-[#4f46e5] outline-none transition-all resize-none" 
                />
              </div>
            </div>

            <div className="bg-[#111111]/50 border border-dashed border-neutral-800 p-6 rounded-2xl">
              <p className="text-[10px] text-neutral-500 font-medium leading-relaxed uppercase tracking-tight">
                Warning: Removing a trip from this bill will return its status to "Delivered / Unbilled" in the master trip registry.
              </p>
            </div>
          </div>

          {/* Right: Trip Batching */}
          <div className="lg:col-span-8">
            <div className="bg-[#111111] rounded-2xl border border-neutral-800 overflow-hidden">
              <div className="p-6 border-b border-neutral-800 bg-white/[0.02] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-[#4f46e5]" />
                  <h3 className="font-bold text-sm uppercase tracking-tight text-white">Re-Batch Trips</h3>
                </div>
                <span className="text-[9px] font-black text-[#4f46e5] uppercase tracking-widest">
                  {selectedTripIds.length} Selected
                </span>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#111111] text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500 border-b border-neutral-800">
                    <tr>
                      <th className="p-6">LR Identity</th>
                      <th className="p-6">Vehicle</th>
                      <th className="p-6 text-right">Balance</th>
                      <th className="p-6 text-center">Batch Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/50">
                    {availableTrips.map((t: any) => (
                      <tr 
                        key={t._id} 
                        onClick={() => toggleTrip(t._id)}
                        className={`hover:bg-white/[0.02] cursor-pointer transition-colors ${selectedTripIds.includes(t._id) ? 'bg-[#4f46e5]/5' : ''}`}
                      >
                        <td className="p-6">
                          <p className="font-bold text-white text-sm mb-1">{t.lrNumber}</p>
                          <p className="text-[10px] text-neutral-500 font-bold uppercase">{new Date(t.tripStartDate).toLocaleDateString()}</p>
                        </td>
                        <td className="p-6">
                          <span className="bg-neutral-900 border border-neutral-800 px-3 py-1 rounded font-mono text-[10px] font-bold text-[#4f46e5]">
                            {t.truckId?.truckNumber}
                          </span>
                        </td>
                        <td className="p-6 text-right font-black text-white text-sm">
                          ₹{t.toalBalanceAmount?.toLocaleString()}
                        </td>
                        <td className="p-6 text-center">
                          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mx-auto transition-all ${selectedTripIds.includes(t._id) ? 'bg-[#4f46e5] border-[#4f46e5] text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' : 'border-neutral-800 text-transparent'}`}>
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UpdateBillDetails;