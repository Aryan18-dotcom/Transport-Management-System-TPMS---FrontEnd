import { useState, useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import GlobalAlertBanner from "../components/GlobalAlertBanner";
import { AdminProvider } from "../adminContext";
import { useAdmin } from "../hooks/adminHook";
import { useAuth } from "../../auth/hooks/useAuth";

function DashboardContent({ activeMenu, setActiveMenu }: any) {
  const { user } = useAuth();
  const { fetchMetrics, metrics } = useAdmin();

  useEffect(() => {
    if (user) fetchMetrics();
  }, [user]);

  const bannerAlerts = useMemo(() => {
    if (!metrics?.metrics?.compliance) return [];

    return metrics.metrics.compliance.flatMap((vehicle: any) =>
      vehicle.alerts.map((alert: any) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiry = new Date(alert.date);
        const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        return {
          truck: vehicle.truck,
          type: alert.type,
          date: alert.date,
          vehicleId: vehicle.truckId,
          daysLeft: diffDays,
          status: diffDays < 0 ? 'EXPIRED' : diffDays <= 15 ? 'CRITICAL' : 'STABLE'
        };
      })
    ).filter((a: any) => a.status !== 'STABLE');
  }, [metrics]);

  return (
    <div className="min-h-screen bg-[#070707] text-zinc-200 flex overflow-hidden font-sans relative">
      {/* 1. Sidebar is now fixed/sticky internally */}
      <SideBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      {/* 2. Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen relative">
        
        {/* 🔥 MOBILE PADDING: Adds 64px (h-16) padding-top only on mobile to clear the hamburger bar */}
        <div className="lg:pt-0 pt-16">
          <GlobalAlertBanner alerts={bannerAlerts} />
          
          <div className="relative">
            <Outlet />
          </div>
        </div>

        {/* Optional: Subtle background glow for the ERP aesthetic */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
      </main>
    </div>
  );
}

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState<string | null>("Dashboard");

  return (
    <AdminProvider>
      <DashboardContent activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
    </AdminProvider>
  );
}