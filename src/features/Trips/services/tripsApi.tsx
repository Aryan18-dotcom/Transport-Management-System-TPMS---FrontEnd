const BASE_URL = "http://localhost:5000/api/notery";

export const tripsApi = {
    // 1. Create Trip with POD upload
    createTrip: async (formData: FormData) => {
        const res = await fetch(`${BASE_URL}/trip-entry`, {
            method: "POST",
            body: formData, // FormData automatically sets content-type with boundary
            credentials: "include"
        });
        return res;
    },

    // 2. Update Trip Status (IN_TRANSIT, DELIVERED, etc.)
    updateTripStatus: async (tripId: string, status: string) => {
        const res = await fetch(`${BASE_URL}/trip-status/${tripId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
            credentials: "include"
        });
        return res;
    },

    // 3. Update Payment Status (PENDING, PAID)
    updatePaymentStatus: async (tripId: string, paymentStatus: string) => {
        const res = await fetch(`${BASE_URL}/payment-status/${tripId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentStatus }),
            credentials: "include"
        });
        return res;
    },

    // 4. Update Full Trip Details (including optional new POD)
    updateTripDetails: async (tripId: string, formData: FormData) => {
        const res = await fetch(`${BASE_URL}/trip-details/${tripId}`, {
            method: "PUT",
            body: formData,
            credentials: "include"
        });
        return res;
    },

    // 5. Get All Trips
    getTrips: async () => {
        const res = await fetch(`${BASE_URL}/trips`, {
            method: "GET",
            credentials: "include"
        });
        return res;
    },

    // 6. Get Single Trip
    getTripById: async (tripId: string) => {
        const res = await fetch(`${BASE_URL}/trips/${tripId}`, {
            method: "GET",
            credentials: "include"
        });
        return res;
    },

    deleteTripById: async (tripId: string) => {
        const res = await fetch(`${BASE_URL}/trip/${tripId}`, {
            method: "DELETE",
            credentials: "include"
        });
        return res;
    }
};