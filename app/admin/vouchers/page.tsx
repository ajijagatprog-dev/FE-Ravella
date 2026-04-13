"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Tag, X, Loader2, CheckCircle2, AlertCircle, ToggleLeft, ToggleRight } from "lucide-react";
import api from "@/lib/axios";

const JOST = "'Jost', system-ui, sans-serif";

const emptyForm = {
    code: "",
    description: "",
    type: "percent" as "percent" | "fixed",
    value: "",
    min_purchase: "",
    max_discount: "",
    max_uses: "",
    is_active: true,
    expires_at: "",
};

export default function VouchersPage() {
    const [vouchers, setVouchers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState({ ...emptyForm });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const formatPrice = (p: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

    const fetchVouchers = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/vouchers");
            if (res.data.status === "success") setVouchers(res.data.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchVouchers(); }, []);

    const openCreate = () => {
        setForm({ ...emptyForm });
        setEditingId(null);
        setError("");
        setShowModal(true);
    };

    const openEdit = (v: any) => {
        setForm({
            code: v.code,
            description: v.description || "",
            type: v.type,
            value: v.value ? parseFloat(v.value).toString() : "",
            min_purchase: v.min_purchase ? parseFloat(v.min_purchase).toString() : "",
            max_discount: v.max_discount ? parseFloat(v.max_discount).toString() : "",
            max_uses: v.max_uses ? String(v.max_uses) : "",
            is_active: v.is_active,
            expires_at: v.expires_at ? v.expires_at.split("T")[0] : "",
        });
        setEditingId(v.id);
        setError("");
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        try {
            const payload: any = {
                code: form.code.toUpperCase(),
                description: form.description,
                type: form.type,
                value: parseFloat(form.value),
                is_active: form.is_active,
            };
            if (form.min_purchase) payload.min_purchase = parseFloat(form.min_purchase);
            if (form.max_discount) payload.max_discount = parseFloat(form.max_discount);
            if (form.max_uses) payload.max_uses = parseInt(form.max_uses);
            if (form.expires_at) payload.expires_at = form.expires_at;

            if (editingId) {
                await api.put(`/admin/vouchers/${editingId}`, payload);
                setSuccessMsg("Voucher berhasil diperbarui!");
            } else {
                await api.post("/admin/vouchers", payload);
                setSuccessMsg("Voucher berhasil dibuat!");
            }
            setShowModal(false);
            fetchVouchers();
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Terjadi kesalahan. Coba lagi.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number, code: string) => {
        if (!confirm(`Hapus voucher "${code}"? Tindakan ini tidak bisa dibatalkan.`)) return;
        try {
            await api.delete(`/admin/vouchers/${id}`);
            setSuccessMsg("Voucher berhasil dihapus!");
            fetchVouchers();
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (e) {
            alert("Gagal menghapus voucher.");
        }
    };

    const handleToggleActive = async (v: any) => {
        try {
            await api.put(`/admin/vouchers/${v.id}`, { is_active: !v.is_active });
            fetchVouchers();
        } catch (e) {
            alert("Gagal mengubah status voucher.");
        }
    };

    const isExpired = (expires_at: string | null) => {
        if (!expires_at) return false;
        return new Date(expires_at) < new Date();
    };

    return (
        <div className="p-6" style={{ fontFamily: JOST }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900">Manajemen Voucher</h1>
                    <p className="text-stone-500 text-sm mt-1">Kelola kode voucher diskon untuk pelanggan</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-black transition-colors"
                >
                    <Plus className="w-4 h-4" /> Buat Voucher
                </button>
            </div>

            {/* Success notice */}
            {successMsg && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 mb-6 text-sm">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    {successMsg}
                </div>
            )}

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-stone-400" /></div>
            ) : vouchers.length === 0 ? (
                <div className="bg-white border border-stone-100 py-20 text-center">
                    <Tag className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                    <p className="text-stone-500 text-sm">Belum ada voucher. Buat voucher pertama!</p>
                    <button onClick={openCreate} className="mt-4 text-stone-900 text-sm font-medium underline">Buat sekarang</button>
                </div>
            ) : (
                <div className="bg-white border border-stone-100 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-stone-100 text-[11px] uppercase tracking-wider text-stone-500">
                                <th className="px-5 py-4 text-left font-medium">Kode</th>
                                <th className="px-5 py-4 text-left font-medium">Deskripsi</th>
                                <th className="px-5 py-4 text-left font-medium">Tipe / Nilai</th>
                                <th className="px-5 py-4 text-left font-medium">Min. Belanja</th>
                                <th className="px-5 py-4 text-left font-medium">Penggunaan</th>
                                <th className="px-5 py-4 text-left font-medium">Kedaluwarsa</th>
                                <th className="px-5 py-4 text-left font-medium">Status</th>
                                <th className="px-5 py-4 text-right font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                            {vouchers.map((v) => {
                                const expired = isExpired(v.expires_at);
                                return (
                                    <tr key={v.id} className="hover:bg-stone-50 transition-colors">
                                        <td className="px-5 py-4">
                                            <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 text-xs">{v.code}</span>
                                        </td>
                                        <td className="px-5 py-4 text-stone-600">{v.description || <span className="text-stone-300">—</span>}</td>
                                        <td className="px-5 py-4 font-medium text-stone-800">
                                            {v.type === 'percent' ? `${parseFloat(v.value)}%` : formatPrice(v.value)}
                                            {v.max_discount && v.type === 'percent' && (
                                                <span className="text-[11px] text-stone-400 block">maks. {formatPrice(v.max_discount)}</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-stone-600">
                                            {parseFloat(v.min_purchase) > 0 ? formatPrice(v.min_purchase) : <span className="text-stone-300">—</span>}
                                        </td>
                                        <td className="px-5 py-4 text-stone-600">
                                            {v.used_count}{v.max_uses ? ` / ${v.max_uses}` : ''}
                                        </td>
                                        <td className="px-5 py-4">
                                            {v.expires_at ? (
                                                <span className={`text-xs ${expired ? 'text-red-500' : 'text-stone-600'}`}>
                                                    {new Date(v.expires_at).toLocaleDateString('id-ID')}
                                                    {expired && ' (Habis)'}
                                                </span>
                                            ) : <span className="text-stone-300">—</span>}
                                        </td>
                                        <td className="px-5 py-4">
                                            <button onClick={() => handleToggleActive(v)} className="flex items-center gap-1.5 text-xs">
                                                {v.is_active ? (
                                                    <><ToggleRight className="w-5 h-5 text-green-600" /><span className="text-green-600 font-medium">Aktif</span></>
                                                ) : (
                                                    <><ToggleLeft className="w-5 h-5 text-stone-400" /><span className="text-stone-400">Nonaktif</span></>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEdit(v)} className="p-1.5 text-stone-500 hover:text-stone-900 transition-colors">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(v.id, v.code)} className="p-1.5 text-stone-400 hover:text-red-600 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg shadow-2xl" style={{ fontFamily: JOST }}>
                        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
                            <h2 className="text-base font-bold text-stone-900 uppercase tracking-wide">
                                {editingId ? 'Edit Voucher' : 'Buat Voucher Baru'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-900">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && (
                                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-medium mb-1">Kode Voucher *</label>
                                    <input required value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                        placeholder="WELCOMERAVELLA" className="w-full border border-stone-200 px-3 py-2 text-sm font-mono uppercase bg-white text-stone-900 focus:outline-none focus:border-stone-900" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-medium mb-1">Deskripsi</label>
                                    <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                                        placeholder="Diskon 10% untuk pelanggan baru" className="w-full border border-stone-200 px-3 py-2 text-sm bg-white text-stone-900 focus:outline-none focus:border-stone-900" />
                                </div>
                                <div>
                                    <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-medium mb-1">Tipe *</label>
                                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })}
                                        className="w-full border border-stone-200 px-3 py-2 text-sm bg-white text-stone-900 focus:outline-none focus:border-stone-900">
                                        <option value="percent">Persen (%)</option>
                                        <option value="fixed">Nominal (Rp)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-medium mb-1">
                                        Nilai * {form.type === 'percent' ? '(%)' : '(Rp)'}
                                    </label>
                                    <input required type="number" min="0" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })}
                                        placeholder={form.type === 'percent' ? "10" : "50000"} className="w-full border border-stone-200 px-3 py-2 text-sm bg-white text-stone-900 focus:outline-none focus:border-stone-900" />
                                </div>
                                <div>
                                    <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-medium mb-1">Min. Belanja (Rp)</label>
                                    <input type="number" min="0" value={form.min_purchase} onChange={e => setForm({ ...form, min_purchase: e.target.value })}
                                        placeholder="100000" className="w-full border border-stone-200 px-3 py-2 text-sm bg-white text-stone-900 focus:outline-none focus:border-stone-900" />
                                </div>
                                {form.type === 'percent' && (
                                    <div>
                                        <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-medium mb-1">Maks. Diskon (Rp)</label>
                                        <input type="number" min="0" value={form.max_discount} onChange={e => setForm({ ...form, max_discount: e.target.value })}
                                            placeholder="50000" className="w-full border border-stone-200 px-3 py-2 text-sm bg-white text-stone-900 focus:outline-none focus:border-stone-900" />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-medium mb-1">Maks. Penggunaan</label>
                                    <input type="number" min="1" value={form.max_uses} onChange={e => setForm({ ...form, max_uses: e.target.value })}
                                        placeholder="Kosong = tidak terbatas" className="w-full border border-stone-200 px-3 py-2 text-sm bg-white text-stone-900 focus:outline-none focus:border-stone-900" />
                                </div>
                                <div>
                                    <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-medium mb-1">Kedaluwarsa</label>
                                    <input type="date" value={form.expires_at} onChange={e => setForm({ ...form, expires_at: e.target.value })}
                                        className="w-full border border-stone-200 px-3 py-2 text-sm bg-white text-stone-900 focus:outline-none focus:border-stone-900" />
                                </div>
                                <div className="col-span-2 flex items-center gap-3">
                                    <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })}
                                        className="w-4 h-4 accent-stone-900" />
                                    <label htmlFor="is_active" className="text-sm text-stone-700 font-medium">Voucher Aktif</label>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 border border-stone-200 text-stone-600 text-sm hover:bg-stone-50 transition-colors">
                                    Batal
                                </button>
                                <button type="submit" disabled={submitting}
                                    className="px-5 py-2.5 bg-stone-900 text-white text-sm font-medium hover:bg-black disabled:bg-stone-400 transition-colors flex items-center gap-2">
                                    {submitting && <Loader2 className="w-3 h-3 animate-spin" />}
                                    {editingId ? 'Simpan Perubahan' : 'Buat Voucher'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
