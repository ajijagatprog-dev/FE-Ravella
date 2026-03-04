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
} from "lucide-react";
import { type Product } from "../../../(public)/product/products";
import api from "@/lib/axios";

// ── Categories ────────────────────────────────────────────────────────────────
const CATEGORIES = [
    { value: "homeliving", label: "Home Living" },
    { value: "appliance", label: "Appliance" },
    { value: "ezy", label: "Ezy Series" },
    { value: "knife", label: "Knife" },
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
function emptyProduct(): Omit<Product, "id"> {
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
    const [editData, setEditData] = useState<Omit<Product, "id"> & { id?: number; imageFile?: File | null }>(emptyProduct());
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

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
                const mapped = fetchedData.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    originalPrice: item.price + (item.price * 0.2),
                    discount: 20,
                    image: item.image || "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&q=80",
                    category: item.category || "homeliving",
                    rating: 5.0,
                    reviews: 89,
                    badge: item.is_featured ? "Best Seller" : "New",
                    features: ["Premium Quality"],
                    inStock: item.stock > 0,
                    isNew: true,
                    description: item.description || "Deskripsi produk",
                    specifications: { "Berat": `${item.weight || 1000}g`, "SKU": item.slug },
                }));
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
        setModalMode("add");
    };

    const openEdit = (p: Product) => {
        setEditData({ ...p, imageFile: null });
        setModalMode("edit");
    };

    const handleSave = async () => {
        if (!editData.name.trim()) return;

        try {
            const formData = new FormData();
            formData.append('name', editData.name);
            formData.append('category', editData.category);
            formData.append('price', editData.price.toString());
            formData.append('sale_price', editData.originalPrice.toString());
            formData.append('stock', editData.inStock ? "100" : "0");
            formData.append('weight', "1000");
            formData.append('description', editData.description || editData.name);

            if (editData.badge === 'Best Seller') {
                formData.append('is_featured', '1');
            } else {
                formData.append('is_featured', '0');
            }

            if (editData.imageFile) {
                formData.append('image', editData.imageFile);
            }

            if (modalMode === "add") {
                await api.post('/products', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                showToast("Produk berhasil ditambahkan!");
            } else {
                formData.append('_method', 'PUT');
                await api.post(`/products/${editData.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                showToast("Produk berhasil diperbarui!");
            }

            setModalMode(null);
            fetchProducts();
        } catch (error) {
            console.error("Error saving product:", error);
            showToast("Gagal menyimpan produk. Periksa kembali data.");
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

                            {/* Image URL / File */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    <ImageIcon size={12} className="inline mr-1" /> Gambar Produk
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            const file = e.target.files[0];
                                            setEditData((d) => ({ ...d, imageFile: file, image: URL.createObjectURL(file) }));
                                        }
                                    }}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                                />
                                {editData.image && (
                                    <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                                        <img src={editData.image} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
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

                            {/* Price + Original Price + Discount */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Harga (Rp)</label>
                                    <input
                                        type="number"
                                        value={editData.price || ""}
                                        onChange={(e) => setEditData((d) => ({ ...d, price: Number(e.target.value) }))}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Harga Asli (Rp)</label>
                                    <input
                                        type="number"
                                        value={editData.originalPrice || ""}
                                        onChange={(e) => setEditData((d) => ({ ...d, originalPrice: Number(e.target.value) }))}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                                    />
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
