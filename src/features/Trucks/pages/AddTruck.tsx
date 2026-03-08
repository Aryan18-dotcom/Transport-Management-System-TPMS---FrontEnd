import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
    Truck, ChevronRight, FileText, Archive, ShieldCheck, Upload,
    ChevronDown
} from "lucide-react";
import { useTrucks } from "../../Trucks/hooks/TrucksHooks";
import InputField from "../../AdminDashboard/helpers/InputField";

export default function AddTruck() {
    const navigate = useNavigate();
    const { handleAddTruck, truckLoading } = useTrucks();

    const [formData, setFormData] = useState({
        truckNumber: "GJ-01-BD-5004",
        truckType: "CONTAINER",
        capacityTons: "30",
        rcNumber: "RC-12345",
        rcExpiryDate: "2026-03-22",
        insuranceNumber: "INC-12345",
        insuranceExpiryDate: "2026-03-22",
        fitnessCertExpiryDate: "2026-03-22",
        nationalPermitExpiryDate: "2026-03-22",
        status: "AVAILABLE"
    });

    const [files, setFiles] = useState<{ [key: string]: File | null }>({
        rcFile: null,
        insuranceFile: null,
        fitnessFile: null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles({ ...files, [e.target.name]: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const requiredFields = [
            { key: "truckNumber", label: "Truck Number" },
            { key: "truckType", label: "Truck Type" },
            { key: "capacityTons", label: "Capacity" },
            { key: "rcNumber", label: "RC Number" },
            { key: "rcExpiryDate", label: "RC Expiry Date" },
            { key: "insuranceNumber", label: "Insurance Number" },
            { key: "insuranceExpiryDate", label: "Insurance Expiry Date" },
            { key: "fitnessCertExpiryDate", label: "Fitness Expiry Date" },
            { key: "nationalPermitExpiryDate", label: "National Permit Expiry" },
        ];

        for (const field of requiredFields) {
            if (!formData[field.key as keyof typeof formData]) {
                return toast.error(`Please fill in the ${field.label}`);
            }
        }

        if (!files.rcFile || !files.insuranceFile || !files.fitnessFile) {
            return toast.error("Please upload all mandatory documents");
        }

        const toastId = toast.loading("Uploading documents and registering vehicle...");

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));
        if (files.rcFile) data.append("rcFile", files.rcFile);
        if (files.insuranceFile) data.append("insuranceFile", files.insuranceFile);
        if (files.fitnessFile) data.append("fitnessFile", files.fitnessFile);

        try {
            const res = await handleAddTruck(data);

            if (res.success) {
                toast.success(res.message || "Truck added successfully!", { id: toastId });
                setTimeout(() => navigate("/admin-dashboard/trucks/all"), 1500);
            } else {
                toast.error(res.message || "Failed to add truck", { id: toastId });
            }
        } catch (error: any) {
            toast.error("An unexpected error occurred. Please try again.", { id: toastId });
        }
    };

    return (
        // 🔥 Added cursor-not-allowed based on truckLoading state
        <div className={`p-8 max-w-6xl mx-auto transition-all ${truckLoading ? "cursor-wait opacity-80" : ""}`}>
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-zinc-500 text-xs mb-4 uppercase tracking-widest font-bold">
                <span>Inventory</span> <ChevronRight size={12} /> <span className="text-indigo-400">Add New Truck</span>
            </motion.div>

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 items-start">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full lg:w-[65%] space-y-6">
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 backdrop-blur-md shadow-xl space-y-8">

                        {/* Section 1: Basic Identity */}
                        <div className="space-y-4">
                            <h3 className="text-white font-semibold flex items-center gap-2"><Truck size={18} className="text-indigo-500" /> Identity & Type</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Truck Number *" name="truckNumber" placeholder="MH-12-AB-1234" value={formData.truckNumber} onChange={handleChange} disabled={truckLoading} />


                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-tighter ml-1">
                                        Truck Type *
                                    </label>
                                    <div className="relative group"> {/* 🔥 Relative container to hold the arrow */}
                                        <select
                                            name="truckType"
                                            value={formData.truckType}
                                            onChange={handleChange}
                                            disabled={truckLoading}
                                            className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="OPEN">Open Body</option>
                                            <option value="CONTAINER">Container</option>
                                            <option value="TRAILER">Trailer</option>
                                            <option value="HALF_BODY">Half Body</option>
                                        </select>

                                        {/* 🔥 Custom Arrow Icon */}
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-focus-within:text-indigo-500 transition-colors">
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                </div>

                                <InputField label="Capacity (Tons) *" name="capacityTons" type="number" placeholder="25" value={formData.capacityTons} onChange={handleChange} disabled={truckLoading} />

                                {/* <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-tighter ml-1">Current Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        disabled={truckLoading}
                                        className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-all disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="AVAILABLE">Available</option>
                                        <option value="ON_TRIP">On Trip</option>
                                        <option value="MAINTENANCE">Maintenance</option>
                                    </select>
                                </div> */}
                            </div>
                        </div>

                        {/* Section 2: RC & Permits */}
                        <div className="space-y-4 pt-4 border-t border-neutral-800">
                            <h3 className="text-white font-semibold flex items-center gap-2"><FileText size={18} className="text-indigo-500" /> Registration & Permits</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="RC Number *" name="rcNumber" value={formData.rcNumber} onChange={handleChange} disabled={truckLoading} />
                                <InputField label="RC Expiry Date *" name="rcExpiryDate" type="date" value={formData.rcExpiryDate} onChange={handleChange} disabled={truckLoading} />
                                <InputField label="National Permit Expiry *" name="nationalPermitExpiryDate" type="date" value={formData.nationalPermitExpiryDate} onChange={handleChange} disabled={truckLoading} />
                            </div>
                        </div>

                        {/* Section 3: Insurance & Fitness */}
                        <div className="space-y-4 pt-4 border-t border-neutral-800">
                            <h3 className="text-white font-semibold flex items-center gap-2"><ShieldCheck size={18} className="text-indigo-500" /> Compliance Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Insurance Number *" name="insuranceNumber" value={formData.insuranceNumber} onChange={handleChange} disabled={truckLoading} />
                                <InputField label="Insurance Expiry *" name="insuranceExpiryDate" type="date" value={formData.insuranceExpiryDate} onChange={handleChange} disabled={truckLoading} />
                                <InputField label="Fitness Expiry *" name="fitnessCertExpiryDate" type="date" value={formData.fitnessCertExpiryDate} onChange={handleChange} disabled={truckLoading} />
                            </div>
                        </div>

                        <div className="pt-6 flex gap-4">
                            <motion.button
                                whileHover={!truckLoading ? { scale: 1.02 } : {}}
                                whileTap={!truckLoading ? { scale: 0.98 } : {}}
                                type="submit"
                                disabled={truckLoading}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:bg-neutral-800 disabled:shadow-none disabled:cursor-not-allowed"
                            >
                                {truckLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Uploading Documents...</span>
                                    </>
                                ) : (
                                    <>
                                        <Archive size={20} />
                                        <span>Register Vehicle</span>
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Right Sidebar: File Uploads */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="w-full lg:w-[35%] space-y-6 sticky top-5">
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-6">
                        <h4 className="text-lg font-bold text-white flex items-center gap-2"><Upload size={20} className="text-indigo-400" /> Documents</h4>

                        <FileSlot label="RC Document *" name="rcFile" file={files.rcFile} onChange={handleFileChange} disabled={truckLoading} />
                        <FileSlot label="Insurance Copy *" name="insuranceFile" file={files.insuranceFile} onChange={handleFileChange} disabled={truckLoading} />
                        <FileSlot label="Fitness Certificate *" name="fitnessFile" file={files.fitnessFile} onChange={handleFileChange} disabled={truckLoading} />
                    </div>
                </motion.div>
            </form>
        </div>
    );
}

// 🔥 Updated FileSlot to handle disabled state
function FileSlot({ label, name, file, onChange, disabled }: any) {
    return (
        <div className={`space-y-2 ${disabled ? "opacity-50" : ""}`}>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</label>
            <div className="relative group">
                <input
                    type="file"
                    name={name}
                    onChange={onChange}
                    className="hidden"
                    id={name}
                    accept=".pdf,.jpg,.jpeg,.png"
                    disabled={disabled}
                />
                <label
                    htmlFor={name}
                    className={`flex items-center justify-between px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl transition-all ${disabled ? "cursor-not-allowed" : "cursor-pointer group-hover:border-indigo-500/50"}`}
                >
                    <span className="text-xs text-zinc-500 truncate w-40">{file ? file.name : "Select File..."}</span>
                    <Upload size={14} className={`text-zinc-600 ${disabled ? "" : "group-hover:text-indigo-400"}`} />
                </label>
            </div>
        </div>
    );
}