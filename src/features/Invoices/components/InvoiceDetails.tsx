import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Loader2, ArrowLeft, ExternalLink,
    Calendar, Building2, Hash,
    AlertCircle, Printer, Image as ImageIcon,
    Info
} from 'lucide-react';
import useInvoice from '../hooks/useInvoice';

const InvoiceDetails = () => {
    const { invoiceId } = useParams();
    const navigate = useNavigate();
    const { getInvoiceById, updateInvoicePayment, invoiceActionLoading } = useInvoice();

    const [invoice, setInvoice] = useState<any>(null);

    useEffect(() => {
        const fetchInvoice = async () => {
            if (!invoiceId) return;

            try {
                // 2. res is the raw Response object from your fetch-based invoiceApi
                const res: any = await getInvoiceById(invoiceId);
                if (!res.ok) throw new Error("Failed to fetch invoice details");
                const result = await res.json();
                setInvoice(result.data);
            } catch (err) {
                console.error("Error loading invoice:", err);
            }
        };

        fetchInvoice();
    }, [invoiceId, getInvoiceById]); // Added getInvoiceById to dependency array for best practice

    const handleStatusUpdate = async (newStatus: any) => {
        try {
            await updateInvoicePayment(invoiceId as string, newStatus);
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };

const handlePrint = () => {
  if (!invoice?.pdfUrl) return;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (iframeDoc) {
    iframeDoc.open();
    iframeDoc.write(`
      <html>
        <head>
          <style>
            /* 1. Eliminate all browser-added margins and headers */
            @page { 
              size: auto; 
              margin: 0; 
            }
            
            /* 2. Ensure body and html occupy zero extra space */
            html, body { 
              margin: 0; 
              padding: 0; 
              width: 100%; 
              height: 100%; 
              overflow: hidden; 
            }

            /* 3. Center the image and force it to fit on one sheet */
            body { 
              display: flex; 
              justify-content: center; 
              align-items: flex-start; 
              background: white;
            }

            img { 
              width: 100%; 
              height: auto; 
              max-height: 99vh; /* Leave 1% breathing room to avoid 2nd page trigger */
              object-fit: contain;
              display: block;
            }
          </style>
        </head>
        <body>
          <img src="${invoice.pdfUrl}" />
          <script>
            // Use a small timeout to ensure the image is actually rendered
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 200);
            };
          </script>
        </body>
      </html>
    `);
    iframeDoc.close();
  }

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 2000);
};

    if (!invoice && invoiceActionLoading) return (
        <div className="h-screen bg-[#09090b] flex items-center justify-center">
            <Loader2 className="animate-spin text-[#4f46e5] w-12 h-12" />
        </div>
    );

    if (!invoice) return <div className="p-20 text-center font-black uppercase text-neutral-500 bg-[#09090b] min-h-screen">Invoice Trace Not Found</div>;

    return (
        <div className="min-h-screen bg-[#09090b] p-4 md:p-10 font-sans text-neutral-100 selection:bg-[#4f46e5]">
            <div className="max-w-7xl mx-auto">

                {/* Top Navigation */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-[#4f46e5] transition-all mb-3"
                        >
                            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Return to Ledger
                        </button>
                        <div className="flex items-center gap-4">
                            <h1 className="text-4xl font-black tracking-tighter uppercase text-white">Invoice Detail</h1>
                            <span className={`px-4 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.2em] border ${invoice.paymentStatus === 'PAID' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border-red-500/50 text-red-400'
                                }`}>
                                {invoice.paymentStatus}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <a
                            href={invoice.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-[#111111] border border-neutral-800 text-white px-6 py-4 rounded-xl font-bold uppercase text-[11px] tracking-widest hover:border-[#4f46e5] transition-all"
                        >
                            <ExternalLink size={16} /> View Original
                        </a>
                        <button
                            onClick={() =>handlePrint()}
                            className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-[#4f46e5] text-white px-8 py-4 rounded-xl font-bold uppercase text-[11px] tracking-widest hover:bg-[#4338ca] shadow-lg shadow-[#4f46e5]/20 transition-all"
                        >
                            <Printer size={16} /> Print Document
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar: Metadata & Financials */}
                    <div className="lg:col-span-4 space-y-6">

                        <div className="bg-[#111111] p-8 rounded-2xl border border-neutral-800 space-y-8">
                            <div>
                                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">Invoice Identification</p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-white">
                                        <Hash className="w-4 h-4 text-[#4f46e5]" />
                                        <span className="text-sm font-black">{invoice.invoiceNumber}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-neutral-400">
                                        <Calendar className="w-4 h-4 text-[#4f46e5]" />
                                        <span className="text-xs font-bold">{new Date(invoice.createdAt).toLocaleDateString('en-IN')}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-neutral-400">
                                        <Building2 className="w-4 h-4 text-[#4f46e5]" />
                                        <span className="text-xs font-bold truncate">{invoice.partnerCompanyId?.partyName}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-neutral-800">
                                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">Financial Reconciliation</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-neutral-500 uppercase">Grand Total</span>
                                        <span className="text-white">₹{invoice.grandTotal?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-neutral-500 uppercase text-[9px]">TDS Withheld</span>
                                        <span className="text-red-500">₹{invoice.taxation?.tdsAmount?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Action */}
                            <div className="pt-8 border-t border-neutral-800">
                                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">Mark Payment Status</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => handleStatusUpdate('PAID')}
                                        className="py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase hover:bg-emerald-500 hover:text-white transition-all"
                                    >
                                        Paid
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate('UNPAID')}
                                        className="py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        Unpaid
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#4f46e5]/5 border border-dashed border-[#4f46e5]/30 p-6 rounded-2xl flex gap-3">
                            <Info className="w-5 h-5 text-[#4f46e5] flex-shrink-0" />
                            <p className="text-[10px] text-neutral-500 leading-relaxed font-medium">
                                This invoice was generated as a <span className="text-white font-bold">PNG Image</span> using Puppeteer for visual fidelity and cross-device compatibility.
                            </p>
                        </div>
                    </div>

                    {/* Main: Invoice Image Preview */}
                    <div className="lg:col-span-8">
                        <div className="bg-[#111111] rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl ring-1 ring-white/5">
                            <div className="px-8 py-4 border-b border-neutral-800 bg-white/[0.02] flex items-center gap-3">
                                <ImageIcon className="w-4 h-4 text-[#4f46e5]" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Document Rendering Engine</h3>
                            </div>

                            <div className="p-4 md:p-8 bg-[#0d0d0f] flex justify-center">
                                {invoice.pdfUrl ? (
                                    <img
                                        src={invoice.pdfUrl}
                                        alt="Tax Invoice"
                                        className="w-full max-w-[800px] shadow-2xl rounded-sm border border-neutral-800"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="h-96 flex flex-col items-center justify-center text-neutral-600">
                                        <AlertCircle size={40} className="mb-4 opacity-20" />
                                        <p className="text-xs font-bold uppercase tracking-widest">Image Source Unavailable</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default InvoiceDetails;