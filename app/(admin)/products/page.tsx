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
    name: "Essential White Tee",
    category: "Tops & Essentials",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBrpdOQJzCllqOVmlNvrxE_isp4ugIr-_CXYvpdLgyEuw63kEy9Wqd4bwXLR6XEW0CsBKKMjhQzyvMJ8bdYYuenSW7xs_Ypx7iQtyBJXOr76NVXxEYo1eLKpvVCWxV_2uWn0XKeWYRJko0BNTGkazDd_K0Hm7Y83ivjCFpcAZLXReJBNrZ5YY2xsldChUDy5zz1qSJXIAXDLa8WoU1pzOKIfnGto5MRIAWHEAnyJErUWpDfdSoEUwnlyHFgGVE09zfD-5A8M8f_r3CM",
    sku: "RV-TSH-001",
    stock: 142,
    stockStatus: "high" as const,
    retailPrice: 45.0,
    b2bPrice: 22.5,
  },
  {
    id: 2,
    name: "Midnight Denim Slim",
    category: "Bottoms / Denim",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBiCWncv3YKy9OngheCcLKDGM6Im53rm3dd-pl7h7ViryWPP6E3BSwzLxfiuGHubvg_N-EVtqdHPHHnezZ10VTTOdSr-Thsw6hsGf-m-sll0H48ozGGnLyezaoFlJcwBtzb2uEnB2tGtAcZ_49vgtY-_tjQ7TvGPKfmM7Eukyfd_I9aZDBl7-o9693bwHrJ02ahLB-YL7xx4K0xGXwh3mwZ2U-EPdFkY6wh6U6edbsh576NBN9qVzuAxRDiy1k5phv_GNlTvhVtnyco",
    sku: "RV-JNS-402",
    stock: 8,
    stockStatus: "low" as const,
    retailPrice: 120.0,
    b2bPrice: 85.0,
  },
  {
    id: 3,
    name: "Olive Bomber Jacket",
    category: "Outerwear",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBMJbIAGcnnvsSN-ROfWk3w-a6Ft6WSt2kOvM-wAQoLarGgT50d834THqJklh7JTQzjLMPTMgdzgwvYlKWMJ8O0fMjGf7PhmPv8JetP0sOgQ7bNDqJ15h43k19ldfHDvDHzUBajt3aUQ4HdCJPOAH3IvdkoiFhlCiQ06_Hv5cdkoebq-u9nxfIqHNVVBRqWzN5GWTCJKeecXlA9A1Sk1hwaZ9ZdBXBAaiGt8VLpwbM101mBnWQADpQIojy-tRP2jvDUGhQC6qRpA_tc",
    sku: "RV-JKT-115",
    stock: 24,
    stockStatus: "medium" as const,
    retailPrice: 185.0,
    b2bPrice: 120.0,
  },
  {
    id: 4,
    name: "Street Logo Hoodie",
    category: "Tops / Hoodies",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCDj8slspm7QfQNxCmIMdOttbHLiGQfCoyF3-BPNNBdyeQ5frqVY6Fj_JPh3vEuNnY3-J6bTKup5NKq1SnnWVrqU6wuVQsG8mTkSNNOjQViTneq_6iiBwBXZnGEYT4jeqaSHdos-g5hjqpejWPY1kgQvLQDfJUCGkpopq3sH5CwCfk7PS-0lkyd8Z4jq48zfAawQGAe7sj48HwI9RPFuxcbRpeGlznWZOE5-DLRlM5bujzx4x27caTU4w0oWPRE2wl9HSSg__4abyck",
    sku: "RV-HOD-881",
    stock: 64,
    stockStatus: "high" as const,
    retailPrice: 75.0,
    b2bPrice: 40.0,
  },
  {
    id: 5,
    name: "Linen Summer Shirt",
    category: "Tops / Shirts",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC4GRDg7wkFfU5NRxs7h324Hf3YgqZULKr-5p3pjGrnM-YDt8xlHLJhbsZinj_I0Pr0jvmHZL_7FnJLWWVEhRFxrjLjeeS4-3z1yy1eTCf3p9VyDzZJqL_hm6RR9Cjww1nxYvHq9Qolttntav74neOG9O1osNlAXNwKn5ztpmKmVnfIUy7Qt3_aMvm5vjHuKEY3qh-3-HmAgxelxh3grZ1c8NnX6y-C11WCHb34mbmvzQ3JfEElVXZOikrPIogtwpsZsIQoGpiV4kay",
    sku: "RV-SHR-303",
    stock: 210,
    stockStatus: "high" as const,
    retailPrice: 65.0,
    b2bPrice: 35.0,
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
                placeholder="Filter by Name or SKU..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap">
              <Filter size={18} />
              <span>Category</span>
            </button>
          </div>

          {/* Sort & Export */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
                Sort By:
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
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
