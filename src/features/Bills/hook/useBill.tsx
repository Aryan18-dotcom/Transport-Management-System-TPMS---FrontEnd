import { useState } from 'react';
import { billApi } from '../services/billApi';
import { useBillContext } from '../billContext';

const useBills = () => {
  const { refreshBills } = useBillContext();
  const [actionLoading, setActionLoading] = useState(false);

  const createNewBill = async (data: any) => {
    setActionLoading(true);
    try {
      const res = await billApi.createBill(data);
      await refreshBills(); // Automatically update global bill state
      return res.data;
    } catch (err) {
      console.error("Error creating bill:", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const updateExistingBill = async (id: string, data: any) => {
    setActionLoading(true);
    try {
      const res = await billApi.updateBill(id, data);
      await refreshBills();
      return res.data;
    } catch (err) {
      console.error("Error updating bill:", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const deleteBill = async (id: string) => {
    setActionLoading(true);
    try {
      await billApi.deleteBill(id);
      await refreshBills();
    } catch (err) {
      console.error("Error deleting bill:", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const getBillDetailsById = async (billId: string) => {
    setActionLoading(true);
    try {
      const data = await billApi.getBillById(billId)
      await refreshBills();
      return data
    } catch (error: any) {
      console.error("Error deleting bill:", error);
      throw error;
    } finally{
      setActionLoading(false);
    }
  }

  return {
    createNewBill,
    updateExistingBill,
    deleteBill,
    actionLoading,
    getBillDetailsById,
  };
};

export default useBills;