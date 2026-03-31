"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Plus,
    Search,
    Package,
    X,
    ChevronLeft,
    ChevronRight,
    Pencil,
    Trash2,
    Star,
    Image as ImageIcon,
    Tag,
    AlertTriangle,
    Check,
    Minus,
    Film,
    Upload,
    Crown,
} from "lucide-react";
import { type Product } from "../../../(public)/product/products";
import api from "@/lib/axios";

// ── Categories ────────────────────────────────────────────────────────────────
const CATEGORIES = [
    { value: "Home & Kitchen Appliance", label: "Home & Kitchen Appliance" },
    { value: "Knife set", label: "Knife set" },
    { value: "ezy series", label: "ezy series" },
    { value: "home living", label: "home living" },
    { value: "keyboard", label: "keyboard" },
];

const BADGES = ["Best Seller", "Premium", "Popular", "New"];

// ── Format helpers ────────────────────────────────────────────────────────────
const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(n);

// ── Empty product template ────────────────────────────────────────────────────
interface MediaItem {
    id?: number; // existing media from DB
    type: 'image' | 'video';
    url: string; // preview URL or server URL
    file?: File; // new file to upload
    is_primary: boolean;
}

function emptyProduct(): Omit<Product, "id"> & { b2bPrice?: number; videoUrl?: string } {
    return {
        name: "",
        price: 0,
        originalPrice: 0,
        image: "",
        category: "homeliving",
        rating: 0,
        reviews: 0,
        badge: "New",
        discount: 0,
        features: [],
        inStock: true,
        isNew: true,
        description: "",
        specifications: {},
        b2bPrice: 0,
        videoUrl: "",
    };
}

