import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom"; // Import Outlet
import SideBar from "../components/SideBar";
import GlobalAlertBanner from "../components/GlobalAlertBanner";
import { AdminProvider } from "../adminContext";

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState<string | null>("Dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API Load for global session check
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <AdminProvider>
      <div className="min-h-screen bg-[#070707] text-zinc-200 flex overflow-hidden font-sans">
      <SideBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <main className="flex-1 overflow-y-auto relative h-screen">
        <GlobalAlertBanner count={3} />
        <div className="relative">
           <Outlet />
        </div>
      </main>
    </div>
    </AdminProvider>
  );
}