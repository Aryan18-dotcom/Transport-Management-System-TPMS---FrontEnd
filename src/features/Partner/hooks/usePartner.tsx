import { useContext } from 'react';
import { PartnerContext } from '../partnerContext';
import { partnerServices } from '../services/partnerApi';

export const usePartner = () => {
    const context = useContext(PartnerContext);
    if (!context) throw new Error("usePartner must be used within PartnerProvider");

    const { partners, partnerLoading, refreshPartners } = context;

    const handleAddPartner = async (data: any) => {
        const res = await partnerServices.addPartner(data);
        if (res.ok) await refreshPartners();
        return res;
    };

    const handleUpdatePartner = async (id: string, data: any) => {
        const res = await partnerServices.updatePartner(id, data);
        if (res.ok) await refreshPartners();
        return res;
    };

    const handleDeletePartner = async (id: string) => {
        const res = await partnerServices.deletePartner(id);
        if (res.ok) await refreshPartners();
        return res;
    };

    const getPartnerDetails = async (id: string) => {
        return await partnerServices.getPartnerById(id);
    };

    return {
        partners,
        partnerLoading,
        refreshPartners,
        handleAddPartner,
        handleUpdatePartner,
        handleDeletePartner,
        getPartnerDetails
    };
};