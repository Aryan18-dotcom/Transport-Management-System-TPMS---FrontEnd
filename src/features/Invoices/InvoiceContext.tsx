import { createContext, useState, useContext, type ReactNode } from 'react';
import { invoiceApi } from './services/InvoiceApi';

interface InvoiceContextType {
    invoices: any[];
    refreshInvoices: () => Promise<void>;
    loading: boolean;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider = ({ children }: { children: ReactNode }) => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);

    const refreshInvoices = async () => {
        setLoading(true);
        try {
            const res = await invoiceApi.getAllInvoices();
            const data = await res.json()
            setInvoices(data.data || []);
        } catch (err) {
            console.error("Failed to sync Invoices:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <InvoiceContext.Provider value={{ invoices, refreshInvoices, loading }}>
            {children}
        </InvoiceContext.Provider>
    );
};

export const useInvoiceContext = () => {
    const context = useContext(InvoiceContext);
    if (!context) throw new Error("useInvoiceContext must be used within an InvoiceProvider");
    return context;
};