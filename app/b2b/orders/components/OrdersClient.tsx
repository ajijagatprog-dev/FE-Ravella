"use client";

import { useState, useMemo } from "react";
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

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const ALL_ORDERS: Order[] = [
  {
    id: "#RVL-8901",
    customer: "Urban Outfitters Ltd.",
    location: "London, UK",
    date: "Oct 24, 2023",
    paymentStatus: "Paid",
    orderStatus: "Completed",
    totalAmount: "Rp. 4,250.00",
    email: "buyer@urbanoutfitters.co.uk",
    phone: "+44 20 7946 0958",
    items: [
      { name: "Classic Denim Jacket", qty: 20, price: "Rp. 1,200.00" },
      { name: "Striped Linen Shirt", qty: 30, price: "Rp. 900.00" },
      { name: "Floral Midi Dress", qty: 25, price: "Rp. 2,150.00" },
    ],
    notes: "Delivery to Warehouse B, loading dock 3.",
  },
  {
    id: "#RVL-8902",
    customer: "Nordstrom Rack",
    location: "New York, US",
    date: "Oct 23, 2023",
    paymentStatus: "Pending",
    orderStatus: "Processing",
    totalAmount: "Rp. 12,840.50",
    email: "wholesale@nordstromrack.com",
    phone: "+1 212 555 0192",
    items: [
      { name: "Wool Blend Coat", qty: 50, price: "Rp. 7,500.00" },
      { name: "Leather Ankle Boots", qty: 40, price: "Rp. 3,200.00" },
      { name: "Cashmere Scarf", qty: 30, price: "Rp. 2,140.50" },
    ],
    notes: "Urgent order — customer requested expedited processing.",
  },
  {
    id: "#RVL-8899",
    customer: "Zara Flagship",
    location: "Madrid, ES",
    date: "Oct 22, 2023",
    paymentStatus: "Failed",
    orderStatus: "On Hold",
    totalAmount: "Rp. 2,100.00",
    email: "orders@zara-flagship.es",
    phone: "+34 91 123 4567",
    items: [
      { name: "Satin Slip Dress", qty: 15, price: "Rp. 900.00" },
      { name: "Wide Leg Trousers", qty: 20, price: "Rp. 1,200.00" },
    ],
    notes: "Payment failed — contact finance team to retry.",
  },
  {
    id: "#RVL-8895",
    customer: "Selfridges & Co",
    location: "Birmingham, UK",
    date: "Oct 20, 2023",
    paymentStatus: "Paid",
    orderStatus: "Completed",
    totalAmount: "Rp. 7.430.000",
    email: "buying@selfridges.com",
    phone: "+44 121 600 6677",
    items: [
      { name: "Embroidered Blouse", qty: 35, price: "Rp. 2,800.00" },
      { name: "Tailored Blazer", qty: 28, price: "Rp. 3,080.25" },
      { name: "Silk Camisole", qty: 20, price: "Rp. 1,550.00" },
    ],
  },
  {
    id: "#RVL-8890",
    customer: "H&M Group",
    location: "Stockholm, SE",
    date: "Oct 19, 2023",
    paymentStatus: "Paid",
    orderStatus: "Completed",
    totalAmount: "Rp. 1,890.00",
    email: "wholesale@hm.com",
    phone: "+46 8 796 5500",
    items: [
      { name: "Cotton Oversized Tee", qty: 60, price: "Rp. 1,200.00" },
      { name: "Jersey Joggers", qty: 30, price: "Rp. 690.00" },
    ],
  },
  {
    id: "#RVL-8885",
    customer: "ASOS Wholesale",
    location: "London, UK",
    date: "Oct 18, 2023",
    paymentStatus: "Paid",
    orderStatus: "Completed",
    totalAmount: "Rp. 9,100.00",
    email: "wholesale@asos.com",
    phone: "+44 20 7042 7000",
    items: [
      { name: "Ribbed Knit Jumper", qty: 50, price: "Rp. 4,500.00" },
      { name: "Cargo Trousers", qty: 45, price: "Rp. 4,600.00" },
    ],
  },
  {
    id: "#RVL-8880",
    customer: "Marks & Spencer",
    location: "Manchester, UK",
    date: "Oct 17, 2023",
    paymentStatus: "Pending",
    orderStatus: "Processing",
    totalAmount: "Rp. 5,670.00",
    email: "trade@marksandspencer.com",
    phone: "+44 161 930 3333",
    items: [
      { name: "Formal Shirt Pack", qty: 40, price: "Rp. 2,400.00" },
      { name: "Chino Trousers", qty: 35, price: "Rp. 3,270.00" },
    ],
    notes: "Scheduled delivery: Nov 1, 2023.",
  },
  {
    id: "#RVL-8875",
    customer: "Zalando SE",
    location: "Berlin, DE",
    date: "Oct 15, 2023",
    paymentStatus: "Paid",
    orderStatus: "Completed",
    totalAmount: "Rp. 3,320.00",
    email: "sourcing@zalando.de",
    phone: "+49 30 200 089 500",
    items: [
      { name: "Summer Sundress", qty: 40, price: "Rp. 1,600.00" },
      { name: "Linen Shorts", qty: 40, price: "Rp. 1,720.00" },
    ],
  },
  {
    id: "#RVL-8870",
    customer: "Mango Fashion",
    location: "Barcelona, ES",
    date: "Oct 13, 2023",
    paymentStatus: "Failed",
    orderStatus: "On Hold",
    totalAmount: "Rp. 4,800.00",
    email: "b2b@mango.com",
    phone: "+34 93 860 9922",
    items: [
      { name: "Pleated Midi Skirt", qty: 30, price: "Rp. 2,100.00" },
      { name: "Cropped Jacket", qty: 25, price: "Rp. 2,700.00" },
    ],
    notes: "Pending payment verification.",
  },
  {
    id: "#RVL-8865",
    customer: "Next PLC",
    location: "Leeds, UK",
    date: "Oct 12, 2023",
    paymentStatus: "Paid",
    orderStatus: "Completed",
    totalAmount: "Rp. 6,250.00",
    email: "wholesale@next.co.uk",
    phone: "+44 113 399 6000",
    items: [
      { name: "Padded Gilet", qty: 50, price: "Rp. 3,500.00" },
      { name: "Knit Cardigan", qty: 45, price: "Rp. 2,750.00" },
    ],
  },
  {
    id: "#RVL-8860",
    customer: "River Island",
    location: "London, UK",
    date: "Oct 10, 2023",
    paymentStatus: "Paid",
    orderStatus: "Completed",
    totalAmount: "Rp. 8,900.00",
    email: "trade@riverisland.com",
    phone: "+44 20 8991 4904",
    items: [
      { name: "Faux Leather Jacket", qty: 60, price: "Rp. 5,400.00" },
      { name: "High Waist Jeans", qty: 55, price: "Rp. 3,500.00" },
    ],
  },
  {
    id: "#RVL-8855",
    customer: "Topshop Group",
    location: "Dublin, IE",
    date: "Oct 9, 2023",
    paymentStatus: "Pending",
    orderStatus: "Processing",
    totalAmount: "Rp. 2,780.00",
    email: "buying@topshop.ie",
    phone: "+353 1 677 6486",
    items: [
      { name: "Ruched Bodycon Dress", qty: 20, price: "Rp. 1,400.00" },
      { name: "Satin Pyjama Set", qty: 18, price: "Rp. 1,380.00" },
    ],
  },
];

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
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                paymentBadge[order.paymentStatus]
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${paymentDot[order.paymentStatus]}`}
              />
              {order.paymentStatus}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                orderBadge[order.orderStatus]
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
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.qty}</p>
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

// ─── Main Client Component ────────────────────────────────────────────────────

export default function OrdersClient() {
  const [activeTab, setActiveTab] = useState<TabType>("All Orders");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const tabs: TabType[] = ["All Orders", "Pending", "Completed"];

  // Filter berdasarkan tab
  const filteredOrders = useMemo(() => {
    if (activeTab === "Pending")
      return ALL_ORDERS.filter(
        (o) => o.paymentStatus === "Pending" || o.orderStatus === "Processing" || o.orderStatus === "On Hold"
      );
    if (activeTab === "Completed")
      return ALL_ORDERS.filter((o) => o.orderStatus === "Completed");
    return ALL_ORDERS;
  }, [activeTab]);

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

  return (
    <>
      {/* Filter Tabs + Date Filter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab
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
                {["Order ID", "Customer", "Date", "Payment Status", "Order Status", "Total Amount", "Actions"].map(
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
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <Package size={36} className="mx-auto mb-2 opacity-30" />
                    No orders found.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order, index) => (
                  <tr
                    key={order.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index === paginatedOrders.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="px-5 py-4">
                      <span className="text-blue-600 font-medium">{order.id}</span>
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
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          paymentBadge[order.paymentStatus]
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
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          orderBadge[order.orderStatus]
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
                className={`w-8 h-8 text-sm rounded-md transition-colors ${
                  page === currentPage
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