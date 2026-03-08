import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Phone, MapPin, CreditCard, Calendar, 
  ShieldCheck, Droplets, ExternalLink,
  Edit3, Trash2, AlertCircle, Truck, 
  Weight, Gauge, ChevronRight
} from "lucide-react";
import { useDrivers } from "../hooks/DriversHook";

export default function DriverDetails() {
  const { driverId } = useParams();
  const navigate = useNavigate();
  
  // 🔥 Using GetDriverAndTruckDetails to get populated data
  const { GetDriverAndTruckDetails, driverLoading } = useDrivers();
  
  const [driver, setDriver] = useState<any>(null);
  const [truck, setTruck] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFullDetails = async () => {
      if (!driverId) return;
      const result = await GetDriverAndTruckDetails(driverId);
      
      if (result.success) {
        setDriver(result.driverDetails);
        setTruck(result.truckDetails); // This contains the populated vehicle info
      } else {
        setError(result.message);
      }
    };
    fetchFullDetails();
  }, [driverId]);

  if (driverLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-zinc-500 font-bold tracking-widest text-xs uppercase">Opening Personnel File...</p>
    </div>
  );

  if (error || (!driver && !driverLoading)) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <AlertCircle size={48} className="text-red-500 mb-4" />
      <h2 className="text-xl font-bold text-white mb-2">Driver Not Found</h2>
      <button onClick={() => navigate(-1)} className="bg-neutral-800 px-6 py-2 rounded-xl text-white font-bold">Back to Directory</button>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
      {/* 1. Header Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white group transition-all">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-[10px] uppercase tracking-[0.2em]">Personnel Directory</span>
        </button>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate(`/admin-dashboard/driver/edit/${driver._id}`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-zinc-400 text-xs font-bold hover:text-white transition-all"
          >
            <Edit3 size={14} /> Edit Profile
          </button>
          <button className="p-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Profile & Info */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* A. Hero Identity Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-neutral-900 border border-neutral-800 rounded-[48px] p-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[100px] rounded-full -mr-32 -mt-32" />
            
            <div className="flex flex-col md:flex-row md:items-center gap-10 relative z-10">
              <div className="w-32 h-32 bg-indigo-600 rounded-[40px] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-indigo-600/30">
                {driver.firstName[0]}{driver.lastName[0]}
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <h1 className="text-5xl font-black text-white tracking-tighter uppercase">{driver.firstName} {driver.lastName}</h1>
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest border ${driver.status === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                    {driver.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-zinc-400 font-medium text-sm">
                  <span className="flex items-center gap-2"><Phone size={14} className="text-indigo-500" /> {driver.phoneNum}</span>
                  <span className="flex items-center gap-2"><MapPin size={14} className="text-indigo-500" /> {driver.address}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-10 border-t border-neutral-800/60 relative z-10">
               <DetailItem label="Blood Group" value={driver.bloodGroup} icon={<Droplets size={14}/>} />
               <DetailItem label="Guarantor" value={driver.guarantorName} icon={<ShieldCheck size={14}/>} />
               <DetailItem label="Joined Date" value={new Date(driver.createdAt).toLocaleDateString()} icon={<Calendar size={14}/>} />
               <DetailItem label="Emergency No." value={driver.homeNumber || 'N/A'} icon={<Phone size={14}/>} />
            </div>
          </motion.div>

          {/* B. FLEET ASSIGNMENT SECTION (NEW) */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-[40px] p-8 relative overflow-hidden shadow-xl">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Truck size={18} className="text-indigo-500" /> Active Fleet Assignment
                </h3>
                <button 
                  onClick={() => navigate(`/admin-dashboard/driver/manage-assignment/${driver._id}`)}
                  className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest flex items-center gap-1"
                >
                  Manage Handover <ChevronRight size={12} />
                </button>
             </div>

             {truck ? (
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 flex items-center gap-4 col-span-4">
                     <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-2xl">
                        <Truck size={24} />
                     </div>
                     <div>
                        <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Plate Number</p>
                        <p className="text-lg font-black text-white uppercase">{truck.truckNumber}</p>
                     </div>
                  </div>
                  <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 flex items-center gap-4 col-span-2">
                     <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-2xl">
                        <Gauge size={24} />
                     </div>
                     <div>
                        <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Truck Type</p>
                        <p className="text-sm font-bold text-white uppercase">{truck.truckType}</p>
                     </div>
                  </div>
                  <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 flex items-center gap-4 col-span-2">
                     <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-2xl">
                        <Weight size={24} />
                     </div>
                     <div>
                        <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Capacity</p>
                        <p className="text-sm font-bold text-white uppercase">{truck.capacityTons} Tons</p>
                     </div>
                  </div>
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center py-6 bg-neutral-950/50 rounded-3xl border border-dashed border-neutral-800">
                  <AlertCircle size={24} className="text-zinc-700 mb-2" />
                  <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest italic">No vehicle currently linked to this personnel.</p>
               </div>
             )}
          </div>

          {/* C. License Badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LicenseBadge title="Commercial License" value={driver.licenceNumber} />
            <LicenseBadge 
              title="License Expiry" 
              value={new Date(driver.licenseExpiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} 
              isUrgent={new Date(driver.licenseExpiryDate) < new Date()}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Document Scans */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[48px] p-8 space-y-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <CreditCard className="text-indigo-500" size={24} /> License Vault
            </h3>
            
            <div className="space-y-6">
               <DocumentPreview label="License Front" url={driver.licenseImageFront} />
               <DocumentPreview label="License Back" url={driver.licenseImageBack} />
            </div>
          </div>

          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[32px] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-500 rounded-lg text-white"><ShieldCheck size={18} /></div>
              <h4 className="text-sm font-bold text-white">Compliance Verified</h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed italic">Documents were uploaded and verified by {driver.addedBy?.firstName || 'Admin'} on {new Date(driver.createdAt).toLocaleDateString()}.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// UI HELPERS (Sub-components)
function DetailItem({ label, value, icon }: any) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-zinc-500">
        <span className="p-1 bg-neutral-950 border border-neutral-800 rounded-md text-indigo-400">{icon}</span> 
        <span className="text-[9px] uppercase font-black tracking-widest">{label}</span>
      </div>
      <p className="text-sm font-bold text-white truncate">{value || 'N/A'}</p>
    </div>
  )
}

function LicenseBadge({ title, value, isUrgent }: any) {
  return (
    <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-[36px] flex flex-col gap-2">
      <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">{title}</p>
      <p className={`text-xl font-black tracking-tight ${isUrgent ? 'text-red-500' : 'text-white'}`}>{value}</p>
    </div>
  )
}

function DocumentPreview({ label, url }: any) {
  return (
    <div className="space-y-3 group">
      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-2">{label}</p>
      <div className="relative aspect-[16/10] bg-neutral-950 rounded-[24px] border border-neutral-800 overflow-hidden">
        {url ? (
          <>
            <img src={url} alt={label} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
            <a href={url} target="_blank" rel="noreferrer" className="absolute inset-0 flex items-center justify-center bg-indigo-600/0 group-hover:bg-indigo-600/20 transition-all">
               <div className="p-3 bg-white text-indigo-600 rounded-full scale-0 group-hover:scale-100 transition-transform">
                 <ExternalLink size={20} />
               </div>
            </a>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700 italic text-xs">No scan available</div>
        )}
      </div>
    </div>
  )
}