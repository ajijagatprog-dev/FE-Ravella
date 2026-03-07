"use client";

import { useState } from "react";
import {
  X,
  Package,
  Tag,
  Image as ImageIcon,
  Barcode,
  Box,
  DollarSign,
} from "lucide-react";
import api from "@/lib/axios";

interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  sku: string;
  stock: number;
  stockStatus: "low" | "medium" | "high";
  retailPrice: number;
  salePrice: number;
  b2bPrice: number;
  b2bMinOrder: number;
}

interface ModalTambahProps {
  open: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

export default function ModalTambah({
  open,
  onClose,
  onAddProduct,
}: ModalTambahProps) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    image: null as File | null,
    sku: "",
    stock: 0,
    retailPrice: 0,
    salePrice: 0,
    b2bPrice: 0,
    b2bMinOrder: 1,
    description: "",
    weight: 1000,
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!form.name || !form.sku) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category', form.category);
      if (form.image) formData.append('image', form.image);
      formData.append('stock', form.stock.toString());
      formData.append('price', form.retailPrice.toString());
      formData.append('sale_price', form.salePrice.toString());
      formData.append('b2b_price', form.b2bPrice.toString());
      formData.append('b2b_min_order', form.b2bMinOrder.toString());
      formData.append('description', form.description || form.name);
      formData.append('weight', form.weight.toString() || "1000");

      const res = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.status === 'success') {
        const mockProduct: Product = {
          id: res.data.data?.id || Date.now(),
          name: form.name, category: form.category, image: res.data.data?.image || "", sku: form.sku,
          stock: form.stock, stockStatus: form.stock <= 10 ? "low" : "high",
          retailPrice: form.retailPrice, salePrice: form.salePrice, b2bPrice: form.b2bPrice, b2bMinOrder: form.b2bMinOrder
        };

        onAddProduct(mockProduct);
        onClose();
      } else {
        alert(res.data.message || "Failed to create product");
      }
    } catch (error: any) {
      console.error("Error creating product:", error);
      alert(error.response?.data?.message || "Failed to create product. Check your inputs.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
      />

      <div className="relative bg-gradient-to-br from-white via-white to-gray-50 rounded-3xl shadow-2xl w-full max-w-2xl z-10 border border-gray-200/60 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-gray-200/70 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-t-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-t-3xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Package className="text-white" size={20} />
                </span>
                Add New Product
              </h2>
              <p className="text-sm text-gray-600 mt-1 ml-13">
                Tambahkan produk baru ke inventory
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl hover:bg-white/80 transition-all duration-200 text-gray-500 hover:text-gray-700 hover:shadow-md group"
            >
              <X
                size={20}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Product Name */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Package size={16} className="text-blue-500" />
                Product Name
              </label>
              <input
                placeholder="Masukkan nama produk"
                className="w-full border-2 border-gray-200 bg-white text-gray-900 px-4 py-3.5 rounded-xl text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 hover:border-gray-300"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Tag size={16} className="text-purple-500" />
                Category
              </label>
              <select
                className="w-full border-2 border-gray-200 bg-white text-gray-900 px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 hover:border-gray-300 appearance-none cursor-pointer"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="" disabled>Pilih Kategori</option>
                <option value="Home & Kitchen Appliance">Home & Kitchen Appliance</option>
                <option value="Knife set">Knife set</option>
                <option value="ezy series">ezy series</option>
                <option value="home living">home living</option>
                <option value="keyboard">keyboard</option>
              </select>
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Box size={16} className="text-indigo-500" />
                Weight (gram)
              </label>
              <input
                type="number"
                placeholder="1000"
                className="w-full border-2 border-gray-200 bg-white text-gray-900 px-4 py-3.5 rounded-xl text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 hover:border-gray-300"
                onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <ImageIcon size={16} className="text-pink-500" />
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full border-2 border-gray-200 bg-white text-gray-900 px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all duration-200 hover:border-gray-300"
                onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
              />
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Package size={16} className="text-gray-500" />
                Description
              </label>
              <textarea
                placeholder="Deskripsi produk"
                rows={3}
                className="w-full border-2 border-gray-200 bg-white text-gray-900 px-4 py-3.5 rounded-xl text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:ring-4 focus:ring-gray-500/10 transition-all duration-200 hover:border-gray-300"
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>



            {/* Stock */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Box size={16} className="text-orange-500" />
                Stock
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0"
                  className="w-full border-2 border-gray-200 bg-white text-gray-900 px-4 py-3.5 rounded-xl text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 hover:border-gray-300"
                  onChange={(e) =>
                    setForm({ ...form, stock: Number(e.target.value) })
                  }
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">
                  units
                </span>
              </div>
            </div>

            {/* Retail Price */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <DollarSign size={16} className="text-green-500" />
                Retail Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">
                  Rp
                </span>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full border-2 border-gray-200 bg-white text-gray-900 pl-12 pr-4 py-3.5 rounded-xl text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-200 hover:border-gray-300"
                  onChange={(e) =>
                    setForm({ ...form, retailPrice: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            {/* Sale Price */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <DollarSign size={16} className="text-rose-500" />
                Sale Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">
                  Rp
                </span>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full border-2 border-gray-200 bg-white text-gray-900 pl-12 pr-4 py-3.5 rounded-xl text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all duration-200 hover:border-gray-300"
                  onChange={(e) =>
                    setForm({ ...form, salePrice: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            {/* B2B Price */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <DollarSign size={16} className="text-teal-500" />
                B2B Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">
                  Rp
                </span>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full border-2 border-gray-200 bg-white text-gray-900 pl-12 pr-4 py-3.5 rounded-xl text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all duration-200 hover:border-gray-300"
                  onChange={(e) =>
                    setForm({ ...form, b2bPrice: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            {/* B2B Min Order */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Package size={16} className="text-yellow-500" />
                B2B Min Order
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="1"
                  className="w-full border-2 border-gray-200 bg-white text-gray-900 px-4 py-3.5 rounded-xl text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all duration-200 hover:border-gray-300"
                  onChange={(e) =>
                    setForm({ ...form, b2bMinOrder: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-8 py-6 border-t border-gray-200/70 bg-gray-50/50 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border-2 border-gray-300 text-sm text-gray-700 font-bold hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 hover:shadow-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            <Package size={16} />
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}
