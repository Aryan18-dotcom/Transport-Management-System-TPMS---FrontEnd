import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Truck, Building2, Settings, Plus, 
  List, Wrench, LogOut, UserPlus, Contact, FileUser, Key, LucideTruckElectric, ChevronDown
} from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth.jsx";
import toast from "react-hot-toast";

const SideBar = ({ activeMenu, setActiveMenu }: { activeMenu: string | null; setActiveMenu: (menu: string) => void }) => {
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const { handleLogout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/employees")) setOpenSubMenu("Employees");
    else if (path.includes("/truck")) setOpenSubMenu("Trucks");
    else if (path.includes("/partner")) setOpenSubMenu("Partners");
    else if (path.includes("/driver")) setOpenSubMenu("Workforce");
    else if (path.includes("/trips")) setOpenSubMenu("Trips");

    if (path === "/employee-dashboard") setActiveMenu("Dashboard");
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
    <aside className="w-72 bg-[#0d0d0f] border-r border-neutral-800 flex flex-col h-screen sticky top-0 z-40">
      <div className="p-6 border-b border-neutral-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 font-black">T</div>
          TPMS <span className="text-indigo-500 text-[10px] font-mono tracking-tighter border border-indigo-500/30 px-1.5 rounded">OPS</span>
        </h2>
      </div>

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
            { title: "Manage Maintenance", path: "/employee-dashboard/truck/maintenance/manage", icon: <Wrench size={14} />, isDynamic: true },
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
            { title: "Fleet Assignments", path: "/employee-dashboard/driver/assignments", icon: <Key size={14} />, isDynamic: true },
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
            { title: "Manage", path: "/employee-dashboard/partner/manage", icon: <Settings size={14} />, isDynamic: true },
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
            { title: "Control Room", path: "/employee-dashboard/trips/manage", icon: <Settings size={14} />, isDynamic: true },
          ]}
        />

        <SidebarLink icon={<Settings size={18} />} title="System Settings" isActive={location.pathname === "/settings"} onClick={() => navigate('/employee-dashboard/settings')} />
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <button onClick={handleLogoutClick} className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-rose-400 hover:bg-rose-400/5 rounded-xl transition-all group">
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-[11px] uppercase tracking-widest">Terminate Session</span>
        </button>
      </div>
    </aside>
  );
};

// Sub-components (CollapsibleMenu & SidebarLink) remain logic-heavy to handle dynamic IDs
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
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden ml-9 border-l border-neutral-800 mt-1">
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