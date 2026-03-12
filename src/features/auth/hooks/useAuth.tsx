import { useContext, useEffect } from "react";
import { AuthContext } from "../authContext.tsx"; // Remove .jsx extension in the import
import { login, register, logout, getCurrentUser } from "../services/api.tsx";
import { useNavigate } from "react-router-dom"

// 1. Define the shape of the Auth Response from your API
interface AuthResponse {
  success: boolean;
  message: string;
  user?: any; // Ideally, replace 'any' with a User interface like { id: string, name: string }
}

// 2. Define the types for the Register arguments
interface RegisterParams {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  password: string;
  username: string;
  companyName: string;
  gstNumber: string;
}

// 3. Define the types for the Login arguments
interface LoginParams {
  userId: string;
  password: string;
}

export const useAuth = () => {
  const navigate = useNavigate();
  // We cast as 'any' here temporarily if your AuthContext.jsx isn't typed yet
  // This prevents red lines on 'user', 'setUser', etc.
  const context = useContext(AuthContext) as any;

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, setUser, loading, setLoading } = context;

  // 🔥 LOGIN
  const handleLogin = async ({ userId, password }: LoginParams): Promise<AuthResponse> => {
    setLoading(true);

    try {
      const data = await login({ userId, password });

      if (typeof data === "string") {
        return {
          success: false,
          message: data
        };
      }

      setUser(data.user);
      console.log(data.user);
      

      return {
        success: true,
        message: data.message || "Login successful",
        user: data.user
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "An unexpected error occurred"
      };
    } finally {
      setLoading(false);
    }
  };

  // 🔥 REGISTER
  const handleRegister = async (params: RegisterParams): Promise<AuthResponse> => {
    setLoading(true);

    try {
      const data = await register(params);

      if (typeof data === "string") {
        return {
          success: false,
          message: data,
        };
      }

      if (!data.user) {
        return {
          success: false,
          message: data.message || "Registration failed",
        };
      }

      setUser(data.user);

      return {
        success: true,
        message: data.message || "Account created successfully",
        user: data.user,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "An unexpected error occurred"
      };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const data = await logout();
      if (typeof data === "string") {
        return {
          success: false,
          message: data
        };
      }
      setUser(null);
      navigate("/login");
      return {
        success: true,
        message: data.message || "Logged out successfully"
      };

    } catch (error: any) {
      return {
        success: false,
        message: error.message || "An unexpected error occurred"
      };
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   // Here you can implement logic to check if the user is already logged in
  //   // For example, you could check localStorage for a token and validate it with the server
  //   // get the dets for the current user and set it in context if valid by this API -- http://localhost:5000/api/auth/current-user

  //   const checkAuth = async () => {
  //     setLoading(true);
  //     try {
  //       const data = await getCurrentUser();

  //       if(typeof data === "string"){
  //         console.log("Current User Not Found!");
  //         return {
  //           success: false,
  //           message: data,
  //         };
  //       }

  //       setUser(data.user)
  //       if(data.user.role === "COMPANY_ADMIN" || data.user.role === "SUPER_ADMIN"){
  //         navigate('/admin-dashboard')
  //       } else{
  //         navigate('/employee-dashboard')
  //       }
        
  //     } catch (error) {
  //       console.error("Error checking auth status:", error);

  //       setUser(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   checkAuth();
  // }, [])

  return { user, loading, handleRegister, handleLogin, handleLogout };
};