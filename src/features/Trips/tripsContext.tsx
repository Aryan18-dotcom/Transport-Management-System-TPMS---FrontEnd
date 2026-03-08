import React, { createContext, useState, useCallback } from 'react';
import { tripsApi } from './services/tripsApi';

export const TripsContext = createContext<any>(null);

export const TripsProvider = ({ children }: { children: React.ReactNode }) => {
    const [trips, setTrips] = useState([]);
    const [tripsLoading, setTripsLoading] = useState(false);

    const refreshTrips = useCallback(async () => {
        setTripsLoading(true);
        try {
            const res = await tripsApi.getTrips();
            const data = await res.json()
            if (res.ok) setTrips(data.trips);
        } catch (error) {
            console.error("Trip Registry Sync Error:", error);
        } finally {
            setTripsLoading(false);
        }
    }, []);

    return (
        <TripsContext.Provider value={{ 
            trips, 
            tripsLoading, 
            setTrips, 
            refreshTrips 
        }}>
            {children}
        </TripsContext.Provider>
    );
};