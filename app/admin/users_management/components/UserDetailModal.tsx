"use client";

import { useState, useEffect } from "react";
import { X, Mail, Phone, Building, MapPin, FileText, Star, ShoppingBag, Package, Calendar, Loader2 } from "lucide-react";
import api from "@/lib/axios";

interface UserDetailData {
    user: {
        id: number;
        name: string;
        email: string;
        phone_number: string | null;
        role: string;
        company_name: string | null;
        npwp: string | null;
        b2b_status: string | null;
        address: string | null;
        loyalty_points: number;
        created_at: string;
    };
    stats: {
        total_orders: number;
        total_spent: number;
    };
    recent_orders: {
        id: number;
        order_number: string;
        total_amount: number;
        status: string;
        payment_method: string | null;
        created_at: string;
        items_count: number;
    }[];
}

interface UserDetailModalProps {
    userId: number | null;
    isOpen: boolean;
    onClose: () => void;
    onAction?: (userId: number, action: string) => void;
}

const ORDER_STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
    PROCESSING: "bg-blue-50 text-blue-700 ring-blue-200",
    SHIPPED: "bg-purple-50 text-purple-700 ring-purple-200",
    DELIVERED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    CANCELLED: "bg-red-50 text-red-700 ring-red-200",
};

const B2B_STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: "bg-amber-100", text: "text-amber-700", label: "Pending Review" },
    approved: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Approved" },
    rejected: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
};

export default function UserDetailModal({ userId, isOpen, onClose, onAction }: UserDetailModalProps) {
    const [data, setData] = useState<UserDetailData | null>(null);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && userId) {
            setLoading(true);
            setData(null);
            api.get(`/admin/users/${userId}`)
                .then(res => {
                    if (res.data.status === 'success') setData(res.data.data);
                })
                .catch(err => console.error("Failed to load user detail", err))
                .finally(() => setLoading(false));
        }
    }, [isOpen, userId]);

    const handleAction = async (action: string) => {
        if (!userId) return;
        setActionLoading(action);
        try {
            onAction?.(userId, action);
            // Refresh data
            const res = await api.get(`/admin/users/${userId}`);
            if (res.data.status === 'success') setData(res.data.data);
        } catch (err) {
            console.error("Action failed", err);
        } finally {
            setActionLoading(null);
        }
    };

    if (!isOpen) return null;

    const user = data?.user;
    const isB2B = user?.role === 'b2b';
    const isPending = isB2B && user?.b2b_status === 'pending';
    const isRejected = isB2B && user?.b2b_status === 'rejected';

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200"
                    onClick={(e) => e.stopPropagation()}
                    style={{ animation: "modalIn 0.25s ease-out" }}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        <X size={16} />
                    </button>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <Loader2 size={28} className="animate-spin text-blue-500" />
                            <p className="text-sm text-slate-400">Loading user details...</p>
                        </div>
                    ) : data ? (
                        <>
                            {/* Header */}
                            <div className={`px-6 pt-6 pb-5 border-b border-slate-100 ${isB2B ? "bg-gradient-to-r from-blue-50 to-violet-50" : "bg-gradient-to-r from-emerald-50 to-teal-50"}`}>
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0 ${isB2B ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
                                        {user?.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${isB2B ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
                                                {isB2B ? "B2B Partner" : "Retail Customer"}
                                            </span>
                                            {isB2B && user?.b2b_status && (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${B2B_STATUS_COLORS[user.b2b_status]?.bg} ${B2B_STATUS_COLORS[user.b2b_status]?.text}`}>
                                                    {B2B_STATUS_COLORS[user.b2b_status]?.label}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500 mt-0.5">Member since {user?.created_at}</p>
                                    </div>
                                </div>

                                {/* B2B Approval Actions */}
                                {(isPending || isRejected) && (
                                    <div className="mt-4 flex items-center gap-2">
                                        <button
                                            onClick={() => handleAction('approve')}
                                            disabled={actionLoading === 'approve'}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                        >
                                            {actionLoading === 'approve' ? <Loader2 size={14} className="animate-spin" /> : null}
                                            {isPending ? "Approve B2B" : "Re-activate"}
                                        </button>
                                        {isPending && (
                                            <button
                                                onClick={() => handleAction('reject')}
                                                disabled={actionLoading === 'reject'}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors"
                                            >
                                                {actionLoading === 'reject' ? <Loader2 size={14} className="animate-spin" /> : null}
                                                Reject
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Stats Summary */}
                            <div className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-slate-800">{data.stats.total_orders}</p>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">Total Orders</p>
                                </div>
                                <div className="text-center border-x border-slate-200">
                                    <p className="text-2xl font-bold text-slate-800">
                                        Rp {new Intl.NumberFormat("id-ID").format(data.stats.total_spent)}
                                    </p>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">Total Spent</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-slate-800">{user?.loyalty_points ?? 0}</p>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">Loyalty Points</p>
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="px-6 py-5 space-y-4 border-b border-slate-100">
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Profile Information</h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <InfoRow icon={<Mail size={14} />} label="Email" value={user?.email ?? "—"} />
                                    <InfoRow icon={<Phone size={14} />} label="Phone" value={user?.phone_number ?? "—"} />
                                    {isB2B && (
                                        <>
                                            <InfoRow icon={<Building size={14} />} label="Company" value={user?.company_name ?? "—"} />
                                            <InfoRow icon={<FileText size={14} />} label="NPWP" value={user?.npwp ?? "—"} />
                                        </>
                                    )}
                                    <InfoRow icon={<MapPin size={14} />} label="Address" value={user?.address ?? "—"} className="sm:col-span-2" />
                                    <InfoRow icon={<Star size={14} />} label="Loyalty Points" value={`${user?.loyalty_points ?? 0} pts`} />
                                    <InfoRow icon={<Calendar size={14} />} label="Registered" value={user?.created_at ?? "—"} />
                                </div>
                            </div>

                            {/* Recent Orders */}
                            <div className="px-6 py-5">
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
                                    Recent Orders ({data.recent_orders.length})
                                </h3>

                                {data.recent_orders.length === 0 ? (
                                    <div className="text-center py-8 text-slate-400">
                                        <ShoppingBag size={24} className="mx-auto mb-2 opacity-50" />
                                        <p className="text-sm font-medium">No orders yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {data.recent_orders.map(order => (
                                            <div
                                                key={order.id}
                                                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                                        <Package size={16} className="text-slate-400" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-slate-700 truncate">{order.order_number}</p>
                                                        <p className="text-xs text-slate-400">{order.created_at} · {order.items_count} item(s)</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 shrink-0">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ring-1 ${ORDER_STATUS_COLORS[order.status] ?? "bg-slate-100 text-slate-600 ring-slate-200"}`}>
                                                        {order.status}
                                                    </span>
                                                    <p className="text-sm font-bold text-slate-800 whitespace-nowrap">
                                                        Rp {new Intl.NumberFormat("id-ID").format(order.total_amount)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="py-20 text-center text-slate-400">
                            <p className="text-sm">Failed to load user details</p>
                        </div>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}} />
        </>
    );
}

function InfoRow({ icon, label, value, className = "" }: { icon: React.ReactNode; label: string; value: string; className?: string }) {
    return (
        <div className={`flex items-start gap-2.5 ${className}`}>
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm text-slate-700 font-medium truncate">{value}</p>
            </div>
        </div>
    );
}
