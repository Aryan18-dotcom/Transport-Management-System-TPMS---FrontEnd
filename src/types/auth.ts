// 1. Define types for the Payloads
export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  password?: string;
  username: string;
  companyName: string;
  gstNumber: string;
}

export interface LoginPayload {
  userId: string;
  password?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: "EMPLOYEE" | "COMPANY_ADMIN"; // Added literal types for better safety
  isPasswordChanged: boolean;
}

export interface LoginResponse {
  message: string;
  user: User;
  success?: boolean; // Optional, in case your backend sends it
}