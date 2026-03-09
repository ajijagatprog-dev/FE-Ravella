"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Camera, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import toast from "react-hot-toast";

interface UserProfile {
    name: string;
    email: string;
    phone_number?: string;
    address?: string;
    company_name?: string;
    role: string;
}

interface ProfilePageProps {
    role: "admin" | "b2b" | "customer";
    backUrl: string;
}

export default function ProfilePageBase({ role, backUrl }: ProfilePageProps) {
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/auth/me');
                if (res.data?.status === 'success') {
                    setUserData(res.data.data.user);
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
                toast.error("Gagal memuat profil");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userData) return;

        setIsSaving(true);
        try {
            const res = await api.put('/customer/profile', {
                name: userData.name,
                phone_number: userData.phone_number,
                address: userData.address
            });

            if (res.data?.status === 'success') {
                setUserData(res.data.data);
                toast.success("Profil berhasil diperbarui!");
                // Trigger profile update event for header
                window.dispatchEvent(new Event('profileUpdated'));
            }
        } catch (err) {
            console.error("Failed to update profile", err);
            toast.error("Gagal memperbarui profil");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Standardize "Super Admin" to "Admin"
    const displayName = userData?.name === 'Super Admin' ? 'Admin' : (userData?.name || "User");
    const userInitial = displayName.charAt(0).toUpperCase();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
                    <p className="text-gray-500 text-sm mt-1">Kelola informasi profil dan pengaturan akun Anda</p>
                </div>
                <Link
                    href={backUrl}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Kembali ke Dashboard
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
                        <div className="relative inline-block">
                            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg mx-auto">
                                {userInitial}
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                                <Camera size={14} className="text-gray-600" />
                            </button>
                        </div>
                        <h2 className="mt-4 text-lg font-bold text-gray-900">{displayName}</h2>
                        <p className="text-sm text-gray-500 font-medium capitalize">
                            Admin
                        </p>

                        <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                            {role === 'b2b' && userData?.company_name && (
                                <div className="flex items-center gap-3 text-sm text-gray-600 justify-center">
                                    <span className="font-semibold text-gray-900">{userData.company_name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">Informasi Pribadi</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={userData?.name || ''}
                                            onChange={(e) => setUserData(prev => prev ? { ...prev, name: e.target.value } : null)}
                                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-sm text-gray-900 font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Email</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            value={userData?.email || ''}
                                            disabled
                                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 text-sm cursor-not-allowed font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Nomor Telepon</label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={userData?.phone_number || ''}
                                            onChange={(e) => setUserData(prev => prev ? { ...prev, phone_number: e.target.value } : null)}
                                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-sm text-gray-900 font-medium"
                                        />
                                    </div>
                                </div>
                                {role === 'b2b' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Nama Perusahaan</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={userData?.company_name || ''}
                                                disabled
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 text-sm cursor-not-allowed font-medium"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Alamat</label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                                    <textarea
                                        rows={3}
                                        value={userData?.address || ''}
                                        onChange={(e) => setUserData(prev => prev ? { ...prev, address: e.target.value } : null)}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-sm text-gray-900 font-medium"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Save size={16} />
                                )}
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
