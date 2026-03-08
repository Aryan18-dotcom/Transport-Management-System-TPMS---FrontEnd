import React, { createContext, useState, type ReactNode } from "react";

interface MaintenanceState {
    records: any[];
    financialStats: any;
    topExpenses: any[];
    maintLoading: boolean;
    setRecords: React.Dispatch<React.SetStateAction<any[]>>;
    setFinancialStats: React.Dispatch<React.SetStateAction<any>>;
    setTopExpenses: React.Dispatch<React.SetStateAction<any[]>>;
    setMaintLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MaintenanceContext = createContext<MaintenanceState | undefined>(undefined);

export const MaintenanceProvider = ({ children }: { children: ReactNode }) => {
    const [records, setRecords] = useState<any[]>([]);
    const [financialStats, setFinancialStats] = useState<any>(null);
    const [topExpenses, setTopExpenses] = useState<any[]>([]);
    const [maintLoading, setMaintLoading] = useState<boolean>(false);

    return (
        <MaintenanceContext.Provider value={{ 
            records, setRecords, 
            financialStats, setFinancialStats, 
            topExpenses, setTopExpenses,
            maintLoading, setMaintLoading 
        }}>
            {children}
        </MaintenanceContext.Provider>
    );
};