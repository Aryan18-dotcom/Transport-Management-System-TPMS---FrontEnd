import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  ArrowUpRight, 
  AlertCircle,
  Truck,
  Plus,
  Search
} from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useBillContext } from '../billContext';

const AllBills = () => {
  const { bills, loading, refreshBills } = useBillContext();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    refreshBills();
  }, []);

  // TMPS V1.0 Status Badge Styles
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'FINALIZED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'INVOICED': return 'bg-[#4f46e5]/10 text-[#4f46e5] border-[#4f46e5]/20';
      case 'CANCELLED': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20'; // DRAFT
    }
  };

  if (loading && bills.length === 0) {
    return (
      <div className="h-screen bg-[#09090b] flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-2 border-neutral-800 border-t-[#4f46e5] rounded-full animate-spin" />
        <p className="text-neutral-500 font-bold uppercase tracking-[0.3em] text-[10px]">Accessing Ledger Database...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 bg-[#09090b] min-h-screen font-sans text-neutral-100 selection:bg-[#4f46e5]">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Bill Ledger</h1>
            <p className="text-neutral-500 text-sm font-medium">
              System monitoring {bills.length} active transport records for <span className="text-white">{user?.companyId?.companyName}</span>.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <input 
                  placeholder="Filter Records..." 
                  className="w-full bg-[#111111] border border-neutral-800 rounded-xl py-3 pl-11 pr-4 text-xs font-bold focus:border-[#4f46e5] outline-none transition-all"
                />
             </div>
             <button 
                onClick={() => navigate('/admin-dashboard/bills/generate')}
                className="bg-[#4f46e5] text-white px-6 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-[#4338ca] transition-all flex items-center gap-2"
             >
                <Plus className="w-4 h-4" /> New Bill
             </button>
          </div>
        </div>

        {/* BENTO GRID LEDGER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bills.map((bill: any) => (
            <div 
              key={bill._id}
              onClick={() => navigate(`/admin-dashboard/bill/${bill._id}`)}
              className="group bg-[#111111] rounded-2xl border border-neutral-800 p-7 shadow-sm hover:border-[#4f46e5]/50 transition-all cursor-pointer relative overflow-hidden"
            >
              {/* Decorative Background Element */}
              <div className="absolute -right-4 -bottom-4 bg-white/[0.02] p-8 rounded-full group-hover:bg-[#4f46e5]/5 transition-all">
                <FileText className="w-16 h-16 text-white group-hover:text-[#4f46e5] transition-colors" />
              </div>

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className={`px-3 py-1 rounded-md border text-[9px] font-black uppercase tracking-[0.15em] ${getStatusStyle(bill.status)}`}>
                  {bill.status}
                </div>
                <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg group-hover:bg-[#4f46e5] group-hover:border-[#4f46e5] transition-all">
                  <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-white" />
                </div>
              </div>

              <div className="mb-6 relative z-10">
                <h3 className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Bill Identification</h3>
                <p className="text-xl font-black text-white tracking-tight">{bill.billNumber}</p>
              </div>

              <div className="mb-8 relative z-10">
                <h3 className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Partner Entity</h3>
                <p className="text-sm font-bold text-neutral-300 truncate">
                  {bill.partnerCompanyId?.partyName || 'External Contractor'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-5 border-t border-neutral-800/50 relative z-10">
                <div>
                  <h3 className="text-[9px] font-bold text-neutral-500 uppercase mb-1.5">Trip Load</h3>
                  <div className="flex items-center gap-2 text-white font-black">
                    <Truck className="w-3.5 h-3.5 text-[#4f46e5]" />
                    <span>{bill.trips?.length || 0} Batches</span>
                  </div>
                </div>
                <div className="text-right">
                  <h3 className="text-[9px] font-bold text-neutral-500 uppercase mb-1.5">Net Payable</h3>
                  <p className="text-lg font-black text-white">₹{bill.netBalanceDue?.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-800/50 text-neutral-500 relative z-10">
                <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[9px] font-bold uppercase tracking-tighter">
                        {new Date(bill.createdAt).toLocaleDateString('en-IN')}
                    </span>
                </div>
                <span className="text-[9px] font-mono text-neutral-700">ID: {bill._id.slice(-6).toUpperCase()}</span>
              </div>
            </div>
          ))}

          {bills.length === 0 && (
            <div className="col-span-full bg-[#111111] border-2 border-dashed border-neutral-800 rounded-3xl p-20 text-center">
              <AlertCircle className="w-12 h-12 text-neutral-800 mx-auto mb-6" />
              <p className="text-neutral-500 font-bold uppercase tracking-[0.2em] text-[11px]">No active ledger records found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBills;