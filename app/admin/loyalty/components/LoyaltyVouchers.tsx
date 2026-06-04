"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Tag,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Coins,
} from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

const emptyForm = {
  code: "",
  value: "",
  min_purchase: "",
  max_uses: "",
  max_per_user: "1", // default 1 for loyalty
  is_active: true,
  starts_at: "",
  expires_at: "",
};

export default function LoyaltyVouchers() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [redemptionValue, setRedemptionValue] = useState(5);
  const [showConfirm, setShowConfirm] = useState<{
    id: number;
    code: string;
  } | null>(null);

  const formatPrice = (p: any) => {
    const num = typeof p === "string" ? parseFloat(p) : p;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num || 0);
  };

  const fetchSettingsAndVouchers = async () => {
    setLoading(true);
    try {
      // Get redemption value for points calculation
      const settingsRes = await api.get("/admin/loyalty/settings");
      if (settingsRes.data.status === "success") {
        setRedemptionValue(
          parseInt(settingsRes.data.data.redemption_value) || 5,
        );
      }

      // Get loyalty vouchers (is_loyalty = 1)
      const res = await api.get("/admin/vouchers?is_loyalty=1");
      if (res.data.status === "success") setVouchers(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettingsAndVouchers();
  }, []);

  const openCreate = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setError("");
    setShowModal(true);
  };

  const openEdit = (v: any) => {
    const parseDate = (d: any) => {
      if (!d) return "";
      try {
        return new Date(d).toISOString().split("T")[0];
      } catch {
        return "";
      }
    };

    setForm({
      code: v.code,
      value: v.value ? parseFloat(v.value).toString() : "",
      min_purchase: v.min_purchase ? parseFloat(v.min_purchase).toString() : "",
      max_uses: v.max_uses ? String(v.max_uses) : "",
      max_per_user: v.max_per_user ? String(v.max_per_user) : "1",
      is_active: !!v.is_active,
      starts_at: parseDate(v.starts_at),
      expires_at: parseDate(v.expires_at),
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
        type: "fixed",
        value: parseFloat(form.value),
        is_active: form.is_active,
        is_loyalty: true, // Mark as loyalty voucher reward
      };
      if (form.min_purchase)
        payload.min_purchase = parseFloat(form.min_purchase);
      if (form.max_uses) payload.max_uses = parseInt(form.max_uses) || null;
      if (form.starts_at) payload.starts_at = form.starts_at;
      if (form.expires_at) payload.expires_at = form.expires_at;
      if (form.max_per_user)
        payload.max_per_user = parseInt(form.max_per_user) || null;

      if (editingId) {
        await api.put(`/admin/vouchers/${editingId}`, payload);
        toast.success("Voucher Loyalty berhasil diperbarui!");
      } else {
        await api.post("/admin/vouchers", payload);
        toast.success("Voucher Loyalty berhasil dibuat!");
      }
      setShowModal(false);
      fetchSettingsAndVouchers();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, code: string) => {
    setShowConfirm({ id, code });
  };

  const confirmDelete = async () => {
    if (!showConfirm) return;
    const { id } = showConfirm;
    try {
      await api.delete(`/admin/vouchers/${id}`);
      toast.success("Voucher Loyalty berhasil dihapus!");
      setShowConfirm(null);
      fetchSettingsAndVouchers();
    } catch (e) {
      toast.error("Gagal menghapus voucher.");
      setShowConfirm(null);
    }
  };

  const handleToggleActive = async (v: any) => {
    try {
      await api.put(`/admin/vouchers/${v.id}`, { is_active: !v.is_active });
      fetchSettingsAndVouchers();
      toast.success("Status voucher berhasil diperbarui!");
    } catch (e) {
      toast.error("Gagal mengubah status voucher.");
    }
  };

  const calculatePointsNeeded = (value: number) => {
    if (redemptionValue <= 0) return 0;
    return Math.ceil(value / redemptionValue);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Hadiah Voucher Loyalty
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar voucher diskon belanja yang dapat ditukarkan customer
            menggunakan poin loyalty
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 bg-stone-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-black transition-colors"
        >
          <Plus size={16} />
          <span>Buat Voucher Loyalty</span>
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
        </div>
      ) : vouchers.length === 0 ? (
        <div className="border border-slate-100 rounded-xl py-12 text-center bg-slate-50/50">
          <Tag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Belum ada voucher loyalty.</p>
          <button
            onClick={openCreate}
            className="mt-2 text-stone-900 text-xs font-semibold underline"
          >
            Buat voucher loyalty sekarang
          </button>
        </div>
      ) : (
        <div className="border border-slate-100 rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50">
              <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                <th className="px-4 py-3 text-left font-bold">Kode Voucher</th>
                <th className="px-4 py-3 text-left font-bold">
                  Potongan Belanja
                </th>
                <th className="px-4 py-3 text-left font-bold">Biaya Poin</th>
                <th className="px-4 py-3 text-left font-bold">Min. Belanja</th>
                <th className="px-4 py-3 text-left font-bold">Kuota Voucher</th>
                <th className="px-4 py-3 text-left font-bold">
                  Maks. Klaim/User
                </th>
                <th className="px-4 py-3 text-left font-bold">Masa Berlaku</th>
                <th className="px-4 py-3 text-left font-bold">Status</th>
                <th className="px-4 py-3 text-right font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vouchers.map((v) => {
                const pointsNeeded = calculatePointsNeeded(parseFloat(v.value));
                return (
                  <tr
                    key={v.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded text-xs">
                        {v.code}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-stone-800">
                      {formatPrice(v.value)}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-emerald-600">
                      <div className="flex items-center gap-1.5">
                        <Coins size={14} className="text-emerald-500" />
                        <span>{pointsNeeded.toLocaleString()} pts</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-stone-600">
                      {v.min_purchase && parseFloat(v.min_purchase) > 0 ? (
                        formatPrice(v.min_purchase)
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-stone-600">
                      <span className="font-medium">{v.max_uses || "∞"}</span>
                      <span className="text-[10px] text-slate-400 block">
                        Terpakai: {v.used_count || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-stone-600">
                      {v.max_per_user ? (
                        <span className="font-medium">{v.max_per_user}x</span>
                      ) : (
                        <span className="text-slate-300">∞</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-stone-600 text-xs">
                      {v.expires_at ? (
                        <span>
                          s.d.{" "}
                          {new Date(v.expires_at).toLocaleDateString("id-ID")}
                        </span>
                      ) : (
                        <span className="text-slate-300">∞</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(v)}
                        className="flex items-center gap-2 group cursor-pointer"
                      >
                        <div
                          className={`relative w-8 h-4.5 rounded-full transition-colors duration-200 ${
                            v.is_active ? "bg-green-600" : "bg-stone-200"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full transition-transform duration-200 ${
                              v.is_active ? "translate-x-3.5" : "translate-x-0"
                            }`}
                          />
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            v.is_active
                              ? "text-green-600"
                              : "text-stone-400 opacity-60"
                          }`}
                        >
                          {v.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(v)}
                          className="p-1 text-stone-500 hover:text-stone-900 transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id, v.code)}
                          className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={15} />
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

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg shadow-2xl rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
              <h2 className="text-base font-bold text-stone-900 uppercase tracking-wide">
                {editingId ? "Edit Voucher Loyalty" : "Buat Voucher Loyalty"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-900"
              >
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm rounded-lg">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-1">
                    Kode Voucher *
                  </label>
                  <input
                    required
                    value={form.code}
                    onChange={(e) =>
                      setForm({ ...form, code: e.target.value.toUpperCase() })
                    }
                    placeholder="DISKONLOYALTY50"
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm font-mono uppercase bg-stone-50 text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-1">
                    Nominal Potongan (Rp) *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.value}
                    onChange={(e) =>
                      setForm({ ...form, value: e.target.value })
                    }
                    placeholder="50000"
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white text-stone-900 focus:outline-none focus:border-stone-900 font-semibold"
                  />
                  {form.value && (
                    <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                      Biaya Poin:{" "}
                      {calculatePointsNeeded(
                        parseFloat(form.value),
                      ).toLocaleString()}{" "}
                      pts
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-1">
                    Minimal Belanja (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.min_purchase}
                    onChange={(e) =>
                      setForm({ ...form, min_purchase: e.target.value })
                    }
                    placeholder="100000"
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-1">
                    Kuota Total Voucher
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.max_uses}
                    onChange={(e) =>
                      setForm({ ...form, max_uses: e.target.value })
                    }
                    placeholder="Kosong = tidak terbatas"
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-1">
                    Maksimal Klaim per Buyer
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.max_per_user}
                    onChange={(e) =>
                      setForm({ ...form, max_per_user: e.target.value })
                    }
                    placeholder="Kosong = tidak terbatas"
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div className="col-span-2 bg-stone-50 p-4 border border-stone-100 rounded-xl">
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-3">
                    Masa Berlaku Voucher
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-tight mb-1">
                        Mulai Aktif
                      </label>
                      <input
                        type="date"
                        value={form.starts_at}
                        onChange={(e) =>
                          setForm({ ...form, starts_at: e.target.value })
                        }
                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white text-stone-900 focus:outline-none focus:border-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-tight mb-1">
                        Kadaluarsa
                      </label>
                      <input
                        type="date"
                        value={form.expires_at}
                        onChange={(e) =>
                          setForm({ ...form, expires_at: e.target.value })
                        }
                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white text-stone-900 focus:outline-none focus:border-stone-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-2 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={form.is_active}
                    onChange={(e) =>
                      setForm({ ...form, is_active: e.target.checked })
                    }
                    className="w-4 h-4 accent-stone-900 rounded"
                  />
                  <label
                    htmlFor="is_active"
                    className="text-sm text-stone-700 font-medium select-none"
                  >
                    Aktifkan Voucher
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-stone-200 text-stone-600 text-sm hover:bg-stone-50 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-stone-900 text-white text-sm font-semibold rounded-xl hover:bg-black disabled:bg-stone-400 transition-colors flex items-center gap-2"
                >
                  {submitting && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  <span>{editingId ? "Simpan Perubahan" : "Buat Voucher"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm shadow-2xl rounded-3xl overflow-hidden border border-stone-100">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 uppercase tracking-wide">
                Hapus Voucher?
              </h3>
              <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                Anda akan menghapus voucher loyalty{" "}
                <span className="font-bold text-stone-900">
                  {showConfirm.code}
                </span>
                . Tindakan ini bersifat permanen.
              </p>

              <div className="grid grid-cols-2 gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowConfirm(null)}
                  className="px-5 py-3 border border-stone-200 rounded-xl text-stone-600 text-xs font-bold uppercase tracking-widest hover:bg-stone-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="px-5 py-3 bg-red-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-700 rounded-xl transition-colors shadow-lg shadow-red-200"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
