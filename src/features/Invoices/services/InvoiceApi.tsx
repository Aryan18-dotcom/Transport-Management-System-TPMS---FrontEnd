const BASE_URL = `${import.meta.env.VITE_BASE_URL}/invoice`;

export const invoiceApi = {
    // 1. Generate Automated PNG Invoice
    generateInvoice: async (data: { billId: string; gstRate: number; tdsRate: number; isRCM: boolean; }) => {
        const res = await fetch(`${BASE_URL}/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include"
        });
        return res;
    },

    // 2. Get All Invoices for the Ledger
    getAllInvoices: async () => {
        const res = await fetch(`${BASE_URL}/all`, {
            method: "GET",
            credentials: "include"
        });
        return res;
    },

    // 3. Get Single Invoice Details
    getInvoiceById: async (id: string) => {
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: "GET",
            credentials: "include"
        });
        return res;
    },

    // 4. Update Payment Status (PAID, UNPAID, PARTIAL)
    updatePaymentStatus: async (id: string, status: 'PAID' | 'UNPAID' | 'PARTIAL') => {
        const res = await fetch(`${BASE_URL}/status/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentStatus: status }),
            credentials: "include"
        });
        return res;
    },

    // 5. Delete Invoice Record
    deleteInvoice: async (id: string) => {
        const res = await fetch(`${BASE_URL}/delete/${id}`, {
            method: "DELETE",
            credentials: "include"
        });
        return res;
    }
};