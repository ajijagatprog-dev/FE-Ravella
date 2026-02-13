"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  SlidersHorizontal,
} from "lucide-react";

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
    id: 5,
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
    id: 6,
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
];

// ===============================
// Page Component
// ===============================

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Modal State
  const [deleteTargetIds, setDeleteTargetIds] = useState<number[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // ===============================
  // Handlers
  // ===============================

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

  return (
    <div className="space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">
            Product Management
          </h1>
          <p className="text-sm text-gray-500">
            Organize inventory and manage SKU logistics.
          </p>
        </div>

        <button
          onClick={() => setOpenAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 transition-all"
        >
          <Plus size={18} />
          Add New Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-400 font-semibold px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="latest">Latest</option>
              <option value="stock-low">Stock: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Download size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <ProductTable
        products={filteredProducts}
        selectedProducts={selectedProducts}
        onSelectProduct={handleSelectProduct}
        onDeleteProduct={handleSingleDelete}
        onEditProduct={handleEditClick}
      />

      {/* Bulk Action */}
      <BulkActionBar
        selectedCount={selectedProducts.length}
        onBulkDelete={handleBulkDelete}
        onChangeCategory={() => {}}
        onMarkInactive={() => {}}
      />

      {/* Add Modal */}
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

      {/* Delete Modal */}
      <ModalDelete
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={confirmDelete}
        title={
          deleteTargetIds.length > 1
            ? `Delete ${deleteTargetIds.length} Products`
            : "Hapus Produk"
        }
        description="Apakah anda yakin ingin menghapus produk ini ?"
      />
    </div>
  );
}
