import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
    Save, RotateCcw, User, ShieldCheck,
    Edit3, Upload, RefreshCw
} from "lucide-react";
import { useDrivers } from "../hooks/DriversHook";
import InputField from "../../AdminDashboard/helpers/InputField";

export default function UpdateDriversDetails() {
    const { driverId } = useParams();
    const navigate = useNavigate();
    const { handleGetDriverById, handleUpdateDriver, driverLoading } = useDrivers();

    const [formData, setFormData] = useState<any>(null);

    // 🔥 State for new license files
    const [newFiles, setNewFiles] = useState<{ [key: string]: File | null }>({
        licenseImageFront: null,
        licenseImageBack: null,
    });

    // Format ISO Date to YYYY-MM-DD for HTML input
    const formatDate = (isoString: string) => {
        if (!isoString) return "";
        return isoString.split("T")[0];
    };

    useEffect(() => {
        const loadData = async () => {
            const res = await handleGetDriverById(driverId!);
            if (res.success) {
                const driverData = res.data.driver;
                setFormData({
                    ...driverData,
                    licenseExpiryDate: formatDate(driverData.licenseExpiryDate),
                });
            }
        };
        loadData();
    }, [driverId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fieldName = e.target.name;
            setNewFiles({ ...newFiles, [fieldName]: e.target.files[0] });
            toast.success(`${fieldName.replace('licenseImage', '')} Side staged for upload`);
        }
    };

    const onUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const tid = toast.loading("Updating personnel records...");

        // 🔥 Prepare FormData for Multipart Upload
        const data = new FormData();

        // Append all current form fields
        Object.keys(formData).forEach(key => {
            // Don't append Cloudinary URLs if we are sending new files
            data.append(key, formData[key]);
        });

        // Append new files if the user selected any
        if (newFiles.licenseImageFront) data.append("licenseImageFront", newFiles.licenseImageFront);
        if (newFiles.licenseImageBack) data.append("licenseImageBack", newFiles.licenseImageBack);

        const res = await handleUpdateDriver(driverId!, data);

        if (res.success) {
            toast.success("Driver records updated successfully", { id: tid });
            navigate("/admin-dashboard/driver/edit");
        } else {
            toast.error(res.message, { id: tid });
        }
    };

    if (!formData) return (
        <div className="p-20 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Loading Personnel Data...</p>
        </div>
    );

    return (
        <div className="relative p-8 max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-white flex items-center gap-3">
                    <Edit3 className="text-indigo-500" /> Modify Driver: <span className="text-zinc-500 font-medium">{formData.firstName} {formData.lastName}</span>
                </h1>
                <button onClick={() => navigate(-1)} className="text-xs font-bold text-zinc-500 hover:text-white flex items-center gap-2 transition-colors">
                    <RotateCcw size={14} /> Revert Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Edit Form */}
                <form onSubmit={onUpdate} className="lg:col-span-8 space-y-8">

                    {/* Personal & Contact Section */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[40px] p-10 space-y-8 shadow-2xl">
                        <h3 className="text-white font-bold flex items-center gap-2 border-b border-neutral-800 pb-4">
                            <User size={18} className="text-indigo-500" /> Personal Identity
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                            <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                            <InputField label="Phone Number" name="phoneNum" value={formData.phoneNum} onChange={handleInputChange} />
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Status</label>
                                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-all">
                                    <option value="AVAILABLE">Available</option>
                                    <option value="ON_TRIP">On Trip</option>
                                    <option value="OFF_DUTY">Off Duty</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Current Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-3 text-white text-sm min-h-[100px] outline-none focus:border-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Legal & Compliance Section */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[40px] p-10 space-y-8 shadow-2xl">
                        <h3 className="text-white font-bold flex items-center gap-2 border-b border-neutral-800 pb-4">
                            <ShieldCheck size={18} className="text-indigo-500" /> License & Legal
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="License Number" name="licenceNumber" value={formData.licenceNumber} onChange={handleInputChange} />
                            <InputField label="License Expiry" name="licenseExpiryDate" type="date" value={formData.licenseExpiryDate} onChange={handleInputChange} />
                            <InputField label="Guarantor Name" name="guarantorName" value={formData.guarantorName} onChange={handleInputChange} />
                            <InputField label="Guarantor Phone.no" name="homeNumber" value={formData.homeNumber} onChange={handleInputChange} />
                            <InputField label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} />
                        </div>
                    </div>

                    <button type="submit" disabled={driverLoading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-3xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-600/20">
                        <Save size={20} /> Commit Changes to Registry
                    </button>
                </form>

                {/* Document Update Sidebar */}
                <div className="lg:col-span-4 lg:self-start sticky top-6 space-y-6">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[40px] p-8 space-y-8 shadow-2xl border-t-2 border-t-indigo-500">
                        <div className="space-y-2">
                            <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                <RefreshCw size={20} className="text-indigo-500" /> Renew License
                            </h4>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                Select new files to replace current scans
                            </p>
                        </div>

                        <div className="space-y-6">
                            <DocumentUploadSlot
                                label="License Front"
                                currentUrl={formData.licenseImageFront}
                                name="licenseImageFront"
                                selectedFile={newFiles.licenseImageFront}
                                onFileChange={handleFileChange}
                            />
                            <DocumentUploadSlot
                                label="License Back"
                                currentUrl={formData.licenseImageBack}
                                name="licenseImageBack"
                                selectedFile={newFiles.licenseImageBack}
                                onFileChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <div className="bg-indigo-600/5 border border-indigo-500/10 p-6 rounded-[32px]">
                        <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] mb-2">
                            Audit Information
                        </p>
                        <div className="space-y-2">
                            <p className="text-xs text-zinc-500">Last Registry Update:</p>
                            <p className="text-xs text-white font-bold">
                                {new Date(formData.updatedAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-component for Document Upload Slots
function DocumentUploadSlot({ label, currentUrl, name, selectedFile, onFileChange }: any) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{label}</span>
                {currentUrl && (
                    <a href={currentUrl} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-400 font-bold hover:underline">View Current</a>
                )}
            </div>

            <div className="relative group">
                <input type="file" name={name} id={name} className="hidden" onChange={onFileChange} accept="image/*" />
                <label
                    htmlFor={name}
                    className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-[28px] cursor-pointer transition-all ${selectedFile
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                            : 'bg-neutral-950 border-neutral-800 text-zinc-600 group-hover:border-indigo-500/40 group-hover:text-white'
                        }`}
                >
                    <Upload size={20} className={selectedFile ? "animate-bounce" : ""} />
                    <span className="text-[11px] font-bold mt-2 truncate w-full text-center px-2">
                        {selectedFile ? selectedFile.name : "Replace Document"}
                    </span>
                </label>
            </div>
        </div>
    );
}