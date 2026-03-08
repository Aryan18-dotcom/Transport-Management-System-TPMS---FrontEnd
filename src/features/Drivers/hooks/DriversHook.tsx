import { useContext } from "react";
import { DriversContext } from "../driverContext";
import { driverServices } from "../services/driverApi";

export const useDrivers = () => {
    const context = useContext(DriversContext);
    if (!context) throw new Error("useDrivers must be used within a DriversProvider");

    const { drivers, setDrivers, driverLoading, setDriverLoading } = context;

    // Refresh the local driver list
    const refreshDrivers = async () => {
        setDriverLoading(true);
        try {
            const res = await driverServices.getDrivers();
            const data = await res.json();
            if (res.ok) setDrivers(data.drivers);
        } catch (error) {
            console.error("Fetch Drivers Error:", error);
        } finally {
            setDriverLoading(false);
        }
    };

    // Handle Registration (Multiparts)
    const handleAddDriver = async (formData: FormData) => {
        setDriverLoading(true);
        try {
            const res = await driverServices.addDriver(formData);
            const data = await res.json();

            if (res.ok) {
                setDrivers((prev) => [...prev, data.driver]);
                return { success: true, message: data.message };
            }
            return { success: false, message: data.message };
        } catch (err: any) {
            console.log(err)
            return { success: false, message: err.message };
        } finally {
            setDriverLoading(false);
        }
    };

    // Handle Update (Multiparts)
    const handleUpdateDriver = async (driverId: string, formData: FormData) => {
        setDriverLoading(true);
        try {
            const res = await driverServices.updateDriver(driverId, formData);
            const data = await res.json();
            if (res.ok) {
                setDrivers((prev) => prev.map(d => d._id === driverId ? data.driver : d));
                return { success: true, message: data.message };
            }
            return { success: false, message: data.message };
        } catch (err: any) {
            return { success: false, message: "Network Error" };
        } finally {
            setDriverLoading(false);
        }
    };

    const handleGetDriverById = async (driverId: string) => {
        setDriverLoading(true);
        try {
            const res = await driverServices.getDriverById(driverId);
            const data = await res.json();
            return res.ok ? { success: true, data } : { success: false, message: data.message };
        } catch (error) {
            return { success: false, message: "Network Error" };
        } finally {
            setDriverLoading(false);
        }
    };

    const handleDeleteDriver = async (driverId: string) => {
        setDriverLoading(true);
        try {
            const res = await driverServices.deleteDriver(driverId);
            if (res.ok) {
                setDrivers((prev) => prev.filter(d => d._id !== driverId));
                return { success: true };
            }
            return { success: false };
        } catch (error) {
            return { success: false };
        } finally {
            setDriverLoading(false);
        }
    };

    const handleAssignTruck = async (driverId: string, truckId: string) => {
        setDriverLoading(true);
        try {
            const res = await driverServices.assignTruck(driverId, truckId);
            const data = await res.json();

            if (res.ok) {
                // Update the local drivers list with the new assignment data
                setDrivers((prev) =>
                    prev.map(d => d._id === driverId ? data.driver : d)
                );
                return { success: true, message: data.message };
            }
            return { success: false, message: data.message };
        } catch (error) {
            return { success: false, message: "Connection Error" };
        } finally {
            setDriverLoading(false);
        }
    };

    const handleRevokeTruck = async (driverId: string) => {
        setDriverLoading(true);
        try {
            const res = await driverServices.revokeTruck(driverId);
            const data = await res.json();

            if (res.ok) {
                // Update the local drivers list: 
                // Replace the old driver object with the one returned from server (driver.assignedTruck will be null)
                setDrivers((prev) =>
                    prev.map((d) => (d._id === driverId ? data.driver : d))
                );

                return { success: true, message: data.message };
            }

            return { success: false, message: data.message || "Failed to revoke truck" };
        } catch (error) {
            console.error("Revoke Hook Error:", error);
            return { success: false, message: "Connection Error: Could not reach server" };
        } finally {
            setDriverLoading(false);
        }
    };

    const GetDriverAndTruckDetails = async (id: string) => {
        setDriverLoading(true);
        try {
            const res = await driverServices.driverandTruckDetails(id);
            const data = await res.json();

            if (res.ok) {
                // If the ID we fetched matches a driver in our local state, update it
                setDrivers((prev) =>
                    prev.map(d => d._id === id ? data.driverDetails : d)
                );

                // Return the specific details to the component calling this function
                return {
                    success: true,
                    truckDetails: data.truckDetails,
                    driverDetails: data.driverDetails
                };
            }

            return { success: false, message: data.message };
        } catch (error) {
            console.error("Hook Error:", error);
            return { success: false, message: "Connection Error" };
        } finally {
            setDriverLoading(false);
        }
    };

    return {
        drivers,
        driverLoading,
        refreshDrivers,
        handleAddDriver,
        handleUpdateDriver,
        handleGetDriverById,
        handleDeleteDriver,
        handleAssignTruck,
        GetDriverAndTruckDetails,
        handleRevokeTruck
    };
};