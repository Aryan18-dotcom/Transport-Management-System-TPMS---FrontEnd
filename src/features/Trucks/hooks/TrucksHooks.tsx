import { useContext } from "react";
import { TrucksContext } from "../trucksContext";
import { truckServices } from "../services/truckApi";

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
            const response = await truckServices.getTrucks();
            const data = await response.json()

            if (response.ok) {
                setTrucks(data.vehicles);
            }
        } catch (error: any) {
            console.error("Fetch Error:", error);
        } finally {
            setTruckLoading(false);
        }
    };

    // Handler: Add Truck
    const handleAddTruck = async (formData: any) => {
        setTruckLoading(true);
        try {
            const response = await truckServices.createTruck(formData);
            const data = await response.json()
            if (response.ok) {
                setTrucks((prev) => [...prev, data.truck]);
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
        setTruckLoading(true)
        try {
            const response = await truckServices.getTruckById(truckId);
            const data = await response.json();
            if (response.ok) {
                return { success: true, data: data }
            }
            return { success: false, message: data.message || "Failed to Get truck details." };
        } catch (error: any) {
            return { success: false, message: error.message || "Network Error" };
        } finally {
            setTruckLoading(false);
        }
    }

    // Handle: Update Truck Details
    const handleUpdateTruck = async (truckId: string, formData: any) => {
        setTruckLoading(true);
        try {
            const response = await truckServices.updateTruck(truckId, formData);
            const data = await response.json();

            if (response.ok) {
                // Update local state so the UI reflects changes immediately
                setTrucks((prev) =>
                    prev.map((t) => (t._id === truckId ? { ...t, ...data.vehicle } : t))
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
        setDriverLoading(true) // Using truckLoading as this is within useTrucks
        try {
            const res = await truckServices.driverandTruckDetails(id);
            const data = await res.json();

            if (res.ok) {
                // Return the specific details directly to the component
                // This allows the TruckDetails or ManageAssignment page to use the data locally
                return {
                    success: true,
                    truckDetails: data.truckDetails,
                    driverDetails: data.driverDetails
                };
            }

            return {
                success: false,
                message: data.message || "Failed to fetch handover details"
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
            const response = await truckServices.assignDriver(driverId, truckId);
            const data = await response.json();
            if (response.ok) {
                // Refresh local trucks list to show new assignment
                await refreshTrucks();
                return { success: true, message: data.message, driver: data.driver };
            }
            return { success: false, message: data.message || "Failed to assign" };
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