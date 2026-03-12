import toast from 'react-hot-toast';
import { useEmployeeContext } from '../employeeContext';
import { employeeApi } from '../services/employeeApi';

export const useEmployee = () => {
    const { metrics, setMetrics, opsLoading, setOpsLoading } = useEmployeeContext();

    // --- 1. Operational Sync ---
    const fetchOpsMetrics = async () => {
        setOpsLoading(true);
        try {
            const res = await employeeApi.getDashboardMetrics();
            if (!res.ok) {
                if (res.status === 401) toast.error("Session Expired", { id: "auth-denied" });
                throw new Error("Sync failed");
            }
            const data = await res.json();
            if (data.success) setMetrics(data.metrics);
        } catch (err: any) {
            console.error("Ops Metrics Error:", err.message);
        } finally {
            setOpsLoading(false);
        }
    };

    // --- 2. Security & Settings Actions ---

    /**
     * Handles password updates.
     * If the server returns 202, it means an OTP was sent to the Admin.
     */
    const handlePasswordUpdate = async (currentPass: string, newPass: string, otp?: string) => {
        try {
            const res = await employeeApi.changePassword(currentPass, newPass, otp);
            const data = await res.json();

            // Handle OTP Requirement (Initial Change)
            if (res.status === 202 && data.otpRequired) {
                toast.success(data.message, { id: "otp-sent" });
                return { status: "OTP_REQUIRED" };
            }

            if (data.success) {
                toast.success("Security Credentials Updated", { id: "pass-success" });
                return { status: "SUCCESS" };
            } else {
                toast.error(data.message || "Update Failed", { id: "pass-error" });
                return { status: "ERROR" };
            }
        } catch (err) {
            toast.error("Connection Error", { id: "conn-error" });
            return { status: "ERROR" };
        }
    };

    /**
     * Updates full profile synchronization (Name, Username, Phone, Email).
     */
    const handleUpdateProfile = async (firstName: string, lastName: string, username: string, phoneNo: string, email: string) => {
        try {
            const res = await employeeApi.updateProfile({ firstName, lastName, username, phoneNo, email });
            const data = await res.json();
            
            if (data.success) {
                toast.success("Profile Synchronized", { id: "profile-success" });
                // Optionally update local metrics state with new user info
                if (data.user) {
                    setMetrics((prev: any) => ({ ...prev, user: data.user }));
                }
                return true;
            } else {
                toast.error(data.message || "Update Failed", { id: "profile-fail" });
                console.log(data.error);
                
                return false;
            }
        } catch (err: any) {
            toast.error("Network failure", { id: "profile-net-error" });
            console.log(err.message);
            return false;
        }
    };

    return {
        metrics,
        opsLoading,
        fetchOpsMetrics,
        handlePasswordUpdate,
        handleUpdateProfile
    };
};