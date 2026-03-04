import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom"; // Added Link
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth.js";
import { ChevronRight, Building2, ShieldCheck } from "lucide-react"; 

import React from "react";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  companyName: string;
  gstNumber: string;
  email: string;
  username: string;
  phoneNo: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const navigate = useNavigate();
  const { loading, handleRegister } = useAuth();

  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "", lastName: "", companyName: "", gstNumber: "",
    email: "", username: "", phoneNo: "", password: "", confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!passwordsMatch) return toast.error("Passwords do not match");

    const result = await handleRegister(formData);
    if (!result.success) return toast.error(result.message || "Registration failed");

    toast.success("Account created successfully!");
    navigate("/admin-dashboard");
  };

  const containerVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 selection:bg-indigo-500/30 flex items-center justify-center p-6">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-indigo-500/10 blur-[120px] pointer-events-none" />

      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl grid lg:grid-cols-12 gap-12 items-start"
      >
        {/* LEFT: Branding & Info */}
        <div className="lg:col-span-5 space-y-8 pt-8">
          <motion.div variants={itemVars}>
            <span className="px-3 py-1 rounded-full border border-indigo-500/30 text-indigo-400 text-xs font-medium bg-indigo-500/5">
              Admin Portal v2.0
            </span>
            <h1 className="text-5xl font-bold tracking-tight text-white mt-4">
              Register Your <span className="text-indigo-500">Admin Account.</span>
            </h1>
            <h3 className="text-2xl font-bold tracking-tight text-white mt-4 opacity-80">
              Scale your Logistics.
            </h3>
            <p className="text-zinc-400 mt-4 text-lg leading-relaxed">
              The all-in-one Transport Management System designed for modern carriers.
            </p>
          </motion.div>

          <motion.div variants={itemVars} className="space-y-6">
            <FeatureItem icon={<ShieldCheck size={20}/>} title="Super Admin Control" desc="Full visibility over operations and fleet." />
            <FeatureItem icon={<Building2 size={20}/>} title="Company Profile" desc="Automated setup for your logistics hub." />
          </motion.div>

          <motion.div variants={itemVars} className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
            <p className="text-sm text-zinc-400 italic leading-relaxed">
              "Employees don't register here. They’ll receive an invite via the dashboard once you've set up your profile."
            </p>
          </motion.div>
        </div>

        {/* RIGHT: The Form Card */}
        <motion.div 
          variants={itemVars}
          className="lg:col-span-7 bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl backdrop-blur-md shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input disabled={loading} label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
              <Input disabled={loading} label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input disabled={loading} label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} />
              <Input disabled={loading} label="GST Number" name="gstNumber" value={formData.gstNumber} onChange={handleChange} />
            </div>

            <hr className="border-zinc-800/50 my-2" />

            <div className="grid grid-cols-2 gap-4">
              <Input disabled={loading} label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} />
              <Input disabled={loading} label="Phone Number" type="tel" name="phoneNo" value={formData.phoneNo} onChange={handleChange} />
            </div>

            <Input disabled={loading} label="Username" name="username" value={formData.username} onChange={handleChange} />

            <div className="grid grid-cols-2 gap-4">
              <Input disabled={loading} label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
              <Input 
                disabled={loading} 
                label="Confirm Password" 
                type="password" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleChange}
                error={formData.confirmPassword && !passwordsMatch}
              />
            </div>

            <div className="pt-2 space-y-4">
              <motion.button
                whileHover={!loading ? { scale: 1.01, backgroundColor: "#4f46e5" } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                disabled={loading}
                className={`w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 ${loading ? "cursor-not-allowed opacity-40" : ""}`}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                ) : null}
                {loading ? "Creating Account..." : "Complete Registration"}
                {!loading && <ChevronRight size={20} />}
              </motion.button>

              {/* Redirect to Login */}
              <div className="text-center">
                <p className="text-zinc-500 text-sm">
                  Already have an account?{" "}
                  <Link 
                    to="/login" 
                    className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors ml-1"
                  >
                    Sign In here
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function FeatureItem({ icon, title, desc }: FeatureItemProps) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 text-indigo-500">{icon}</div>
      <div>
        <h4 className="font-semibold text-zinc-100">{title}</h4>
        <p className="text-sm text-zinc-400">{desc}</p>
      </div>
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: boolean | string;
}

function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="space-y-1.5 flex-1">
      <label className="text-xs font-medium text-zinc-500 ml-1">{label}</label>
      <input
        {...props}
        required
        className={`w-full bg-zinc-950/50 border ${
          error ? "border-red-500 focus:ring-red-500/20" : "border-zinc-800 focus:ring-indigo-500/20"
        } rounded-xl px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:ring-4 focus:border-indigo-500/50 transition-all`}
      />
      {error && <p className="text-[10px] text-red-500 mt-1 ml-1 uppercase tracking-wider font-bold">Match Error</p>}
    </div>
  );
}