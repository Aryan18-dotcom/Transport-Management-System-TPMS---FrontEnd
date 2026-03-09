import { createContext, useState, useContext, type ReactNode } from 'react';
import { billApi } from './services/billApi';

interface BillContextType {
    bills: any[];
    refreshBills: () => Promise<void>;
    loading: boolean;
}

const BillContext = createContext<BillContextType | undefined>(undefined);

export const BillProvider = ({ children }: { children: ReactNode }) => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(false);

    const refreshBills = async () => {
        setLoading(true);
        try {
            const res = await billApi.getAllBills();
            setBills(res.data);
        } catch (err) {
            console.error("Failed to refresh bills in context:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <BillContext.Provider value={{ bills, refreshBills, loading }}>
            {children}
        </BillContext.Provider>
    );
};

export const useBillContext = () => {
    const context = useContext(BillContext);
    if (!context) throw new Error("useBillContext must be used within a BillProvider");
    return context;
};