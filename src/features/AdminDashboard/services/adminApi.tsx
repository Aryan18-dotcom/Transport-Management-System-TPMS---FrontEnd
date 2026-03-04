const BASE_URL = "http://localhost:5000/api/admin";

export const adminServices = {
  // 🔥 CREATE EMPLOYEE
  createEmployee: async (formData: any) => {
    const res = await fetch(`${BASE_URL}/create-employee`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    });
    return res;
  },

  // 🔥 GET ALL EMPLOYEES
  getEmployees: async () => {
    const res = await fetch(`${BASE_URL}/employees`, {
      method: "GET",
      credentials: "include",
    });
    return await res.json();
  },

  // 🔥 UPDATE EMPLOYEE STATUS (Active/Inactive)
  updateEmployeeStatus: async (employeeId: string, setIsActive: boolean) => {
    const res = await fetch(`${BASE_URL}/employees/${employeeId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ setIsActive }),
      credentials: "include",
    });
    
    return await res;
  },

  // 🔥 DELETE EMPLOYEE
  deleteEmployee: async (employeeId: string) => {
    const res = await fetch(`${BASE_URL}/employees/${employeeId}`, {
      method: "DELETE",
      credentials: "include",
    });
    return await res.json();
  },

  // 🔥 GET COMPANY DETAILS
  getCompanyDetails: async (companyId: string) => {
    const res = await fetch(`${BASE_URL}/company/${companyId}`, {
      method: "GET",
      credentials: "include",
    });
    return await res.json();
  },

  // 🔥 UPDATE COMPANY DETAILS
  updateCompany: async (companyId: string, details: any) => {
    const res = await fetch(`${BASE_URL}/company/${companyId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
      credentials: "include",
    });
    return await res.json();
  },

  // 🔥 DASHBOARD METRICS
  getMetrics: async () => {
    const res = await fetch(`${BASE_URL}/dashboard-metrics`, {
      method: "GET",
      credentials: "include",
    });
    return await res.json();
  }
};