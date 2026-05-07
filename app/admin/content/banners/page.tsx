"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Image as ImageIcon,
  Upload,
  Check,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  RefreshCw,
  Monitor,
  X,
} from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

// ── Page config ───────────────────────────────────────────────────────────────

interface PageConfig {
  key: string;
  label: string;
  description: string;
  slots: number;
  defaultImages: string[];
}

const PAGE_CONFIGS: PageConfig[] = [
  {
    key: "home",
    label: "Home — Hero Slider",
    description: "Banner slider utama di halaman beranda (3 slide)",
    slots: 3,
    defaultImages: ["/Hero/banner1.png", "/Hero/banner2.png", "/Hero/banner3.png"],
  },
  {
    key: "product",
    label: "Product",
    description: "Banner hero halaman produk",
    slots: 1,
    defaultImages: ["https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1920&q=80"],
  },
  {
    key: "news",
    label: "News",
    description: "Banner hero halaman berita",
    slots: 1,
    defaultImages: ["https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1920&q=80"],
  },
  {
    key: "company",
    label: "Company",
    description: "Banner hero halaman perusahaan",
    slots: 1,
    defaultImages: ["/Company/company.webp"],
  },
  {
    key: "contact",
    label: "Contact",
    description: "Banner hero halaman kontak",
    slots: 1,
    defaultImages: ["https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80"],
  },
  {
    key: "sale",
    label: "Sale",
    description: "Banner hero halaman promo / sale",
    slots: 1,
    defaultImages: ["https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80"],
  },
  {
    key: "service-center",
    label: "Service Center",
    description: "Banner hero halaman service center",
    slots: 1,
    defaultImages: ["/ServiceCenter/service-center.jpg"],
  },
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface BannerData {
  id: number;
  page: string;
  slot: number;
  image: string | null;
  is_active: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BannerManagementPage() {
  const [banners, setBanners] = useState<Record<string, BannerData[]>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null); // "page-slot" key
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/banners");
      if (res.data?.status === "success") {
        setBanners(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch banners:", err);
      toast.error("Gagal memuat data banner");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleUpload = async (
    bannerId: number,
    pageKey: string,
    slot: number,
    file: File,
  ) => {
    const uploadKey = `${pageKey}-${slot}`;
    setUploading(uploadKey);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post(`/admin/banners/${bannerId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.status === "success") {
        toast.success("Banner berhasil diperbarui!");
        fetchBanners();
      }
    } catch (err: any) {
      console.error("Upload failed:", err);
      const msg =
        err.response?.data?.errors?.image?.[0] ||
        err.response?.data?.message ||
        "Gagal mengupload banner";
      toast.error(msg);
    } finally {
      setUploading(null);
    }
  };

  const handleToggleActive = async (bannerId: number) => {
    try {
      const res = await api.put(`/admin/banners/${bannerId}/toggle`);
      if (res.data?.status === "success") {
        toast.success("Status banner diperbarui");
        fetchBanners();
      }
    } catch (err) {
      toast.error("Gagal mengubah status banner");
    }
  };

  const handleDrop = (
    e: React.DragEvent,
    bannerId: number,
    pageKey: string,
    slot: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleUpload(bannerId, pageKey, slot, files[0]);
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    bannerId: number,
    pageKey: string,
    slot: number,
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUpload(bannerId, pageKey, slot, files[0]);
    }
    e.target.value = "";
  };

  const getBannerForSlot = (
    pageKey: string,
    slot: number,
  ): BannerData | undefined => {
    const pageBanners = banners[pageKey];
    if (!pageBanners) return undefined;
    return pageBanners.find((b) => b.slot === slot);
  };

  const getImageUrl = (
    banner: BannerData | undefined,
    config: PageConfig,
    slotIndex: number,
  ): string | null => {
    if (banner?.image) return banner.image;
    return config.defaultImages[slotIndex] || null;
  };

  return (
    <div className="py-8 space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-200">
              <ImageIcon size={20} />
            </div>
            Kelola Banner
          </h1>
          <p className="text-sm text-gray-500 mt-1.5">
            Upload dan kelola gambar banner untuk semua halaman public website
          </p>
        </div>
        <button
          onClick={fetchBanners}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ── Info Banner ── */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Panduan Upload Banner</p>
          <ul className="text-blue-600 space-y-0.5 text-xs">
            <li>• Format yang didukung: JPEG, PNG, JPG, GIF, WebP</li>
            <li>• Ukuran maksimal: 5MB per gambar</li>
            <li>• Banner akan otomatis responsif di semua perangkat</li>
            <li>• Gunakan gambar landscape beresolusi tinggi untuk hasil terbaik</li>
          </ul>
        </div>
      </div>

      {/* ── Loading ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 size={32} className="text-blue-500 animate-spin" />
          <p className="text-sm text-gray-500">Memuat data banner...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {PAGE_CONFIGS.map((config) => (
            <div
              key={config.key}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Page Header */}
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white">
                    <Monitor size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {config.label}
                    </h3>
                    <p className="text-xs text-gray-500">{config.description}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
                  {config.slots} {config.slots > 1 ? "Slides" : "Banner"}
                </span>
              </div>

              {/* Slots Grid */}
              <div
                className={`p-6 grid gap-6 ${
                  config.slots > 1
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {Array.from({ length: config.slots }, (_, slotIndex) => {
                  const slot = slotIndex + 1;
                  const banner = getBannerForSlot(config.key, slot);
                  const imageUrl = getImageUrl(banner, config, slotIndex);
                  const uploadKey = `${config.key}-${slot}`;
                  const isUploading = uploading === uploadKey;

                  return (
                    <div key={slot} className="space-y-3">
                      {/* Slot Label */}
                      {config.slots > 1 && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Slide {slot}
                          </span>
                          {banner && (
                            <button
                              onClick={() => handleToggleActive(banner.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                banner.is_active
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                  : "bg-gray-100 text-gray-500 border border-gray-200"
                              }`}
                            >
                              {banner.is_active ? (
                                <>
                                  <Eye size={12} /> Active
                                </>
                              ) : (
                                <>
                                  <EyeOff size={12} /> Inactive
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )}

                      {/* Preview + Upload */}
                      <div
                        className="relative group rounded-xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors bg-gray-50"
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={(e) =>
                          banner
                            ? handleDrop(e, banner.id, config.key, slot)
                            : null
                        }
                      >
                        {/* Image Preview */}
                        {imageUrl ? (
                          <div className="relative aspect-[21/9]">
                            <img
                              src={imageUrl}
                              alt={`${config.label} Banner ${slot}`}
                              className="w-full h-full object-cover"
                            />
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-3">
                                <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                                  <Upload size={14} />
                                  Ganti Banner
                                  <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                    className="hidden"
                                    onChange={(e) =>
                                      banner
                                        ? handleFileSelect(
                                            e,
                                            banner.id,
                                            config.key,
                                            slot,
                                          )
                                        : null
                                    }
                                  />
                                </label>
                                <button
                                  onClick={() => setPreviewImage(imageUrl)}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-lg hover:bg-white/30 transition-colors border border-white/20"
                                >
                                  <Eye size={14} />
                                  Preview
                                </button>
                              </div>
                            </div>

                            {/* Status Badge */}
                            {banner && config.slots === 1 && (
                              <div className="absolute top-3 right-3">
                                <button
                                  onClick={() =>
                                    handleToggleActive(banner.id)
                                  }
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm ${
                                    banner.is_active
                                      ? "bg-green-500 text-white"
                                      : "bg-gray-700 text-gray-300"
                                  }`}
                                >
                                  {banner.is_active ? (
                                    <>
                                      <Eye size={10} /> Active
                                    </>
                                  ) : (
                                    <>
                                      <EyeOff size={10} /> Inactive
                                    </>
                                  )}
                                </button>
                              </div>
                            )}

                            {/* Custom Upload Badge */}
                            {banner?.image && (
                              <div className="absolute top-3 left-3">
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-wider rounded-md shadow-sm">
                                  <Check size={10} /> Custom
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Empty State */
                          <div className="aspect-[21/9] flex flex-col items-center justify-center gap-3 text-gray-400">
                            <ImageIcon size={32} className="text-gray-300" />
                            <p className="text-xs font-medium">
                              Belum ada banner
                            </p>
                          </div>
                        )}

                        {/* Upload Overlay */}
                        {isUploading && (
                          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-20">
                            <Loader2
                              size={28}
                              className="text-blue-500 animate-spin"
                            />
                            <p className="text-xs font-medium text-gray-600">
                              Mengupload banner...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Full Preview Modal ── */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-8"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-6xl w-full">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>
            <img
              src={previewImage}
              alt="Banner Preview"
              className="w-full h-auto rounded-xl shadow-2xl max-h-[80vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
