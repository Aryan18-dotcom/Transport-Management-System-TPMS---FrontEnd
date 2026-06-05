import { useState, useRef, type ClipboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
    Mail,
    ShieldCheck,
    Lock,
    ArrowLeft,
    ChevronRight,
    Loader2,
    KeyRound
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const ResetPassword = () => {
    const { requestResetOTP, verifyResetOTP, resetPassword, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");

    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    if (!location.state?.fromLogin) {
        return <Navigate to="/login" replace />;
    }

    // --- HANDLERS ---
    const handleSendOTP = async () => {
        if (!email) return toast.error("Email is required");
        const res = await requestResetOTP({ email });
        if (res.success) {
            toast.success("Verification code dispatched");
            setStep(2);
        } else {
            toast.error(res.message || "Failed to send OTP");
        }
    };

    const handleOtpChange = (value: string, index: number) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
        const pasteData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^[0-9]{6}$/.test(pasteData)) return;
        setOtp(pasteData.split(""));
        inputsRef.current[5]?.focus();
    };

    const handleVerifyOTP = async () => {
        const finalOtp = otp.join("");
        if (finalOtp.length !== 6) return toast.error("Please enter the full 6-digit code");

        const res = await verifyResetOTP({ email, otp: finalOtp });
        if (res.success) {
            toast.success("Identity verified");
            setStep(3);
        } else {
            toast.error(res.message || "Invalid code");
        }
    };

    const handleResetPassword = async () => {
        if (newPassword.length < 6) return toast.error("Password is too weak");
        const res = await resetPassword({ email, otp: otp.join(""), newPassword });
        if (res.success) {
            toast.success("Credentials updated successfully");
            setTimeout(() => navigate("/login"), 1500);
        } else {
            toast.error(res.message || "Reset failed");
        }
    };

    const maskEmail = (email: string) => {
        if (!email) return "";
        const [user, domain] = email.split("@");
        if (user.length <= 2) return `${user}***@${domain}`;
        return `${user.substring(0, 3)}••••••••${user.slice(-1)}@${domain}`;
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 selection:bg-indigo-500/30 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Glows */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-indigo-500/10 blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-96 h-96 bg-blue-600/5 blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Progress Bar */}
                <div className="flex gap-2 mb-8 px-1">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? "bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.4)]" : "bg-zinc-800"
                                }`}
                        />
                    ))}
                </div>

                <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl backdrop-blur-md shadow-2xl relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {/* --- STEP 1: EMAIL --- */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="text-center space-y-2">
                                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20 text-indigo-400">
                                        <Mail size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white tracking-tight">Recover Access</h2>
                                    <p className="text-zinc-500 text-sm">Enter your registered email to receive a secure code.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-600 ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="name@company.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSendOTP}
                                        disabled={loading}
                                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : <>Send Verification Code <ChevronRight size={18} /></>}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* --- STEP 2: OTP --- */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="text-center space-y-2">
                                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20 text-indigo-400">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white tracking-tight">Verify Identity</h2>
                                    <p className="text-zinc-500 text-sm">
                                        We've sent a 6-digit code to{" "}
                                        <span className="text-indigo-400 font-mono italic">
                                            {maskEmail(email)}
                                        </span>
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-between gap-2" onPaste={handlePaste}>
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                ref={(el) => {inputsRef.current[index] = el}}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                onChange={(e) => handleOtpChange(e.target.value, index)}
                                                className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-zinc-950/50 border border-zinc-800 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
                                            />
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleVerifyOTP}
                                        disabled={loading}
                                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : "Verify Code"}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* --- STEP 3: NEW PASSWORD --- */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                <div className="text-center space-y-2">
                                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 text-emerald-400">
                                        <KeyRound size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white tracking-tight">New Credentials</h2>
                                    <p className="text-zinc-500 text-sm">Please choose a strong password for your TPMS account.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-600 ml-1">New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleResetPassword}
                                        disabled={loading}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : "Update Credentials"}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Navigation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-center"
                >
                    <button
                        onClick={() => navigate("/login")}
                        className="group inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Portal Login
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;