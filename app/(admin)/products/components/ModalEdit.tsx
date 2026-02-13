"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Product = {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
};

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
  const [form, setForm] = useState<Product | null>(product);

  useEffect(() => {
    setForm(product);
  }, [product]);

  if (!open || !form) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "number" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = () => {
    onUpdateProduct(form);
    onClose();
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

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Gambar
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

          {/* Price + Stock Grid */}
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
                  name="retail_price"
                  value={form.retail_price}
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
                  name="b2b_price"
                  value={form.b2b_price}
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
