import { useContext } from "react";
import { toast } from "react-hot-toast";
import { AdminContext } from "../adminContext";
import { adminServices } from "../services/adminApi";

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");

  const { employees, setEmployees, metrics, setMetrics, adminLoading, setAdminLoading } = context;

  // --- EXISTING HANDLERS ---
  const refreshEmployees = async () => {
    setAdminLoading(true);
    const data = await adminServices.getEmployees();
    if (data.employees.length > 0) setEmployees(data.employees);
    setAdminLoading(false);
  };

  const handleCreateEmployee = async (formData: any) => {
    setAdminLoading(true);
    const data = await adminServices.createEmployee(formData);
    setAdminLoading(false);
    return data;
  };

  const toggleEmployeeStatus = async (id: string, currentStatus: boolean) => {
    const data = await adminServices.updateEmployeeStatus(id, !currentStatus);
    if (data.ok) {
      setEmployees(prev => prev.map(emp => emp._id === id ? { ...emp, isActive: !currentStatus } : emp));
      toast.success("Status updated", { id: "status-toast" });
    }
  };

  const fetchMetrics = async () => {
    const data = await adminServices.getMetrics();
    if (data.success) setMetrics(data);
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    setAdminLoading(true);
    try {
      const data = await adminServices.deleteEmployee(employeeId);
      if (data.success) {
        setEmployees((prev) => prev.filter((emp) => emp._id !== employeeId));
        toast.success(data.message || "Employee removed successfully");
        return { success: true };
      } else {
        toast.error(data.message || "Failed to delete employee");
        return { success: false };
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during deletion");
      return { success: false };
    } finally {
      setAdminLoading(false);
    }
  };

  // --- NEW SETTINGS HANDLERS ---

  /**
   * Handler: Update Global Company Data (GST, Bank Dets, Entity Name)
   */
  const handleUpdateCompany = async (formData: any) => {
    setAdminLoading(true);
    try {
      const data = await adminServices.updateCompanyData(formData);
      
      if (data.success) {
        // Sync local context with new company branding/details
        setMetrics((prev: any) => ({ ...prev, company: data.data }));
        toast.success("Global Company Protocol Updated", { id: "company-sync" });
        return { success: true };
      } else {
        toast.error(data.message || "Company update failed");
        return { success: false };
      }
    } catch (error: any) {
      toast.error("Network Error: Failed to sync company data");
      console.log(error);
      
      return { success: false };
    } finally {
      setAdminLoading(false);
    }
  };

  /**
   * Handler: Update Admin Personnel Details
   */
  const handleUpdateAdminProfile = async (formData: any) => {
    setAdminLoading(true);
    try {
      const data = await adminServices.updateProfileDetails(formData);
      if (data.success) {
        // Update user context so Sidebar/Header name updates
        setMetrics((prev: any) => ({ ...prev, user: data.user }));
        toast.success("Admin Profile Synchronized", { id: "admin-profile-sync" });
        return { success: true };
      } else {
        toast.error(data.message || "Profile update failed");
        return { success: false };
      }
    } catch (error: any) {
      toast.error("An error occurred during profile synchronization");
      return { success: false };
    } finally {
      setAdminLoading(false);
    }
  };

  const handleAdminPasswordChange = async (currentPassword: string, newPassword: string) => {
    setAdminLoading(true);
    try {
        const data = await adminServices.changeAdminPassword({ currentPassword, newPassword });
        if (data.success) {
            toast.success("Master Password Updated", { id: "admin-pass-sync" });
            return true;
        } else {
            toast.error(data.message || "Failed to update password");
            return false;
        }
    } catch (err) {
        toast.error("Security sync failed");
        return false;
    } finally {
        setAdminLoading(false);
    }
};

  return {
    employees,
    metrics,
    adminLoading,
    refreshEmployees,
    handleCreateEmployee,
    toggleEmployeeStatus,
    fetchMetrics,
    handleDeleteEmployee,
    handleUpdateCompany,       // 🔥 New
    handleUpdateAdminProfile,  
    handleAdminPasswordChange// 🔥 New
  };
};