"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Eye,
  Calendar,
  ChevronDown,
  X,
  MapPin,
  CreditCard,
  Package,
  Hash,
  User,
  Clock,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type PaymentStatus = "Paid" | "Pending" | "Failed";
type OrderStatus = "Completed" | "Processing" | "On Hold";
type TabType = "All Orders" | "Pending" | "Completed";

interface OrderItem {
  name: string;
  qty: number;
  price: string;
  image?: string;
}

interface Order {
  id: string;
  customer: string;
  location: string;
  date: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  totalAmount: string;
  email: string;
  phone: string;
  items: OrderItem[];
  notes?: string;
}

import api from "@/lib/axios";

// ─── Laravel API Interface ──────────────────────────────────────────────────────────

interface AddressSnapshot {
  recipient_name: string;
  phone_number: string;
  full_address: string;
  city: string;
  province: string;
  postal_code: string;
}

interface ProductItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  // other fields...
}

interface LaravelOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: ProductItem;
}

interface LaravelOrder {
  id: number;
  order_number: string;
  user_id: number;
  total_amount: number;
  status: string;
  payment_method: string;
  shipping_address: string; // JSON string
  created_at: string;
  updated_at: string;
  items: LaravelOrderItem[];
}

// Transform Laravel order to UI order
function transformOrder(lo: LaravelOrder): Order {
  let addr: AddressSnapshot | null = null;
  try {
    addr = JSON.parse(lo.shipping_address);
  } catch (e) { }

  const paymentStatusMap: Record<string, PaymentStatus> = {
    PENDING: "Pending",
    PROCESSING: "Paid",
    SHIPPED: "Paid",
    DELIVERED: "Paid",
    CANCELLED: "Failed"
  };

  const orderStatusMap: Record<string, OrderStatus> = {
    PENDING: "Processing",
    PROCESSING: "Processing",
    SHIPPED: "Processing",
    DELIVERED: "Completed",
    CANCELLED: "On Hold"
  };

  const fmtPrice = (p: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

  return {
    id: lo.order_number,
    customer: addr ? addr.recipient_name : "Customer",
    location: addr ? addr.city : "N/A",
    date: new Date(lo.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    paymentStatus: paymentStatusMap[lo.status] || "Pending",
    orderStatus: orderStatusMap[lo.status] || "Processing",
    totalAmount: fmtPrice(lo.total_amount),
    email: addr ? addr.phone_number : "N/A", // Reusing email field for phone in UI 
    phone: addr ? addr.phone_number : "N/A",
    items: lo.items.map(i => ({
      name: i.product?.name || "Unknown Product",
      qty: i.quantity,
      price: fmtPrice(i.price),
      image: i.product?.image || ""
    })),
    notes: `Payment via: ${lo.payment_method}`
  };
}

const ITEMS_PER_PAGE = 5;

// ─── Style Maps ───────────────────────────────────────────────────────────────

const paymentBadge: Record<PaymentStatus, string> = {
  Paid: "bg-green-100 text-green-600",
  Pending: "bg-yellow-100 text-yellow-600",
  Failed: "bg-red-100 text-red-500",
};
const paymentDot: Record<PaymentStatus, string> = {
  Paid: "bg-green-500",
  Pending: "bg-yellow-500",
  Failed: "bg-red-500",
};
const orderBadge: Record<OrderStatus, string> = {
  Completed: "bg-blue-50 text-blue-600",
  Processing: "bg-purple-50 text-purple-600",
  "On Hold": "bg-gray-100 text-gray-600",
};

// ─── Order Detail Modal ───────────────────────────────────────────────────────

function OrderModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Order Detail</h2>
            <p className="text-sm text-blue-600 font-medium">{order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Status Row */}
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${paymentBadge[order.paymentStatus]
                }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${paymentDot[order.paymentStatus]}`}
              />
              {order.paymentStatus}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${orderBadge[order.orderStatus]
                }`}
            >
              {order.orderStatus}
            </span>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <User size={14} className="text-gray-400" />
              <span className="font-medium">{order.customer}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={14} className="text-gray-400" />
              {order.location}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CreditCard size={14} className="text-gray-400" />
              {order.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Hash size={14} className="text-gray-400" />
              {order.phone}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock size={14} className="text-gray-400" />
              {order.date}
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Order Items
            </p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package size={16} className="text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-700">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-sm text-yellow-800">
              <p className="font-semibold text-xs text-yellow-600 uppercase tracking-wider mb-1">
                Notes
              </p>
              {order.notes}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-lg font-bold text-gray-800">{order.totalAmount}</p>
        </div>
      </div>
    </div>
  );
}

