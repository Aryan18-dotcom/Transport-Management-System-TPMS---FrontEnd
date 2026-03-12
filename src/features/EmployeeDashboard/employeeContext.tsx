import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface EmployeeContextType {
    metrics: any;
    setMetrics: React.Dispatch<React.SetStateAction<any>>;
    opsLoading: boolean;
    setOpsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
    const [metrics, setMetrics] = useState<any>(null);
    const [opsLoading, setOpsLoading] = useState<boolean>(false);

    return (
      <EmployeeContext.Provider value={{ metrics, setMetrics, opsLoading, setOpsLoading }}>
        {children}
      </EmployeeContext.Provider>
    );
};

export const useEmployeeContext = () => {
    const context = useContext(EmployeeContext);
    if (!context) throw new Error("useEmployeeContext must be used within EmployeeProvider");
    return context;
};