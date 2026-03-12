const BASE_URL = `${import.meta.env.VITE_BASE_URL}/assets`;

export const driverServices = {
    // Register a new driver with license images
    addDriver: async (formData: FormData) => {
        const res = await fetch(`${BASE_URL}/add-driver`, {
            method: "POST",
            body: formData,
            credentials: "include",
        });
        return res
    },

    // Update existing driver (supports partial text or new images)
    updateDriver: async (driverId: string, formData: FormData) => {
        return await fetch(`${BASE_URL}/update-driver/${driverId}`, {
            method: "PUT",
            body: formData,
            credentials: "include",
        });
    },

    // Fetch all drivers for the company
    getDrivers: async () => {
        return await fetch(`${BASE_URL}/drivers`, {
            method: "GET",
            credentials: "include",
        });
    },

    // Get specific driver details
    getDriverById: async (driverId: string) => {
        return await fetch(`${BASE_URL}/driver/${driverId}`, {
            method: "GET",
            credentials: "include",
        });
    },

    // Remove driver from database
    deleteDriver: async (driverId: string) => {
        return await fetch(`${BASE_URL}/delete-driver/${driverId}`, {
            method: "DELETE",
            credentials: "include",
        });
    },

    // Assign Truck to Driver
    assignTruck: async (driverId: string, truckId: string) => {
        return await fetch(`${BASE_URL}/driver/assign-truck/${driverId}/${truckId}`, {
            method: "POST",
            credentials: "include"
        });
    },

    // Assign Truck to Driver
    revokeTruck: async (driverId: string) => {
        return await fetch(`${BASE_URL}/driver/revoke-truck/${driverId}`, {
            method: "PUT", // Matches the backend update method
            credentials: "include",
        });
    },

    // GET the Detail of Both Driver and the Truck
    driverandTruckDetails: async (id: string) => {
        return await fetch(`${BASE_URL}/truck-driver/${id}`, {
            method: "GET",
            credentials: "include"
        });
    }
};