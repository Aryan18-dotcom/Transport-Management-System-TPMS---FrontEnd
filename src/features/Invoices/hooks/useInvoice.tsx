import { useState } from 'react';
import { invoiceApi } from '../services/InvoiceApi';
import { useInvoiceContext } from '../InvoiceContext';

const useInvoice = () => {
    const { refreshInvoices, invoices } = useInvoiceContext();
    const [invoiceActionLoading, setInvoiceActionLoading] = useState(false);

    const createInvoice = async (data: any) => {
        setInvoiceActionLoading(true);
        try {
            const result = await invoiceApi.generateInvoice(data);
            await refreshInvoices();
            
            return result; // Usually returns the Cloudinary URL or PDF path
        } catch (err: any) {
            console.error(err.message);
            throw err;
        } finally {
            setInvoiceActionLoading(false);
        }
    };

    const updateInvoicePayment = async (id: string, status: any) => {
        try {
            await invoiceApi.updatePaymentStatus(id, status);
            await refreshInvoices();
        } catch (err) {
            console.error(err);
        }
    };

    const getInvoiceById = async (invoiceId: string) => {
        try {
            return await invoiceApi.getInvoiceById(invoiceId)
        } catch (error: any) {
            console.log(error);
        }
    }

    const deleleInvoiceById = async (invoiceId: string) => {
        try {
            return await invoiceApi.deleteInvoice(invoiceId)
        } catch (error: any) {
            return error.message
        }
    }

    return {
        createInvoice,
        updateInvoicePayment,
        invoiceActionLoading,
        getInvoiceById, 
        refreshInvoices,
        invoices,
        deleleInvoiceById
    };
};

export default useInvoice;