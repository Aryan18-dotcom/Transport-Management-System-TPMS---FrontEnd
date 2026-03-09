import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Loader2, Search, Filter, Trash2, 
  ExternalLink, Calendar, Hash, 
  CheckCircle2, Clock, AlertCircle, IndianRupee, 
  PenIcon
} from 'lucide-react';
import useInvoice from '../hooks/useInvoice';
import DeleteConfirmModal from '../../AdminDashboard/components/DeleteConfirmModel';

const AllInvoices = () => {
  const { invoices, invoiceActionLoading, refreshInvoices, deleleInvoiceById } = useInvoice();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<{id: string, number: string} | null>(null);

  useEffect(() => {
    refreshInvoices();
  }, []);

  const openDeleteModal = (id: string, number: string) => {
    setSelectedInvoice({ id, number });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedInvoice) {
      try {
        await deleleInvoiceById(selectedInvoice.id);
        setIsDeleteModalOpen(false);
        setSelectedInvoice(null);
        refreshInvoices()
      } catch (err) {
        console.error("Deletion failed:", err);
      }
    }
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.partnerCompanyId?.partyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (invoiceActionLoading && invoices.length === 0) {
    return (
      <div className="h-screen bg-[#09090b] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#4f46e5] w-10 h-10 mb-4" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500 font-mono">Syncing Invoice Database...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 bg-[#09090b] min-h-screen font-sans text-neutral-100 selection:bg-[#4f46e5]">
      <div className="max-w-7xl mx-auto">
        
        {/* CUSTOM DELETE MODAL */}
        <DeleteConfirmModal 
          isOpen={isDeleteModalOpen}
          title={selectedInvoice?.number || "this invoice"}
          onConfirm={confirmDelete}
          onClose={() => setIsDeleteModalOpen(false)}
          loading={invoiceActionLoading}
        />

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Invoice Registry</h1>
            <p className="text-neutral-500 text-sm font-medium uppercase tracking-widest">
              Financial Tracking • {invoices.length} Documents Generated
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Invoice # or Partner..." 
                className="w-full bg-[#111111] border border-neutral-800 rounded-xl py-3.5 pl-11 pr-4 text-xs font-bold text-white focus:border-[#4f46e5] outline-none transition-all"
              />
            </div>
            <button className="p-3.5 bg-[#111111] border border-neutral-800 rounded-xl hover:bg-neutral-900 transition-all text-neutral-400 hover:text-white">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* DATA TABLE AREA */}
        <div className="bg-[#111111] rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-neutral-800 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500">
                  <th className="p-6">Document Identity</th>
                  <th className="p-6">Recipient Partner</th>
                  <th className="p-6 text-right">Grand Total</th>
                  <th className="p-6 text-center">Status</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {filteredInvoices.map((inv: any) => (
                  <tr key={inv._id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
                          <Hash className="w-4 h-4 text-[#4f46e5]" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm leading-none mb-1">{inv.invoiceNumber}</p>
                          <p className="text-[10px] font-medium text-neutral-500 uppercase flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" /> {new Date(inv.createdAt).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="text-xs font-bold text-neutral-300 mb-1">{inv.partnerCompanyId?.partyName}</p>
                      <p className="text-[9px] font-mono text-neutral-600 uppercase">GSTIN: {inv.partnerCompanyId?.gstNumber || 'N/A'}</p>
                    </td>
                    <td className="p-6 text-right font-black text-white text-sm">
                      <div className="flex items-center justify-end gap-1">
                        <IndianRupee className="w-3 h-3 text-neutral-500" />
                        <span>{inv.grandTotal?.toLocaleString('en-IN')}</span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border flex items-center justify-center gap-1.5 w-fit mx-auto ${
                        inv.paymentStatus === 'PAID' 
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                        : 'bg-red-500/10 border-red-500/50 text-red-400'
                      }`}>
                        {inv.paymentStatus === 'PAID' ? <CheckCircle2 size={10}/> : <Clock size={10}/>}
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/admin-dashboard/invoice/${inv._id}`)}
                          className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-[#4f46e5] hover:text-[#4f46e5] transition-all"
                          title="Detailed View"
                        >
                          <PenIcon className="w-4 h-4 text-zinc-500" />
                        </button>
                        <a 
                          href={inv.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-emerald-500 hover:text-emerald-500 transition-all"
                          title="Open PNG Source"
                        >
                          <ExternalLink className="w-4 h-4 text-zinc-500" />
                        </a>
                        <button 
                          onClick={() => openDeleteModal(inv._id, inv.invoiceNumber)}
                          className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-red-500/50 hover:text-red-500 transition-all"
                          title="Purge Record"
                        >
                          <Trash2 className="w-4 h-4 text-zinc-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredInvoices.length === 0 && (
              <div className="p-24 text-center">
                <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-neutral-800">
                   <AlertCircle className="w-8 h-8 text-neutral-700" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-600">No generated invoices found in current trace</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllInvoices;