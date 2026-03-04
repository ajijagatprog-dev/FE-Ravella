"use client";

import { useEffect, useState } from "react";
import { X, ImageIcon, Box, Package } from "lucide-react";
import api from "@/lib/axios";

type Product = {
  id: number;
  name: string;
  category: string;
  image: string;
  sku: string;
  stock: number;
  stockStatus: "high" | "medium" | "low";
  retailPrice: number;
  b2bPrice: number;
  description?: string;
  weight?: number;
};

type FormDataState = Product & { newImage: File | null };

type Props = {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onUpdateProduct: (product: Product) => void;
};

export default function ModalEdit({
  open,
  product,
  onClose,
  onUpdateProduct,
}: Props) {
  const [form, setForm] = useState<FormDataState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        ...product,
        description: product.description || product.name,
        weight: product.weight || 1000,
        newImage: null
      });
    }
  }, [product]);

  if (!open || !form) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "number"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!form || !form.name) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('_method', 'PUT'); // Laravel requirement for multipart/form-data PUT
      formData.append('name', form.name);
      formData.append('category', form.category);
      if (form.newImage) formData.append('image', form.newImage);
      formData.append('stock', form.stock.toString());
      formData.append('price', form.retailPrice.toString());
      formData.append('sale_price', form.b2bPrice.toString());
      formData.append('description', form.description || form.name);
      formData.append('weight', form.weight?.toString() || "1000");

      await api.post(`/products/${form.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      onUpdateProduct(form);
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40 px-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200/60 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-gray-200/70 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-t-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-t-3xl" />
          <div className="relative">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Edit Product
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Update detail produk Anda
            </p>
          </div>

          <button
            onClick={onClose}
            className="absolute top-5 right-6 p-2.5 rounded-xl hover:bg-white/80 transition-all duration-200 text-gray-500 hover:text-gray-700 hover:shadow-md group"
          >
            <X
              size={20}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-8 space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Product Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border-2 border-gray-200 bg-white text-gray-900 px-4 py-3.5 text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 hover:border-gray-300"
                placeholder="Masukkan nama produk"
              />
            </div>
          </div>

          {/* Retail + B2B + Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Retail Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">
                  Rp
                </span>
                <input
                  type="number"
                  name="retailPrice"
                  value={form.retailPrice}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white text-gray-900 pl-12 pr-4 py-3.5 text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-200 hover:border-gray-300"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                B2B Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">
                  Rp
                </span>
                <input
                  type="number"
                  name="b2bPrice"
                  value={form.b2bPrice}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white text-gray-900 pl-12 pr-4 py-3.5 text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-200 hover:border-gray-300"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                Stock
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white text-gray-900 px-4 py-3.5 text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 hover:border-gray-300"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">
                  units
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Box size={16} className="text-indigo-500" />
                Weight (gram)
              </label>
              <input
                type="number"
                name="weight"
                value={form.weight || ""}
                placeholder="1000"
                className="w-full rounded-xl border-2 border-gray-200 bg-white text-gray-900 px-4 py-3.5 text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 hover:border-gray-300"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <ImageIcon size={16} className="text-pink-500" />
                Update Image (Leave empty to keep current)
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full rounded-xl border-2 border-gray-200 bg-white text-gray-900 px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all duration-200 hover:border-gray-300"
                onChange={(e) => setForm({ ...form, newImage: e.target.files?.[0] || null })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Package size={16} className="text-gray-500" />
                Description
              </label>
              <textarea
                name="description"
                value={form.description || ""}
                placeholder="Deskripsi produk"
                rows={3}
                className="w-full rounded-xl border-2 border-gray-200 bg-white text-gray-900 px-4 py-3.5 text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:ring-4 focus:ring-gray-500/10 transition-all duration-200 hover:border-gray-300"
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
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
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Update Product
          </button>
        </div>
      </div>
    </div>
  );
}
