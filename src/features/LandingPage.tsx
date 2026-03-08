import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { Truck, ChevronRight, Shield, BarChart3, Globe } from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Logic to get initials (e.g., "Aryan Chheda" -> "AC")
  const getInitials = () => {
    if (!user) return "";
    const first = user.firstName?.charAt(0) || "";
    const last = user.lastName?.charAt(0) || "";
    return (first + last).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-indigo-500/30">
      {/* --- NAVIGATION BAR --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#070707]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform">
              <Truck size={22} />
            </div>
            <span className="text-xl font-bold tracking-tighter">TPMS <span className="text-indigo-500">PRO</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#fleet" className="hover:text-white transition-colors">Fleet</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              /* LOGGED IN: Show Initials Avatar */
              <Link 
                to={user.role === "COMPANY_ADMIN" ? "/admin-dashboard" : "/employee-dashboard"}
                className="flex items-center gap-3 group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-zinc-500 font-medium">Welcome back,</p>
                  <p className="text-sm font-bold text-white">{user.firstName}</p>
                </div>
                <div className="w-11 h-11 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold border-2 border-indigo-400/20 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                  {getInitials()}
                </div>
              </Link>
            ) : (
              /* LOGGED OUT: Show Get Started */
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-zinc-400 hover:text-white transition-colors">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-200 transition-all shadow-lg shadow-white/5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-8 uppercase tracking-widest"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Next-Gen Logistics Solution
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]"
          >
            Manage your fleet <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">without the chaos.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            The ultimate ERP for transport companies. Tracking, Billing, Maintenance, 
            and Personnel management in one unified dashboard.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => navigate(user ? '/admin-dashboard' : '/register')}
              className="w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 transition-all"
            >
              Start Free Trial <ChevronRight size={18} />
            </button>
            <button className="w-full sm:w-auto px-10 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-2xl font-bold transition-all">
              Watch Demo
            </button>
          </motion.div>
        </div>
      </header>

      {/* --- FEATURE GRID --- */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Shield className="text-indigo-500" />} 
            title="Secure Operations" 
            desc="Role-based access ensures your company sensitive data stays between you and the admins." 
          />
          <FeatureCard 
            icon={<BarChart3 className="text-indigo-500" />} 
            title="Smart Analytics" 
            desc="Predictive maintenance and revenue tracking to help you scale your fleet efficiently." 
          />
          <FeatureCard 
            icon={<Globe className="text-indigo-500" />} 
            title="Real-time Sync" 
            desc="Instant updates across employee and admin dashboards for zero communication lag." 
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-[32px] hover:bg-zinc-900 hover:border-indigo-500/30 transition-all group">
      <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}