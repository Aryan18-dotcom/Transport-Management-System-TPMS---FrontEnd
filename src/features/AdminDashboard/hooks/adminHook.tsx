import { useContext } from "react";
import { toast } from "react-hot-toast";
import { AdminContext } from "../adminContext";
import { adminServices } from "../services/adminApi";

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");

  const { employees, setEmployees, metrics, setMetrics, adminLoading, setAdminLoading } = context;

  // Handler: Fetch All Employees
  const refreshEmployees = async () => {
    setAdminLoading(true);
    const data = await adminServices.getEmployees();
    
    if (data.employees.length > 0) setEmployees(data.employees);
    setAdminLoading(false);
  };

  // Handler: Create Employee
  const handleCreateEmployee = async (formData: any) => {
    setAdminLoading(true);
    const data = await adminServices.createEmployee(formData);
    setAdminLoading(false);
    return data;
  };

  // Handler: Toggle Status
  const toggleEmployeeStatus = async (id: string, currentStatus: boolean) => {
    console.log(id, !currentStatus);
    
    const data = await adminServices.updateEmployeeStatus(id, !currentStatus);
    if (data.ok) {
      setEmployees(prev => prev.map(emp => emp._id === id ? { ...emp, isActive: !currentStatus } : emp));
      toast.success("Status updated");
    } else {
      console.log(data);
      
    }
  };

  // Handler: Fetch Metrics
  const fetchMetrics = async () => {
    const data = await adminServices.getMetrics();
    if (data.success) setMetrics(data);
  };
  // Inside useAdmin.ts

  // Handler: Delete Employee
  const handleDeleteEmployee = async (employeeId: string) => {
    setAdminLoading(true);
    try {
      const data = await adminServices.deleteEmployee(employeeId);

      if (data.success) {
        // Update local state to remove the deleted employee
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

  // Make sure to return it at the end of the hook
  return {
    employees,
    metrics,
    adminLoading,
    refreshEmployees,
    handleCreateEmployee,
    toggleEmployeeStatus,
    fetchMetrics,
    handleDeleteEmployee, // Add this here
  };
};