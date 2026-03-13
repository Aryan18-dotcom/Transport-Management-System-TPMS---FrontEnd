import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth.js";
import { 
  ChevronRight, Building2, User, Landmark, 
  Mail, ArrowLeft, Loader2, ShieldCheck, 
  CheckCircle2 
} from "lucide-react";
import type { LoginResponse } from "../../../types/auth.js";

export default function Register() {
  const navigate = useNavigate();
  const { loading, requestOTP, verifyAndRegister } = useAuth();
  
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    username: "", firstName: "", lastName: "", phoneNo: "", email: "", password: "", confirmPassword: "",
    companyName: "", gstNumber: "", bankName: "", accountNumber: "", ifscCode: "", branchName: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors.includes(e.target.name)) {
      setFieldErrors(prev => prev.filter(f => f !== e.target.name));
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleStepOne = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setFieldErrors(['confirmPassword']);
      return toast.error("Passwords do not match");
    }
    
    const res = await requestOTP({ username: formData.username, email: formData.email });
    
    if (res.success) {
      toast.success("Verification code sent to email");
      nextStep();
    } else {
      if (res.message.toLowerCase().includes("username")) setFieldErrors(p => [...p, "username"]);
      if (res.message.toLowerCase().includes("email")) setFieldErrors(p => [...p, "email"]);
      toast.error(res.message);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return toast.error("Please enter a valid 6-digit OTP");

    const res = await verifyAndRegister({ ...formData, otp }) as LoginResponse;
    
    if (res.success) {
      toast.success("Registration complete! Welcome aboard.");
      if (res.user?.role === "EMPLOYEE") navigate("/employee-dashboard");
      else navigate("/admin-dashboard");
    } else {
      toast.error(res.message);
    }
  };

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 selection:bg-indigo-500/30 flex items-center justify-center p-6">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-indigo-500/10 blur-[120px] pointer-events-none" />

      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl grid lg:grid-cols-12 gap-12 items-center"
      >
        {/* LEFT: Branding & Info */}
        <div className="lg:col-span-5 space-y-8 hidden lg:block">
          <div>
            <span className="px-3 py-1 rounded-full border border-indigo-500/30 text-indigo-400 text-xs font-medium bg-indigo-500/5">
              Admin Portal v2.0
            </span>
            <h1 className="text-5xl font-bold tracking-tight text-white mt-4 leading-tight">
              Scale your <br />
              <span className="text-indigo-500">Logistics Hub.</span>
            </h1>
            <p className="text-zinc-400 mt-4 text-lg leading-relaxed">
              The all-in-one Transport Management System designed for modern carriers.
            </p>
          </div>

          <div className="space-y-6">
            <FeatureItem icon={<ShieldCheck size={20}/>} title="Fraud Prevention" desc="OTP verified registration ensures secure admin access." />
            <FeatureItem icon={<Building2 size={20}/>} title="Asset Management" desc="Track fleet, drivers, and partners in one unified grid." />
            <FeatureItem icon={<CheckCircle2 size={20}/>} title="Compliant Invoicing" desc="GST-ready billing and automated bank reconciliations." />
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
            <p className="text-sm text-zinc-400 italic leading-relaxed">
              "Establish your company profile in minutes. Employees are added later via your personal dashboard."
            </p>
          </div>
        </div>

        {/* RIGHT: Multi-Step Form Card */}
        <div className="lg:col-span-7 w-full">
          <motion.div 
            layout
            className="bg-zinc-900/40 border border-zinc-800 p-8 sm:p-10 rounded-3xl backdrop-blur-md shadow-2xl relative overflow-hidden"
          >
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 w-10 rounded-full transition-all duration-500 ${step >= i ? "bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]" : "bg-zinc-800"}`} 
                  />
                ))}
              </div>
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Step 0{step}</span>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.form 
                  key="step1" 
                  initial={{ x: 20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  exit={{ x: -20, opacity: 0 }} 
                  onSubmit={handleStepOne} 
                  className="space-y-5"
                >
                  <div className="space-y-2 mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <User size={20} className="text-indigo-500" /> Admin Profile
                    </h2>
                    <p className="text-zinc-500 text-sm">Create your master administrator account.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                    <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Username" name="username" value={formData.username} onChange={handleChange} isInvalid={fieldErrors.includes("username")} />
                    <Input label="Phone Number" type="tel" name="phoneNo" value={formData.phoneNo} onChange={handleChange} />
                  </div>
                  <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} isInvalid={fieldErrors.includes("email")} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
                    <Input label="Confirm" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} isInvalid={fieldErrors.includes("confirmPassword")} />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-indigo-600 py-4 rounded-xl font-bold mt-4 flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <>Next: Company Profile <ChevronRight size={18} /></>}
                  </button>
                </motion.form>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2" 
                  initial={{ x: 20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  exit={{ x: -20, opacity: 0 }} 
                  className="space-y-5"
                >
                  <div className="space-y-2 mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Building2 size={20} className="text-indigo-500" /> Company Identity
                    </h2>
                    <p className="text-zinc-500 text-sm">Registered business details for invoicing.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} />
                    <Input label="GST Number" name="gstNumber" value={formData.gstNumber} onChange={handleChange} />
                  </div>
                  <div className="pt-2 flex items-center gap-2 mb-2">
                    <Landmark size={18} className="text-indigo-500" />
                    <h3 className="text-lg font-bold text-white">Bank Settlement</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Bank Name" name="bankName" value={formData.bankName} onChange={handleChange} />
                    <Input label="Account Number" name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="IFSC Code" name="ifscCode" value={formData.ifscCode} onChange={handleChange} />
                    <Input label="Branch Name" name="branchName" value={formData.branchName} onChange={handleChange} />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button onClick={prevStep} className="flex-1 bg-zinc-800 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors"><ArrowLeft size={18}/> Back</button>
                    <button onClick={nextStep} className="flex-[2] bg-indigo-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all">Verify Email <ChevronRight size={18}/></button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.form 
                  key="step3" 
                  initial={{ scale: 0.9, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }} 
                  onSubmit={handleFinalSubmit} 
                  className="text-center space-y-6 py-4"
                >
                  <div className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Mail className="text-indigo-500" size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Check your Inbox</h2>
                    <p className="text-zinc-500 text-sm mt-1">Sent code to <span className="text-indigo-400 font-medium">{formData.email}</span></p>
                  </div>
                  <input 
                    type="text" maxLength={6} placeholder="••••••"
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-6 py-5 text-center text-4xl tracking-[0.5em] font-mono focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                    value={otp} onChange={(e) => setOtp(e.target.value)}
                  />
                  <div className="space-y-4 pt-4">
                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 py-4 rounded-xl font-bold text-lg hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                      {loading ? <Loader2 className="animate-spin" /> : "Verify & Complete"}
                    </button>
                    <button type="button" onClick={() => setStep(1)} className="text-zinc-500 text-sm hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto">
                      <ArrowLeft size={14} /> Back to edit
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="mt-8 text-center border-t border-zinc-800/50 pt-6">
              <p className="text-zinc-500 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 ml-1">
                  Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 text-indigo-500">{icon}</div>
      <div>
        <h4 className="font-semibold text-zinc-100">{title}</h4>
        <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function Input({ label, isInvalid, ...props }: any) {
  return (
    <div className="space-y-1.5 flex-1 text-left">
      <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${isInvalid ? "text-red-500" : "text-zinc-500"}`}>
        {label}
      </label>
      <input 
        {...props} 
        required 
        className={`w-full bg-zinc-950/50 border rounded-xl px-4 py-3 text-white text-sm transition-all ${
          isInvalid 
          ? "border-red-500/50 focus:ring-red-500/10 focus:border-red-500" 
          : "border-zinc-800 focus:ring-indigo-500/10 focus:border-indigo-500/50"
        } focus:outline-none focus:ring-4`} 
      />
    </div>
  );
}