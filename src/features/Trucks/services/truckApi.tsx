const BASE_URL = `${import.meta.env.VITE_BASE_URL}/assets`;

export const truckServices = {
    // 🔥 CREATE TRUCK IN THE FLEET
    createTruck: async (formData: FormData) => {
        const res = await fetch(`${BASE_URL}/add-vehicle`, {
            method: "POST",
            body: formData,
            credentials: "include",
        });
        return await res;
    },

    // 🔥 GET ALL TRUCKS IN THE FLEET
    getTrucks: async () => {
        const res = await fetch(`${BASE_URL}/vehicles`, {
            method: "GET",
            credentials: "include",
        });
        return await res;
    },

    // 🔥 UPDATE TRUCK DETAILS (Maintenance, Specs, etc.)
    updateTruck: async (truckId: string, updateData: any) => {
        const res = await fetch(`${BASE_URL}/update-vehicle/${truckId}`, {
            method: "PUT",
            body: updateData,
            credentials: "include",
        });
        return await res;
    },

    // 🔥 DELETE A TRUCK
    deleteTruck: async (truckId: string) => {
        const res = await fetch(`${BASE_URL}/delete-vehicle/${truckId}`, {
            method: "DELETE",
            credentials: "include",
        });
        return await res;
    },

    // 🔥 GET FLEET FROM THE FLEET_ID
    getTruckById: async (truckId: string) => {
        const res = await fetch(`${BASE_URL}/vehicle/${truckId}`, {
            method: "GET",
            credentials: "include"
        });

        return await res;
    },

    // 🔥 GET the Detail of Both Driver and the Truck
    driverandTruckDetails: async (id: string) => {
        return await fetch(`${BASE_URL}/truck-driver/${id}`, {
            method: "GET",
            credentials: "include"
        });
    },

    // 🔥 POST ASSIGN DRIVER TO THE TRUCK
    assignDriver: async (driverId: string, truckId: string) => {
        return await fetch(`${BASE_URL}/driver/assign-truck/${driverId}/${truckId}`, {
            method: "POST",
            credentials: "include"
        })
    }
};