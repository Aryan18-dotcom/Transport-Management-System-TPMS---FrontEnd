import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Link as LinkIcon, Unlink, Truck, RotateCcw, Save, AlertCircle, CheckCircle2, ShieldCheck, Weight } from "lucide-react";
import { useDrivers } from "../hooks/DriversHook";
import { useTrucks } from "../../Trucks/hooks/TrucksHooks";

export default function ManageAssignment() {
    const { driverId } = useParams();
    const navigate = useNavigate();
    
    // 🔥 Destructuring the new handleRevokeTruck alongside other functions
    const { 
        GetDriverAndTruckDetails, 
        handleAssignTruck, 
        handleRevokeTruck, // 👈 Added this
        driverLoading 
    } = useDrivers();
    
    const { trucks, refreshTrucks } = useTrucks();

    const [driver, setDriver] = useState<any>(null);
    const [currentTruck, setCurrentTruck] = useState<any>(null);
    const [selectedTruckId, setSelectedTruckId] = useState("");

    useEffect(() => {
        const loadData = async () => {
            if (!driverId) return;
            const result = await GetDriverAndTruckDetails(driverId);
            
            if (result.success) {
                setDriver(result.driverDetails);
                setCurrentTruck(result.truckDetails);
            }
            refreshTrucks();
        };
        loadData();
    }, [driverId]);

    const onConfirmAssignment = async () => {
        if (!selectedTruckId) return toast.error("Please select a vehicle first");
        const tid = toast.loading("Finalizing handover...");
        
        const res = await handleAssignTruck(driverId!, selectedTruckId);
        
        if (res.success) {
            toast.success("Vehicle Assigned Successfully", { id: tid });
            navigate("/admin-dashboard/driver/assignments");
        } else {
            toast.error(res.message || "Assignment failed", { id: tid });
        }
    };

    // 🔥 Updated: Using the dedicated Revoke function from your hook
    const onRevokeAssignment = async () => {
        const tid = toast.loading("Revoking keys and updating registry...");
        
        const res = await handleRevokeTruck(driverId!);
        
        if (res.success) {
            toast.success(res.message || "Assignment Revoked", { id: tid });
            // Refresh local state or navigate back
            navigate("/admin-dashboard/driver/assignments");
        } else {
            toast.error(res.message || "Failed to revoke access", { id: tid });
        }
    };

    if (!driver) return <div className="p-20 text-center text-zinc-500 font-bold tracking-widest uppercase animate-pulse">Accessing Registry...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-white flex items-center gap-3">
                    <LinkIcon className="text-indigo-500" /> Handover Control
                </h1>
                <button onClick={() => navigate(-1)} className="text-xs font-bold text-zinc-500 hover:text-white flex items-center gap-2 transition-all">
                    <RotateCcw size={14} /> Back to Directory
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Personnel & Current Fleet Details */}
                <div className="space-y-6">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-10 -mt-10" />
                        
                        <div className="flex items-center gap-5 mb-10 relative z-10">
                            <div className="w-20 h-20 bg-indigo-600 rounded-[28px] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-600/20">
                                {driver.firstName[0]}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">Active Personnel</p>
                                <h2 className="text-3xl font-black text-white tracking-tight">{driver.firstName} {driver.lastName}</h2>
                                <p className="text-sm text-zinc-500 font-medium">UID: {driver._id.slice(-6).toUpperCase()}</p>
                            </div>
                        </div>

                        <div className={`p-8 rounded-[36px] border-2 border-dashed transition-all relative z-10 ${
                            currentTruck ? 'bg-emerald-500/[0.02] border-emerald-500/20' : 'bg-neutral-950 border-neutral-800'
                        }`}>
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Linked Asset</p>
                                {currentTruck && <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black rounded-full border border-emerald-500/20 uppercase tracking-tighter">In Transit</span>}
                            </div>
                            
                            {currentTruck ? (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-4 bg-neutral-900 text-indigo-400 rounded-2xl border border-neutral-800">
                                                <Truck size={28} />
                                            </div>
                                            <div>
                                                <p className="text-xl font-black text-white uppercase tracking-tight">{currentTruck.truckNumber}</p>
                                                <p className="text-xs text-zinc-500 font-bold uppercase">{currentTruck.truckType}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-center px-4 border-l border-neutral-800">
                                            <div className="flex items-center gap-2 text-zinc-500 mb-1">
                                                <Weight size={14} />
                                                <span className="text-[10px] font-black uppercase">Capacity</span>
                                            </div>
                                            <p className="text-sm font-bold text-white">{currentTruck.capacityTons} Tons</p>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={onRevokeAssignment}
                                        disabled={driverLoading}
                                        className="w-full py-4 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-[20px] text-[11px] font-black tracking-[0.2em] transition-all shadow-lg active:scale-95"
                                    >
                                        TERMINATE HANDOVER
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center py-10 text-center">
                                    <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mb-4 border border-neutral-800">
                                        <AlertCircle size={32} className="text-zinc-700" />
                                    </div>
                                    <p className="text-sm font-bold text-zinc-500 italic">No fleet currently assigned.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* New Assignment Selection */}
                <div className="space-y-6">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[40px] p-10 space-y-10 shadow-2xl h-full">
                        <div className="space-y-3">
                            <h3 className="text-2xl font-black text-white flex items-center gap-3">
                                <CheckCircle2 size={24} className="text-indigo-500" /> New Pairing
                            </h3>
                            <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                                Select a vehicle from the available inventory to initialize a new link.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Available Fleet</label>
                            <div className="relative">
                                <select
                                    value={selectedTruckId}
                                    onChange={(e) => setSelectedTruckId(e.target.value)}
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-6 py-5 text-white text-sm outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">-- Choose Truck --</option>
                                    {trucks.filter(t => t.status === 'AVAILABLE' && t._id !== currentTruck?._id).map(truck => (
                                        <option key={truck._id} value={truck._id}>
                                            {truck.truckNumber} • {truck.truckType}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="pt-4 space-y-4">
                            <button
                                onClick={onConfirmAssignment}
                                disabled={!selectedTruckId || driverLoading}
                                className={`w-full py-5 rounded-[24px] font-black text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl ${
                                    !selectedTruckId || driverLoading 
                                    ? 'bg-neutral-800 text-zinc-600 cursor-not-allowed border border-neutral-700' 
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 active:scale-95'
                                }`}
                            >
                                <Save size={20} /> INITIALIZE HANDOVER
                            </button>
                            
                            <div className="flex items-start gap-3 p-4 bg-indigo-500/[0.03] border border-indigo-500/10 rounded-2xl">
                                <ShieldCheck size={16} className="text-indigo-500 mt-0.5" />
                                <p className="text-[10px] text-zinc-500 leading-relaxed font-bold tracking-tight uppercase">
                                    Changes will take effect immediately in the live tracking system.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}