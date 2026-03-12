import React, { createContext, useState, type ReactNode } from "react";
import type { Truck } from "../../types/fleet";

interface TrucksContextType {
    trucks: Truck[];
    setTrucks: React.Dispatch<React.SetStateAction<Truck[]>>;
    truckLoading: boolean;
    setTruckLoading: React.Dispatch<React.SetStateAction<boolean>>;
    driverLoading: boolean;
    setDriverLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TrucksContext = createContext<TrucksContextType | undefined>(undefined);

export const TrucksProvider = ({ children }: { children: ReactNode }) => {
    const [trucks, setTrucks] = useState<Truck[]>([]);
    const [truckLoading, setTruckLoading] = useState<boolean>(false);
    const [driverLoading, setDriverLoading] = useState<boolean>(false);

    return (
        <TrucksContext.Provider value={{
            trucks,
            setTrucks,
            truckLoading,
            setTruckLoading,
            driverLoading,
            setDriverLoading,
        }}>
            {children}
        </TrucksContext.Provider>
    );
};