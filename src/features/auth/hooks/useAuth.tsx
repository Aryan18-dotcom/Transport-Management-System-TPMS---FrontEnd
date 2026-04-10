import { useContext } from "react";
import { AuthContext } from "../authContext.tsx";
import { login, logout, requestRegistrationOTP, verifyAndRegister, requestPasswordResetOTP, verifyPasswordResetOTP, resetPassword } from "../services/api.tsx";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();
  const context = useContext(AuthContext) as any;

  if (!context) throw new Error("useAuth must be used within an AuthProvider");

  const { user, setUser, loading, setLoading } = context;

  // 🔥 STEP 1: Request OTP
  const requestOTP = async ({ username, email }: { username: string; email: string }) => {
    setLoading(true);
    try {
      const data = await requestRegistrationOTP(username, email);
      if (data.message === "Verification code sent to your email" || data.success) {
        return { success: true };
      }
      return { success: false, message: data.message || data };
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // 🔥 STEP 2: Final Registration
  const handleVerifyAndRegister = async (payload: any) => {
    setLoading(true);
    try {
      const data = await verifyAndRegister(payload);
      if (typeof data === "string") return { success: false, message: data };

      if (data.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message || "Registration failed" };
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async ({ userId, password }: any) => {
    setLoading(true);
    try {
      const data = await login({ userId, password });
      if (typeof data === "string") return { success: false, message: data };
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error: any) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/login");
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  // 🔥 REQUEST RESET OTP
  const requestResetOTP = async ({ email }: { email: string }) => {
    setLoading(true);
    try {
      const data = await requestPasswordResetOTP(email);

      if (data.success || data.message?.includes("OTP")) {
        return { success: true };
      }

      return { success: false, message: data.message || data };
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // 🔥 VERIFY OTP
  const verifyResetOTP = async ({ email, otp }: { email: string; otp: string }) => {
    setLoading(true);
    try {
      const data = await verifyPasswordResetOTP(email, otp);

      if (data.success || data.message?.includes("verified")) {
        return { success: true };
      }

      return { success: false, message: data.message || data };
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // 🔥 RESET PASSWORD
  const handleResetPassword = async (payload: {
    email: string;
    otp: string;
    newPassword: string;
  }) => {
    setLoading(true);
    try {
      const data = await resetPassword(payload);

      if (data.success || data.message?.includes("successful")) {
        return { success: true };
      }

      return { success: false, message: data.message || data };
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    requestOTP,
    verifyAndRegister: handleVerifyAndRegister,
    handleLogin,
    handleLogout,
    requestResetOTP,
    verifyResetOTP,
    resetPassword: handleResetPassword
  };
};