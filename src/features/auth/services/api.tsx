const BASE_URL = "http://localhost:5000/api";

// 1. Define types for the Payloads
interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  password?: string;
  username: string;
  companyName: string;
  gstNumber: string;
}

interface LoginPayload {
  userId: string;
  password?: string;
}

// 2. REGISTER SERVICE
export async function register({
  firstName,
  lastName,
  email,
  phoneNo,
  password,
  username,
  companyName,
  gstNumber
}: RegisterPayload): Promise<any> {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phoneNo,
        password,
        username,
        companyName,
        gstNumber
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Return the message string if error
      return data.message || "Registration failed";
    }

    return data;
  } catch (e: any) {
    console.error("Register Error:", e);
    return e.message || "Network error occurred";
  }
}

// 3. LOGIN SERVICE
export async function login({ userId, password }: LoginPayload): Promise<any> {
  try {
    
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        userId,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Return the message string if error
      return data.message || "Login failed";
    }

    return data;
  } catch (e: any) {
    console.error("Login Error:", e);
    return e.message || "Network error occurred";
  }
}

// 4. LOGOUT SERVICE
export async function logout(): Promise<any> {
  try {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      return data.message || "Logout failed";
    }
    return data;
  } catch (e: any) {
    console.error("Logout Error:", e);
    return e.message || "Network error occurred";
  }
}

// 5. GET CURRENT USER
export async function getCurrentUser() {
  try {
    const response = await fetch(`${BASE_URL}/auth/current-user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    const data = await response.json();
    

    if(!response.ok){
      return data.message || "Cannot Get the Current User, Please Login."
    }

    return data;
    
  } catch (error: any) {
    console.error("Login Error:", error);
    return error.message || "Network error occurred";
  }
}