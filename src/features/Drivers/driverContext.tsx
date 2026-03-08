import React, { createContext, useState, type ReactNode } from "react";

interface DriversContextType {
    drivers: any[];
    setDrivers: React.Dispatch<React.SetStateAction<any[]>>;
    driverLoading: boolean;
    setDriverLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DriversContext = createContext<DriversContextType | undefined>(undefined);

export const DriversProvider = ({ children }: { children: ReactNode }) => {
    const [drivers, setDrivers] = useState<any[]>([]);
    const [driverLoading, setDriverLoading] = useState(false);

    return (
        <DriversContext.Provider value={{ drivers, setDrivers, driverLoading, setDriverLoading }}>
            {children}
        </DriversContext.Provider>
    );
};