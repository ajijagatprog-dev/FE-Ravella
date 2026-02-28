"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Plus,
    Search,
    Newspaper,
    X,
    ChevronLeft,
    ChevronRight,
    Pencil,
    Trash2,
    Star as StarIcon,
    Image as ImageIcon,
    AlertTriangle,
    Check,
    Minus,
    Eye,
    Calendar,
    Clock,
} from "lucide-react";
import {
    type Article,
    getArticles,
    saveArticles,
    defaultArticles,
} from "../../../(public)/news/articles";

// ── Categories that exist in the news data ────────────────────────────────────
const CATEGORIES = ["Tips & Trik", "Tutorial", "Panduan", "Trend", "Resep"];

// ── Empty article template ────────────────────────────────────────────────────
function emptyArticle(): Omit<Article, "id"> {
    return {
        title: "",
        excerpt: "",
        image: "",
        category: "Tips & Trik",
        date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
        readTime: "5 min",
        views: "0",
        isFeatured: false,
        author: "",
        content: [""],
    };
}

// ══════════════════════════════════════════════════════════════════════════════
// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
export default function NewsContentPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [search, setSearch] = useState("");
    const [filterCat, setFilterCat] = useState("all");
    const [page, setPage] = useState(1);
    const PER_PAGE = 6;

    // Modal state
    const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
    const [editData, setEditData] = useState<Omit<Article, "id"> & { id?: number }>(emptyArticle());
    const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

    // Toast
    const [toast, setToast] = useState<{ message: string; visible: boolean }>({
        message: "",
        visible: false,
    });

    const showToast = (msg: string) => {
        setToast({ message: msg, visible: true });
        setTimeout(() => setToast({ message: "", visible: false }), 2500);
    };

    // Load from localStorage
    useEffect(() => {
        setArticles(getArticles());
    }, []);

    // ── Filter + Paginate ─────────────────────────────────────────────────────
    const filtered = useMemo(() => {
        let r = [...articles];
        if (search) r = r.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()));
        if (filterCat !== "all") r = r.filter((a) => a.category === filterCat);
        return r;
    }, [articles, search, filterCat]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    useEffect(() => { setPage(1); }, [search, filterCat]);

    // ── CRUD ──────────────────────────────────────────────────────────────────
    const openAdd = () => {
        setEditData(emptyArticle());
        setModalMode("add");
    };

    const openEdit = (a: Article) => {
        setEditData({ ...a });
        setModalMode("edit");
    };

    const handleSave = () => {
        if (!editData.title.trim()) return;
        let next: Article[];
        if (modalMode === "add") {
            const newId = articles.length ? Math.max(...articles.map((a) => a.id)) + 1 : 1;
            next = [{ ...editData, id: newId } as Article, ...articles];
        } else {
            next = articles.map((a) => (a.id === editData.id ? (editData as Article) : a));
        }
        setArticles(next);
        saveArticles(next);
        setModalMode(null);
        showToast(modalMode === "add" ? "Artikel berhasil ditambahkan!" : "Artikel berhasil diperbarui!");
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        const next = articles.filter((a) => a.id !== deleteTarget.id);
        setArticles(next);
        saveArticles(next);
        setDeleteTarget(null);
        showToast("Artikel berhasil dihapus!");
    };

    // ── Content paragraph helpers ─────────────────────────────────────────────
    const addParagraph = () => setEditData((d) => ({ ...d, content: [...d.content, ""] }));
    const removeParagraph = (i: number) =>
        setEditData((d) => ({ ...d, content: d.content.filter((_, idx) => idx !== i) }));
    const updateParagraph = (i: number, v: string) =>
        setEditData((d) => ({ ...d, content: d.content.map((c, idx) => (idx === i ? v : c)) }));

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
                            <Newspaper size={24} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Kelola Konten Berita
                        </h1>
                    </div>
                    <p className="text-slate-500 font-medium flex items-center gap-2 mt-2">
                        Kelola artikel berita yang ditampilkan di halaman public website.
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
                            {articles.length} Artikel
                        </span>
                    </p>
                </div>

                <button
                    onClick={openAdd}
                    className="group inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl shadow-blue-100 transition-all duration-200 w-full md:w-auto"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    Tambah Artikel
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
                            placeholder="Cari judul artikel..."
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
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* ── Articles Table ── */}
            <div className="rounded-3xl border border-slate-200/60 bg-white shadow-2xl shadow-slate-200/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200/80">
                                <th className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 px-6 py-4">Artikel</th>
                                <th className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 px-4 py-4">Kategori</th>
                                <th className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 px-4 py-4">Tanggal</th>
                                <th className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 px-4 py-4">Author</th>
                                <th className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 px-4 py-4">Info</th>
                                <th className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-500 px-4 py-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-16">
                                        <Newspaper className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-400 text-sm font-medium">Tidak ada artikel ditemukan</p>
                                    </td>
                                </tr>
                            ) : (
                                paginated.map((a) => (
                                    <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
                                                    <img src={a.image} alt={a.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-900 text-sm truncate max-w-[280px]">{a.title}</p>
                                                    <p className="text-xs text-slate-400 truncate max-w-[280px] mt-0.5">{a.excerpt.slice(0, 60)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold">
                                                {a.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                <Calendar size={12} />
                                                {a.date}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm text-slate-700 font-medium">{a.author}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                    <Clock size={12} /> {a.readTime}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                    <Eye size={12} /> {a.views} views
                                                </div>
                                                {a.isFeatured && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => openEdit(a)}
                                                    className="p-2 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all"
                                                    title="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(a)}
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
                        <span className="text-slate-900 font-bold">{filtered.length}</span> artikel
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
                                {modalMode === "add" ? "Tambah Artikel Baru" : "Edit Artikel"}
                            </h2>
                            <button onClick={() => setModalMode(null)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
                            {/* Title */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Judul Artikel *</label>
                                <input
                                    type="text"
                                    value={editData.title}
                                    onChange={(e) => setEditData((d) => ({ ...d, title: e.target.value }))}
                                    placeholder="Masukkan judul artikel..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                                />
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    <ImageIcon size={12} className="inline mr-1" /> URL Gambar Cover
                                </label>
                                <input
                                    type="text"
                                    value={editData.image}
                                    onChange={(e) => setEditData((d) => ({ ...d, image: e.target.value }))}
                                    placeholder="https://..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                                />
                                {editData.image && (
                                    <div className="mt-2 w-32 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                        <img src={editData.image} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ringkasan (Excerpt)</label>
                                <textarea
                                    rows={2}
                                    value={editData.excerpt}
                                    onChange={(e) => setEditData((d) => ({ ...d, excerpt: e.target.value }))}
                                    placeholder="Tulis ringkasan singkat artikel..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 resize-none"
                                />
                            </div>

                            {/* Category + Author */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kategori</label>
                                    <select
                                        value={editData.category}
                                        onChange={(e) => setEditData((d) => ({ ...d, category: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                                    >
                                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Author</label>
                                    <input
                                        type="text"
                                        value={editData.author}
                                        onChange={(e) => setEditData((d) => ({ ...d, author: e.target.value }))}
                                        placeholder="Nama penulis..."
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Date + Read Time + Views */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal</label>
                                    <input
                                        type="text"
                                        value={editData.date}
                                        onChange={(e) => setEditData((d) => ({ ...d, date: e.target.value }))}
                                        placeholder="15 Januari 2026"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Waktu Baca</label>
                                    <input
                                        type="text"
                                        value={editData.readTime}
                                        onChange={(e) => setEditData((d) => ({ ...d, readTime: e.target.value }))}
                                        placeholder="5 min"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Views</label>
                                    <input
                                        type="text"
                                        value={editData.views}
                                        onChange={(e) => setEditData((d) => ({ ...d, views: e.target.value }))}
                                        placeholder="2.5k"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Featured Toggle */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={editData.isFeatured}
                                    onChange={(e) => setEditData((d) => ({ ...d, isFeatured: e.target.checked }))}
                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-700 font-medium">Artikel Unggulan (Featured)</span>
                            </label>

                            {/* Content Paragraphs */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Konten Artikel</label>
                                    <button onClick={addParagraph} className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                        <Plus size={14} /> Tambah Paragraf
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {editData.content.map((c, i) => (
                                        <div key={i} className="flex gap-2">
                                            <span className="text-xs text-slate-400 font-bold mt-3 shrink-0 w-6 text-right">P{i + 1}</span>
                                            <textarea
                                                rows={3}
                                                value={c}
                                                onChange={(e) => updateParagraph(i, e.target.value)}
                                                placeholder={`Paragraf ke-${i + 1}...`}
                                                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 resize-none"
                                            />
                                            {editData.content.length > 1 && (
                                                <button onClick={() => removeParagraph(i)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors self-start mt-2">
                                                    <Minus size={14} />
                                                </button>
                                            )}
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
                                disabled={!editData.title.trim()}
                                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-200 disabled:opacity-50 transition-all"
                            >
                                {modalMode === "add" ? "Tambah Artikel" : "Simpan Perubahan"}
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
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Hapus Artikel?</h3>
                        <p className="text-sm text-slate-500 mb-6">
                            Artikel <span className="font-semibold text-slate-700">&quot;{deleteTarget.title}&quot;</span> akan dihapus dari website public. Tindakan ini tidak dapat dibatalkan.
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