import StatsCards from "./StatsCards";

// ─── Main Client Component ────────────────────────────────────────────────────

export default function OrdersClient() {
  const [ALL_ORDERS, setAllOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("All Orders");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const tabs: TabType[] = ["All Orders", "Pending", "Completed"];

  // Fetch orders
  useEffect(() => {
    setIsLoading(true);
    api.get('/customer/orders')
      .then(res => {
        if (res.data?.status === 'success') {
          const mapped = res.data.data.map((lo: LaravelOrder) => transformOrder(lo));
          setAllOrders(mapped);
        }
      })
      .catch(err => console.error("Failed to fetch customer orders", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Filter berdasarkan tab
  const filteredOrders = useMemo(() => {
    if (activeTab === "Pending")
      return ALL_ORDERS.filter(
        (o) => o.paymentStatus === "Pending" || o.orderStatus === "Processing" || o.orderStatus === "On Hold"
      );
    if (activeTab === "Completed")
      return ALL_ORDERS.filter((o) => o.orderStatus === "Completed");
    return ALL_ORDERS;
  }, [activeTab, ALL_ORDERS]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  // Reset ke page 1 saat ganti tab
  function handleTabChange(tab: TabType) {
    setActiveTab(tab);
    setCurrentPage(1);
  }

  // Generate page numbers
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }, [totalPages]);

  // Derive stats
  const totalRevenue = useMemo(() => {
    return ALL_ORDERS.reduce((sum, order) => {
      const numeric = Number(order.totalAmount.replace(/[^0-9,-]+/g, "").replace(",", "."));
      return sum + (numeric || 0);
    }, 0);
  }, [ALL_ORDERS]);
  const activeCount = ALL_ORDERS.filter(o => ["Processing", "Completed"].includes(o.orderStatus)).length;
  const pendingCount = ALL_ORDERS.filter(o => o.orderStatus === "On Hold" || o.paymentStatus === "Pending").length;

  return (
    <>
      {/* Stats */}
      <StatsCards
        revenueMonth={totalRevenue}
        activeOrders={activeCount}
        pendingQuotes={pendingCount}
      />

      {/* Filter Tabs + Date Filter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === tab
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-gray-500">Filter by:</span>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
            <Calendar size={14} className="text-gray-500" />
            <span>Last 30 days</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Order ID", "Items", "Customer", "Date", "Payment Status", "Order Status", "Total Amount", "Actions"].map(
                  (col) => (
                    <th
                      key={col}
                      className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400 font-medium">
                    Loading orders...
                  </td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    <Package size={36} className="mx-auto mb-2 opacity-30" />
                    No orders found.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order, index) => (
                  <tr
                    key={order.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index === paginatedOrders.length - 1 ? "border-b-0" : ""
                      }`}
                  >
                    <td className="px-5 py-4">
                      <span className="text-blue-600 font-medium">{order.id}</span>
                    </td>
                    <td className="px-5 py-4 min-w-[150px]">
                      {order.items.length > 0 && (
                        <div className="flex items-center gap-3">
                          {order.items[0].image ? (
                            <img src={order.items[0].image} alt="product" className="w-10 h-10 rounded-md object-cover border border-gray-200" />
                          ) : (
                            <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200">
                              <Package size={16} className="text-gray-400" />
                            </div>
                          )}
                          <div className="text-xs">
                            <p className="font-medium text-gray-800 line-clamp-1">{order.items[0].name}</p>
                            {order.items.length > 1 && <p className="text-gray-400 mt-0.5">+{order.items.length - 1} items more</p>}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800 whitespace-nowrap">
                        {order.customer}
                      </p>
                      <p className="text-xs text-gray-400">{order.location}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                      {order.date}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${paymentBadge[order.paymentStatus]
                          }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${paymentDot[order.paymentStatus]}`}
                        />
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${orderBadge[order.orderStatus]
                          }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-800 whitespace-nowrap">
                      {order.totalAmount}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title="View detail"
                      >
                        <Eye size={18} />
                      </button>
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
            Showing{" "}
            {filteredOrders.length === 0
              ? 0
              : (currentPage - 1) * ITEMS_PER_PAGE + 1}{" "}
            to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} of{" "}
            {filteredOrders.length} orders
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 text-sm rounded-md transition-colors ${page === currentPage
                  ? "bg-blue-600 text-white font-medium"
                  : "text-gray-500 hover:bg-gray-100"
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}