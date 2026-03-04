import React, { createContext, useState, type ReactNode } from "react";

interface AdminContextType {
  employees: any[];
  setEmployees: React.Dispatch<React.SetStateAction<any[]>>;
  metrics: any | null;
  setMetrics: React.Dispatch<React.SetStateAction<any | null>>;
  adminLoading: boolean;
  setAdminLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any | null>(null);
  const [adminLoading, setAdminLoading] = useState(false);

  return (
    <AdminContext.Provider value={{ 
      employees, setEmployees, 
      metrics, setMetrics, 
      adminLoading, setAdminLoading 
    }}>
      {children}
    </AdminContext.Provider>
  );
};