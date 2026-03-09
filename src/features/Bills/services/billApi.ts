const API_URL = 'http://localhost:5000/api/bill';

export const billApi = {
    // Helper to handle repetitive fetch logic
    request: async (url: string, options?: RequestInit) => {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API Request failed');
        }
        return response.json();
    },

    createBill: (data: any) => 
        billApi.request(`${API_URL}/create`, {
            method: 'POST',
            body: JSON.stringify(data),
            credentials: "include"
        }),

    getAllBills: () => 
        billApi.request(`${API_URL}/all`, {
            method: 'GET',
            credentials: "include"
        }),

    getBillById: (id: string) => 
        billApi.request(`${API_URL}/${id}`, {
            method: 'GET',
            credentials: "include"
        }),

    updateBill: (id: string, data: any) => 
        billApi.request(`${API_URL}/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            credentials: "include"
        }),

    deleteBill: (id: string) => 
        billApi.request(`${API_URL}/delete/${id}`, {
            method: 'DELETE',
            credentials: "include"
        }),
};