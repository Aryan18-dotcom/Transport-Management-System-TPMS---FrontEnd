import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth.js";
import { LogIn, ArrowRight, Activity, Globe, Box } from "lucide-react";

// --- Interfaces ---

interface StatBoxProps {
  label: string;
  value: string;
  color: "indigo" | "emerald" | "amber";
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Login() {
  const navigate = useNavigate();
  // Ensure useAuth provides these types or cast them if necessary
  const { loading, handleLogin } = useAuth() as { 
    loading: boolean; 
    handleLogin: (data: any) => Promise<{ success: boolean; message?: string }> 
  };

  const [formData, setFormData] = useState({ userId: "", password: "" });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Fixed Event Type for Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Mouse move with specific HTMLDivElement type
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth) - 0.5;
    const y = (clientY / window.innerHeight) - 0.5;
    setMousePos({ x, y });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const result = await handleLogin(formData);
    if (!result.success) {
      toast.error(result.message || "Invalid credentials");
      return;
    }
    
    toast.success("Welcome back!");
    navigate("/admin-dashboard");
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#070707] text-zinc-200 flex overflow-hidden relative"
    >
      {/* GLOBAL DOT BACKGROUND */}
      <div 
        className="absolute inset-0 opacity-[0.2] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(#333 1px, transparent 1px)`, backgroundSize: '24px 24px' }} 
      />

      {/* AMBIENT GLOWS */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-indigo-600/5 blur-[120px] pointer-events-none" />

      {/* LEFT SIDE - 40% (LOGIN FORM) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }} // Changed to -30 for entrance from left
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-[40%] flex items-center justify-center p-8 z-10 border-r border-zinc-800/50"
      >
        <div className="w-full max-w-sm space-y-10">
          <div className="space-y-3">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20"
            >
              <LogIn className="text-white" size={24} />
            </motion.div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h1>
            <p className="text-zinc-500 text-sm">Secure access for fleet managers and logistics operators.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Identifier"
                name="userId"
                placeholder="Username or Email"
                value={formData.userId}
                onChange={handleChange}
              />
              <div className="space-y-2">
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors ml-1">
                  Trouble signing in?
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01, backgroundColor: "#4f46e5" }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              ) : null}
              {loading ? "Authenticating..." : "Enter Dashboard"}
              {!loading && <ArrowRight size={18} />}
            </motion.button>

            <div className="text-center pt-4">
              <p className="text-sm text-zinc-500">
                New to the platform?{" "}
                <Link to="/register" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                  Create Company
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>

      {/* RIGHT SIDE - 60% (DASHBOARD VISUALS) */}
      <div className="hidden lg:flex lg:w-[60%] relative items-center justify-center p-12 overflow-hidden">
        <motion.div
          style={{
            x: mousePos.x * 30,
            y: mousePos.y * 30,
            rotateX: mousePos.y * -5,
            rotateY: mousePos.x * 5
          }}
          className="relative w-full max-w-2xl grid grid-cols-2 gap-6"
        >
          {/* Main Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-2 p-8 bg-zinc-900/40 border border-zinc-700/50 rounded-3xl backdrop-blur-md shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-indigo-600/20 rounded-2xl text-indigo-400">
                <Globe size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Global Fleet Network</h3>
                <p className="text-sm text-zinc-500">Real-time logistics synchronization active.</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <StatBox label="Active Trucks" value="482" color="indigo" />
              <StatBox label="On-Route" value="319" color="emerald" />
              <StatBox label="Pending" value="24" color="amber" />
            </div>
          </motion.div>

          {/* Mini Interactive Cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <Activity size={18} className="text-emerald-500" />
              <span className="text-[10px] font-mono text-emerald-500/80 bg-emerald-500/10 px-2 py-0.5 rounded uppercase tracking-wider">System Stable</span>
            </div>
            <div className="h-20 flex items-end gap-1">
              {[0.4, 0.8, 0.5, 0.9, 0.6, 0.3, 0.7].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [`${h * 100}%`, `${Math.random() * 100}%`, `${h * 100}%`] }}
                  transition={{ repeat: Infinity, duration: 2 + i }}
                  className="flex-1 bg-indigo-500/30 rounded-t-sm"
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl backdrop-blur-sm space-y-4"
          >
            <div className="flex items-center gap-3">
              <Box size={18} className="text-indigo-400" />
              <span className="text-xs font-bold text-zinc-300">Recent Load ID</span>
            </div>
            <div className="space-y-2">
              <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ x: [-100, 200] }} 
                  transition={{ repeat: Infinity, duration: 1.5 }} 
                  className="w-1/2 h-full bg-indigo-500" 
                />
              </div>
              <p className="text-[10px] font-mono text-zinc-500">Processing: #TMS-8829-X</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// --- Sub-components with TypeScript Props ---

function StatBox({ label, value, color }: StatBoxProps) {
  const colorMap = {
    indigo: "text-indigo-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400"
  };
  
  return (
    <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/50">
      <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 font-bold">{label}</p>
      <p className={`text-2xl font-mono font-bold ${colorMap[color]}`}>{value}</p>
    </div>
  );
}

function Input({ label, ...props }: InputProps) {
  return (
    <div className="space-y-2 w-full text-left">
      <label className="text-xs font-bold text-zinc-400 ml-1 uppercase tracking-tighter">
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-zinc-900/50 border border-zinc-800 focus:ring-indigo-500/20 rounded-2xl px-5 py-3.5 text-white placeholder-zinc-700 focus:outline-none focus:ring-4 focus:border-indigo-500/40 transition-all shadow-inner"
      />
    </div>
  );
}