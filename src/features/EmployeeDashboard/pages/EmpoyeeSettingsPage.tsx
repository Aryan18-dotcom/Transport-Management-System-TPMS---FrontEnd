import React, { useState, useEffect } from 'react';
import {
    User, Moon, Sun, Type, ShieldCheck,
    Monitor, FileSpreadsheet, HardDrive, KeyRound, Mail, Phone, AtSign
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEmployee } from '../hook/employeeHook';
import { useAuth } from '../../auth/hooks/useAuth';

const EmployeeSettingsPage = () => {
    const { metrics, handlePasswordUpdate, handleUpdateProfile } = useEmployee();
    const { user } = useAuth();

    // --- Profile State ---
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [email, setEmail] = useState('');

    const [passwords, setPasswords] = useState({ current: '', new: '' });
    const [otp, setOtp] = useState('');
    const [showOtpModal, setShowOtpModal] = useState(false);

    // --- Operational & UI Settings ---
    const [reportPath, setReportPath] = useState('C:/TMPS/Reports/2026/March');
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [fontSize, setFontSize] = useState<'standard' | 'large' | 'extra'>('large');

    // Sync profile data from Auth Context on load
    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setUsername(user.username || '');
            setPhoneNo(user.phoneNo || '');
            setEmail(user.email || '');
        }
    }, [user]);

    // Logic: Browser Directory Picker for Report Path
    const handleBrowse = async () => {
        try {
            if ('showDirectoryPicker' in window) {
                const directoryHandle = await (window as any).showDirectoryPicker();
                // Simulating a Windows absolute path based on selection
                const simulatedPath = `C:/TMPS/Exports/${directoryHandle.name}`;
                setReportPath(simulatedPath);
                toast.success(`Export path updated: ${directoryHandle.name}`);
            } else {
                toast.error("Your browser doesn't support folder picking. Please type manually.");
            }
        } catch (err: any) {
            if (err.name !== 'AbortError') console.error(err);
        }
    };

    // Logic: Password Update with OTP gating
    const onPasswordSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!passwords.current || !passwords.new) return toast.error("Credentials missing");

        const result = await handlePasswordUpdate(passwords.current, passwords.new, otp || undefined);
        
        if (result.status === "OTP_REQUIRED") {
            setShowOtpModal(true);
        } else if (result.status === "SUCCESS") {
            setShowOtpModal(false);
            setPasswords({ current: '', new: '' });
            setOtp('');
        }
    };

    return (
        <div className={`p-6 lg:p-12 min-h-screen font-sans transition-all relative ${theme === 'dark' ? 'bg-[#070707] text-white' : 'bg-gray-50 text-gray-900'}`}>

            {/* OTP MODAL OVERLAY */}
            {showOtpModal && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-[#111111] border border-white/10 p-8 rounded-[32px] max-w-md w-full shadow-2xl">
                        <KeyRound className="text-amber-500 mb-4" size={32} />
                        <h3 className="text-xl font-black uppercase tracking-tighter text-white">Security Verification</h3>
                        <p className="text-zinc-500 text-[10px] font-bold mt-2 mb-6 uppercase tracking-wider leading-relaxed">
                            A one-time code was sent to the Company Admin. Enter it to authorize this change.
                        </p>
                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="0 0 0 0 0 0"
                            className="w-full bg-black border border-white/5 py-4 rounded-2xl text-center text-2xl font-black tracking-[0.5em] focus:border-indigo-500 outline-none mb-6"
                        />
                        <div className="flex gap-3">
                            <button onClick={() => onPasswordSubmit()} className="flex-1 py-4 bg-indigo-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700">Confirm</button>
                            <button onClick={() => setShowOtpModal(false)} className="flex-1 py-4 bg-zinc-800 rounded-2xl font-black uppercase text-[10px] tracking-widest">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic">System Configuration</h1>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">{user?.companyId?.companyName || "Company"} Terminal v1.0 • Settings</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-7 space-y-8">

                        {/* 1. EXPORT SETTINGS */}
                        <section className={`p-8 rounded-[32px] border ${theme === 'dark' ? 'bg-[#111111] border-white/5' : 'bg-white border-gray-200'}`}>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500"><FileSpreadsheet size={24} /></div>
                                <h3 className="text-sm font-black uppercase tracking-widest">Export Protocol</h3>
                            </div>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={reportPath}
                                    readOnly
                                    className="flex-1 py-4 px-6 bg-[#0d0d0f] border border-white/5 rounded-2xl text-xs font-bold text-zinc-500"
                                />
                                <button onClick={handleBrowse} className="px-6 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-[10px] font-black uppercase">Browse</button>
                            </div>
                        </section>

                        {/* 2. PROFILE SETTINGS */}
                        <section className={`p-8 rounded-[32px] border ${theme === 'dark' ? 'bg-[#111111] border-white/5' : 'bg-white border-gray-200'}`}>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500"><User size={24} /></div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-white">Personnel Profile</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full py-4 px-6 bg-[#0d0d0f] border border-white/5 rounded-2xl text-sm font-bold" />
                                    <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full py-4 px-6 bg-[#0d0d0f] border border-white/5 rounded-2xl text-sm font-bold" />
                                </div>
                                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full py-4 px-6 bg-[#0d0d0f] border border-white/5 rounded-2xl text-sm font-bold" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Phone" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} className="w-full py-4 px-6 bg-[#0d0d0f] border border-white/5 rounded-2xl text-sm font-bold" />
                                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full py-4 px-6 bg-[#0d0d0f] border border-white/5 rounded-2xl text-sm font-bold" />
                                </div>
                                <button onClick={() => handleUpdateProfile(firstName, lastName, username, phoneNo, email)} className="w-full py-4 bg-emerald-600 rounded-2xl font-black uppercase text-[10px] tracking-widest">Update Profile</button>
                            </div>

                            <div className="mt-10 pt-10 border-t border-white/5 space-y-4">
                                <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Security Update</label>
                                <input type="password" placeholder="Current Key" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} className="w-full py-4 px-6 bg-[#0d0d0f] border border-white/5 rounded-2xl text-sm" />
                                <input type="password" placeholder="New Key" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} className="w-full py-4 px-6 bg-[#0d0d0f] border border-white/5 rounded-2xl text-sm" />
                                <button onClick={onPasswordSubmit} className="w-full py-4 bg-rose-600/10 border border-rose-600/20 text-rose-500 rounded-2xl font-black uppercase text-[10px] tracking-widest">Change Password</button>
                            </div>
                        </section>
                    </div>

                    {/* 3. UI CUSTOMIZATION */}
                    <div className="lg:col-span-5 space-y-8">
                        <section className={`p-8 rounded-[32px] border ${theme === 'dark' ? 'bg-[#111111] border-white/5 shadow-2xl' : 'bg-white border-gray-200'}`}>
                            <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2"><Monitor size={14} /> Theme</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setTheme('dark')} className={`p-6 rounded-3xl border-2 transition-all ${theme === 'dark' ? 'bg-black border-indigo-500' : 'border-transparent opacity-40'}`}><Moon className="mx-auto mb-2" /><span className="text-[10px] font-black uppercase">Onyx</span></button>
                                <button onClick={() => setTheme('light')} className={`p-6 rounded-3xl border-2 transition-all ${theme === 'light' ? 'bg-white border-indigo-500 text-black' : 'border-transparent opacity-40'}`}><Sun className="mx-auto mb-2" /><span className="text-[10px] font-black uppercase">Paper</span></button>
                            </div>
                        </section>

                        <div className="p-10 bg-zinc-900/40 border border-dashed border-zinc-800 rounded-[40px] flex flex-col items-center text-center gap-6">
                            <ShieldCheck className="text-zinc-700" size={40} />
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] leading-relaxed">Authorized Personnel Only. IP trace active.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeSettingsPage;