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
                <input type="checkbox" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Product Name
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

                <td className="px-4 py-4 text-center">
                  {getStockBadge(product.stock, product.stockStatus)}
                </td>

                <td className="px-4 py-4 text-gray-500">
                  Rp. {product.retailPrice.toFixed(2)}
                </td>

                <td className="px-4 py-4 text-gray-500">
                  Rp. {product.b2bPrice.toFixed(2)}
                </td>

                <td className="px-4 py-4">
                  <div
                    className={`flex items-center justify-end gap-2 transition-opacity ${
                      hoveredRow === product.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditProduct?.(product);
                      }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProduct?.(product.id);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
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
