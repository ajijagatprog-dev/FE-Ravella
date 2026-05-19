"use client";

import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Zap,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Upload,
  FileSpreadsheet,
  Percent,
  Calendar,
} from "lucide-react";
import api from "@/lib/axios";

const emptyForm = {
  sku: "",
  name: "",
  discount_type: "percent" as "percent" | "fixed",
  discount_value: "",
  starts_at: "",
  ends_at: "",
  is_active: true,
};

export default function FlashSalePage() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showConfirm, setShowConfirm] = useState<{
    id: number;
    sku: string;
  } | null>(null);

  // Import states
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatPrice = (p: any) => {
    const num = typeof p === "string" ? parseFloat(p) : p;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num || 0);
  };

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/promotions?type=flash_sale");
      if (res.data.status === "success") setPromotions(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const [availableProducts, setAvailableProducts] = useState<any[]>([]);

  const fetchProductsForDropdown = async () => {
    try {
      const res = await api.get("/products", { params: { limit: 100 } });
      if (res.data.status === "success") {
        setAvailableProducts(res.data.data.data || res.data.data);
      }
    } catch (e) {
      console.error("Failed to load products for dropdown", e);
    }
  };

  useEffect(() => {
    fetchPromotions();
    fetchProductsForDropdown();
  }, []);

  const openCreate = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setError("");
    setShowModal(true);
  };

  const openEdit = (p: any) => {
    const parseDate = (d: any) => {
      if (!d) return "";
      try {
        const date = new Date(d);
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
      } catch {
        return "";
      }
    };

    setForm({
      sku: p.sku,
      name: p.name || "",
      discount_type: p.discount_type,
      discount_value: p.discount_value
        ? parseFloat(p.discount_value).toString()
        : "",
      starts_at: parseDate(p.starts_at),
      ends_at: parseDate(p.ends_at),
      is_active: !!p.is_active,
    });
    setEditingId(p.id);
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload: any = {
        ...form,
        type: "flash_sale",
        discount_value: parseFloat(form.discount_value),
      };

      if (editingId) {
        await api.put(`/admin/promotions/${editingId}`, payload);
        setSuccessMsg("Flash Sale berhasil diperbarui!");
      } else {
        await api.post("/admin/promotions", payload);
        setSuccessMsg("Flash Sale berhasil dibuat!");
      }
      setShowModal(false);
      fetchPromotions();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: number, sku: string) => {
    setShowConfirm({ id, sku });
  };

  const confirmDelete = async () => {
    if (!showConfirm) return;
    try {
      await api.delete(`/admin/promotions/${showConfirm.id}`);
      setSuccessMsg("Flash Sale berhasil dihapus!");
      setShowConfirm(null);
      fetchPromotions();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e) {
      alert("Gagal menghapus flash sale.");
      setShowConfirm(null);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;
    setImporting(true);
    try {
      const formData = new FormData();
      formData.append("file", importFile);
      formData.append("type", "flash_sale");
      await api.post("/admin/promotions/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchPromotions();
      setSuccessMsg("Import flash sale berhasil!");
      setShowImportModal(false);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Import gagal.");
    } finally {
      setImporting(false);
    }
  };

  const isPromoValid = (p: any) => {
    const now = new Date();
    const starts = p.starts_at ? new Date(p.starts_at) : null;
    const ends = p.ends_at ? new Date(p.ends_at) : null;

    if (!p.is_active) return false;
    if (starts && starts > now) return false;
    if (ends && ends < now) return false;
    return true;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-stone-900">
              Manajemen Flash Sale
            </h1>
            <Zap className="text-amber-500 w-5 h-5 md:w-6 md:h-6 fill-amber-500" />
          </div>
          <p className="text-stone-500 text-xs md:text-sm mt-1">
            Kelola promo terbatas dengan periode waktu tertentu
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* <button
            onClick={() => {
              setShowImportModal(true);
              setImportFile(null);
            }}
            className="flex items-center justify-center gap-2 border border-stone-300 text-stone-700 px-4 py-2.5 text-sm font-medium hover:bg-stone-50 transition-colors"
          >
            <Upload className="w-4 h-4" /> Import Excel
          </button> */}
          <button
            onClick={openCreate}
            className="flex items-center justify-center gap-2 bg-stone-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-black transition-colors"
          >
            <Plus className="w-4 h-4" /> Buat Flash Sale
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="bg-stone-900 border border-stone-800 text-white px-5 py-4 shadow-2xl flex items-center gap-4 min-w-[300px]">
            <div className="bg-amber-500 p-2 rounded-full">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold tracking-wide uppercase italic">
                Flash Event
              </p>
              <p className="text-xs text-stone-400 mt-0.5">{successMsg}</p>
            </div>
            <button
              onClick={() => setSuccessMsg("")}
              className="text-stone-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* List Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
        </div>
      ) : promotions.length === 0 ? (
        <div className="bg-white border border-stone-100 py-20 text-center">
          <Zap className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500 text-sm">
            Belum ada flash sale yang terdaftar.
          </p>
          <button
            onClick={openCreate}
            className="mt-4 text-stone-900 text-sm font-medium underline"
          >
            Buat sekarang
          </button>
        </div>
      ) : (
        <div className="bg-white border border-stone-100 overflow-x-auto rounded-xl shadow-sm">
          <table className="w-full text-sm min-w-[800px] md:min-w-full">
            <thead>
              <tr className="border-b border-stone-100 text-[10px] uppercase tracking-wider text-stone-500 font-bold">
                <th className="px-5 py-4 text-left font-bold">Produk SKU</th>
                <th className="px-5 py-4 text-left font-bold">Nama Event</th>
                <th className="px-5 py-4 text-left font-bold">Potongan</th>
                <th className="px-5 py-4 text-left font-bold">Periode</th>
                <th className="px-5 py-4 text-left font-bold">Status</th>
                <th className="px-5 py-4 text-right font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {promotions.map((p) => {
                const isActive = isPromoValid(p);
                return (
                  <tr
                    key={p.id}
                    className="hover:bg-stone-50 transition-colors"
                  >
                    <td className="px-5 py-4 font-mono font-bold text-stone-900">
                      {p.sku}
                    </td>
                    <td className="px-5 py-4 text-stone-600 font-medium italic">
                      {p.name || "Flash Sale"}
                    </td>
                    <td className="px-5 py-4 font-bold text-amber-600">
                      {p.discount_type === "percent"
                        ? `${parseFloat(p.discount_value)}%`
                        : formatPrice(p.discount_value)}
                    </td>
                    <td className="px-5 py-4 text-xs text-stone-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-stone-400" />
                        {new Date(p.starts_at).toLocaleString("id-ID", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}{" "}
                        -{" "}
                        {new Date(p.ends_at).toLocaleString("id-ID", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${isActive ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-400"}`}
                      >
                        {isActive ? "Aktif Sekarang" : "Selesai/Belum Mulai"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.sku)}
                          className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                        >
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
              <h2 className="text-base font-bold text-stone-900 uppercase tracking-wide">
                {editingId ? "Edit Flash Sale" : "Buat Flash Sale Baru"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 p-3 text-sm flex gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-1">
                    Pilih Produk *
                  </label>
                  <select
                    required
                    value={form.sku}
                    onChange={(e) => {
                      const selectedSku = e.target.value;
                      const product = availableProducts.find(
                        (p) => p.sku === selectedSku,
                      );
                      // Auto-fill event name if it's currently empty
                      setForm({
                        ...form,
                        sku: selectedSku,
                        name:
                          form.name ||
                          (product
                            ? `Flash Sale ${product.name.slice(0, 15)}...`
                            : ""),
                      });
                    }}
                    className="w-full border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-900 bg-white"
                  >
                    <option value="" disabled>
                      -- Pilih Produk --
                    </option>
                    {availableProducts.map((p) => (
                      <option key={p.id} value={p.sku}>
                        {p.sku ? `[${p.sku}] ` : "(No SKU) "}
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-1">
                    Event Name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Midnight Sale"
                    className="w-full border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-900 font-medium italic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-1">
                    Tipe Potongan *
                  </label>
                  <select
                    value={form.discount_type}
                    onChange={(e) =>
                      setForm({ ...form, discount_type: e.target.value as any })
                    }
                    className="w-full border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:outline-none bg-white"
                  >
                    <option value="fixed">Nominal (Rp)</option>
                    <option value="percent">Persen (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-1">
                    Nilai Potongan *
                  </label>
                  <input
                    required
                    type="number"
                    value={form.discount_value}
                    onChange={(e) =>
                      setForm({ ...form, discount_value: e.target.value })
                    }
                    className="w-full border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:outline-none font-bold text-amber-600"
                  />
                </div>
              </div>

              <div className="bg-amber-50 p-4 border border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg">
                <div className="col-span-2 text-[10px] font-bold text-amber-700 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  <Calendar size={14} /> Periode Flash Sale
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-amber-600 uppercase mb-1 font-mono">
                    Starts At *
                  </label>
                  <input
                    required
                    type="datetime-local"
                    value={form.starts_at}
                    onChange={(e) =>
                      setForm({ ...form, starts_at: e.target.value })
                    }
                    className="w-full border border-amber-200 px-3 py-2 text-sm text-amber-900 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-amber-600 uppercase mb-1 font-mono">
                    Ends At *
                  </label>
                  <input
                    required
                    type="datetime-local"
                    value={form.ends_at}
                    onChange={(e) =>
                      setForm({ ...form, ends_at: e.target.value })
                    }
                    className="w-full border border-amber-200 px-3 py-2 text-sm text-amber-900 focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                  className="accent-stone-900"
                />
                <label
                  htmlFor="is_active"
                  className="text-sm font-medium text-stone-700"
                >
                  Aktifkan Flash Sale
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 text-sm text-stone-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-stone-900 text-white text-sm font-bold uppercase transition-colors hover:bg-black disabled:bg-stone-400 flex items-center gap-2 shadow-lg shadow-stone-200"
                >
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Zap size={14} className="fill-white" />
                  )}
                  {submitting ? "Menyimpan..." : "Simpan Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
              <h2 className="text-base font-bold text-stone-900 uppercase tracking-wide">
                Import Flash Sale via Excel
              </h2>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-stone-400 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-amber-50 p-4 rounded text-xs text-amber-800 space-y-2 border border-amber-100 font-mono">
                <p className="font-bold uppercase tracking-wider underline">
                  Format Kolom Excel:
                </p>
                <p>
                  A:{" "}
                  <code className="bg-white px-1 border">kode_produk_sku</code>{" "}
                  (Wajib)
                </p>
                <p>
                  B: <code className="bg-white px-1 border">nama_promo</code>{" "}
                  (Opsional)
                </p>
                <p>
                  C: <code className="bg-white px-1 border">tipe_potongan</code>{" "}
                  (<code className="text-blue-600">percent</code> /{" "}
                  <code className="text-blue-600">fixed</code>)
                </p>
                <p>
                  D:{" "}
                  <code className="bg-white px-1 border">nilai_potongan</code>{" "}
                  (Wajib)
                </p>
                <p>
                  E: <code className="bg-white px-1 border">periode_on</code>{" "}
                  (YYYY-MM-DD)
                </p>
                <p>
                  F: <code className="bg-white px-1 border">periode_off</code>{" "}
                  (YYYY-MM-DD)
                </p>
              </div>
              <div
                className="border-2 border-dashed border-stone-200 rounded-xl p-8 text-center cursor-pointer hover:border-amber-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {importFile ? (
                  <div className="flex items-center justify-center gap-2 font-medium">
                    <FileSpreadsheet className="text-green-600" />{" "}
                    {importFile.name}
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                    <p className="text-sm text-stone-500">
                      Klik untuk upload file Excel Flash Sale
                    </p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-5 py-2 text-sm text-stone-500"
                >
                  Tutup
                </button>
                <button
                  onClick={handleImport}
                  disabled={!importFile || importing}
                  className="px-6 py-2 bg-stone-900 text-white text-sm font-bold uppercase disabled:opacity-50 flex items-center gap-2"
                >
                  {importing && <Loader2 size={14} className="animate-spin" />}
                  {importing ? "Mengimport..." : "Import Sekarang"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {showConfirm && (
        <div className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-stone-100 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>

            <h3 className="text-xl font-bold text-stone-900 tracking-tight">
              Hapus Event Flash Sale?
            </h3>

            <p className="text-sm text-stone-500 mt-3 leading-relaxed">
              Anda akan menghapus promo flash sale untuk SKU{" "}
              <span className="font-bold text-stone-900">
                {showConfirm.sku}
              </span>
              . Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-8">
              <button
                onClick={() => setShowConfirm(null)}
                className="px-4 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold uppercase tracking-wider transition-all active:scale-95"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-200 transition-all active:scale-95"
              >
                Hapus Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
