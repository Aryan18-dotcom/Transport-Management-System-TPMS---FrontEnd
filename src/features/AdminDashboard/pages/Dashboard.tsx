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

  // 🔥 CORE DATA LOGIC: Extract and filter alerts for the banner
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
    <div className="min-h-screen bg-[#070707] text-zinc-200 flex overflow-hidden font-sans">
      <SideBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <main className="flex-1 overflow-y-auto relative h-screen">
        {/* 🔥 Passing the dynamic data here */}
        <GlobalAlertBanner alerts={bannerAlerts} />
        
        <div className="relative">
          <Outlet />
        </div>
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