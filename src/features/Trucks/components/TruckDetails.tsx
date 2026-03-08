import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Calendar, FileText, Clock, Download, Edit3, AlertCircle,
  Truck, Gauge, Activity, User, Building2, Phone, ShieldCheck, ChevronRight
} from "lucide-react";
import { useTrucks } from "../hooks/TrucksHooks";

export default function TruckDetails() {
  const { truckId } = useParams();
  const navigate = useNavigate();
  
  // 🔥 Using the unified fetcher to get both Truck and populated Driver details
  const { GetDriverAndTruckDetails, driverLoading } = useTrucks();
  
  const [truckData, setTruckData] = useState<any>(null);
  const [driver, setDriver] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnifiedData = async () => {
      if (!truckId) return;
      const result = await GetDriverAndTruckDetails(truckId);
      
      if (result.success) {
        // truckDetails contains the vehicle, driverDetails contains the personnel
        setTruckData(result.truckDetails);
        setDriver(result.driverDetails);
      } else {
        setError(result.message);
      }
    };
    fetchUnifiedData();
  }, [truckId]);

  if (driverLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-zinc-500 font-bold tracking-widest text-[10px] uppercase">Retrieving Fleet Data...</p>
    </div>
  );

  if (error || (!truckData && !driverLoading)) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <AlertCircle size={48} className="text-red-500 mb-4" />
      <h2 className="text-xl font-bold text-white mb-2">Vehicle Missing</h2>
      <button onClick={() => navigate(-1)} className="mt-4 bg-neutral-800 px-6 py-2 rounded-xl text-white font-bold">Back to Fleet</button>
    </div>
  );

  const truck = truckData;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
      {/* 1. Header Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white group transition-all">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-[10px] uppercase tracking-[0.2em]">Fleet Systems</span>
        </button>
        <div className="flex gap-3">
          <button onClick={()=>{navigate(`/admin-dashboard/truck/edit/${truck._id}`)}} className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-zinc-400 text-xs font-bold hover:text-white hover:border-indigo-500/50 transition-all">
            <Edit3 size={14} /> Update Registry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Main Specs & History */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* A. Hero Registry Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-neutral-900 border border-neutral-800 rounded-[48px] p-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full -mr-32 -mt-32" />
            
            <div className="flex flex-col md:flex-row md:items-center gap-10 relative z-10">
              <div className="w-28 h-28 bg-indigo-600 rounded-[40px] flex items-center justify-center text-white shadow-indigo-600/30 shadow-2xl">
                <Truck size={52} strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                   <h1 className="text-6xl font-black text-white tracking-tighter uppercase">{truck.truckNumber}</h1>
                   <div className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest border transition-all ${truck.status === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      truck.status === 'ON_TRIP' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        truck.status === 'MAINTENANCE' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          truck.status === 'IDLE' ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' :
                            truck.status === 'IN_PARKING' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                              'bg-neutral-500/10 text-neutral-400 border-neutral-800'
                    }`}>
                     {truck.status}
                   </div>
                </div>
                <p className="text-zinc-500 font-bold text-sm flex items-center gap-2">
                  <span className="text-indigo-500 tracking-widest uppercase font-mono">{truck.truckType}</span>
                  <span className="w-1.5 h-1.5 bg-neutral-700 rounded-full" />
                  <span>Payload: {truck.capacityTons}T</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-10 border-t border-neutral-800/60 relative z-10">
               <DetailItem label="Fleet Owner" value={truck.companyId?.companyName || "Internal Fleet"} icon={<Building2 size={14}/>} />
               <DetailItem label="Registry Entry" value={new Date(truck.createdAt).toLocaleDateString()} icon={<Clock size={14}/>} />
               <DetailItem label="Last Activity" value={new Date(truck.updatedAt).toLocaleDateString()} icon={<Activity size={14}/>} />
               <DetailItem label="Added By" value={truck.addedBy?.firstName || "Admin"} icon={<User size={14}/>} />
            </div>
          </motion.div>

          {/* B. PERSONNEL ASSIGNMENT SECTION (NEW) */}
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-[40px] p-8 relative overflow-hidden">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <User size={18} className="text-indigo-500" /> Active Assigned Driver
                </h3>
                {driver && (
                    <button 
                      onClick={() => navigate(`/admin-dashboard/driver/details/${driver._id}`)}
                      className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest flex items-center gap-1"
                    >
                      View Profile <ChevronRight size={12} />
                    </button>
                )}
             </div>

             {driver ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 flex items-center gap-5">
                     <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-black">
                        {driver.firstName[0]}{driver.lastName[0]}
                     </div>
                     <div>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Driver Name</p>
                        <p className="text-lg font-black text-white">{driver.firstName} {driver.lastName}</p>
                     </div>
                  </div>
                  <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 flex items-center gap-5">
                     <div className="p-3 bg-neutral-900 text-indigo-400 rounded-2xl">
                        <Phone size={24} />
                     </div>
                     <div>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Direct Contact</p>
                        <p className="text-lg font-black text-white">{driver.phoneNum}</p>
                     </div>
                  </div>
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center py-8 bg-neutral-950/50 rounded-3xl border border-dashed border-neutral-800">
                  <AlertCircle size={24} className="text-zinc-700 mb-2" />
                  <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest italic">No personnel assigned to this vehicle.</p>
                  <button 
                    onClick={() => navigate(`/admin-dashboard/driver/assignments`)}
                    className="mt-4 text-[10px] font-black text-indigo-500 hover:text-indigo-400 uppercase tracking-widest"
                  >
                    Assign Driver Now
                  </button>
               </div>
             )}
          </div>

          {/* C. Compliance & Expiry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <ComplianceCard title="RC Registration Expiry" date={truck.rcExpiryDate} />
             <ComplianceCard title="Insurance Policy Expiry" date={truck.insuranceExpiryDate} />
             <ComplianceCard title="Fitness Cert. Expiry" date={truck.fitnessCertExpiryDate} />
             <ComplianceCard title="National Permit Expiry" date={truck.nationalPermitExpiryDate} />
          </div>
        </div>

        {/* RIGHT COLUMN: Document Repository */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[48px] p-8 space-y-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <FileText className="text-indigo-500" size={24} /> Document Vault
            </h3>
            <div className="space-y-4">
                <DocItem label="Registration (RC)" url={truck.rcDocumentUrl} date={truck.rcExpiryDate} />
                <DocItem label="Insurance Policy" url={truck.insuranceDocumentUrl} date={truck.insuranceExpiryDate} />
                <DocItem label="Fitness Certificate" url={truck.fitnessDocumentUrl} date={truck.fitnessCertExpiryDate} />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/10 rounded-[40px] p-8">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Compliance Health</h4>
              <ShieldCheck size={18} className="text-indigo-500" />
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <span className="text-zinc-500 text-xs font-medium">Registry Status</span>
                <span className="text-emerald-500 text-xs font-black tracking-widest uppercase">Verified</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[100%]" />
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">All primary documents are current and uploaded to the cloud repository.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helpers (DetailItem, ComplianceCard, DocItem remain the same)

// UI HELPERS (Sub-components remain the same)
function DetailItem({ label, value, icon, color }: any) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-zinc-600">
        <span className="p-1 bg-neutral-950 border border-neutral-800 rounded-md text-indigo-400">{icon}</span> 
        <span className="text-[9px] uppercase font-black tracking-widest">{label}</span>
      </div>
      <p className={`text-sm font-bold tracking-tight truncate ${color || 'text-white'}`}>{value || 'N/A'}</p>
    </div>
  )
}

function ComplianceCard({ title, date }: any) {
    const expiryDate = new Date(date);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isExpired = diffDays <= 0;
    const isUrgent = diffDays > 0 && diffDays <= 30;

    return (
        <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-[36px] flex justify-between items-center group hover:border-indigo-500/30 transition-all hover:bg-neutral-900/60 shadow-lg">
            <div className="space-y-2">
                <p className="text-[9px] text-zinc-500 uppercase font-black tracking-[0.1em]">{title}</p>
                <p className="text-lg font-black text-white tracking-tighter">{expiryDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isExpired ? 'bg-red-500 animate-ping' : isUrgent ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                  <span className={`text-[10px] font-bold ${isExpired ? 'text-red-500' : isUrgent ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {isExpired ? 'EXPIRED' : `${diffDays} Days Remaining`}
                  </span>
                </div>
            </div>
            <div className={`p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-zinc-600 group-hover:text-indigo-400 transition-colors`}>
              <Calendar size={20} />
            </div>
        </div>
    )
}

