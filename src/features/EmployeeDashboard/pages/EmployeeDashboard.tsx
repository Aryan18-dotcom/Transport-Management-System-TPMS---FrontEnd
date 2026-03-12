import { useState, useEffect } from 'react';
import SideBar from '../components/SideBar';
import { Outlet, useNavigate } from "react-router-dom"; // Added useNavigate for cleaner routing
import { useEmployee } from '../hook/employeeHook';
import GlobalAlertBanner from '../../AdminDashboard/components/GlobalAlertBanner';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, KeyRound } from 'lucide-react';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<string | null>("Dashboard");
  const [showPrompt, setShowPrompt] = useState(false);
  
  const { metrics, fetchOpsMetrics, opsLoading } = useEmployee();

  useEffect(() => {
    // Initial fetch of today's movements and security status
    fetchOpsMetrics();
  }, []);

  useEffect(() => {
    // 🔥 Logic: Trigger Security Gate if the Admin's temp password is still active
    // This looks at the flag we added in the dashboard-metrics controller
    if (metrics?.user?.needsInitialPasswordChange) {
      setShowPrompt(true);
    }
  }, [metrics]);

  const handleGoToSettings = () => {
    setShowPrompt(false);
    setActiveMenu("Settings");
    // Standard react-router navigation to your settings page
    navigate("/employee-dashboard/settings");
  };

  return (
    <div className="min-h-screen bg-[#070707] text-zinc-200 flex overflow-hidden font-sans">
      <SideBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      <main className="flex-1 overflow-y-auto relative h-screen custom-scrollbar">
        <GlobalAlertBanner alerts={metrics?.compliance || []} />

        {/* --- PASSWORD SECURITY PROMPT: Initial Access Protocol --- */}
        <AnimatePresence>
          {showPrompt && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className="bg-[#111111] border border-white/10 p-10 rounded-[40px] max-w-lg w-full shadow-2xl text-center"
              >
                <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-amber-500/20">
                  <ShieldAlert size={40} className="text-amber-500" />
                </div>
                
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-4 italic leading-none">Security Protocol</h2>
                <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-10 px-4">
                  Your account is currently using a <span className="text-amber-500">temporary access key</span> assigned by the Admin. For the safety of <span className="text-white">AK Roadways Terminal</span>, please establish a secure personal password.
                </p>

                <div className="flex flex-col gap-4">
                  <button 
                    onClick={handleGoToSettings}
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20"
                  >
                    <KeyRound size={18} /> Update Access Key
                  </button>
                  
                  <button 
                    onClick={() => setShowPrompt(false)}
                    className="w-full py-5 bg-transparent border border-white/5 text-zinc-600 hover:text-zinc-400 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
                  >
                    Remind Me Later
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <Outlet context={{ metrics, opsLoading, refresh: fetchOpsMetrics }} />
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;