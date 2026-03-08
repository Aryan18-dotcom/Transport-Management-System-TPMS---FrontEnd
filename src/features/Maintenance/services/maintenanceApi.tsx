const BASE_URL = "http://localhost:5000/api/assets";

export const maintenanceService = {

    // 🔥 CREATE: Initialize a maintenance event
    createMaintenance: async (maintenanceData: any) => {
        return await fetch(`${BASE_URL}/maintenance/add`, {
            method: "POST",
            body: maintenanceData,
            credentials: "include",
        });
    },

    // 🔥 GET ALL: Fetch every maintenance record in the company
    getAllMaintenance: async (filters: { vehicleId?: string; category?: string } = {}) => {
        const query = new URLSearchParams(filters as any).toString();
        return await fetch(`${BASE_URL}/maintenance/all?${query}`, {
            method: "GET",
            credentials: "include",
        });
    },

    // 🔥 GET VEHICLE HISTORY: Full lifecycle of a specific truck
    getVehicleMaintenanceHistory: async (vehicleId: string) => {
        return await fetch(`${BASE_URL}/maintenance/vehicle/${vehicleId}`, {
            method: "GET",
            credentials: "include",
        });
    },

    // 🔥 GET BY ID: Details for a specific bill/record
    getMaintenanceById: async (recordId: string) => {
        return await fetch(`${BASE_URL}/maintenance/record/${recordId}`, {
            method: "GET",
            credentials: "include",
        });
    },

    // 🔥 UPDATE: Full modification of technical details/billing
    updateMaintenance: async (recordId: string, updateData: any) => {
        return await fetch(`${BASE_URL}/maintenance/update/${recordId}`, {
            method: "PUT",
            body: updateData,
            credentials: "include",
        });
    },

    // 🔥 PATCH: Fast status transition (e.g., mark as COMPLETED)
    updateMaintenanceStatus: async (recordId: string, status: string) => {
        const res = await fetch(`${BASE_URL}/maintenance/update-status/${recordId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentStatus: status }),
            credentials: "include",
        });
        const data = await res.json()
        console.log(data)
        return res
    },

    // 🔥 ANALYTICS: Financial summary by category
    getMaintenanceFinancialSummary: async () => {
        return await fetch(`${BASE_URL}/maintenance/analytics/financial-summary`, {
            method: "GET",
            credentials: "include",
        });
    },

    // 🔥 ANALYTICS: "Money Pit" vehicle detection
    getTopExpenseVehicles: async () => {
        return await fetch(`${BASE_URL}/maintenance/analytics/top-expenses`, {
            method: "GET",
            credentials: "include",
        });
    },

    // 🔥 DELETE: Purge record from registry
    deleteMaintenance: async (recordId: string) => {
        return await fetch(`${BASE_URL}/maintenance/delete/${recordId}`, {
            method: "DELETE",
            credentials: "include",
        });
    }
};