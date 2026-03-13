import type { LoginPayload, LoginResponse, RegisterPayload } from "../../../types/auth";

const BASE_URL = import.meta.env.VITE_BASE_URL?.replace(/\/$/, "") || "";

// 🔥 NEW: Request OTP for registration
export async function requestRegistrationOTP(username: string, email: string) {
  try {
    const response = await fetch(`${BASE_URL}/auth/register/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email }),
    });
    return await response.json();
  } catch (e: any) {
    return e.message || "Network error occurred";
  }
}

// 🔥 UPDATED: Verify and Register (Commit to DB)
export async function verifyAndRegister(payload: any) {
  try {
    const response = await fetch(`${BASE_URL}/auth/register/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (e: any) {
    return e.message || "Network error occurred";
  }
}

// LOGIN SERVICE
export async function login({ userId, password }: LoginPayload): Promise<any> {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId, password }),
    });
    const data = await response.json();
    return response.ok ? data : data.message || "Login failed";
  } catch (e: any) {
    return e.message || "Network error occurred";
  }
}

// LOGOUT SERVICE
export async function logout(): Promise<any> {
  try {
    console.log("BASE URL", BASE_URL)
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return await response.json();
  } catch (e: any) {
    return e.message || "Network error occurred";
  }
}

// GET CURRENT USER
export async function getCurrentUser() {
  try {
    const response = await fetch(`${BASE_URL}/auth/current-user`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await response.json();
    return response.ok ? data : data.message || "Session expired";
  } catch (error: any) {
    return error.message || "Network error occurred";
  }
}
