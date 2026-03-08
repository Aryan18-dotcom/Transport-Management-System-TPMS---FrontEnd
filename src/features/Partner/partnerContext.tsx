import React, { createContext, useState, useCallback } from 'react';
import { partnerServices } from './services/partnerApi';

export const PartnerContext = createContext<any>(null);

export const PartnerProvider = ({ children }: { children: React.ReactNode }) => {
    const [partners, setPartners] = useState([]);
    const [partnerLoading, setPartnerLoading] = useState(false);

    const refreshPartners = useCallback(async () => {
        setPartnerLoading(true);
        const res = await partnerServices.getAllPartners();
        const data = await res.json()
        
        if (res.ok) setPartners(data.partnerCompanies);
        setPartnerLoading(false);
    }, []);

    return (
        <PartnerContext.Provider value={{ 
            partners, 
            partnerLoading, 
            setPartners, 
            refreshPartners 
        }}>
            {children}
        </PartnerContext.Provider>
    );
};