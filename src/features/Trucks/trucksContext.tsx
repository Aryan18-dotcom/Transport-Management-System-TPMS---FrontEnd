import React, { createContext, useState, type ReactNode } from "react";

// Define the shape of a Truck object
interface Truck {
    _id: string;
    truckNumber: string;
    model: string;
    capacity: string;
    isActive: boolean;
    assignedDriver: string
    // Add other fields as per your schema
}

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