"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Pencil,
  Trash2,
  Tag,
  X,
  Loader2,
  CheckCircle2,
  Upload,
  FileSpreadsheet,
  Download,
  ArrowLeft,
} from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { downloadFile } from "@/lib/download";

export default function VoucherProdukPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [showConfirm, setShowConfirm] = useState<{
    id: number;
    code: string;
  } | null>(null);

  // Import states
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    failures: string[];
  } | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatPrice = (p: any) => {
    const num = typeof p === "string" ? parseFloat(p) : p;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num || 0);
  };

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/vouchers?type=product");
      if (res.data.status === "success") setVouchers(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

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
      setSuccessMsg("Import berhasil! Voucher produk telah ditambahkan.");
      setShowImportModal(false);
      setImportFile(null);
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
    <div className="p-6">
      {/* Back Navigation */}
      <Link
        href="/admin/vouchers"
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 mb-5 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Kembali ke Kategori Voucher
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-stone-900 leading-tight">
            Voucher Produk
          </h1>
          <p className="text-stone-500 text-xs md:text-sm mt-1">
            Kelola voucher untuk produk terpilih via Bulk Import
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Export Button */}
          <button
            onClick={async () => {
              try {
                await downloadFile(
                  "/admin/export/vouchers",
                  "vouchers_produk_report.xlsx",
                );
                toast.success("Voucher exported successfully");
              } catch (error) {
                toast.error("Failed to export vouchers");
              }
            }}
            className="flex items-center justify-center gap-2 border border-stone-300 text-stone-700 px-4 py-2.5 text-sm font-medium hover:bg-stone-50 transition-colors"
          >
            <Download className="w-4 h-4" /> Ekspor Excel
          </button>
          {/* Import Button */}
          <button
            onClick={() => {
              setShowImportModal(true);
              setImportFile(null);
              setImportResult(null);
            }}
            className="flex items-center justify-center gap-2 bg-stone-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-black transition-colors"
          >
            <Upload className="w-4 h-4" /> Import Excel
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
            <button
              onClick={() => setSuccessMsg("")}
              className="text-stone-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="h-1 bg-green-500 animate-out fade-out duration-[3000ms] origin-left" />
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
          <FileSpreadsheet className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-blue-900">
            Voucher Produk hanya dapat dibuat melalui Bulk Import
          </p>
          <p className="text-xs text-blue-600 mt-0.5">
            Siapkan file Excel (.xlsx, .xls, atau .csv) dengan kolom yang sesuai
            template, lalu klik tombol &quot;Import Excel&quot; di atas.
          </p>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
        </div>
      ) : vouchers.length === 0 ? (
        <div className="bg-white border border-stone-100 py-20 text-center rounded-xl">
          <Tag className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500 text-sm">
            Belum ada voucher produk. Import via Excel untuk menambahkan!
          </p>
          <button
            onClick={() => {
              setShowImportModal(true);
              setImportFile(null);
              setImportResult(null);
            }}
            className="mt-4 text-stone-900 text-sm font-medium underline"
          >
            Import sekarang
          </button>
        </div>
      ) : (
        <div className="bg-white border border-stone-100 overflow-x-auto rounded-xl shadow-sm">
          <table className="w-full text-sm min-w-[1000px] md:min-w-full">
            <thead>
              <tr className="border-b border-stone-100 text-[10px] uppercase tracking-wider text-stone-500 font-bold">
                <th className="px-5 py-4 text-left font-bold">
                  Kode Produk / SKU
                </th>
                <th className="px-5 py-4 text-left font-bold">Kode Voucher</th>
                <th className="px-5 py-4 text-left font-bold">
                  Nominal Voucher
                </th>
                <th className="px-5 py-4 text-left font-bold">
                  Minimal Purchase
                </th>
                <th className="px-5 py-4 text-left font-bold">Qty Voucher</th>
                <th className="px-5 py-4 text-left font-bold">
                  Maks. Claim/Buyer
                </th>
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
                  <tr
                    key={v.id}
                    className="hover:bg-stone-50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      {v.sku ? (
                        <span className="font-medium text-stone-900">
                          {v.sku}
                        </span>
                      ) : (
                        <span className="text-stone-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 text-xs">
                        {v.code}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-stone-800">
                      {formatPrice(v.value)}
                    </td>
                    <td className="px-5 py-4 text-stone-600">
                      {v.min_purchase && parseFloat(v.min_purchase) > 0 ? (
                        formatPrice(v.min_purchase)
                      ) : (
                        <span className="text-stone-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-stone-600">
                      <span className="font-medium">
                        {v.max_uses ? v.max_uses : "∞"}
                      </span>
                      <span className="text-[10px] text-stone-400 block">
                        Terpakai: {v.used_count}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-stone-600">
                      {v.max_per_user ? (
                        <span className="font-medium">{v.max_per_user}x</span>
                      ) : (
                        <span className="text-stone-300">∞</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs ${new Date(v.starts_at) > new Date() ? "text-amber-600 font-medium" : "text-stone-600"}`}
                      >
                        {v.starts_at
                          ? new Date(v.starts_at).toLocaleDateString("id-ID")
                          : "Sekarang"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {v.expires_at ? (
                        <span
                          className={`text-xs ${expired ? "text-red-500 font-medium" : "text-stone-600"}`}
                        >
                          {new Date(v.expires_at).toLocaleDateString("id-ID")}
                          {expired && " (Habis)"}
                        </span>
                      ) : (
                        <span className="text-stone-300">∞</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleActive(v);
                        }}
                        className="flex items-center gap-2 group cursor-pointer outline-none"
                      >
                        <div
                          className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${v.is_active ? "bg-green-600" : "bg-stone-200"}`}
                        >
                          <div
                            className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${v.is_active ? "translate-x-4" : "translate-x-0"}`}
                          />
                        </div>
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider ${v.is_active ? "text-green-600" : "text-stone-400 opacity-60"}`}
                        >
                          {v.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDelete(v.id, v.code)}
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

      {/* ── IMPORT MODAL ── */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg shadow-2xl rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
              <div>
                <h2 className="text-base font-bold text-stone-900 uppercase tracking-wide">
                  Import Voucher Produk via Excel
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Upload file .xlsx, .xls, atau .csv
                </p>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-stone-400 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Kolom info */}
              <div className="text-xs text-stone-500 space-y-1">
                <p className="font-semibold text-stone-600 mb-1">
                  Kolom Template (Format Baru):
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                  <span>
                    •{" "}
                    <code className="bg-stone-100 px-1">Kode Produk / SKU</code>
                  </span>
                  <span>
                    • <code className="bg-stone-100 px-1">Kode Voucher</code>
                  </span>
                  <span>
                    • <code className="bg-stone-100 px-1">Nominal Voucher</code>
                  </span>
                  <span>
                    •{" "}
                    <code className="bg-stone-100 px-1">Minimal Purchase</code>
                  </span>
                  <span>
                    • <code className="bg-stone-100 px-1">Qty Voucher</code>
                  </span>
                  <span>
                    •{" "}
                    <code className="bg-stone-100 px-1">
                      Maksimal Claim per Buyer
                    </code>
                  </span>
                  <span>
                    • <code className="bg-stone-100 px-1">Periode On</code>
                  </span>
                  <span>
                    •{" "}
                    <code className="bg-stone-100 px-1">
                      Periode Off / Kadaluarsa
                    </code>
                  </span>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-medium mb-2">
                  Pilih File
                </label>
                <div
                  className="border-2 border-dashed border-stone-200 rounded-xl px-4 py-6 text-center cursor-pointer hover:border-stone-400 transition"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {importFile ? (
                    <div className="flex items-center justify-center gap-2 text-stone-700">
                      <FileSpreadsheet className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">
                        {importFile.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setImportFile(null);
                        }}
                        className="text-stone-400 hover:text-red-500 ml-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                      <p className="text-sm text-stone-500">
                        Klik untuk pilih file atau drag &amp; drop
                      </p>
                      <p className="text-xs text-stone-400 mt-1">
                        .xlsx, .xls, atau .csv — maks 5MB
                      </p>
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
                  }}
                />
              </div>

              {/* Import Result */}
              {importResult && (
                <div
                  className={`text-sm rounded px-4 py-3 ${importResult.failures.length > 0 ? "bg-amber-50 border border-amber-200 text-amber-700" : "bg-green-50 border border-green-200 text-green-700"}`}
                >
                  {importResult.failures.length === 0 ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Semua baris berhasil
                      diimport!
                    </div>
                  ) : (
                    <>
                      <p className="font-semibold mb-1">
                        Beberapa baris gagal diimport:
                      </p>
                      <ul className="text-xs space-y-0.5 list-disc pl-4">
                        {importResult.failures.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
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
                  className="px-5 py-2.5 border border-stone-200 text-stone-600 text-sm hover:bg-stone-50 transition-colors rounded-lg"
                >
                  Tutup
                </button>
                <button
                  onClick={handleImport}
                  disabled={!importFile || importing}
                  className="px-5 py-2.5 bg-stone-900 text-white text-sm font-medium hover:bg-black disabled:bg-stone-400 transition-colors flex items-center gap-2 rounded-lg"
                >
                  {importing && <Loader2 className="w-3 h-3 animate-spin" />}
                  {importing ? "Mengimport..." : "Import Sekarang"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CONFIRM DELETE MODAL ── */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm shadow-2xl rounded-3xl overflow-hidden border border-stone-100">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 uppercase tracking-wide">
                Hapus Voucher?
              </h3>
              <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                Anda akan menghapus voucher{" "}
                <span className="font-bold text-stone-900">
                  {showConfirm.code}
                </span>
                . Tindakan ini bersifat permanen.
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
