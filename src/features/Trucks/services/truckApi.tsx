import type { Truck, TruckResponse } from "../../../types/fleet";

const BASE_URL = `${import.meta.env.VITE_BASE_URL}/assets`;

export const truckServices = {
    // 🔥 CREATE TRUCK
    createTruck: async (formData: FormData): Promise<TruckResponse> => {
        const res = await fetch(`${BASE_URL}/add-vehicle`, {
            method: "POST",
            body: formData,
            credentials: "include",
        });
        return await res.json();
    },

    // 🔥 GET ALL TRUCKS
    getTrucks: async (): Promise<Truck[]> => {
        const res = await fetch(`${BASE_URL}/vehicles`, {
            method: "GET",
            credentials: "include",
        });
        const data = await res.json();
        // Assuming your backend returns { trucks: [...] } or an array directly
        return data.trucks || data; 
    },

    // 🔥 UPDATE TRUCK
    updateTruck: async (truckId: string, updateData: any): Promise<TruckResponse> => {
        const res = await fetch(`${BASE_URL}/update-vehicle/${truckId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }, // Added header for JSON
            body: JSON.stringify(updateData),
            credentials: "include",
        });
        return await res.json();
    },

    // 🔥 DELETE A TRUCK
    deleteTruck: async (truckId: string): Promise<{ success: boolean }> => {
        const res = await fetch(`${BASE_URL}/delete-vehicle/${truckId}`, {
            method: "DELETE",
            credentials: "include",
        });
        return await res.json();
    },

    // 🔥 GET BY ID
    getTruckById: async (truckId: string): Promise<Truck> => {
        const res = await fetch(`${BASE_URL}/vehicle/${truckId}`, {
            method: "GET",
            credentials: "include"
        });
        const data = await res.json();
        return data.truck || data;
    },

    // 🔥 Driver and Truck Details
    driverandTruckDetails: async (id: string): Promise<any> => {
        const res = await fetch(`${BASE_URL}/truck-driver/${id}`, {
            method: "GET",
            credentials: "include"
        });
        return await res.json();
    },

    // 🔥 Assign Driver
    assignDriver: async (driverId: string, truckId: string): Promise<any> => {
        const res = await fetch(`${BASE_URL}/driver/assign-truck/${driverId}/${truckId}`, {
            method: "POST",
            credentials: "include"
        });
        return await res.json();
    }
};