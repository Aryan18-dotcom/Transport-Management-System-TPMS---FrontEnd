import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UserPlus, ShieldCheck, Mail, Lock, User, ChevronRight } from "lucide-react";
import InputField from "../../helpers/InputField";
import { useAdmin } from "../../hooks/AdminHook";// 🔥 Import the new Admin hook

export default function CreateEmployee() {
  const navigate = useNavigate();
  const { handleCreateEmployee, adminLoading } = useAdmin(); // 🔥 Get handlers from hook

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a toast ID so we can update it (loading -> success/error)
    const toastId = toast.loading("Provisioning employee account...");

    try {
      // 🔥 Call the real API through the hook
      const result = await handleCreateEmployee(formData);
      const data = await result.json()

      if (result.ok) {
        toast.success(data.message || "Employee created successfully!", { id: toastId });
        // Redirect to the employee list after success
        navigate("/admin-dashboard/employees/all");
      } else {
        // Handle specific error messages from the backend
        toast.error(data.message || "Failed to create employee", { id: toastId });
      }
    } catch (error: any) {
      toast.error("A network error occurred. Please try again.", { id: toastId });
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* 1. Breadcrumbs */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 text-zinc-500 text-xs mb-4 uppercase tracking-widest font-bold"
      >
        <span>Employees</span>
        <ChevronRight size={12} />
        <span className="text-indigo-400">Add New Staff</span>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* 2. Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full lg:w-[65%] space-y-6"
        >
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 backdrop-blur-md shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <User size={18} className="text-indigo-500" /> Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="First Name"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={adminLoading}
                  />
                  <InputField
                    label="Last Name"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={adminLoading}
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Mail size={18} className="text-indigo-500" /> Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={adminLoading}
                  />
                  <InputField
                    label="Phone Number"
                    name="phoneNo"
                    type="tel"
                    placeholder="+91 00000 00000"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    disabled={adminLoading}
                  />
                </div>
              </div>

              {/* Security */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Lock size={18} className="text-indigo-500" /> Access Security
                </h3>
                <InputField
                  label="Temporary Password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={adminLoading}
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-6 flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={adminLoading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                  {adminLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <UserPlus size={20} />
                  )}
                  {adminLoading ? "Processing..." : "Register Employee"}
                </motion.button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-8 py-4 bg-neutral-800 hover:bg-neutral-700 text-zinc-300 font-bold rounded-2xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* 3. Info Sidebar (Right 35%) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-[35%] space-y-6"
        >
          <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-3xl space-y-4">
            <ShieldCheck className="text-indigo-400" size={32} />
            <h4 className="text-lg font-bold text-white leading-tight">First-Time Login Protocol</h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Upon first login, the employee will be forced to change their temporary password.
            </p>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li className="flex gap-2">
                <div className="w-1 h-1 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                Employees cannot view revenue or bill totals.
              </li>
              <li className="flex gap-2">
                <div className="w-1 h-1 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                They can manage trips, trucks, and maintenance.
              </li>
            </ul>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl">
            <h4 className="text-sm font-bold text-zinc-100 mb-2 uppercase tracking-tighter">Quick Note</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Ensure the phone number is correct as it will be used for two-factor authentication in future updates.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}