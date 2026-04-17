"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart2,
  Users,
  Package,
  Clock,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  Loader2,
  Eye,
  Activity,
  UserPlus,
  XCircle,
} from "lucide-react";
import {
  ReportingTable,
  StockBadge,
  Column,
} from "./components/ReportingTable";
import api from "@/lib/axios";
import { downloadFile } from "@/lib/download";
import toast from "react-hot-toast";

// ── Types ─────────────────────────────────────────────────────────────────────
type TabKey = "sales" | "customer" | "stock" | "transaction" | "traffic";

interface SummaryCard {
  label: string;
  value: number;
  change: number;
  up: boolean;
}

// ── Format helpers ────────────────────────────────────────────────────────────
function formatRp(val: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
}

// ── Column Configs ────────────────────────────────────────────────────────────
const salesColumns: Column<Record<string, unknown>>[] = [
  {
    key: "product",
    label: "Produk",
    sortable: true,
    render: (_, row) => (
      <div>
        <p className="font-medium text-gray-800">{String(row.product)}</p>
        <p className="text-xs text-gray-400">
          {String(row.category)} · SKU: {String(row.sku)}
        </p>
      </div>
    ),
  },
  {
    key: "unitsSold",
    label: "Unit Terjual",
    sortable: true,
    render: (v) => (
      <span className="font-semibold text-gray-800">
        {Number(v).toLocaleString()}
      </span>
    ),
  },
  {
    key: "revenue",
    label: "Pendapatan",
    sortable: true,
    render: (v) => (
      <span className="font-medium text-gray-800">{formatRp(Number(v))}</span>
    ),
  },
  {
    key: "stock",
    label: "Stok",
    sortable: true,
    render: (v) => {
      const s = Number(v);
      return (
        <StockBadge
          label={
            s <= 0
              ? "Stok Habis"
              : s < 10
                ? `Stok Menipis (${s})`
                : `Stok Tersedia (${s})`
          }
        />
      );
    },
  },
];

const customerColumns: Column<Record<string, unknown>>[] = [
  {
    key: "name",
    label: "Pelanggan",
    sortable: true,
    render: (_, row) => (
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600 shrink-0">
          {String(row.name)
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <p className="font-medium text-gray-800">{String(row.name)}</p>
          <p className="text-xs text-gray-400">{String(row.email)}</p>
        </div>
      </div>
    ),
  },
  { key: "orders", label: "Pesanan", sortable: true },
  {
    key: "totalSpent",
    label: "Total Belanja",
    sortable: true,
    render: (v) => (
      <span className="font-medium text-gray-800">{formatRp(Number(v))}</span>
    ),
  },
  { key: "lastOrder", label: "Pesanan Terakhir" },
  {
    key: "tier",
    label: "Level",
    render: (_, row) => {
      const tierStyles: Record<string, string> = {
        Platinum: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
        Gold: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
        Basic: "bg-slate-50 text-slate-600 ring-1 ring-slate-200",
      };
      const tier = String(row.tier);
      return (
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${tierStyles[tier] ?? "bg-gray-100 text-gray-600"}`}
        >
          {tier}
        </span>
      );
    },
  },
  {
    key: "status",
    label: "Status",
    render: (_, row) => {
      const s = String(row.status);
      const styles: Record<string, string> = {
        active: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        inactive: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
      };
      return (
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[s] ?? "bg-gray-100 text-gray-600"}`}
        >
          {s}
        </span>
      );
    },
  },
];

const stockColumns: Column<Record<string, unknown>>[] = [
  {
    key: "product",
    label: "Produk",
    sortable: true,
    render: (_, row) => (
      <div>
        <p className="font-medium text-gray-800">{String(row.product)}</p>
        <p className="text-xs text-gray-400">
          {String(row.category)} · SKU: {String(row.sku)}
        </p>
      </div>
    ),
  },
  {
    key: "stock",
    label: "Jumlah Stok",
    sortable: true,
    render: (v) => {
      const s = Number(v);
      return (
        <span
          className={`font-semibold ${s === 0 ? "text-red-500" : s < 10 ? "text-amber-500" : "text-gray-800"}`}
        >
          {s}
        </span>
      );
    },
  },
  {
    key: "price",
    label: "Harga",
    sortable: true,
    render: (v) => <span className="text-gray-700">{formatRp(Number(v))}</span>,
  },
  {
    key: "stockStatus",
    label: "Status",
    render: (_, row) => <StockBadge label={String(row.stockStatus)} />,
  },
];