// ══════════════════════════════════════════════════════════════════════════════
// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
export default function ProductContentPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterCat, setFilterCat] = useState("all");
    const [page, setPage] = useState(1);
    const PER_PAGE = 6;

    // Modal state
    const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
    const [editData, setEditData] = useState<Omit<Product, "id"> & { id?: number; imageFile?: File | null; b2bPrice?: number; videoUrl?: string }>(emptyProduct());
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [deleteMediaIds, setDeleteMediaIds] = useState<number[]>([]);

    // Toast
    const [toast, setToast] = useState<{ message: string; visible: boolean }>({
        message: "",
        visible: false,
    });

    const showToast = (msg: string) => {
        setToast({ message: msg, visible: true });
        setTimeout(() => setToast({ message: "", visible: false }), 2500);
    };

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const res = await api.get('/products', { params: { limit: 100 } });
            if (res.data.status === 'success') {
                const fetchedData = res.data.data.data;
                const mapped = fetchedData.map((item: any) => {
                    // Get primary image from media, fallback to legacy image field
                    const primaryMedia = item.media?.find((m: any) => m.is_primary) || item.media?.[0];
                    const thumbnail = primaryMedia?.url || item.image || "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&q=80";
                    return {
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        originalPrice: item.sale_price !== null ? item.sale_price : item.price,
                        discount: item.discount || 0,
                        image: thumbnail,
                        category: item.category || "homeliving",
                        rating: item.rating ? parseFloat(item.rating) : 0,
                        reviews: item.reviews || 0,
                        badge: item.badge || (item.is_featured ? "Best Seller" : "New"),
                        features: Array.isArray(item.features) ? item.features : [],
                        inStock: item.stock > 0,
                        isNew: true,
                        description: item.description || "Deskripsi produk",
                        specifications: typeof item.specifications === 'object' && item.specifications !== null ? item.specifications : {},
                        b2bPrice: item.b2b_price || 0,
                        videoUrl: item.video_url || "",
                        _media: item.media || [],
                    };
                });
                setProducts(mapped);
            }
        } catch (err) {
            console.error("Failed to fetch backend products", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Load from backend
    useEffect(() => {
        fetchProducts();
    }, []);

    // ── Filter + Paginate ─────────────────────────────────────────────────────
    const filtered = useMemo(() => {
        let r = [...products];
        if (search) r = r.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
        if (filterCat !== "all") r = r.filter((p) => p.category === filterCat);
        return r;
    }, [products, search, filterCat]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    useEffect(() => { setPage(1); }, [search, filterCat]);

    // ── CRUD ──────────────────────────────────────────────────────────────────
    const openAdd = () => {
        setEditData({ ...emptyProduct(), imageFile: null });
        setMediaItems([]);
        setDeleteMediaIds([]);
        setModalMode("add");
    };

    const openEdit = (p: any) => {
        setEditData({ ...p, imageFile: null });
        // Load existing media into state
        const existingMedia: MediaItem[] = (p._media || []).map((m: any) => ({
            id: m.id,
            type: m.type as 'image' | 'video',
            url: m.url,
            is_primary: m.is_primary,
        }));
        setMediaItems(existingMedia);
        setDeleteMediaIds([]);
        setModalMode("edit");
    };

    const handleAddMediaFiles = (files: FileList) => {
        const newItems: MediaItem[] = Array.from(files).map((file) => {
            const isVideo = file.type.startsWith('video/');
            return {
                type: isVideo ? 'video' as const : 'image' as const,
                url: URL.createObjectURL(file),
                file,
                is_primary: false,
            };
        });
        setMediaItems(prev => {
            const combined = [...prev, ...newItems].slice(0, 10); // Max 10 total
            // If no primary set, auto-set first image
            if (!combined.some(m => m.is_primary)) {
                const firstImg = combined.find(m => m.type === 'image');
                if (firstImg) firstImg.is_primary = true;
            }
            return combined;
        });
    };

    const handleRemoveMedia = (index: number) => {
        setMediaItems(prev => {
            const item = prev[index];
            if (item.id) setDeleteMediaIds(ids => [...ids, item.id!]);
            const next = prev.filter((_, i) => i !== index);
            // Re-assign primary if removed
            if (item.is_primary && next.length > 0) {
                const firstImg = next.find(m => m.type === 'image');
                if (firstImg) firstImg.is_primary = true;
            }
            return next;
        });
    };

    const handleSetPrimary = (index: number) => {
        setMediaItems(prev => prev.map((m, i) => ({ ...m, is_primary: i === index })));
    };

    const handleSave = async () => {
        if (!editData.name.trim()) return;

        try {
            const formData = new FormData();
            formData.append('name', editData.name);
            formData.append('category', editData.category);
            formData.append('price', editData.price.toString());
            formData.append('sale_price', editData.originalPrice.toString());
            if (editData.b2bPrice && editData.b2bPrice > 0) {
                formData.append('b2b_price', editData.b2bPrice.toString());
            }
            if (editData.videoUrl && editData.videoUrl.trim()) {
                formData.append('video_url', editData.videoUrl.trim());
            }
            formData.append('stock', editData.inStock ? "100" : "0");
            formData.append('weight', "1000");
            formData.append('description', editData.description || editData.name);
            formData.append('badge', editData.badge || 'New');
            formData.append('discount', (editData.discount || 0).toString());
            formData.append('rating', (editData.rating || 0).toString());
            formData.append('reviews', (editData.reviews || 0).toString());

            if (editData.badge === 'Best Seller') {
                formData.append('is_featured', '1');
            } else {
                formData.append('is_featured', '0');
            }

            if (editData.features && editData.features.length > 0) {
                const cleanFeatures = editData.features.filter(f => f.trim() !== "");
                formData.append('features', JSON.stringify(cleanFeatures));
            }

            if (editData.specifications && Object.keys(editData.specifications).length > 0) {
                const cleanSpecs = Object.fromEntries(
                    Object.entries(editData.specifications).filter(([k, v]) => k.trim() !== "" && v.trim() !== "")
                );
                formData.append('specifications', JSON.stringify(cleanSpecs));
            }

            // Append new media files
            const newMediaFiles = mediaItems.filter(m => m.file);
            newMediaFiles.forEach(m => {
                formData.append('media_files[]', m.file!);
            });

            // Append media to delete (for edit mode)
            if (deleteMediaIds.length > 0) {
                formData.append('delete_media_ids', JSON.stringify(deleteMediaIds));
            }

            // Set primary media
            const primaryItem = mediaItems.find(m => m.is_primary && m.id);
            if (primaryItem?.id) {
                formData.append('primary_media_id', primaryItem.id.toString());
            }

            // Legacy: if no media items but has imageFile
            if (editData.imageFile) {
                formData.append('image', editData.imageFile);
            }

            let token = "";
            const authData = localStorage.getItem('auth');
            if (authData) {
                try {
                    const parsed = JSON.parse(authData);
                    if (parsed.token) token = parsed.token;
                } catch (e) { }
            }

            if (modalMode === "add") {
                await api.post('/products', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });
                showToast("Produk berhasil ditambahkan!");
            } else {
                formData.append('_method', 'PUT');
                await api.post(`/products/${editData.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });
                showToast("Produk berhasil diperbarui!");
            }

            setModalMode(null);
            setMediaItems([]);
            setDeleteMediaIds([]);
            fetchProducts();
        } catch (error: any) {
            console.error("Error saving product:", error);
            let msg = "Gagal menyimpan produk. Periksa kembali data.";
            if (error?.response?.data?.errors) {
                const errs = error.response.data.errors;
                const firstErr = Object.values(errs).flat()[0];
                if (typeof firstErr === 'string') {
                    if (firstErr.includes('failed to upload')) {
                        msg = "File terlalu besar! Max: gambar 2MB, video 50MB.";
                    } else {
                        msg = firstErr;
                    }
                }
            }
            showToast(msg);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;

        try {
            await api.delete(`/products/${deleteTarget.id}`);
            showToast("Produk berhasil dihapus!");
            setDeleteTarget(null);
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
            showToast("Gagal menghapus produk.");
        }
    };

    // ── Feature / Spec helpers ────────────────────────────────────────────────
    const addFeature = () => setEditData((d) => ({ ...d, features: [...d.features, ""] }));
    const removeFeature = (i: number) =>
        setEditData((d) => ({ ...d, features: d.features.filter((_, idx) => idx !== i) }));
    const updateFeature = (i: number, v: string) =>
        setEditData((d) => ({ ...d, features: d.features.map((f, idx) => (idx === i ? v : f)) }));

    const addSpec = () =>
        setEditData((d) => ({ ...d, specifications: { ...d.specifications, "": "" } }));
    const removeSpec = (key: string) =>
        setEditData((d) => {
            const s = { ...d.specifications };
            delete s[key];
            return { ...d, specifications: s };
        });
    const updateSpecKey = (oldKey: string, newKey: string) =>
        setEditData((d) => {
            const entries = Object.entries(d.specifications);
            const updated = Object.fromEntries(
                entries.map(([k, v]) => (k === oldKey ? [newKey, v] : [k, v]))
            );
            return { ...d, specifications: updated };
        });
    const updateSpecVal = (key: string, val: string) =>
        setEditData((d) => ({ ...d, specifications: { ...d.specifications, [key]: val } }));

    // ── Pagination numbers ────────────────────────────────────────────────────
    const getPages = () => {
        const ps: (number | "...")[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) ps.push(i);
        } else {
            ps.push(1);
            if (page > 3) ps.push("...");
            for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) ps.push(i);
            if (page < totalPages - 2) ps.push("...");
            ps.push(totalPages);
        }
        return ps;
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 px-4 py-6 sm:px-6 lg:px-8 bg-slate-50/30 min-h-screen">
            {/* ── Toast ── */}
            <div
                className={`fixed top-6 right-6 z-[100] transition-all duration-500 ${toast.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                    }`}
            >
                <div className="flex items-center gap-3 bg-white border border-blue-200 shadow-xl px-5 py-4 rounded-2xl min-w-[280px]">
                    <Check className="w-5 h-5 text-blue-500 shrink-0" />
                    <p className="text-sm font-semibold text-slate-800">{toast.message}</p>
                </div>
            </div>

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-200">
                            <Package size={24} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Kelola Konten Produk
                        </h1>
                    </div>
                    <p className="text-slate-500 font-medium flex items-center gap-2 mt-2">
                        Kelola produk yang ditampilkan di halaman public website.
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
                            {products.length} Produk
                        </span>
                    </p>
                </div>

                <button
                    onClick={openAdd}
                    className="group inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl shadow-blue-100 transition-all duration-200 w-full md:w-auto"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    Tambah Produk
                </button>
            </div>

            {/* ── Filter Bar ── */}
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama produk..."
                            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <div className="relative flex-1 sm:flex-none">
                        <select
                            value={filterCat}
                            onChange={(e) => setFilterCat(e.target.value)}
                            className="w-full appearance-none bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 px-5 py-3 pr-10 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 cursor-pointer transition-all"
                        >
                            <option value="all">Semua Kategori</option>
                            {CATEGORIES.map((c) => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* ── Product Table ── */}
            <div className="rounded-3xl border border-slate-200/60 bg-white shadow-2xl shadow-slate-200/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200/80">
                                <th className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 px-6 py-4">Produk</th>
                                <th className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 px-4 py-4">Kategori</th>
                                <th className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 px-4 py-4">Harga</th>
                                <th className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 px-4 py-4">Badge</th>
                                <th className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 px-4 py-4">Status</th>
                                <th className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-500 px-4 py-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-16">
                                        <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-400 text-sm font-medium">Tidak ada produk ditemukan</p>
                                    </td>
                                </tr>
                            ) : (
                                paginated.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
                                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-900 text-sm truncate max-w-[260px]">{p.name}</p>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                        <span className="text-xs text-slate-500">{p.rating} ({p.reviews})</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold capitalize">
                                                {CATEGORIES.find((c) => c.value === p.category)?.label || p.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="font-bold text-slate-900 text-sm">{fmt(p.price)}</p>
                                            {p.originalPrice > p.price && (
                                                <p className="text-xs text-slate-400 line-through">{fmt(p.originalPrice)}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${p.badge === "Best Seller" ? "bg-amber-100 text-amber-700" :
                                                p.badge === "Premium" ? "bg-purple-100 text-purple-700" :
                                                    p.badge === "Popular" ? "bg-blue-100 text-blue-700" :
                                                        "bg-blue-100 text-blue-700"
                                                }`}>
                                                {p.badge}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-2 h-2 rounded-full ${p.inStock ? "bg-blue-500" : "bg-red-400"}`} />
                                                <span className="text-xs font-medium text-slate-600">
                                                    {p.inStock ? "In Stock" : "Out of Stock"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => openEdit(p)}
                                                    className="p-2 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all"
                                                    title="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(p)}
                                                    className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
                    <p className="text-sm font-medium text-slate-500 order-2 sm:order-1">
                        Menampilkan <span className="text-slate-900 font-bold">{paginated.length}</span> dari{" "}
                        <span className="text-slate-900 font-bold">{filtered.length}</span> produk
                    </p>
                    <div className="flex items-center gap-2 order-1 sm:order-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-white hover:shadow-md disabled:opacity-30 transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
                            {getPages().map((pg, i) =>
                                pg === "..." ? (
                                    <span key={`e-${i}`} className="px-3 text-slate-400 font-bold">...</span>
                                ) : (
                                    <button
                                        key={pg}
                                        onClick={() => setPage(pg as number)}
                                        className={`min-w-[40px] h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${page === pg ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                                            }`}
                                    >
                                        {pg}
                                    </button>
                                )
                            )}
                        </div>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-white hover:shadow-md disabled:opacity-30 transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════════ */}
            {/* ── ADD / EDIT MODAL ─────────────────────────────────────────────── */}
            {/* ══════════════════════════════════════════════════════════════════════ */}
            {modalMode && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm pt-10 px-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mb-10 border border-slate-200/60">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900">
                                {modalMode === "add" ? "Tambah Produk Baru" : "Edit Produk"}
                            </h2>
                            <button onClick={() => setModalMode(null)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
                            {/* Name */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Produk *</label>
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => setEditData((d) => ({ ...d, name: e.target.value }))}
                                    placeholder="Masukkan nama produk..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                                />
                            </div>

                            {/* Multi-Media Gallery Upload */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    <ImageIcon size={12} className="inline mr-1" /> Gambar & Video Produk
                                </label>
                                <p className="text-[10px] text-slate-400 mb-2">Max 8 gambar + 2 video. Klik ⭐ untuk set gambar utama.</p>

                                {/* Media Preview Grid */}
                                {mediaItems.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2 mb-3">
                                        {mediaItems.map((item, idx) => (
                                            <div key={idx} className={`relative group rounded-lg overflow-hidden border-2 aspect-square ${item.is_primary ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200'}`}>
                                                {item.type === 'image' ? (
                                                    <img src={item.url} alt={`Media ${idx}`} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                                        <Film className="w-8 h-8 text-white/60" />
                                                        <span className="absolute bottom-1 left-1 text-[9px] text-white bg-black/60 px-1.5 py-0.5 rounded">VIDEO</span>
                                                    </div>
                                                )}
                                                {/* Overlay actions */}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                                    {item.type === 'image' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSetPrimary(idx)}
                                                            title="Set as primary"
                                                            className={`p-1.5 rounded-lg transition-colors ${item.is_primary ? 'bg-blue-500 text-white' : 'bg-white/90 text-slate-700 hover:bg-blue-100'}`}
                                                        >
                                                            <Crown className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveMedia(idx)}
                                                        className="p-1.5 rounded-lg bg-white/90 text-red-500 hover:bg-red-50 transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                {item.is_primary && (
                                                    <span className="absolute top-1 left-1 text-[8px] font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded">UTAMA</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Upload Button */}
                                <label className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                                    <Upload size={16} />
                                    <span>Klik untuk upload gambar / video</span>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                handleAddMediaFiles(e.target.files);
                                            }
                                            e.target.value = ''; // Reset input
                                        }}
                                    />
                                </label>
                                <p className="text-[10px] text-slate-400 mt-1">Format: JPG, PNG, WebP (max 2MB) • MP4, WebM (max 50MB)</p>
                            </div>

                            {/* Category + Badge */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kategori</label>
                                    <select
                                        value={editData.category}
                                        onChange={(e) => setEditData((d) => ({ ...d, category: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                                    >
                                        {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Badge</label>
                                    <select
                                        value={editData.badge}
                                        onChange={(e) => setEditData((d) => ({ ...d, badge: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                                    >
                                        {BADGES.map((b) => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Harga Jual (Rp) *</label>
                                    <input
                                        type="number"
                                        value={editData.price || ""}
                                        onChange={(e) => setEditData((d) => ({ ...d, price: Number(e.target.value) }))}
                                        placeholder="Harga yang dibayar customer"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">Harga yang dibayar customer di web public</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Harga Sebelum Diskon (Rp)</label>
                                    <input
                                        type="number"
                                        value={editData.originalPrice || ""}
                                        onChange={(e) => setEditData((d) => ({ ...d, originalPrice: Number(e.target.value) }))}
                                        placeholder="Harga coret (opsional)"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">Ditampilkan sebagai harga coret jika lebih tinggi dari Harga Jual</p>
                                </div>
                            </div>

                            {/* B2B Price + Discount */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Harga B2B (Rp)</label>
                                    <input
                                        type="number"
                                        value={editData.b2bPrice || ""}
                                        onChange={(e) => setEditData((d) => ({ ...d, b2bPrice: Number(e.target.value) }))}
                                        placeholder="Harga khusus B2B"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">Harga khusus untuk mitra B2B/agen</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Diskon (%)</label>
                                    <input
                                        type="number"
                                        value={editData.discount || ""}
                                        onChange={(e) => setEditData((d) => ({ ...d, discount: Number(e.target.value) }))}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Video URL */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Video Produk (URL)</label>
                                <input
                                    type="text"
                                    value={editData.videoUrl || ""}
                                    onChange={(e) => setEditData((d) => ({ ...d, videoUrl: e.target.value }))}
                                    placeholder="https://www.youtube.com/watch?v=... atau link embed"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                                />
                                <p className="text-[10px] text-slate-400 mt-1">Copy-paste link YouTube/TikTok untuk ditampilkan di halaman detail produk</p>
                            </div>

                            {/* Rating + Reviews */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Rating</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        value={editData.rating || ""}
                                        onChange={(e) => setEditData((d) => ({ ...d, rating: Number(e.target.value) }))}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jumlah Review</label>
                                    <input
                                        type="number"
                                        value={editData.reviews || ""}
                                        onChange={(e) => setEditData((d) => ({ ...d, reviews: Number(e.target.value) }))}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Deskripsi</label>
                                <textarea
                                    rows={3}
                                    value={editData.description}
                                    onChange={(e) => setEditData((d) => ({ ...d, description: e.target.value }))}
                                    placeholder="Tulis deskripsi produk..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 resize-none"
                                />
                            </div>

                            {/* Toggles */}
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editData.inStock}
                                        onChange={(e) => setEditData((d) => ({ ...d, inStock: e.target.checked }))}
                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-slate-700 font-medium">In Stock</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editData.isNew}
                                        onChange={(e) => setEditData((d) => ({ ...d, isNew: e.target.checked }))}
                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-slate-700 font-medium">Produk Baru</span>
                                </label>
                            </div>

                            {/* Features */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fitur</label>
                                    <button onClick={addFeature} className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                        <Plus size={14} /> Tambah Fitur
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {editData.features.map((f, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={f}
                                                onChange={(e) => updateFeature(i, e.target.value)}
                                                placeholder="Nama fitur..."
                                                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                                            />
                                            <button onClick={() => removeFeature(i)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                                                <Minus size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Specifications */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Spesifikasi</label>
                                    <button onClick={addSpec} className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                        <Plus size={14} /> Tambah Spesifikasi
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {Object.entries(editData.specifications).map(([k, v], i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={k}
                                                onChange={(e) => updateSpecKey(k, e.target.value)}
                                                placeholder="Key"
                                                className="w-1/3 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                value={v}
                                                onChange={(e) => updateSpecVal(k, e.target.value)}
                                                placeholder="Value"
                                                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                                            />
                                            <button onClick={() => removeSpec(k)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                                                <Minus size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
                            <button onClick={() => setModalMode(null)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                                Batal
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!editData.name.trim()}
                                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-200 disabled:opacity-50 transition-all"
                            >
                                {modalMode === "add" ? "Tambah Produk" : "Simpan Perubahan"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════════ */}
            {/* ── DELETE MODAL ──────────────────────────────────────────────────── */}
            {/* ══════════════════════════════════════════════════════════════════════ */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-200/60 p-6 text-center">
                        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-7 h-7 text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Hapus Produk?</h3>
                        <p className="text-sm text-slate-500 mb-6">
                            Produk <span className="font-semibold text-slate-700">&quot;{deleteTarget.name}&quot;</span> akan dihapus dari website public. Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteTarget(null)} className="flex-1 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                                Batal
                            </button>
                            <button onClick={confirmDelete} className="flex-1 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all">
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
