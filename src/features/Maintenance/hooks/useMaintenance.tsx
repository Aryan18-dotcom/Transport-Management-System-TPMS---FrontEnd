import { useContext } from "react";
import { maintenanceService } from "../services/maintenanceApi";
import { MaintenanceContext } from "../maintenanceContext";
import toast from "react-hot-toast";

export const useMaintenance = () => {
    const context = useContext(MaintenanceContext);

    if (!context) throw new Error("useMaintenance must be used within a MaintenanceProvider");

    const {
        records, setRecords,
        setFinancialStats, setTopExpenses,
        maintLoading, setMaintLoading
    } = context;

    // 🔥 Handler: Create New Record
    const handleAddMaintenance = async (data: any) => {
        setMaintLoading(true);
        try {
            const res = await maintenanceService.createMaintenance(data);
            const result = await res.json();
            if (res.ok) {
                setRecords((prev) => [result.maintenance, ...prev]);
                return { success: true, message: "Registry Updated" };
            }
            return { success: false, message: result.message };
        } catch (err: any) {
            return { success: false, message: "Network Error" };
        } finally {
            setMaintLoading(false);
        }
    };

    // 🔥 Handler: Fetch History for specific truck (e.g. GJ-01-BD-5005)
    const fetchVehicleHistory = async (vehicleId: string) => {
        setMaintLoading(true);
        try {
            const res = await maintenanceService.getVehicleMaintenanceHistory(vehicleId);
            const result = await res.json();
            if (res.ok) {
                setRecords(result.history);
                return { success: true, data: result.history };
            }
            return { success: false, message: result.message };
        } finally {
            setMaintLoading(false);
        }
    };

    // 🔥 Handler: Quick Status Transition (Workshop -> Fleet)
    const handleStatusTransition = async (recordId: string, status: string) => {
        setMaintLoading(true);
        try {
            const res = await maintenanceService.updateMaintenanceStatus(recordId, status);
            if (res.ok) {
                setRecords((prev) => prev.map(r => r._id === recordId ? { ...r, status } : r));
                return { success: true };
            }
            return { success: false };
        } finally {
            setMaintLoading(false);
        }
    };

    // 🔥 Handler: Intelligence / Analytics & Records Sync
    const refreshAnalytics = async () => {
        setMaintLoading(true);
        try {
            // 1. Concurrent fetching of all critical data points
            const [finRes, topRes, recordRes] = await Promise.all([
                maintenanceService.getMaintenanceFinancialSummary(),
                maintenanceService.getTopExpenseVehicles(),
                maintenanceService.getAllMaintenance() // 🔥 Added to fetch the main table data
            ]);

            // 2. Parse all responses
            const finData = await finRes.json();
            const topData = await topRes.json();
            const recordData = await recordRes.json();

            // 3. Update State for the entire Dashboard
            if (finRes.ok) setFinancialStats(finData.stats);
            if (topRes.ok) setTopExpenses(topData.stats);
            if (recordRes.ok) setRecords(recordData.data); // 🔥 Sync the main registry table

        } catch (error) {
            console.error("Analytics Sync Error:", error);
        } finally {
            setMaintLoading(false);
        }
    };

    const handleDeleteRecord = async (id: string) => {
        try {
            const res = await maintenanceService.deleteMaintenance(id);
            if (res.ok) {
                setRecords(prev => prev.filter(r => r._id !== id));
                return { success: true };
            }
            return { success: false };
        } catch (err) { return { success: false }; }
    };

    const getMaintenanceById = async (recordId: string) => {
        try {
            const res = await maintenanceService.getMaintenanceById(recordId);
            const data = await res.json()
            return data
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    const handleUpdateMaintenance = async (recordId: string, data: any) => {
        try {
            const res = await maintenanceService.updateMaintenance(recordId, data)
            console.log("RESPONSE OF UPDATEMAINTENANCE BY HOOK", res);
            const responseData = await res.json()

            return responseData
        } catch (err: any) {
            return { success: false, message: err.message };
        }
    }

    // Inside your useMaintenance.ts
    const handleQuickPaymentUpdate = async (recordId: string, status: string) => {
        setMaintLoading(true);
        try {
            // We use the patch endpoint for efficiency
            const res = await maintenanceService.updateMaintenanceStatus(recordId, status);
            if (res.ok) {
                setRecords(prev => prev.map(r => r._id === recordId ? { ...r, paymentStatus: status } : r));
                toast.success(`Marked as ${status}`);
                return true;
            }
        } finally {
            setMaintLoading(false);
        }
    };

    return {
        records,
        maintLoading,
        handleAddMaintenance,
        fetchVehicleHistory,
        handleStatusTransition,
        refreshAnalytics,
        handleDeleteRecord,
        getMaintenanceById,
        handleUpdateMaintenance,
        handleQuickPaymentUpdate
    };
};