"use client";

import { useMemo, useState, useEffect } from "react";
import { Plus, Search, Download } from "lucide-react";

import ProductTable from "./components/ProductTable";
import BulkActionBar from "./components/BulkActionBar";
import ModalDelete from "./components/ModalDelete";
import ModalTambah from "./components/ModalTambah";
import ModalEdit from "./components/ModalEdit";

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

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Ravelle Airflex Vacuum Cleaner",
    category: "homeliving",
    image:
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&q=80",
    sku: "RV-TSH-001",
    stock: 142,
    stockStatus: "high",
    retailPrice: 798900,
    b2bPrice: 598900,
  },
  {
    id: 2,
    name: "Ravelle SOLIS Dehumidifier & Air Purifier 2in1 2L",
    category: "homeliving",
    image:
      "https://www.ravelle.co.id/data/product_cover/224-20250520175323.png",
    sku: "RV-JNS-402",
    stock: 8,
    stockStatus: "low",
    retailPrice: 1799900,
    b2bPrice: 850000,
  },
  {
    id: 3,
    name: "Ravelle High Speed Hair Dryer-grey",
    category: "homeliving",
    image:
      "https://www.ravelle.co.id/data/product_cover/207-20250109102859.png",
    sku: "RV-JKT-115",
    stock: 24,
    stockStatus: "medium",
    retailPrice: 899900,
    b2bPrice: 799900,
  },
  {
    id: 4,
    name: "Product 4",
    category: "homeliving",
    image:
      "https://www.ravelle.co.id/data/product_cover/207-20250109102859.png",
    sku: "RV-004",
    stock: 24,
    stockStatus: "medium",
    retailPrice: 899900,
    b2bPrice: 799900,
  },
  {
    id: 5,
    name: "Product 5",
    category: "homeliving",
    image:
      "https://www.ravelle.co.id/data/product_cover/207-20250109102859.png",
    sku: "RV-005",
    stock: 24,
    stockStatus: "medium",
    retailPrice: 899900,
    b2bPrice: 799900,
  },
  {
    id: 6,
    name: "Product 6",
    category: "homeliving",
    image:
      "https://www.ravelle.co.id/data/product_cover/207-20250109102859.png",
    sku: "RV-006",
    stock: 24,
    stockStatus: "medium",
    retailPrice: 899900,
    b2bPrice: 799900,
  },
  {
    id: 7,
    name: "Product 7",
    category: "homeliving",
    image:
      "https://www.ravelle.co.id/data/product_cover/207-20250109102859.png",
    sku: "RV-007",
    stock: 24,
    stockStatus: "medium",
    retailPrice: 899900,
    b2bPrice: 799900,
  },
  {
    id: 8,
    name: "Product 8",
    category: "homeliving",
    image:
      "https://www.ravelle.co.id/data/product_cover/207-20250109102859.png",
    sku: "RV-008",
    stock: 24,
    stockStatus: "medium",
    retailPrice: 899900,
    b2bPrice: 799900,
  },
  {
    id: 9,
    name: "Product 9",
    category: "homeliving",
    image:
      "https://www.ravelle.co.id/data/product_cover/207-20250109102859.png",
    sku: "RV-009",
    stock: 24,
    stockStatus: "medium",
    retailPrice: 899900,
    b2bPrice: 799900,
  },
  {
    id: 10,
    name: "Product 10",
    category: "homeliving",
    image:
      "https://www.ravelle.co.id/data/product_cover/207-20250109102859.png",
    sku: "RV-010",
    stock: 24,
    stockStatus: "medium",
    retailPrice: 899900,
    b2bPrice: 799900,
  },
  {
    id: 11,
    name: "Product 11",
    category: "homeliving",
    image:
      "https://www.ravelle.co.id/data/product_cover/207-20250109102859.png",
    sku: "RV-011",
    stock: 24,
    stockStatus: "medium",
    retailPrice: 899900,
    b2bPrice: 799900,
  },
];

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const [deleteTargetIds, setDeleteTargetIds] = useState<number[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  const handleSelectProduct = (id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleAddProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setOpenEditModal(true);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    );
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

  const confirmDelete = () => {
    setProducts((prev) =>
      prev.filter((product) => !deleteTargetIds.includes(product.id)),
    );

    setSelectedProducts([]);
    setDeleteTargetIds([]);
    setOpenDeleteModal(false);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (sortBy === "stock-low") {
      result.sort((a, b) => a.stock - b.stock);
    }

    if (sortBy === "price-high") {
      result.sort((a, b) => b.retailPrice - a.retailPrice);
    }

    return result;
  }, [products, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Pagination pages with ellipsis
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-6 px-4 sm:px-0">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Product Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Organize inventory and manage SKU logistics.
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200">
              {products.length} products
            </span>
          </p>
        </div>

        <button
          onClick={() => setOpenAddModal(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-colors"
        >
          <Plus size={16} />
          Add New Product
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="latest">Sort: Latest</option>
              <option value="stock-low">Stock: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            {/* Export */}
            <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 text-sm font-medium transition-colors">
              <Download size={15} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Active search hint */}
        {searchQuery && (
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <span>
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredProducts.length}
              </span>{" "}
              result{filteredProducts.length !== 1 ? "s" : ""} for
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium ring-1 ring-blue-200">
              "{searchQuery}"
              <button
                onClick={() => setSearchQuery("")}
                className="ml-0.5 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <ProductTable
        products={paginatedProducts}
        selectedProducts={selectedProducts}
        onSelectProduct={handleSelectProduct}
        onDeleteProduct={handleSingleDelete}
        onEditProduct={handleEditClick}
      />

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Page{" "}
            <span className="font-semibold text-slate-700">{currentPage}</span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">{totalPages}</span>
            <span className="ml-2 text-slate-400">
              ({filteredProducts.length} total)
            </span>
          </p>

          <div className="flex items-center gap-1">
            {/* Prev */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
            >
              ‹
            </button>

            {getPageNumbers().map((page, i) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 text-sm"
                >
                  …
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page as number)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-blue-600 text-white shadow-sm"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            {/* Next */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* ── Bulk Action Bar ── */}
      <BulkActionBar
        selectedCount={selectedProducts.length}
        onBulkDelete={handleBulkDelete}
        onChangeCategory={() => {}}
        onMarkInactive={() => {}}
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
            ? `Delete ${deleteTargetIds.length} Products`
            : "Hapus Produk"
        }
        description="Apakah anda yakin ingin menghapus produk ini?"
      />
    </div>
  );
}
