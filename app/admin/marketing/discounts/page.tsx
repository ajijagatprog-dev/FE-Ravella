"use client";

import { useEffect, useRef, useState } from "react";
import {
  Plus, Pencil, Trash2, Tag, X, Loader2, CheckCircle2,
  AlertCircle, Upload, FileSpreadsheet, Percent
} from "lucide-react";
import api from "@/lib/axios";

const JOST = "'Jost', system-ui, sans-serif";

const emptyForm = {
  sku: "",
  name: "",
  discount_type: "percent" as "percent" | "fixed",
  discount_value: "",
  is_active: true,
};

export default function DiscountsPage() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showConfirm, setShowConfirm] = useState<{ id: number; sku: string } | null>(null);

  // Import states
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatPrice = (p: any) => {
    const num = typeof p === "string" ? parseFloat(p) : p;
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num || 0);
  };

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/promotions?type=discount");
      if (res.data.status === "success") setPromotions(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPromotions(); }, []);

  const openCreate = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setError("");
    setShowModal(true);
  };

  const openEdit = (p: any) => {
    setForm({
      sku: p.sku,
      name: p.name || "",
      discount_type: p.discount_type,
      discount_value: p.discount_value ? parseFloat(p.discount_value).toString() : "",
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
        type: 'discount',
        discount_value: parseFloat(form.discount_value),
      };

      if (editingId) {
        await api.put(`/admin/promotions/${editingId}`, payload);
        setSuccessMsg("Diskon berhasil diperbarui!");
      } else {
        await api.post("/admin/promotions", payload);
        setSuccessMsg("Diskon berhasil dibuat!");
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
      setSuccessMsg("Diskon berhasil dihapus!");
      setShowConfirm(null);
      fetchPromotions();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e) {
      alert("Gagal menghapus diskon.");
      setShowConfirm(null);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;
    setImporting(true);
    try {
      const formData = new FormData();
      formData.append("file", importFile);
      formData.append("type", "discount");
      await api.post("/admin/promotions/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchPromotions();
      setSuccessMsg("Import diskon berhasil!");
      setShowImportModal(false);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Import gagal.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="p-6" style={{ fontFamily: JOST }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Manajemen Diskon Produk</h1>
          <p className="text-stone-500 text-sm mt-1">Kelola diskon permanen (harga coret) langsung pada produk/SKU</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShowImportModal(true); setImportFile(null); }}
            className="flex items-center gap-2 border border-stone-300 text-stone-700 px-4 py-2.5 text-sm font-medium hover:bg-stone-50 transition-colors"
          >
            <Upload className="w-4 h-4" /> Import Excel
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-black transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah Diskon
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
              <p className="text-sm font-semibold tracking-wide uppercase">Berhasil</p>
              <p className="text-xs text-stone-400 mt-0.5">{successMsg}</p>
            </div>
            <button onClick={() => setSuccessMsg("")} className="text-stone-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* List Table */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-stone-400" /></div>
      ) : promotions.length === 0 ? (
        <div className="bg-white border border-stone-100 py-20 text-center">
          <Percent className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500 text-sm">Belum ada diskon produk aktif.</p>
          <button onClick={openCreate} className="mt-4 text-stone-900 text-sm font-medium underline">Tambah sekarang</button>
        </div>
      ) : (
        <div className="bg-white border border-stone-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 text-[10px] uppercase tracking-wider text-stone-500 font-bold">
                <th className="px-5 py-4 text-left font-bold">Produk SKU</th>
                <th className="px-5 py-4 text-left font-bold">Nama Promo</th>
                <th className="px-5 py-4 text-left font-bold">Potongan</th>
                <th className="px-5 py-4 text-left font-bold">Status</th>
                <th className="px-5 py-4 text-right font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {promotions.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-stone-900">{p.sku}</td>
                  <td className="px-5 py-4 text-stone-600">{p.name || '-'}</td>
                  <td className="px-5 py-4 font-medium text-stone-800">
                    {p.discount_type === 'percent' ? `${parseFloat(p.discount_value)}%` : formatPrice(p.discount_value)}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-400'}`}>
                      {p.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-stone-500 hover:text-stone-900 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.sku)} className="p-1.5 text-stone-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md shadow-2xl" style={{ fontFamily: JOST }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
              <h2 className="text-base font-bold text-stone-900 uppercase tracking-wide">
                {editingId ? 'Edit Diskon' : 'Tambah Diskon Baru'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-900"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="bg-red-50 text-red-700 p-3 text-sm flex gap-2"><AlertCircle size={16} />{error}</div>}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-1">SKU Produk *</label>
                <input required value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="ABC-123" className="w-full border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-900" />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-1">Nama Promo (Opsional)</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Diskon Awal Tahun" className="w-full border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-900" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-1">Tipe *</label>
                  <select value={form.discount_type} onChange={e => setForm({ ...form, discount_type: e.target.value as any })} className="w-full border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:outline-none">
                    <option value="fixed">Nominal (Rp)</option>
                    <option value="percent">Persen (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-1">Nilai *</label>
                  <input required type="number" value={form.discount_value} onChange={e => setForm({ ...form, discount_value: e.target.value })} className="w-full border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:outline-none" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="accent-stone-900" />
                <label htmlFor="is_active" className="text-sm font-medium text-stone-700">Aktifkan Diskon</label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 text-sm text-stone-500">Batal</button>
                <button type="submit" disabled={submitting} className="px-6 py-2 bg-stone-900 text-white text-sm font-bold uppercase transition-colors hover:bg-black disabled:bg-stone-400">
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg shadow-2xl" style={{ fontFamily: JOST }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
              <h2 className="text-base font-bold text-stone-900 uppercase tracking-wide">Import Diskon via Excel</h2>
              <button onClick={() => setShowImportModal(false)} className="text-stone-400 hover:text-stone-900"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-stone-50 p-4 rounded text-xs text-stone-600 space-y-2">
                <p className="font-bold uppercase tracking-wider">Format Kolom Excel:</p>
                <p>A: <code className="bg-white px-1 border">kode_produk_sku</code> (Wajib)</p>
                <p>B: <code className="bg-white px-1 border">nama_promo</code> (Opsional)</p>
                <p>C: <code className="bg-white px-1 border">tipe_potongan</code> (<code className="text-blue-600">percent</code> / <code className="text-blue-600">fixed</code>)</p>
                <p>D: <code className="bg-white px-1 border">nilai_potongan</code> (Wajib)</p>
              </div>
              <div className="border-2 border-dashed border-stone-200 rounded-xl p-8 text-center cursor-pointer hover:border-stone-400" onClick={() => fileInputRef.current?.click()}>
                {importFile ? (
                  <div className="flex items-center justify-center gap-2 font-medium">
                    <FileSpreadsheet className="text-green-600" /> {importFile.name}
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                    <p className="text-sm text-stone-500">Klik untuk upload file Excel</p>
                  </>
                )}
              </div>
              <input ref={fileInputRef} type="file" className="hidden" accept=".xlsx,.xls" onChange={(e) => setImportFile(e.target.files?.[0] || null)} />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowImportModal(false)} className="px-5 py-2 text-sm text-stone-500">Tutup</button>
                <button onClick={handleImport} disabled={!importFile || importing} className="px-6 py-2 bg-stone-900 text-white text-sm font-bold uppercase disabled:opacity-50">
                  {importing ? 'Mengimport...' : 'Import Sekarang'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white p-8 max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-lg font-bold text-stone-900 uppercase">Hapus Diskon?</h3>
            <p className="text-sm text-stone-500 mt-2">Menghapus diskon untuk SKU <span className="font-bold">{showConfirm.sku}</span> bersifat permanen.</p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => setShowConfirm(null)} className="px-4 py-3 border border-stone-200 text-xs font-bold uppercase">Batal</button>
              <button onClick={confirmDelete} className="px-4 py-3 bg-red-600 text-white text-xs font-bold uppercase shadow-lg shadow-red-200">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
