import { useContext } from 'react';
import { TripsContext } from '../tripsContext';
import { tripsApi } from '../services/tripsApi';

export const useTrips = () => {
    const context = useContext(TripsContext);
    if (!context) throw new Error("useTrips must be used within a TripsProvider");

    const { trips, tripsLoading, refreshTrips } = context;

    const handleCreateTrip = async (formData: FormData) => {
        const res = await tripsApi.createTrip(formData);
        if (res.ok) await refreshTrips();
        return res;
    };

    const handleUpdateStatus = async (tripId: string, status: string) => {
        const res = await tripsApi.updateTripStatus(tripId, status);
        if (res.ok) await refreshTrips();
        return res;
    };

    const handleUpdatePayment = async (tripId: string, pStatus: string) => {
        const res = await tripsApi.updatePaymentStatus(tripId, pStatus);
        if (res.ok) await refreshTrips();
        return res;
    };

    const handleUpdateDetails = async (tripId: string, formData: FormData) => {
        const res = await tripsApi.updateTripDetails(tripId, formData);
        if (res.ok) await refreshTrips();
        return res;
    };

    const getTripDetails = async (tripId: string) => {
        return await tripsApi.getTripById(tripId);
    };

    const deleteTripDetsById = async (tripId: string) => {
        return await tripsApi.deleteTripById(tripId)
    }

    const getTripForThePartnerCompany = async (partnerCompanyId: string) => {
        return await tripsApi.getTripsByCompanyId(partnerCompanyId)
    }

    return {
        trips,
        tripsLoading,
        refreshTrips,
        handleCreateTrip,
        handleUpdateStatus,
        handleUpdatePayment,
        handleUpdateDetails,
        getTripDetails,
        deleteTripDetsById,
        getTripForThePartnerCompany
    };
};