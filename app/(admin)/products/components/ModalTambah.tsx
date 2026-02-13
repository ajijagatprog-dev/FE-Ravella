"use client";

import { useState } from "react";

interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  sku: string;
  stock: number;
  stockStatus: "low" | "medium" | "high";
  retailPrice: number;
  b2bPrice: number;
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
    image: "",
    sku: "",
    stock: 0,
    retailPrice: 0,
    b2bPrice: 0,
  });

  if (!open) return null;

  const handleSubmit = () => {
    if (!form.name || !form.sku) return;

    const newProduct: Product = {
      id: Date.now(),
      ...form,
      stockStatus:
        form.stock <= 10 ? "low" : form.stock <= 30 ? "medium" : "high",
    };

    onAddProduct(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10">
        <h2 className="text-xl font-bold mb-4">Add New Product</h2>

        <div className="space-y-3">
          <input
            placeholder="Product Name"
            className="w-full border p-2 rounded-lg"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Category"
            className="w-full border p-2 rounded-lg"
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            placeholder="Image URL"
            className="w-full border p-2 rounded-lg"
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <input
            placeholder="SKU"
            className="w-full border p-2 rounded-lg"
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
          />
          <input
            type="number"
            placeholder="Stock"
            className="w-full border p-2 rounded-lg"
            onChange={(e) =>
              setForm({ ...form, stock: Number(e.target.value) })
            }
          />
          <input
            type="number"
            placeholder="Retail Price"
            className="w-full border p-2 rounded-lg"
            onChange={(e) =>
              setForm({ ...form, retailPrice: Number(e.target.value) })
            }
          />
          <input
            type="number"
            placeholder="B2B Price"
            className="w-full border p-2 rounded-lg"
            onChange={(e) =>
              setForm({ ...form, b2bPrice: Number(e.target.value) })
            }
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}
