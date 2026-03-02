"use client";

import { useMemo, useState, useEffect } from "react";
import { Plus, Search, Download, Package, X, ChevronLeft, ChevronRight } from "lucide-react";

import ProductTable from "./components/ProductTable";
import BulkActionBar from "./components/BulkActionBar";
import ModalDelete from "./components/ModalDelete";
import ModalTambah from "./components/ModalTambah";
import ModalEdit from "./components/ModalEdit";
import api from "@/lib/axios";

interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  sku: string;
  stock: number;
  stockStatus: "high" | "medium" | "low";
  retailPrice: number;
  b2bPrice: number;
}

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const [deleteTargetIds, setDeleteTargetIds] = useState<number[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/products', {
        params: {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          search: searchQuery || undefined,
          sort: sortBy 
        }
      });
      if (res.data.status === 'success') {
        const fetchedData = res.data.data.data;
        // Map the backend product model to frontend Product interface if necessary
        // Assuming backend has: id, name, category, image, price (retailPrice), sale_price (b2bPrice), stock
        const mappedProducts = fetchedData.map((item: any) => ({
          id: item.id,
          name: item.name,
          category: item.category || 'homeliving',
          image: item.image || 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&q=80',
          sku: item.slug || `SKU-${item.id}`,
          stock: item.stock,
          stockStatus: item.stock > 50 ? 'high' : item.stock > 10 ? 'medium' : 'low',
          retailPrice: item.price,
          b2bPrice: item.sale_price !== null ? item.sale_price : item.price,
        }));

        setProducts(mappedProducts);
        setTotalProducts(res.data.data.total);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchQuery, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  const handleSelectProduct = (id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleAddProduct = (product: Product) => {
    fetchProducts();
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setOpenEditModal(true);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    fetchProducts();
  };

  const handleSingleDelete = (id: number) => {
    setDeleteTargetIds([id]);
    setOpenDeleteModal(true);
  };

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return;
    setDeleteTargetIds(selectedProducts);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      // Delete each product selected
      for (const id of deleteTargetIds) {
        await api.delete(`/products/${id}`);
      }
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product", error);
    }

    setSelectedProducts([]);
    setDeleteTargetIds([]);
    setOpenDeleteModal(false);
  };

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 py-6 sm:px-6 lg:px-8 bg-slate-50/30 min-h-screen">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-200">
              <Package size={24} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Product Inventory
            </h1>
          </div>
          <p className="text-slate-500 font-medium flex items-center gap-2 mt-2">
            Manage your store's stock and pricing in one place.
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
              {totalProducts} Items Total
            </span>
          </p>
        </div>

        <button
          onClick={() => setOpenAddModal(true)}
          className="group inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl shadow-blue-100 transition-all duration-200 w-full md:w-auto"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          Add New Product
        </button>
      </div>

      {/* ── Filter Card ── */}
      <div className="bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product name, SKU, or category..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 px-5 py-3 pr-10 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 cursor-pointer transition-all"
              >
                <option value="latest">Latest Entries</option>
                <option value="stock-low">Low Stock First</option>
                <option value="price-high">Highest Price</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            {/* Export Button */}
            <button className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 active:bg-slate-200 text-slate-700 text-sm font-bold transition-all">
              <Download size={18} className="text-slate-500" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Active search filter badge */}
        {searchQuery && (
          <div className="mt-4 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Results for:</span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold ring-1 ring-blue-200/50">
              "{searchQuery}"
              <button
                onClick={() => setSearchQuery("")}
                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          </div>
        )}
      </div>

      {/* ── Table Container ── */}
      <div className="rounded-3xl border border-slate-200/60 bg-white shadow-2xl shadow-slate-200/40 overflow-hidden">
        <ProductTable
          products={products}
          selectedProducts={selectedProducts}
          onSelectProduct={handleSelectProduct}
          onDeleteProduct={handleSingleDelete}
          onEditProduct={handleEditClick}
        />
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
          <p className="text-sm font-medium text-slate-500 order-2 sm:order-1">
            Showing page <span className="text-slate-900 font-bold">{currentPage}</span> of{" "}
            <span className="text-slate-900 font-bold">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-white hover:shadow-md disabled:opacity-30 disabled:hover:shadow-none transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
              {getPageNumbers().map((page, i) =>
                page === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-3 text-slate-400 font-bold">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    className={`min-w-[40px] h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${currentPage === page
                        ? "bg-white text-blue-600 shadow-sm scale-105"
                        : "text-slate-500 hover:text-slate-900"
                      }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-white hover:shadow-md disabled:opacity-30 disabled:hover:shadow-none transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Bulk Action Bar ── */}
      <BulkActionBar
        selectedCount={selectedProducts.length}
        onBulkDelete={handleBulkDelete}
        onChangeCategory={() => { }}
        onMarkInactive={() => { }}
      />

      {/* ── Modals ── */}
      <ModalTambah
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAddProduct={handleAddProduct}
      />

      <ModalEdit
        open={openEditModal}
        product={selectedProduct}
        onClose={() => setOpenEditModal(false)}
        onUpdateProduct={handleUpdateProduct}
      />

      <ModalDelete
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={confirmDelete}
        title={
          deleteTargetIds.length > 1
            ? `Hapus ${deleteTargetIds.length} Produk Terpilih?`
            : "Hapus Produk"
        }
        description={`Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus ${deleteTargetIds.length > 1 ? "produk-produk ini" : "produk ini"
          }?`}
      />
    </div>
  );
}