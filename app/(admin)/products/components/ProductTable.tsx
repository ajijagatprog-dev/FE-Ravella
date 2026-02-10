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
  selectedProducts?: number[];
}

export default function ProductTable({
  products,
  onSelectProduct,
  selectedProducts = [],
}: ProductTableProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const getStockBadge = (stock: number, status: string) => {
    if (status === "low") {
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span className="text-xs font-bold text-red-700">{stock}</span>
        </div>
      );
    } else if (status === "medium") {
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span className="text-xs font-bold text-amber-700">{stock}</span>
        </div>
      );
    } else {
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 border border-green-200">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-xs font-bold text-green-700">{stock}</span>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Retail Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                B2B Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr
                key={product.id}
                onMouseEnter={() => setHoveredRow(product.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => onSelectProduct?.(product.id)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.category}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-mono text-gray-600">
                    {product.sku}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  {getStockBadge(product.stock, product.stockStatus)}
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-semibold text-gray-900">
                    ${product.retailPrice.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-semibold text-gray-900">
                    ${product.b2bPrice.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div
                    className={`flex items-center justify-end gap-2 transition-opacity ${
                      hoveredRow === product.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-600">Showing 1 to 5 of 142 products</p>
        <div className="flex items-center gap-1">
          <button className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50">
            ‹
          </button>
          <button className="px-3 py-1.5 text-sm font-bold bg-blue-600 text-white rounded-lg">
            1
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
            2
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
            3
          </button>
          <span className="px-2 text-gray-400">...</span>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
            28
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-200 rounded-lg transition-colors">
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
