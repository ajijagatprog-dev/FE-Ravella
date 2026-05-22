"use client";

import Link from "next/link";
import { Store, Package, ExternalLink } from "lucide-react";

export default function VouchersPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-stone-900 leading-tight">
          Buat Voucher
        </h1>
        <p className="text-stone-500 text-xs md:text-sm mt-1">
          Buat Voucher Toko atau Voucher Produk sekarang untuk menarik
          Pembeli.{" "}
        </p>
      </div>

      {/* Section Label */}
      <h2 className="text-sm font-semibold text-stone-700 mb-4">
        Voucher keseluruhan
      </h2>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Voucher Toko */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 hover:shadow-lg hover:border-stone-300 transition-all duration-300 group relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-50 to-transparent rounded-bl-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-200/50 group-hover:shadow-lg group-hover:shadow-orange-200/70 transition-shadow duration-300">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-stone-900 group-hover:text-orange-700 transition-colors duration-200">
                  Voucher Toko
                </h3>
                <p className="text-sm text-stone-500 mt-1 leading-relaxed">
                  Voucher untuk semua produkmu agar penjualannya meningkat
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Link
                href="/admin/vouchers/toko"
                className="inline-flex items-center gap-2 bg-white border border-stone-300 text-stone-700 px-5 py-2.5 text-sm font-semibold rounded-lg hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Buat
                <ExternalLink className="w-3.5 h-3.5 opacity-50" />
              </Link>
            </div>
          </div>
        </div>

        {/* Voucher Produk */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 hover:shadow-lg hover:border-stone-300 transition-all duration-300 group relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-200/50 group-hover:shadow-lg group-hover:shadow-blue-200/70 transition-shadow duration-300">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-stone-900 group-hover:text-blue-700 transition-colors duration-200">
                  Voucher Produk
                </h3>
                <p className="text-sm text-stone-500 mt-1 leading-relaxed">
                  Voucher untuk produk terpilih sebagai bagian dari promosi
                  tertentu
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                Bulk Import
              </span>
              <Link
                href="/admin/vouchers/produk"
                className="inline-flex items-center gap-2 bg-white border border-stone-300 text-stone-700 px-5 py-2.5 text-sm font-semibold rounded-lg hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Buat
                <ExternalLink className="w-3.5 h-3.5 opacity-50" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