function DocItem({ label, url, date }: any) {
  const isExpired = new Date(date) < new Date();
  
  return (
    <div className="flex items-center justify-between p-5 bg-neutral-950 border border-neutral-800 rounded-3xl group hover:border-indigo-500/40 transition-all">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center border border-neutral-800 text-zinc-500 group-hover:text-indigo-400 group-hover:bg-indigo-400/5 transition-all`}>
            <FileText size={22} strokeWidth={1.5} />
        </div>
        <div>
            <span className="block text-sm font-bold text-zinc-200">{label}</span>
            <span className={`text-[9px] uppercase font-bold ${isExpired ? 'text-red-500' : 'text-zinc-600'}`}>
              {isExpired ? 'Update Required' : 'Verified Copy'}
            </span>
        </div>
      </div>
      {url ? (
          <a href={url} target="_blank" rel="noreferrer" className="p-3 bg-neutral-900 text-zinc-400 hover:text-white rounded-2xl border border-neutral-800 hover:bg-indigo-600 hover:border-indigo-500 transition-all shadow-xl">
              <Download size={16} />
          </a>
      ) : (
          <div className="px-3 py-1.5 bg-red-500/5 border border-red-500/10 rounded-xl">
             <span className="text-[9px] font-black text-red-500 uppercase tracking-tighter">Missing</span>
          </div>
      )}
    </div>
  )
}