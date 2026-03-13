import { useContext } from "react";
import { TrucksContext } from "../trucksContext";
import { truckServices } from "../services/truckApi";
import type { Truck } from "../../../types/fleet";

export const useTrucks = () => {
    const context = useContext(TrucksContext);

    if (!context) {
        throw new Error("useTrucks must be used within a TrucksProvider");
    }

    const { trucks, setTrucks, truckLoading, setTruckLoading, setDriverLoading, driverLoading } = context;

    // Handler: Fetch All Trucks
    const refreshTrucks = async () => {
        setTruckLoading(true);
        try {
            // getTrucks returns Truck[]
            const trucksArr = await truckServices.getTrucks();
            const vehicleList = Array.isArray(trucksArr) ? trucksArr : [];
            setTrucks(vehicleList);
        } catch (error: any) {
            console.error("Fetch Error:", error);
            setTrucks([]);
        } finally {
            setTruckLoading(false);
        }
    };

    // Handler: Add Truck
    const handleAddTruck = async (formData: FormData) => {
        setTruckLoading(true);
        try {
            const data = await truckServices.createTruck(formData);
            if (data.success && data.truck) {
                setTrucks((prev) => [...prev, data.truck as Truck]);
                return { success: true, message: data.message };
            }
            return { success: false, message: data.message || "Failed to add truck" };
        } catch (error: any) {
            return { success: false, message: error.message || "Network Error" };
        } finally {
            setTruckLoading(false);
        }
    };

    // Handle: Get Truck By its ID
    const handleGetTruckById = async (truckId: string) => {
        setTruckLoading(true);
        try {
            const data = await truckServices.getTruckById(truckId);
            // Check if data exists (service returns the object directly)
            if (data) {
                return { success: true, data: data };
            }
            return { success: false, message: "Failed to Get truck details." };
        } catch (error: any) {
            return { success: false, message: error.message || "Network Error" };
        } finally {
            setTruckLoading(false);
        }
    };

    // Handle: Update Truck Details
    const handleUpdateTruck = async (truckId: string, formData: any) => {
        setTruckLoading(true);
        try {
            const data = await truckServices.updateTruck(truckId, formData);

            if (data.success) {
                setTrucks((prev) =>
                    prev.map((t) => (t._id === truckId ? { ...t, ...(data.truck || {}) } : t))
                );
                return { success: true, message: data.message || "Truck updated successfully" };
            }
            return { success: false, message: data.message || "Failed to update truck details" };
        } catch (error: any) {
            return { success: false, message: error.message || "Network Error" };
        } finally {
            setTruckLoading(false);
        }
    };

    const GetDriverAndTruckDetails = async (id: string) => {
        setTruckLoading(true);
        setDriverLoading(true);
        try {
            const data = await truckServices.driverandTruckDetails(id);

            if (data) {
                return {
                    success: true,
                    truckDetails: data.truckDetails,
                    driverDetails: data.driverDetails
                };
            }

            return {
                success: false,
                message: "Failed to fetch handover details"
            };
        } catch (error: any) {
            console.error("Fetch Unified Details Error:", error);
            return {
                success: false,
                message: error.message || "Connection Error"
            };
        } finally {
            setTruckLoading(false);
            setDriverLoading(false);
        }
    };

    const handleAssignDriver = async (driverId: string, truckId: string) => {
        setTruckLoading(true);
        try {
            const data = await truckServices.assignDriver(driverId, truckId);
            // Refresh local list to show new assignment
            await refreshTrucks();
            return { success: true, message: data.message, driver: data.driver };
        } catch (error: any) {
            return { success: false, message: error.message || "Network Error" };
        } finally {
            setTruckLoading(false);
        }
    };

    return {
        trucks,
        truckLoading,
        refreshTrucks,
        handleAddTruck,
        handleGetTruckById,
        handleUpdateTruck,
        GetDriverAndTruckDetails,
        driverLoading,
        handleAssignDriver
    };
};