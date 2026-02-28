"use client";

import Image from "next/image";
import { MoreVertical, Edit, Trash2, Package } from "lucide-react";
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
    const styles = {
      low: "bg-red-50 text-red-700 border-red-100 ring-red-500/20",
      medium: "bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/20",
      high: "bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/20",
    };

    const currentStyle = styles[status as keyof typeof styles] || styles.high;

    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold tracking-tight ring-2 transition-all ${currentStyle}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${status === 'low' ? 'animate-pulse bg-red-500' : status === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
        {stock} <span className="font-medium opacity-80 uppercase ml-0.5">Units</span>
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/80 backdrop-blur-sm">
              <th className="sticky top-0 z-10 px-6 py-4 text-left border-b border-slate-200">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500/20 transition-all cursor-pointer"
                  />
                </div>
              </th>
              <th className="sticky top-0 z-10 px-6 py-4 text-left border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Product Info
              </th>
              <th className="sticky top-0 z-10 px-6 py-4 text-center border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Inventory
              </th>
              <th className="sticky top-0 z-10 px-6 py-4 text-left border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Pricing Details
              </th>
              <th className="sticky top-0 z-10 px-6 py-4 text-right border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product.id}
                  onMouseEnter={() => setHoveredRow(product.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className="group transition-all duration-200 hover:bg-blue-50/30"
                >
                  <td className="px-6 py-5">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => onSelectProduct?.(product.id)}
                      className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500/20 transition-all cursor-pointer"
                    />
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-1 ring-slate-200 shadow-sm transition-transform group-hover:scale-105 duration-300 bg-slate-50">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="max-w-[200px] sm:max-w-xs">
                        <p className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-tighter">
                            {product.sku}
                          </span>
                          <span className="text-xs text-slate-400 font-medium capitalize">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-center">
                    {getStockBadge(product.stock, product.stockStatus)}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400">RP</span>
                        <span className="text-sm font-extrabold text-slate-900 tracking-tight">
                          {product.retailPrice.toLocaleString("id-ID")}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-1 rounded">Retail</span>
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[10px] font-bold text-blue-400">RP</span>
                        <span className="text-sm font-bold text-blue-600 tracking-tight">
                          {product.b2bPrice.toLocaleString("id-ID")}
                        </span>
                        <span className="text-[10px] font-medium text-blue-400 bg-blue-50 px-1 rounded">B2B</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <div className={`flex items-center justify-end gap-1 transition-all duration-300 ${
                      hoveredRow === product.id ? "opacity-100 translate-x-0" : "opacity-0 md:opacity-40 translate-x-1"
                    }`}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProduct?.(product);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-sm rounded-xl border border-transparent hover:border-blue-100 transition-all active:scale-90"
                        title="Edit Data"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProduct?.(product.id);
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-white hover:shadow-sm rounded-xl border border-transparent hover:border-red-100 transition-all active:scale-90"
                        title="Hapus Produk"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                   <div className="flex flex-col items-center gap-2">
                      <Package size={40} className="text-slate-200" />
                      <p className="text-slate-400 font-medium">No products found matching your criteria.</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}