const transactionColumns: Column<Record<string, unknown>>[] = [
  {
    key: "id",
    label: "ID Pesanan",
    render: (v) => (
      <span className="font-mono text-xs text-gray-500">{String(v)}</span>
    ),
  },
  { key: "customer", label: "Pelanggan", sortable: true },
  { key: "date", label: "Tanggal", sortable: true },
  { key: "items", label: "Item" },
  {
    key: "amount",
    label: "Total",
    sortable: true,
    render: (v) => (
      <span className="font-semibold text-gray-800">{formatRp(Number(v))}</span>
    ),
  },
  { key: "method", label: "Metode" },
  {
    key: "status",
    label: "Status",
    render: (_, row) => {
      const s = String(row.status);
      const styles: Record<string, string> = {
        Delivered: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
        Processing: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
        Shipped: "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200",
        Cancelled: "bg-red-50 text-red-600 ring-1 ring-red-200",
      };
      
      const labels: Record<string, string> = {
        Delivered: "Diterima",
        Pending: "Menunggu",
        Processing: "Diproses",
        Shipped: "Dikirim",
        Cancelled: "Dibatalkan",
      };

      return (
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[s] ?? "bg-gray-100 text-gray-600"}`}
        >
          {labels[s] ?? s}
        </span>
      );
    },
  },
];

const trafficColumns: Column<Record<string, unknown>>[] = [
  {
    key: "page_path",
    label: "Path Halaman",
    sortable: true,
    render: (v) => (
      <span className="font-medium text-gray-800">{String(v)}</span>
    ),
  },
  {
    key: "views",
    label: "Tayangan Halaman",
    sortable: true,
    render: (v) => (
      <span className="font-semibold text-gray-800">
        {Number(v).toLocaleString()}
      </span>
    ),
  },
  {
    key: "active_users",
    label: "Pengguna Aktif",
    sortable: true,
    render: (v) => (
      <span className="text-gray-700">{Number(v).toLocaleString()}</span>
    ),
  },
  {
    key: "new_users",
    label: "Pengguna Baru",
    sortable: true,
    render: (v) => (
      <span className="text-gray-700">{Number(v).toLocaleString()}</span>
    ),
  },
  {
    key: "sessions",
    label: "Sesi",
    sortable: true,
    render: (v) => (
      <span className="text-gray-700">{Number(v).toLocaleString()}</span>
    ),
  },
];

// ── Tab Config ────────────────────────────────────────────────────────────────
const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "sales", label: "Laporan Penjualan", icon: BarChart2 },
  { key: "customer", label: "Laporan Pelanggan", icon: Users },
  { key: "stock", label: "Laporan Stok", icon: Package },
  { key: "transaction", label: "Riwayat Transaksi", icon: Clock },
  { key: "traffic", label: "Data Trafik", icon: Activity },
];

const columnsMap: Record<TabKey, Column<Record<string, unknown>>[]> = {
  sales: salesColumns,
  customer: customerColumns,
  stock: stockColumns,
  transaction: transactionColumns,
  traffic: trafficColumns,
};

// Note: I'll actually just use the existing icons and map the new Indonesian keys.
const summaryIcons: Record<string, React.ElementType> = {
  "Total Penjualan": DollarSign,
  "Total Pesanan": ShoppingCart,
  "Rata-rata Transaksi": BarChart2,
  "Pesanan Dibatalkan": XCircle,
  "Total Pelanggan": Users,
  "Pelanggan Aktif": Users,
  "Rata-rata Pesanan / Pelanggan": ShoppingCart,
  "LTV Pelanggan": DollarSign,
  "Total SKU": Package,
  "Stok Tersedia": Package,
  "Stok Menipis": Package,
  "Stok Habis": Package,
  "Total Transaksi": Clock,
  Selesai: Clock,
  "Menunggu / Proses": Clock,
  Dibatalkan: Clock,
  "Total Tayangan Halaman": Eye,
  "Total Sesi": Clock,
  "Pengguna Baru": UserPlus,
  "Pengguna Aktif": Users,
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("sales");
  const [dateRange, setDateRange] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  const [tableData, setTableData] = useState<Record<string, unknown>[]>([]);
  const [summaryCards, setSummaryCards] = useState<SummaryCard[]>([]);

  const apiEndpoints: Record<TabKey, string> = {
    sales: "/admin/reports/sales",
    customer: "/admin/reports/customers",
    stock: "/admin/reports/stock",
    transaction: "/admin/reports/transactions",
    traffic: "/admin/reports/traffic",
  };

  const dataKeys: Record<TabKey, string> = {
    sales: "products",
    customer: "customers",
    stock: "products",
    transaction: "transactions",
    traffic: "traffic",
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (dateRange !== "all") params.period = dateRange;

      const res = await api.get(apiEndpoints[activeTab], { params });
      if (res.data.status === "success") {
        setTableData(res.data.data[dataKeys[activeTab]] || []);
        setSummaryCards(res.data.data.summary || []);
      }
    } catch (err) {
      console.error("Failed to load report data:", err);
      setTableData([]);
      setSummaryCards([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, dateRange]);

  useEffect(() => {
    fetchData();
    setPage(1);
  }, [fetchData]);

  const columns = columnsMap[activeTab];

  const formatSummaryValue = (card: SummaryCard) => {
    const moneyLabels = [
      "Total Penjualan",
      "Rata-rata Transaksi",
      "LTV Pelanggan",
    ];
    if (moneyLabels.includes(card.label)) {
      return formatRp(card.value);
    }
    return card.value.toLocaleString();
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pusat Pelaporan &amp; Monitoring Admin
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Wawasan mendalam dan pelacakan kinerja di seluruh platform e-commerce Anda.
          </p>
        </div>
        <button
          onClick={async () => {
            try {
              let endpoint = "/admin/export/orders";
              let filename = "sales_report.xlsx";

              if (activeTab === "stock") {
                endpoint = "/admin/export/products";
                filename = "stock_report.xlsx";
              } else if (activeTab === "customer") {
                endpoint = "/admin/export/users";
                filename = "customer_report.xlsx";
              } else if (activeTab === "transaction") {
                endpoint = "/admin/export/orders";
                filename = "transaction_report.xlsx";
              }

              await downloadFile(endpoint, filename);
              toast.success("Laporan berhasil diunduh");
            } catch (error) {
              toast.error("Gagal mengunduh laporan");
            }
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 active:scale-95 transition-all duration-150 w-fit"
        >
          <Download size={15} />
          Ekspor ke Excel
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Rentang Waktu
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
          >
            <option value="all">Semua Waktu</option>
            <option value="last_7">7 Hari Terakhir</option>
            <option value="last_30">30 Hari Terakhir</option>
            <option value="last_90">90 Hari Terakhir</option>
          </select>
        </div>

        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Perbarui
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setPage(1);
              }}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 ${
                activeTab === tab.key
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Summary Cards */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = summaryIcons[card.label] || BarChart2;
            return (
              <div
                key={card.label}
                className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {card.label}
                  </p>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                    <Icon size={15} className="text-blue-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatSummaryValue(card)}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Table Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">
            {tabs.find((t) => t.key === activeTab)?.label} — Detail
          </h2>
          <div className="flex items-center gap-2">
            {loading && (
              <Loader2 size={14} className="animate-spin text-blue-500" />
            )}
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
              {tableData.length} data
            </span>
          </div>
        </div>

        <ReportingTable
          data={tableData}
          columns={columns}
          isLoading={loading}
          page={page}
          limit={limit}
          total={tableData.length}
          handlePageChange={setPage}
          handleLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
}
