"use client";

import Image from "next/image";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
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

interface ProductTableProps {
  products: Product[];
  onSelectProduct?: (id: number) => void;
  onDeleteProduct?: (id: number) => void;
  onEditProduct?: (product: Product) => void;
  selectedProducts?: number[];
}

export default function ProductTable({
  products,
  onSelectProduct,
  onDeleteProduct,
  onEditProduct,
  selectedProducts = [],
}: ProductTableProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const getStockBadge = (stock: number, status: string) => {
    if (status === "low") {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/60 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50" />
          <span className="text-xs font-bold text-red-700">{stock}</span>
        </div>
      );
    } else if (status === "medium") {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50" />
          <span className="text-xs font-bold text-amber-700">{stock}</span>
        </div>
      );
    } else {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
          <span className="text-xs font-bold text-green-700">{stock}</span>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-lg shadow-gray-200/50">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50 border-b border-gray-200/80">
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all"
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-600 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-4 text-center text-xs font-extrabold text-gray-600 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-600 uppercase tracking-wider">
                Retail Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-600 uppercase tracking-wider">
                B2B Price
              </th>
              <th className="px-6 py-4 text-right text-xs font-extrabold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100/80">
            {products.map((product) => (
              <tr
                key={product.id}
                onMouseEnter={() => setHoveredRow(product.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`transition-all duration-200 ${
                  hoveredRow === product.id
                    ? "bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/50 shadow-inner"
                    : "hover:bg-gray-50/50"
                }`}
              >
                <td className="px-6 py-5">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => onSelectProduct?.(product.id)}
                    className="w-4 h-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all hover:border-blue-400"
                  />
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0 relative ring-2 ring-gray-200/50 shadow-md">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-0.5">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {product.category}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5 text-center">
                  {getStockBadge(product.stock, product.stockStatus)}
                </td>

                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">
                      Rp {product.retailPrice.toLocaleString("id-ID")}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      Retail
                    </span>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">
                      Rp {product.b2bPrice.toLocaleString("id-ID")}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      Wholesale
                    </span>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <div
                    className={`flex items-center justify-end gap-2 transition-all duration-300 ${
                      hoveredRow === product.id
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-2"
                    }`}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditProduct?.(product);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-110 active:scale-95 group"
                      title="Edit Product"
                    >
                      <Edit
                        size={16}
                        className="group-hover:rotate-12 transition-transform"
                      />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProduct?.(product.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-110 active:scale-95 group"
                      title="Delete Product"
                    >
                      <Trash2
                        size={16}
                        className="group-hover:rotate-12 transition-transform"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
