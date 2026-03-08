const BASE_URL = "http://localhost:5000/api/assets";

export const partnerServices = {
    addPartner: async (formData: any) => {
        const res = await fetch(`${BASE_URL}/add-partner-company`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData), // Send directly as FormData
            credentials: "include"
        });
        return res;
    },

    updatePartner: async (id: string, formData: FormData) => {
        const res = await fetch(`${BASE_URL}/update-partner-company/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
            credentials: "include"
        });
        return res;
    },

    deletePartner: async (id: string) => {
        const res = await fetch(`${BASE_URL}/delete-partner-company/${id}`, {
            method: "DELETE",
            credentials: "include"
        });
        return await res;
    },

    getAllPartners: async () => {
        const res = await fetch(`${BASE_URL}/partner-companies`, {
            method: "GET",
            credentials: "include"
        });
        return res;
    },

    getPartnerById: async (id: string) => {
        const res = await fetch(`${BASE_URL}/partner-company/${id}`, {
            method: "GET",
            credentials: "include"
        });
        return res;
    }
};