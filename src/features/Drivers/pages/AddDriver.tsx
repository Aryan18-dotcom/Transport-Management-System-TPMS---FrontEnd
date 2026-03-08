import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { 
  UserPlus, ChevronRight, Contact, ShieldCheck, 
  Upload, Image as ImageIcon, CreditCard
} from "lucide-react";
import { useDrivers } from "../hooks/DriversHook";
import InputField from "../../AdminDashboard/helpers/InputField";

export default function AddDriver() {
  const navigate = useNavigate();
  const { handleAddDriver, driverLoading } = useDrivers(); 

  // 1. Text Fields State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNum: "",
    licenceNumber: "",
    licenseExpiryDate: "",
    bloodGroup: "",
    guarantorName: "",
    homeNumber: "",
    address: "",
    status: "AVAILABLE"
  });

  // 2. File State
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    licenseImageFront: null,
    licenseImageBack: null,
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

    // Client-side validation for mandatory fields based on backend logic
    if (!formData.firstName || !formData.lastName || !formData.phoneNum || !formData.licenceNumber) {
      return toast.error("Please fill in all mandatory fields (Name, Phone, License #)");
    }

    if (!files.licenseImageFront || !files.licenseImageBack) {
      return toast.error("Both Front and Back images of the License are required");
    }

    const toastId = toast.loading("Uploading documents and registering driver...");

    // Prepare Multipart Form Data
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.append("licenseImageFront", files.licenseImageFront);
    data.append("licenseImageBack", files.licenseImageBack);

    try {
      const res = await handleAddDriver(data); 
      if (res.success) {
        toast.success("Driver registered successfully!", { id: toastId });
        navigate("/admin-dashboard/driver/all"); 
      } else {
        toast.error(res.message || "Failed to register driver", { id: toastId });
      }
    } catch (error) {
      toast.error("An unexpected error occurred", { id: toastId });
    }
  };

  return (
    <div className={`p-8 max-w-6xl mx-auto transition-all ${driverLoading ? "opacity-50 pointer-events-none cursor-wait" : ""}`}>
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-zinc-500 text-xs mb-4 uppercase tracking-widest font-bold">
        <span>Workforce</span> <ChevronRight size={12} /> <span className="text-indigo-400">Register Driver</span>
      </motion.div>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 items-start">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full lg:w-[65%] space-y-6">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-[40px] p-10 backdrop-blur-md shadow-2xl space-y-8">
            
            {/* Section 1: Personal Details */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold flex items-center gap-2"><Contact size={18} className="text-indigo-500" /> Identity & Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="First Name *" name="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} required />
                <InputField label="Last Name *" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} required />
                <InputField label="Phone Number *" name="phoneNum" placeholder="+91 00000 00000" value={formData.phoneNum} onChange={handleChange} required />
                <InputField label="Blood Group" name="bloodGroup" placeholder="O+" value={formData.bloodGroup} onChange={handleChange} />
              </div>
            </div>

            {/* Section 2: License Details */}
            <div className="space-y-4 pt-4 border-t border-neutral-800">
              <h3 className="text-white font-semibold flex items-center gap-2"><CreditCard size={18} className="text-indigo-500" /> License Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="License Number *" name="licenceNumber" placeholder="DL-XXXXXXXXXXXXX" value={formData.licenceNumber} onChange={handleChange} required />
                <InputField label="License Expiry Date" name="licenseExpiryDate" type="date" value={formData.licenseExpiryDate} onChange={handleChange} />
                <InputField label="Guarantor Name" name="guarantorName" placeholder="Full Name" value={formData.guarantorName} onChange={handleChange} />
                <InputField label="Guarantor Phone.no" name="homeNumber" placeholder="+91xxxxxxxxxx" value={formData.homeNumber} onChange={handleChange} />
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-tighter ml-1">Current Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-all">
                    <option value="AVAILABLE">Available</option>
                    <option value="ON_TRIP">On Trip</option>
                    <option value="OFF_DUTY">Off Duty</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Address */}
            <div className="space-y-2">
               <label className="text-xs font-bold text-zinc-500 uppercase tracking-tighter ml-1">Permanent Address</label>
               <textarea 
                  name="address" 
                  value={formData.address} 
                  onChange={(e: any) => handleChange(e)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-3 text-white text-sm min-h-[100px] outline-none focus:border-indigo-500 transition-all"
                  placeholder="Street, City, State, Zip..."
               />
            </div>

            <button type="submit" disabled={driverLoading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2">
               {driverLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <UserPlus size={20} />}
               Confirm Registration
            </button>
          </div>
        </motion.div>

        {/* Right Sidebar: License Uploads */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="w-full lg:w-[35%] lg:col-span-4 lg:self-start sticky top-1 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-[40px] space-y-6 shadow-xl">
            <h4 className="text-lg font-bold text-white flex items-center gap-2"><ShieldCheck size={20} className="text-indigo-400" /> Compliance Vault</h4>
            
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest px-1">Mandatory Documents</p>
            
            <FileSlot label="License Front Copy *" name="licenseImageFront" file={files.licenseImageFront} onChange={handleFileChange} />
            <FileSlot label="License Back Copy *" name="licenseImageBack" file={files.licenseImageBack} onChange={handleFileChange} />
            
            <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-3xl">
               <p className="text-[10px] text-indigo-400 uppercase font-bold mb-1">Image Quality Tip</p>
               <p className="text-[11px] text-zinc-400 leading-relaxed">Ensure the license number and expiry date are clearly visible in the photos for automated verification.</p>
            </div>
          </div>
        </motion.div>
      </form>
    </div>
  );
}

function FileSlot({ label, name, file, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <input type="file" name={name} onChange={onChange} className="hidden" id={name} accept="image/*,.pdf" />
        <label htmlFor={name} className="flex flex-col items-center justify-center gap-3 px-4 py-8 bg-neutral-950 border-2 border-dashed border-neutral-800 rounded-[32px] cursor-pointer group-hover:border-indigo-500/50 transition-all group-hover:bg-indigo-500/[0.02]">
          <div className="p-3 bg-neutral-900 rounded-2xl text-zinc-500 group-hover:text-indigo-400 transition-colors">
            {file ? <ImageIcon size={24} /> : <Upload size={24} />}
          </div>
          <span className="text-xs text-zinc-500 text-center font-medium px-4 truncate max-w-full">
            {file ? file.name : "Click to upload scan"}
          </span>
        </label>
      </div>
    </div>
  );
}