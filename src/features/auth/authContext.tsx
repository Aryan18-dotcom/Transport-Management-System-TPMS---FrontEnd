import React, { createContext, useEffect, useState, type ReactNode } from "react";
import { getCurrentUser } from "./services/api";

// 1. Define the shape of a User (Adjust fields based on your DB)
interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  // Add other fields as needed
}

// 2. Define the shape of the Context Value
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// 3. Create the Context with an initial undefined value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Define Props for the Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkForAuth = async () => {
      const data = await getCurrentUser();
      setUser(data.user)
      setLoading(false);
    }

    checkForAuth();
  }, [])
  

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};