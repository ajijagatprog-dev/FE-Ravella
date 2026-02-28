"use client";

import { Download, QrCode, Building2, FileText, SlidersHorizontal, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Transaction, FilterStatus, FilterMethod, formatRp, generateInvoicePDF, ITEMS_PER_PAGE } from "../types";

interface TransactionTableProps {
  transactions: Transaction[];
  currentPage: number;
  totalPages: number;
  filteredCount: number;
  statusFilter: FilterStatus;
  methodFilter: FilterMethod;
  searchQuery: string;
  isFiltered: boolean;
  onPageChange: (page: number) => void;
  onOpenFilter: () => void;
  onSearchChange: (q: string) => void;
  onClearStatusFilter: () => void;
  onClearMethodFilter: () => void;
  onClearSearch: () => void;
  onResetAll: () => void;
  onPayNow: (trx: Transaction) => void;
}

export default function TransactionTable({
  transactions,
  currentPage,
  totalPages,
  filteredCount,
  statusFilter,
  methodFilter,
  searchQuery,
  isFiltered,
  onPageChange,
  onOpenFilter,
  onSearchChange,
  onClearStatusFilter,
  onClearMethodFilter,
  onClearSearch,
  onResetAll,
  onPayNow,
}: TransactionTableProps) {
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = transactions.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Table toolbar */}
      <div className="px-5 py-4 border-b border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-800">Riwayat Transaksi</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenFilter}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                isFiltered
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : "text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <SlidersHorizontal size={13} />
              Filter
              {isFiltered && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold leading-none">
                  !
                </span>
              )}
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download size={13} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari ID transaksi atau deskripsi..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        {/* Active filter chips */}
        {isFiltered && (
          <div className="flex items-center gap-2 flex-wrap">
            {statusFilter !== "All" && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                Status: {statusFilter === "Paid" ? "Lunas" : "Pending"}
                <button onClick={onClearStatusFilter}><X size={11} /></button>
              </span>
            )}
            {methodFilter !== "All" && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                Metode: {methodFilter}
                <button onClick={onClearMethodFilter}><X size={11} /></button>
              </span>
            )}
            {searchQuery && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                &quot;{searchQuery}&quot;
                <button onClick={onClearSearch}><X size={11} /></button>
              </span>
            )}
            <button
              onClick={onResetAll}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Reset semua
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["ID Transaksi", "Tanggal", "Metode", "Jumlah", "Status", "Aksi"].map((col) => (
                <th
                  key={col}
                  className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400">
                  <FileText size={32} className="mx-auto mb-2 opacity-20" />
                  Tidak ada transaksi ditemukan.
                </td>
              </tr>
            ) : (
              paginated.map((trx, index) => (
                <tr
                  key={trx.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index === paginated.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">{trx.id}</span>
                      {trx.isNew && (
                        <span className="px-1.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-600 rounded">
                          BARU
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 max-w-[220px] truncate">
                      {trx.description}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{trx.date}</td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1.5 text-gray-600">
                      {trx.method === "QRIS" ? (
                        <QrCode size={14} className="text-gray-400" />
                      ) : (
                        <Building2 size={14} className="text-gray-400" />
                      )}
                      {trx.method}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-800 whitespace-nowrap">
                    {formatRp(trx.amount)}
                  </td>
                  <td className="px-5 py-4">
                    {trx.status === "Paid" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Lunas
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {trx.status === "Pending" ? (
                      <button
                        onClick={() => onPayNow(trx)}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:scale-95 transition-all whitespace-nowrap"
                      >
                        Bayar Sekarang
                      </button>
                    ) : (
                      <button
                        onClick={() => generateInvoicePDF(trx)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
                      >
                        <Download size={12} />
                        Download Invoice
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          {filteredCount === 0
            ? "Tidak ada data"
            : `Menampilkan ${start + 1}–${Math.min(start + ITEMS_PER_PAGE, filteredCount)} dari ${filteredCount} transaksi`}
        </p>
        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={15} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 text-sm rounded-md transition-colors ${
                page === currentPage
                  ? "bg-blue-600 text-white font-bold"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => onPageChange(currentPage + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}