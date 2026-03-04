import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, Link, useNavigate } from "react-router-dom"; // Added useLocation and Link
import { 
  LayoutDashboard, Users, Truck, Building2, 
  FileText, Settings, Plus, List, Wrench, LogOut, Wallet, CheckCircle2, Receipt,
  ChevronDown
} from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth.jsx";
import toast from "react-hot-toast";

const SideBar = ({ activeMenu, setActiveMenu }: { activeMenu: string | null; setActiveMenu: (menu: string) => void }) => {
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
    const { handleLogout } = useAuth();
    const location = useLocation(); // 🔥 Get current URL path
    const navigate = useNavigate();

    // 🔥 Effect to auto-open the correct dropdown based on URL
    useEffect(() => {
        const path = location.pathname;
        if (path.includes("/employees")) setOpenSubMenu("Employees");
        else if (path.includes("/truck")) setOpenSubMenu("Trucks");
        else if (path.includes("/partner")) setOpenSubMenu("Partners");
        else if (path.includes("/bill")) setOpenSubMenu("Bills");
        
        // Also update the top-level active state if it's the dashboard
        if (path === "/admin-dashboard") setActiveMenu("Dashboard");
        else setActiveMenu("");
    }, [location.pathname, setActiveMenu]);

    const handleToggle = (title: string) => {
        setOpenSubMenu(prev => prev === title ? null : title);
    };

    const handleLogoutClick = async () => {
        const result = await handleLogout();
        if (!result.success) {
            toast.error(result.message || "Logout failed");
        } else {
            toast.success(result.message || "Logged out successfully");
        }
    };

    return (
        <aside className="w-72 bg-neutral-900 border-r border-neutral-800 flex flex-col h-screen sticky top-0 z-40">
            <div className="p-6 border-b border-neutral-800">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">T</div>
                    TPMS <span className="text-indigo-500 text-sm font-mono tracking-tighter">V1.0</span>
                </h2>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
                <SidebarLink
                    icon={<LayoutDashboard size={18} />}
                    title="Dashboard"
                    isActive={activeMenu === "Dashboard" || location.pathname === "/admin-dashboard"}
                    onClick={() => {
                        setActiveMenu("Dashboard");
                        setOpenSubMenu(null);
                        navigate('/admin-dashboard')
                    }}
                />

                <CollapsibleMenu 
                    icon={<Users size={18} />} 
                    title="Employees" 
                    isOpen={openSubMenu === "Employees"}
                    onToggle={() => handleToggle("Employees")}
                    currentPath={location.pathname} // 🔥 Pass path for highlighting
                    items={[
                        { title: "Create", path: "/admin-dashboard/employees/add", icon: <Plus size={14} /> },
                        { title: "Manage", path: "/admin-dashboard/employees/edit", icon: <Settings size={14} />, isDynamic: true },
                        { title: "View All", path: "/admin-dashboard/employees/all", icon: <List size={14} /> },
                    ]} 
                />

                <CollapsibleMenu 
                    icon={<Truck size={18} />} 
                    title="Trucks" 
                    isOpen={openSubMenu === "Trucks"}
                    onToggle={() => handleToggle("Trucks")}
                    currentPath={location.pathname}
                    items={[
                        { title: "Add New", path: "/truck/add", icon: <Plus size={14} /> },
                        { title: "View All", path: "/truck/all", icon: <List size={14} /> },
                        { title: "Manage", path: "/truck/edit", icon: <Settings size={14} /> },
                        { title: "Maintenance", path: "/truck/service", icon: <Wrench size={14} /> },
                    ]} 
                />

                <CollapsibleMenu 
                    icon={<Building2 size={18} />} 
                    title="Partners" 
                    isOpen={openSubMenu === "Partners"}
                    onToggle={() => handleToggle("Partners")}
                    currentPath={location.pathname}
                    items={[
                        { title: "Add", path: "/partner/add", icon: <Plus size={14} /> },
                        { title: "View", path: "/partner/all", icon: <List size={14} /> },
                        { title: "Manage", path: "/partner/edit", icon: <Settings size={14} /> },
                    ]} 
                />

                <CollapsibleMenu 
                    icon={<Receipt size={18} />} 
                    title="Bills & Invoices" 
                    isOpen={openSubMenu === "Bills"}
                    onToggle={() => handleToggle("Bills")}
                    currentPath={location.pathname}
                    items={[
                        { title: "Generate Invoice", path: "/bill/new", icon: <Plus size={14} /> },
                        { title: "Due Payments", path: "/bill/due", icon: <Wallet size={14} /> },
                        { title: "Success Payments", path: "/bill/paid", icon: <CheckCircle2 size={14} /> },
                        { title: "All Details", path: "/bill/all", icon: <FileText size={14} /> },
                    ]} 
                />

                <SidebarLink icon={<Settings size={18} />} title="Settings" isActive={location.pathname === "/settings"} onClick={() => { setOpenSubMenu(null) }} />
            </nav>

            <div className="p-4 border-t border-neutral-800">
                <button onClick={handleLogoutClick} className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all group">
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium text-sm">Logout System</span>
                </button>
            </div>
        </aside>
    )
}

function CollapsibleMenu({ icon, title, items, isOpen, onToggle, currentPath }: any) {
  return (
    <div>
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
              // 🔥 Logic to check if this sub-item is active
              // We check if current URL starts with the item path (to handle /edit/:id)
              const isActive = item.isDynamic 
                ? currentPath.includes(item.path) 
                : currentPath === item.path;

              return (
                <Link 
                  key={idx} 
                  to={item.path} 
                  className={`flex items-center gap-3 px-4 py-2 text-[13px] transition-all relative ${
                    isActive 
                    ? 'text-indigo-400 font-semibold' 
                    : 'text-zinc-500 hover:text-indigo-400'
                  }`}
                >
                  {/* 🔥 Small indicator dot for the active sub-link */}
                  {isActive && (
                    <motion.div 
                        layoutId="activeSub"
                        className="absolute left-0 w-1 h-4 bg-indigo-500 rounded-r-full -ml-[1px]" 
                    />
                  )}
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
        {isActive && <motion.div layoutId="nav-glow" className="absolute inset-0 bg-indigo-500/5 rounded-xl border border-indigo-500/20" />}
        {isActive && <div className="absolute left-0 w-1 h-5 bg-indigo-500 rounded-r-full" />}
        <span className={isActive ? "text-indigo-400" : ""}>{icon}</span>
        <span className="text-sm font-medium">{title}</span>
      </button>
    );
}

export default SideBar;