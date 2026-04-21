"use client";

import { useState } from "react";
import { X, Package, Tag, Image as ImageIcon, Barcode, Box, DollarSign } from "lucide-react";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.sku) {
        alert("Nama Produk dan SKU wajib diisi!");
        return;
    }

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
      formData.append('sku', form.sku || "");

      const res = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.status === 'success') {
        const mockProduct: Product = {
          id: res.data.data?.id || Date.now(),
          name: form.name, 
          category: form.category, 
          image: res.data.data?.image || "", 
          sku: form.sku,
          stock: form.stock, 
          stockStatus: form.stock <= 10 ? "low" : "high",
          retailPrice: form.retailPrice, 
          salePrice: form.salePrice, 
          b2bPrice: form.b2bPrice, 
          b2bMinOrder: form.b2bMinOrder
        };

        onAddProduct(mockProduct);
        onClose();
      } else {
        alert(res.data.message || "Failed to create product");
      }
    } catch (error: any) {
      console.error("Error creating product:", error);
      alert(error.response?.data?.message || "Gagal menambah produk. Pastikan SKU unik dan data valid.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40 px-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-gray-100 bg-gray-50/50 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
              <p className="text-xs text-gray-500 mt-1">Tambah produk baru ke inventory</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-200 transition-all text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-6 overflow-y-auto flex-1">
          {/* Product Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
              <Package size={14} className="text-blue-500" />
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 text-gray-900 px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              placeholder="Masukkan nama produk"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* SKU Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
                <Barcode size={14} className="text-indigo-500" />
                Product SKU (Opsional)
              </label>
              <input
                type="text"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 text-gray-900 px-4 py-3 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                placeholder="Otomatis jika kosong"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
                <Tag size={14} className="text-purple-500" />
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 text-gray-900 px-4 py-3 text-sm font-medium focus:outline-none focus:border-purple-500 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>Pilih Kategori</option>
                <option value="Home & Kitchen Appliance">Home & Kitchen Appliance</option>
                <option value="Knife set">Knife set</option>
                <option value="ezy series">ezy series</option>
                <option value="home living">home living</option>
                <option value="keyboard">keyboard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Retail Price</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rp</span>
                <input
                  type="number"
                  name="retailPrice"
                  value={form.retailPrice}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 text-gray-900 pl-10 pr-4 py-3 text-sm font-medium focus:outline-none focus:border-green-500 focus:bg-white transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Sale Price</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rp</span>
                <input
                  type="number"
                  name="salePrice"
                  value={form.salePrice}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 text-gray-900 pl-10 pr-4 py-3 text-sm font-medium focus:outline-none focus:border-rose-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">B2B Price</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rp</span>
                <input
                  type="number"
                  name="b2bPrice"
                  value={form.b2bPrice}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 text-gray-900 pl-10 pr-4 py-3 text-sm font-medium focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Stock</label>
              <div className="relative">
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 text-gray-900 px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] uppercase font-bold">Units</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Weight (g)</label>
              <input
                type="number"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 text-gray-900 px-4 py-3 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Min B2B</label>
              <input
                type="number"
                name="b2bMinOrder"
                value={form.b2bMinOrder}
                onChange={handleChange}
                className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 text-gray-900 px-4 py-3 text-sm font-medium focus:outline-none focus:border-yellow-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
              <ImageIcon size={14} className="text-pink-500" />
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 text-gray-900 px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-pink-500 focus:bg-white transition-all file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-pink-100 file:text-pink-700 cursor-pointer"
              onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
              <Package size={14} className="text-gray-400" />
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 text-gray-900 px-4 py-3 text-sm font-medium focus:outline-none focus:border-gray-500 focus:bg-white transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200 bg-gray-50/50 rounded-b-3xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-8 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
