import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Truck, Building2, Settings, Plus, 
  List, Wrench, LogOut, UserPlus, Contact, FileUser, Key, 
  LucideTruckElectric, ChevronDown, Menu, X 
} from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth.jsx";
import toast from "react-hot-toast";

const SideBar = ({ activeMenu, setActiveMenu }: { activeMenu: string | null; setActiveMenu: (menu: string) => void }) => {
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false); 
  const { handleLogout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 🔥 Effect: Close sidebar automatically when a link is clicked on mobile
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // 🔥 Effect: Sync active states with URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/employees")) setOpenSubMenu("Employees");
    else if (path.includes("/truck")) setOpenSubMenu("Trucks");
    else if (path.includes("/partner")) setOpenSubMenu("Partners");
    else if (path.includes("/driver")) setOpenSubMenu("Workforce");
    else if (path.includes("/trips")) setOpenSubMenu("Trips");

    if (path === "/employee-dashboard") setActiveMenu("Dashboard");
    else if (path.includes("/settings")) setActiveMenu("Settings");
    else setActiveMenu("");
  }, [location.pathname, setActiveMenu]);

  const handleToggle = (title: string) => {
    setOpenSubMenu(prev => prev === title ? null : title);
  };

  const handleLogoutClick = async () => {
    const result = await handleLogout();
    if (!result.success) toast.error(result.message || "Logout failed");
    else toast.success("Logged out from Operations Console");
  };

  return (
    <>
      {/* 1. MOBILE TRIGGER (HAMBURGER) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0d0d0f]/80 backdrop-blur-md border-b border-white/5 z-40 px-4 flex items-center">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-2 bg-indigo-600/10 text-indigo-500 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-lg"
        >
          <Menu size={22} />
        </button>
        <div className="ml-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-[10px] font-black text-white">T</div>
            <span className="text-white font-bold text-sm tracking-tight">TPMS OPS</span>
        </div>
      </div>

      {/* 2. MOBILE OVERLAY (BACKDROP) */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* 3. ASIDE ELEMENT */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen bg-[#0d0d0f] border-r border-neutral-800 flex flex-col transition-transform duration-300 ease-in-out
        w-72 sm:w-80
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 font-black">T</div>
            TPMS <span className="text-indigo-500 text-[10px] font-mono tracking-tighter border border-indigo-500/30 px-1 rounded uppercase">Ops</span>
          </h2>
          <button 
            onClick={() => setIsMobileOpen(false)} 
            className="lg:hidden p-2 text-zinc-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Area */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          <SidebarLink
            icon={<LayoutDashboard size={18} />}
            title="Dashboard"
            isActive={location.pathname === "/employee-dashboard"}
            onClick={() => navigate('/employee-dashboard')}
          />

          <CollapsibleMenu
            icon={<Truck size={18} />}
            title="Trucks"
            isOpen={openSubMenu === "Trucks"}
            onToggle={() => handleToggle("Trucks")}
            currentPath={location.pathname}
            items={[
              { title: "Add New", path: "/employee-dashboard/truck/add", icon: <Plus size={14} /> },
              { title: "View All", path: "/employee-dashboard/truck/all", icon: <List size={14} />, isDynamic: true },
              { title: "Manage", path: "/employee-dashboard/truck/edit", icon: <Settings size={14} />, isDynamic: true },
              { title: "Maintenance", path: "/employee-dashboard/truck/maintenance", icon: <Wrench size={14} />, isDynamic: true },
            ]}
          />

          <CollapsibleMenu
            icon={<Users size={18} />}
            title="Workforce"
            isOpen={openSubMenu === "Workforce"}
            onToggle={() => handleToggle("Workforce")}
            currentPath={location.pathname}
            items={[
              { title: "Register Driver", path: "/employee-dashboard/driver/add", icon: <UserPlus size={14} /> },
              { title: "Driver Directory", path: "/employee-dashboard/driver/all", icon: <Contact size={14} />, isDynamic: true },
              { title: "Personnel Files", path: "/employee-dashboard/driver/edit", icon: <FileUser size={14} />, isDynamic: true },
            ]}
          />

          <CollapsibleMenu
            icon={<Building2 size={18} />}
            title="Partners"
            isOpen={openSubMenu === "Partners"}
            onToggle={() => handleToggle("Partners")}
            currentPath={location.pathname}
            items={[
              { title: "Add Partner", path: "/employee-dashboard/partner/add", icon: <Plus size={14} /> },
              { title: "Directory", path: "/employee-dashboard/partner/all", icon: <List size={14} />, isDynamic: true },
            ]}
          />

          <CollapsibleMenu
            icon={<LucideTruckElectric size={18} />}
            title="Trips"
            isOpen={openSubMenu === "Trips"}
            onToggle={() => handleToggle("Trips")}
            currentPath={location.pathname}
            items={[
              { title: "Add Trip", path: "/employee-dashboard/trips/add", icon: <Plus size={14} /> },
              { title: "Live Board", path: "/employee-dashboard/trips/all", icon: <List size={14} />, isDynamic: true },
            ]}
          />

          <SidebarLink 
            icon={<Settings size={18} />} 
            title="Settings" 
            isActive={location.pathname.includes("/settings")} 
            onClick={() => navigate('/employee-dashboard/settings')} 
          />
        </nav>

        {/* Footer Area */}
        <div className="p-4 border-t border-neutral-800 bg-[#0d0d0f]">
          <button onClick={handleLogoutClick} className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-rose-400 hover:bg-rose-400/5 rounded-xl transition-all group">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-[11px] uppercase tracking-widest leading-none">Terminate Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};

// --- SUBSIDIARY COMPONENTS ---

function CollapsibleMenu({ icon, title, items, isOpen, onToggle, currentPath }: any) {
  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${
          isOpen ? 'text-zinc-200 bg-neutral-800/40 shadow-sm' : 'text-zinc-500 hover:text-zinc-200 hover:bg-neutral-800/40'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className={isOpen ? "text-indigo-400" : ""}>{icon}</span>
          <span className="text-sm font-medium">{title}</span>
        </div>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="overflow-hidden ml-9 border-l border-neutral-800 mt-1"
          >
            {items.map((item: any, idx: number) => {
              const isActive = currentPath === item.path || (item.isDynamic && currentPath.includes(item.path));
              return (
                <Link key={idx} to={item.path} className={`flex items-center gap-3 px-4 py-2 text-[12px] transition-all relative ${isActive ? 'text-indigo-400 font-bold' : 'text-zinc-500 hover:text-indigo-400'}`}>
                  {isActive && <motion.div layoutId="activeSub" className="absolute left-0 w-1 h-4 bg-indigo-500 rounded-r-full -ml-[1px]" />}
                  {item.icon} {item.title}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarLink({ icon, title, isActive, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all relative group ${isActive ? 'bg-neutral-800/80 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-200 hover:bg-neutral-800/40'} cursor-pointer`}>
      {isActive && <div className="absolute left-0 w-1 h-5 bg-indigo-500 rounded-r-full" />}
      <span className={isActive ? "text-indigo-400" : ""}>{icon}</span>
      <span className="text-sm font-medium">{title}</span>
    </button>
  );
}

export default SideBar;