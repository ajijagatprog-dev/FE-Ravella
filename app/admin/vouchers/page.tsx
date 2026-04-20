"use client";

import { useEffect, useRef, useState } from "react";
import {
  Plus, Pencil, Trash2, Tag, X, Loader2, CheckCircle2,
  AlertCircle, Upload, FileSpreadsheet
} from "lucide-react";
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
  starts_at: "",
  expires_at: "",
  sku: "",
  max_per_user: "",
};

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showConfirm, setShowConfirm] = useState<{ id: number; code: string } | null>(null);

  // Import states
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ failures: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatPrice = (p: any) => {
    const num = typeof p === "string" ? parseFloat(p) : p;
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num || 0);
  };

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
      description: v.description || "",
      type: v.type,
      value: v.value ? parseFloat(v.value).toString() : "",
      min_purchase: v.min_purchase ? parseFloat(v.min_purchase).toString() : "",
      max_discount: v.max_discount ? parseFloat(v.max_discount).toString() : "",
      max_uses: v.max_uses ? String(v.max_uses) : "",
      is_active: !!v.is_active,
      starts_at: parseDate(v.starts_at),
      expires_at: parseDate(v.expires_at),
      sku: v.sku || "",
      max_per_user: v.max_per_user ? String(v.max_per_user) : "",
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
      if (form.max_uses) payload.max_uses = parseInt(form.max_uses) || null;
      if (form.starts_at) payload.starts_at = form.starts_at;
      if (form.expires_at) payload.expires_at = form.expires_at;
      if (form.sku) payload.sku = form.sku || null;
      if (form.max_per_user) payload.max_per_user = parseInt(form.max_per_user) || null;

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
    setShowConfirm({ id, code });
  };

  const confirmDelete = async () => {
    if (!showConfirm) return;
    const { id } = showConfirm;
    try {
      await api.delete(`/admin/vouchers/${id}`);
      setSuccessMsg("Voucher berhasil dihapus!");
      setShowConfirm(null);
      fetchVouchers();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e) {
      alert("Gagal menghapus voucher.");
      setShowConfirm(null);
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


  // Bulk import Excel
  const handleImport = async () => {
    if (!importFile) return;
    setImporting(true);
    setImportResult(null);
    try {
      const formData = new FormData();
      formData.append("file", importFile);
      const res = await api.post("/admin/vouchers/bulk-import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchVouchers();
      setSuccessMsg("Import berhasil! Voucher baru telah ditambahkan.");
      setShowImportModal(false);
      setShowModal(false);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Import gagal.");
    } finally {
      setImporting(false);
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
        <div className="flex items-center gap-2">
          {/* Bulk Import Button */}
          <button
            onClick={() => { setShowImportModal(true); setImportFile(null); setImportResult(null); }}
            className="flex items-center gap-2 border border-stone-300 text-stone-700 px-4 py-2.5 text-sm font-medium hover:bg-stone-50 transition-colors"
          >
            <Upload className="w-4 h-4" /> Import Excel
          </button>
          {/* Create Button */}
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-black transition-colors"
          >
            <Plus className="w-4 h-4" /> Buat Voucher
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="bg-stone-900 border border-stone-800 text-white px-5 py-4 shadow-2xl flex items-center gap-4 min-w-[300px]">
            <div className="bg-green-500/20 p-2 rounded-full">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold tracking-wide">BERHASIL</p>
              <p className="text-xs text-stone-400 mt-0.5">{successMsg}</p>
            </div>
            <button onClick={() => setSuccessMsg("")} className="text-stone-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="h-1 bg-green-500 animate-out fade-out duration-[3000ms] origin-left" />
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
              <tr className="border-b border-stone-100 text-[10px] uppercase tracking-wider text-stone-500 font-bold">
                <th className="px-5 py-4 text-left font-bold">Produk / SKU</th>
                <th className="px-5 py-4 text-left font-bold">Kode Voucher</th>
                <th className="px-5 py-4 text-left font-bold">Nominal</th>
                <th className="px-5 py-4 text-left font-bold">Min. Belanja</th>
                <th className="px-5 py-4 text-left font-bold">Kuota</th>
                <th className="px-5 py-4 text-left font-bold">Limit/User</th>
                <th className="px-5 py-4 text-left font-bold">Periode On</th>
                <th className="px-5 py-4 text-left font-bold">Periode Off</th>
                <th className="px-5 py-4 text-left font-bold">Status</th>
                <th className="px-5 py-4 text-right font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {vouchers.map((v) => {
                const expired = isExpired(v.expires_at);
                return (
                  <tr key={v.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-4">
                      {v.sku ? (
                        <span className="font-medium text-stone-900">{v.sku}</span>
                      ) : (
                        <span className="text-stone-300">All Products</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 text-xs">{v.code}</span>
                      {v.description && (
                        <span className="text-[10px] text-stone-400 block mt-1 line-clamp-1">{v.description}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-medium text-stone-800">
                      {v.type === 'percent' ? `${parseFloat(v.value)}%` : formatPrice(v.value)}
                      {v.max_discount && v.type === 'percent' && (
                        <span className="text-[10px] text-stone-400 block">maks. {formatPrice(v.max_discount)}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-stone-600">
                      {v.min_purchase && parseFloat(v.min_purchase) > 0 ? formatPrice(v.min_purchase) : <span className="text-stone-300">—</span>}
                    </td>
                    <td className="px-5 py-4 text-stone-600">
                      <span className="font-medium">{v.max_uses ? v.max_uses : '∞'}</span>
                      <span className="text-[10px] text-stone-400 block">Terpakai: {v.used_count}</span>
                    </td>
                    <td className="px-5 py-4 text-stone-600">
                      {v.max_per_user ? (
                        <span className="font-medium">{v.max_per_user}x</span>
                      ) : (
                        <span className="text-stone-300">∞</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs ${new Date(v.starts_at) > new Date() ? 'text-amber-600 font-medium' : 'text-stone-600'}`}>
                        {v.starts_at ? new Date(v.starts_at).toLocaleDateString('id-ID') : 'Sekarang'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {v.expires_at ? (
                        <span className={`text-xs ${expired ? 'text-red-500 font-medium' : 'text-stone-600'}`}>
                          {new Date(v.expires_at).toLocaleDateString('id-ID')}
                          {expired && ' (Habis)'}
                        </span>
                      ) : <span className="text-stone-300">∞</span>}
                    </td>
                    <td className="px-5 py-4">
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleToggleActive(v); }}
                        className="flex items-center gap-2 group cursor-pointer outline-none"
                      >
                        <div className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${v.is_active ? 'bg-green-600' : 'bg-stone-200'}`}>
                          <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${v.is_active ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${v.is_active ? 'text-green-600' : 'text-stone-400 opacity-60'}`}>
                          {v.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
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

      {/* ── IMPORT MODAL ── */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg shadow-2xl" style={{ fontFamily: JOST }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
              <div>
                <h2 className="text-base font-bold text-stone-900 uppercase tracking-wide">Import Voucher via Excel</h2>
                <p className="text-xs text-stone-500 mt-0.5">Upload file .xlsx, .xls, atau .csv</p>
              </div>
              <button onClick={() => setShowImportModal(false)} className="text-stone-400 hover:text-stone-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Kolom info */}
              <div className="text-xs text-stone-500 space-y-1">
                <p className="font-semibold text-stone-600 mb-1">Kolom Template (Format Baru):</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                  <span>• <code className="bg-stone-100 px-1">Kode Produk / SKU</code></span>
                  <span>• <code className="bg-stone-100 px-1">Kode Voucher</code></span>
                  <span>• <code className="bg-stone-100 px-1">Nominal Voucher</code></span>
                  <span>• <code className="bg-stone-100 px-1">Minimal Purchase</code></span>
                  <span>• <code className="bg-stone-100 px-1">Qty Voucher</code></span>
                  <span>• <code className="bg-stone-100 px-1">Maksimal Claim per Buyer</code></span>
                  <span>• <code className="bg-stone-100 px-1">Periode On</code></span>
                  <span>• <code className="bg-stone-100 px-1">Periode Off / Kadaluarsa</code></span>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-medium mb-2">Pilih File</label>
                <div
                  className="border-2 border-dashed border-stone-200 rounded px-4 py-6 text-center cursor-pointer hover:border-stone-400 transition"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {importFile ? (
                    <div className="flex items-center justify-center gap-2 text-stone-700">
                      <FileSpreadsheet className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">{importFile.name}</span>
                      <button onClick={(e) => { e.stopPropagation(); setImportFile(null); }} className="text-stone-400 hover:text-red-500 ml-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                      <p className="text-sm text-stone-500">Klik untuk pilih file atau drag & drop</p>
                      <p className="text-xs text-stone-400 mt-1">.xlsx, .xls, atau .csv — maks 5MB</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImportFile(file);
                    if (file && showModal) {
                      // If picked from within create modal, start import immediately
                      setTimeout(() => handleImport(), 100);
                    }
                  }}
                />
              </div>

              {/* Import Result */}
              {importResult && (
                <div className={`text-sm rounded px-4 py-3 ${importResult.failures.length > 0 ? 'bg-amber-50 border border-amber-200 text-amber-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
                  {importResult.failures.length === 0 ? (
                    <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Semua baris berhasil diimport!</div>
                  ) : (
                    <>
                      <p className="font-semibold mb-1">Beberapa baris gagal diimport:</p>
                      <ul className="text-xs space-y-0.5 list-disc pl-4">
                        {importResult.failures.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-5 py-2.5 border border-stone-200 text-stone-600 text-sm hover:bg-stone-50 transition-colors"
                >
                  Tutup
                </button>
                <button
                  onClick={handleImport}
                  disabled={!importFile || importing}
                  className="px-5 py-2.5 bg-stone-900 text-white text-sm font-medium hover:bg-black disabled:bg-stone-400 transition-colors flex items-center gap-2"
                >
                  {importing && <Loader2 className="w-3 h-3 animate-spin" />}
                  {importing ? 'Mengimport...' : 'Import Sekarang'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE / EDIT MODAL ── */}
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
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-1">Kode Produk / SKU (Opsional)</label>
                  <input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })}
                    placeholder="Contoh: SKU-123" className="w-full border border-stone-200 px-3 py-2 text-sm bg-stone-50 text-stone-900 focus:outline-none focus:border-stone-900" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-1">Kode Voucher *</label>
                  <input required value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="WELCOMERAVELLA" className="w-full border border-stone-200 px-3 py-2 text-sm font-mono uppercase bg-stone-50 text-stone-900 focus:outline-none focus:border-stone-900" />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-1">Tipe Voucher *</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })}
                    className="w-full border border-stone-200 px-3 py-2 text-sm bg-white text-stone-900 focus:outline-none focus:border-stone-900">
                    <option value="fixed">Nominal (Rp)</option>
                    <option value="percent">Persen (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-1">
                    {form.type === 'percent' ? 'Persentase Diskon (%)' : 'Nominal Voucher (Rp)'} *
                  </label>
                  <input required type="number" min="0" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })}
                    placeholder={form.type === 'percent' ? "10" : "50000"} className="w-full border border-stone-200 px-3 py-2 text-sm bg-white text-stone-900 focus:outline-none focus:border-stone-900 font-semibold" />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-1">Minimal Purchase (Rp)</label>
                  <input type="number" min="0" value={form.min_purchase} onChange={e => setForm({ ...form, min_purchase: e.target.value })}
                    placeholder="100000" className="w-full border border-stone-200 px-3 py-2 text-sm bg-white text-stone-900 focus:outline-none focus:border-stone-900" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-1">Qty Voucher (Total Kuota)</label>
                  <input type="number" min="1" value={form.max_uses} onChange={e => setForm({ ...form, max_uses: e.target.value })}
                    placeholder="Kosong = tidak terbatas" className="w-full border border-stone-200 px-3 py-2 text-sm bg-white text-stone-900 focus:outline-none focus:border-stone-900" />
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-1">Maksimal Claim per Buyer</label>
                  <input type="number" min="1" value={form.max_per_user} onChange={e => setForm({ ...form, max_per_user: e.target.value })}
                    placeholder="Kosong = tidak terbatas" className="w-full border border-stone-200 px-3 py-2 text-sm bg-white text-stone-900 focus:outline-none focus:border-stone-900" />
                </div>

                <div className="col-span-2 bg-stone-50 p-4 border border-stone-100">
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-3">Masa Berlaku Voucher</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-tight mb-1">Periode On (Mulai)</label>
                      <input type="date" value={form.starts_at} onChange={e => setForm({ ...form, starts_at: e.target.value })}
                        className="w-full border border-stone-200 px-3 py-2 text-sm bg-white text-stone-900 focus:outline-none focus:border-stone-900" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-tight mb-1">Periode Off (Kadaluarsa)</label>
                      <input type="date" value={form.expires_at} onChange={e => setForm({ ...form, expires_at: e.target.value })}
                        className="w-full border border-stone-200 px-3 py-2 text-sm bg-white text-stone-900 focus:outline-none focus:border-stone-900" />
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-1">Deskripsi (Internal)</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={2} placeholder="Catatan tambahan untuk voucher ini..." className="w-full border border-stone-200 px-3 py-2 text-sm bg-white text-stone-900 focus:outline-none focus:border-stone-900 resize-none" />
                </div>

                {form.type === 'percent' && (
                  <div className="col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-1">Maksimal Potongan Diskon (Rp)</label>
                    <input type="number" min="0" value={form.max_discount} onChange={e => setForm({ ...form, max_discount: e.target.value })}
                      placeholder="50000" className="w-full border border-stone-200 px-3 py-2 text-sm bg-white text-stone-900 focus:outline-none focus:border-stone-900" />
                  </div>
                )}
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
      {/* ── CONFIRM DELETE MODAL ── */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm shadow-2xl border border-stone-100" style={{ fontFamily: JOST }}>
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 uppercase tracking-wide">Hapus Voucher?</h3>
              <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                Anda akan menghapus voucher <span className="font-bold text-stone-900">{showConfirm.code}</span>. Tindakan ini bersifat permanen.
              </p>
              
              <div className="grid grid-cols-2 gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowConfirm(null)}
                  className="px-5 py-3 border border-stone-200 text-stone-600 text-xs font-bold uppercase tracking-widest hover:bg-stone-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="px-5 py-3 bg-red-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
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
