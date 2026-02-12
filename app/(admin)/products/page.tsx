"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  SlidersHorizontal,
} from "lucide-react";
import ProductTable from "./components/ProductTable";
import BulkActionBar from "./components/BulkActionBar";

// Sample data
const productsData = [
  {
    id: 1,
    name: "Ravelle Airflex Vacuum Cleaner",
    category: "homeliving",
    image:
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&q=80",
    sku: "RV-TSH-001",
    stock: 142,
    stockStatus: "high" as const,
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
    stockStatus: "low" as const,
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
    stockStatus: "medium" as const,
    retailPrice: 899900,
    b2bPrice: 799900,
  },
  {
    id: 4,
    name: "Ravelle Luxe Air Purifier HEPA13 + Anti-Allergen",
    category: "Tops / Hoodies",
    image:
      "https://www.ravelle.co.id/data/product_cover/223-20250520175032.png",
    sku: "RV-HOD-881",
    stock: 64,
    stockStatus: "high" as const,
    retailPrice: 75.0,
    b2bPrice: 40.0,
  },
  {
    id: 5,
    name: "Ravelle Ezy Squeenze Citrus Juicer- Cream",
    category: "homeliving",
    image:
      "https://www.ravelle.co.id/data/product_cover/218-20250520162617.png",
    sku: "RV-SHR-303",
    stock: 210,
    stockStatus: "high" as const,
    retailPrice: 559900,
    b2bPrice: 749900,
  },
];

export default function ProductManagementPage() {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleSelectProduct = (id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Breadcrumbs & Header */}
      <div className="space-y-3 sm:space-y-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-500">
          <span className="font-medium">DASHBOARD</span>
          <span>›</span>
          <span className="text-gray-900 font-semibold">PRODUCTS</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 mb-1 truncate">
              Product Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
              Organize inventory, modify pricing, and manage SKU logistics.
            </p>
          </div>

          <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:shadow-xl hover:shadow-blue-600/40 shrink-0 w-full sm:w-auto">
            <Plus size={18} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200">
        {/* Mobile: Search + Filter Toggle Button */}
        <div className="lg:hidden space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shrink-0"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>

          {/* Mobile Filters Dropdown */}
          {showMobileFilters && (
            <div className="space-y-3 pt-3 border-t border-gray-200 animate-slide-down">
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors flex-1">
                  <Filter size={16} />
                  <span>Category</span>
                </button>
                <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download size={16} className="text-gray-600" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase shrink-0">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="latest">Latest Created</option>
                  <option value="stock-low">Stock: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Desktop: All Filters in One Row */}
        <div className="hidden lg:flex items-center justify-between gap-4">
          {/* Search & Filter */}
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by Name or Product"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-800 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap">
              <Filter size={18} />
              <span>Category</span>
            </button>
          </div>

          {/* Sort & Export */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-gray-800 uppercase whitespace-nowrap">
                Sort By:
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg text-sm font-semibold px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
              >
                <option value="latest">Latest Created</option>
                <option value="stock-low">Stock: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <ProductTable
        products={productsData}
        onSelectProduct={handleSelectProduct}
        selectedProducts={selectedProducts}
      />

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedProducts.length}
        onChangeCategory={() => console.log("Change category")}
        onMarkInactive={() => console.log("Mark inactive")}
        onBulkDelete={() => {
          console.log("Bulk delete");
          setSelectedProducts([]);
        }}
      />
    </div>
  );
}
