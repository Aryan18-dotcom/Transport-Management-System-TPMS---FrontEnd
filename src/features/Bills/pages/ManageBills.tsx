import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Loader2, Search, Filter, Eye, 
  Trash2, FileEdit, AlertCircle 
} from 'lucide-react';
import DeleteConfirmModal from '../../AdminDashboard/components/DeleteConfirmModel';
import useBills from '../hook/useBill';
import { useBillContext } from '../billContext';

const ManageBills = () => {
  const { bills, loading, refreshBills } = useBillContext();
  const { deleteBill, actionLoading } = useBills();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<{id: string, number: string} | null>(null);

  useEffect(() => {
    refreshBills();
  }, []);

  const openDeleteModal = (id: string, number: string) => {
    setSelectedBill({ id, number });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedBill) {
      try {
        await deleteBill(selectedBill.id);
        setIsDeleteModalOpen(false);
        setSelectedBill(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredBills = bills.filter(bill => 
    bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.partnerCompanyId?.partyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-10 bg-[#09090b] min-h-screen font-sans text-neutral-100">
      <div className="max-w-7xl mx-auto">
        
        {/* UPDATED MODAL INTEGRATION */}
        <DeleteConfirmModal 
          isOpen={isDeleteModalOpen}
          title={selectedBill?.number || "this bill"}
          onConfirm={confirmDelete}
          onClose={() => setIsDeleteModalOpen(false)}
          loading={actionLoading}
        />

        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Manage Bills</h1>
            <p className="text-neutral-500 text-xs font-medium mt-1 uppercase tracking-widest">
              Database Control • {bills.length} Active Records
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 text-white">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 " />
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Bill # or Partner..." 
                className="w-full bg-[#111111] border border-neutral-800 rounded-xl py-3.5 pl-11 pr-4 text-xs font-bold text-white focus:border-[#4f46e5] outline-none transition-all"
              />
            </div>
            <button className="p-3.5 bg-[#111111] border border-neutral-800 rounded-xl hover:bg-neutral-900 transition-all">
              <Filter className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        </div>

        {/* DATA TABLE AREA */}
        <div className="bg-[#111111] rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.02] border-b border-neutral-800 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500">
                  <th className="p-6">Bill Identification</th>
                  <th className="p-6">Partner Entity</th>
                  <th className="p-6 text-center">Batch Size</th>
                  <th className="p-6 text-right">Net Payable</th>
                  <th className="p-6 text-center">Status</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50 text-white">
                {filteredBills.map((bill: any) => (
                  <tr key={bill._id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="p-6">
                      <p className="font-bold text-white text-sm mb-1">{bill.billNumber}</p>
                      <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-tighter">
                        Logged {new Date(bill.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#4f46e5]" />
                        <span className="text-xs font-bold text-neutral-300">{bill.partnerCompanyId?.partyName}</span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className="bg-neutral-900 px-3 py-1 rounded-md text-[10px] font-bold text-neutral-400 border border-neutral-800">
                        {bill.trips?.length || 0} Trips
                      </span>
                    </td>
                    <td className="p-6 text-right font-black text-white text-sm">
                      ₹{bill.netBalanceDue?.toLocaleString('en-IN')}
                    </td>
                    <td className="p-6 text-center">
                      <span className={`px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                        bill.status === 'FINALIZED' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 
                        bill.status === 'INVOICED' ? 'bg-[#4f46e5]/10 border-[#4f46e5]/50 text-[#4f46e5]' :
                        'bg-amber-500/10 border-amber-500/50 text-amber-400'
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/admin-dashboard/bill/${bill._id}`)}
                          className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-[#4f46e5] hover:text-[#4f46e5] transition-all"
                        >
                          <Eye className="w-4 h-4 text-zinc-500" />
                        </button>
                        <button 
                          onClick={()=>navigate(`/admin-dashboard/bill/manage/${bill._id}`)}
                          className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-[#4f46e5] hover:text-[#4f46e5] transition-all"
                        >
                          <FileEdit className="w-4 h-4 text-zinc-500" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(bill._id, bill.billNumber)}
                          className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-red-500/50 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-zinc-500" />
                        </button>
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
  );
};

export default ManageBills;