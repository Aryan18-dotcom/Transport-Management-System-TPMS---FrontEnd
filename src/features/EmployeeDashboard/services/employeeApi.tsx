const BASE_URL = `${import.meta.env.VITE_BASE_URL}/employee`;

export const employeeApi = {
    // 1. Fetch Today's Operational Metrics
    getDashboardMetrics: async () => {
        return await fetch(`${BASE_URL}/dashboard-metrics`, {
            method: "GET",
            credentials: "include"
        });
    },

    // 2. Comprehensive Password Change Logic
    // Handles both Initial (Admin OTP required) and Standard updates
    changePassword: async (currentPassword: string, newPassword: string, otpInput?: string) => {
        return await fetch(`${BASE_URL}/change-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentPassword, newPassword, otpInput }),
            credentials: "include"
        });
    },

    // 3. Update Full Profile details
    updateProfile: async (profileData: { 
        firstName: string; 
        lastName: string; 
        username: string; 
        phoneNo: string; 
        email: string 
    }) => {
        return await fetch(`${BASE_URL}/update-profile`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profileData),
            credentials: "include"
        });
    }
};