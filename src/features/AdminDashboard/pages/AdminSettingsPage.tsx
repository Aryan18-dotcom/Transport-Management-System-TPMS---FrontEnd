import React, { useState, useEffect } from 'react';
import {
    ShieldCheck, Globe, Activity, Lock, Cloud,
    Terminal, Building2, Landmark, User, Mail, Phone, AtSign
} from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import toast from 'react-hot-toast';
import { useAdmin } from '../hooks/adminHook';

const AdminSettingsPage = () => {
    const { metrics, handleUpdateCompany, handleUpdateAdminProfile, handleAdminPasswordChange, adminLoading } = useAdmin();
    const { user } = useAuth();

    // --- Admin Profile State ---
    const [adminProfile, setAdminProfile] = useState({
        firstName: '',
        lastName: '',
        phoneNo: '',
        email: ''
    });

    // --- Global Company State ---
    const [companyProfile, setCompanyProfile] = useState({
        companyName: '',
        gstNumber: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        branchName: ''
    });

    // --- Password Change State ---
    const [passChange, setPassChange] = useState({
        current: '',
        new: ''
    });

    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

    // Sync data from context on load
    useEffect(() => {
        if (user) {
            setAdminProfile({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phoneNo: user.phoneNo || '',
                email: user.email || ''
            });
        }
        if (metrics?.company) {
            setCompanyProfile({
                companyName: metrics.company.companyName || '',
                gstNumber: metrics.company.gstNumber || '',
                bankName: metrics.company.bankName || '',
                accountNumber: metrics.company.accountNumber || '',
                ifscCode: metrics.company.ifscCode || '',
                branchName: metrics.company.branchName || ''
            });
        }
    }, [metrics, user]);

    // HANDLERS
    const onCompanySubmit = async () => {
        if (!metrics?.company?._id) return toast.error("Company Reference Missing");
        await handleUpdateCompany({
            companyId: metrics.company._id,
            ...companyProfile
        });
    };

    const onAdminSubmit = async () => {
        await handleUpdateAdminProfile(adminProfile);
    };

    const onAdminPasswordSubmit = async () => {
        if (!passChange.current || !passChange.new) {
            return toast.error("Both password fields are required");
        }
        const success = await handleAdminPasswordChange(passChange.current, passChange.new);
        if (success) {
            setPassChange({ current: '', new: '' });
        }
    };

    return (
        <div className="p-6 lg:p-12 min-h-screen bg-[#070707] text-white font-sans transition-all">
            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Root Administrator Mode</span>
                        </div>
                        <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none text-white">Terminal Control</h1>
                    </div>
                    <div className="px-6 py-3 bg-zinc-900/50 border border-white/5 rounded-2xl flex items-center gap-4">
                        <Activity className="text-indigo-500" size={20} />
                        <div>
                            <p className="text-[9px] font-black text-zinc-500 uppercase">System Status</p>
                            <p className="text-xs font-bold font-mono text-emerald-500 uppercase">{adminLoading ? 'Syncing...' : '99.9% Optimal'}</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <div className="lg:col-span-8 space-y-8">

                        {/* 1. GLOBAL COMPANY PROTOCOL */}
                        <section className="bg-[#111111] border border-white/5 rounded-[40px] p-10 shadow-2xl">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-4 bg-indigo-500/10 rounded-3xl text-indigo-500"><Building2 size={28} /></div>
                                <div>
                                    <h2 className="text-lg font-black uppercase tracking-widest italic">Company Protocol</h2>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Global Branding & Legal Identity</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Entity Name</label>
                                        <input type="text" value={companyProfile.companyName} onChange={(e) => setCompanyProfile({ ...companyProfile, companyName: e.target.value })} className="w-full py-4 px-6 bg-black border border-white/5 rounded-2xl text-sm font-bold focus:border-indigo-500/50 outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">GST Identification</label>
                                        <input type="text" value={companyProfile.gstNumber} onChange={(e) => setCompanyProfile({ ...companyProfile, gstNumber: e.target.value })} className="w-full py-4 px-6 bg-black border border-white/5 rounded-2xl text-sm font-bold focus:border-indigo-500/50 outline-none" />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                        <Landmark size={14} /> Settlement Bank Credentials
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <input type="text" placeholder="Bank Name" value={companyProfile.bankName} onChange={(e) => setCompanyProfile({ ...companyProfile, bankName: e.target.value })} className="w-full py-4 px-6 bg-black border border-white/5 rounded-2xl text-sm font-bold focus:border-indigo-500/50 outline-none" />
                                        <input type="text" placeholder="Account Number" value={companyProfile.accountNumber} onChange={(e) => setCompanyProfile({ ...companyProfile, accountNumber: e.target.value })} className="w-full py-4 px-6 bg-black border border-white/5 rounded-2xl text-sm font-bold focus:border-indigo-500/50 outline-none" />
                                        <input type="text" placeholder="IFSC Code" value={companyProfile.ifscCode} onChange={(e) => setCompanyProfile({ ...companyProfile, ifscCode: e.target.value })} className="w-full py-4 px-6 bg-black border border-white/5 rounded-2xl text-sm font-bold focus:border-indigo-500/50 outline-none" />
                                        <input type="text" placeholder="Branch Name" value={companyProfile.branchName} onChange={(e) => setCompanyProfile({ ...companyProfile, branchName: e.target.value })} className="w-full py-4 px-6 bg-black border border-white/5 rounded-2xl text-sm font-bold focus:border-indigo-500/50 outline-none" />
                                    </div>
                                </div>

                                <button onClick={onCompanySubmit} disabled={adminLoading} className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all flex justify-center shadow-lg shadow-indigo-600/10">
                                    {adminLoading ? 'Processing Trace...' : 'Commit Global Changes'}
                                </button>
                            </div>
                        </section>

                        {/* 2. ADMIN PERSONNEL SYNC */}
                        <section className="bg-[#111111] border border-white/5 rounded-[40px] p-10">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-4 bg-emerald-500/10 rounded-3xl text-emerald-500"><User size={28} /></div>
                                <h2 className="text-lg font-black uppercase tracking-widest italic">Admin Identity</h2>
                            </div>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="First Name" value={adminProfile.firstName} onChange={(e) => setAdminProfile({ ...adminProfile, firstName: e.target.value })} className="w-full py-4 px-6 bg-black border border-white/5 rounded-2xl text-sm font-bold focus:border-emerald-500/30 outline-none" />
                                    <input type="text" placeholder="Last Name" value={adminProfile.lastName} onChange={(e) => setAdminProfile({ ...adminProfile, lastName: e.target.value })} className="w-full py-4 px-6 bg-black border border-white/5 rounded-2xl text-sm font-bold focus:border-emerald-500/30 outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Phone" value={adminProfile.phoneNo} onChange={(e) => setAdminProfile({ ...adminProfile, phoneNo: e.target.value })} className="w-full py-4 px-6 bg-black border border-white/5 rounded-2xl text-sm font-bold focus:border-emerald-500/30 outline-none" />
                                    <input type="email" placeholder="Email" value={adminProfile.email} onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })} className="w-full py-4 px-6 bg-black border border-white/5 rounded-2xl text-sm font-bold focus:border-emerald-500/30 outline-none" />
                                </div>
                                <button onClick={onAdminSubmit} disabled={adminLoading} className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">
                                    {adminLoading ? 'Updating Profile...' : 'Synchronize Profile'}
                                </button>
                            </div>
                        </section>

                        {/* 3. MASTER SECURITY PROTOCOL */}
                        <section className="bg-[#111111] border border-white/5 rounded-[40px] p-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-rose-500/10 rounded-3xl text-rose-500"><Lock size={28} /></div>
                                <h2 className="text-lg font-black uppercase tracking-widest italic text-rose-500">Master Access Key</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="password"
                                        placeholder="Current Master Key"
                                        value={passChange.current}
                                        className="w-full py-4 px-6 bg-black border border-white/5 rounded-2xl text-sm font-bold focus:border-rose-500/50 outline-none"
                                        onChange={(e) => setPassChange({ ...passChange, current: e.target.value })}
                                    />
                                    <input
                                        type="password"
                                        placeholder="New Secure Key"
                                        value={passChange.new}
                                        className="w-full py-4 px-6 bg-black border border-white/5 rounded-2xl text-sm font-bold focus:border-rose-500/50 outline-none"
                                        onChange={(e) => setPassChange({ ...passChange, new: e.target.value })}
                                    />
                                </div>
                                <button
                                    onClick={onAdminPasswordSubmit}
                                    disabled={adminLoading}
                                    className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-rose-900/20"
                                >
                                    {adminLoading ? 'Updating Key...' : 'Update Master Credentials'}
                                </button>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-4 space-y-8">
                        <section className="bg-[#111111] border border-white/5 rounded-[40px] p-8">
                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2"><Lock size={14} className="text-rose-500" /> Overrides</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-5 bg-black rounded-3xl border border-white/5">
                                    <div>
                                        <p className="text-[10px] font-black uppercase">Maintenance Mode</p>
                                        <p className="text-[8px] text-zinc-600 uppercase mt-1">Lock all employee access</p>
                                    </div>
                                    <button onClick={() => setIsMaintenanceMode(!isMaintenanceMode)} className={`w-12 h-6 rounded-full relative transition-colors ${isMaintenanceMode ? 'bg-rose-600' : 'bg-zinc-800'}`}>
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isMaintenanceMode ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </section>

                        <section className="bg-zinc-900/30 border border-white/5 p-8 rounded-[32px] group hover:border-indigo-500/20 transition-all">
                            <Terminal className="text-zinc-600 mb-4 group-hover:text-indigo-500 transition-colors" size={32} />
                            <h3 className="text-xs font-black uppercase tracking-widest mb-2">Audit Trace</h3>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase leading-relaxed mb-6">Track every terminal modification across Mansi Roadways.</p>
                            <button className="text-[10px] font-black uppercase text-indigo-500 border-b border-indigo-500/20 pb-1 hover:text-indigo-400">Open Logs</button>
                        </section>

                        <div className="p-8 bg-rose-500/5 border border-dashed border-rose-500/20 rounded-[40px] flex flex-col items-center text-center gap-4">
                            <ShieldCheck className="text-rose-500" size={40} />
                            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-relaxed">
                                Caution: Root Admin Access. All actions are logged for audit compliance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsPage;