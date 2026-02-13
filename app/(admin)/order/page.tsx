"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

// ==================== TYPES ====================
interface Order {
  id: string;
  customer: string;
  date: string;
  status: "Success" | "Pending" | "Failed";
  total: string;
}

interface OrderTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  counts: {
    all: number;
    pending: number;
    success: number;
    failed: number;
  };
}

interface OrderTableProps {
  orders: Order[];
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

// ==================== SAMPLE DATA ====================
const allOrders: Order[] = [
  {
    id: "#RVL-4921",
    customer: "Fadil",
    date: "Oct 24, 2023",
    status: "Success",
    total: "Rp. 2.000.000",
  },
  {
    id: "#RVL-4922",
    customer: "Anan",
    date: "Oct 24, 2023",
    status: "Pending",
    total: "Rp. 3.500.000",
  },
  {
    id: "#RVL-4923",
    customer: "Fardan",
    date: "Oct 23, 2023",
    status: "Failed",
    total: "Rp. 2.500.000",
  },
  {
    id: "#RVL-4924",
    customer: "Budi",
    date: "Oct 23, 2023",
    status: "Success",
    total: "Rp. 1.500.000",
  },
  {
    id: "#RVL-4925",
    customer: "Siti",
    date: "Oct 22, 2023",
    status: "Pending",
    total: "Rp. 4.200.000",
  },
  {
    id: "#RVL-4926",
    customer: "Ahmad",
    date: "Oct 22, 2023",
    status: "Failed",
    total: "Rp. 1.800.000",
  },
  {
    id: "#RVL-4927",
    customer: "Dewi",
    date: "Oct 21, 2023",
    status: "Success",
    total: "Rp. 5.500.000",
  },
  {
    id: "#RVL-4928",
    customer: "Rudi",
    date: "Oct 21, 2023",
    status: "Pending",
    total: "Rp. 2.800.000",
  },
  {
    id: "#RVL-4929",
    customer: "Lina",
    date: "Oct 20, 2023",
    status: "Success",
    total: "Rp. 3.200.000",
  },
  {
    id: "#RVL-4930",
    customer: "Joko",
    date: "Oct 20, 2023",
    status: "Failed",
    total: "Rp. 1.200.000",
  },
  {
    id: "#RVL-4931",
    customer: "Maya",
    date: "Oct 19, 2023",
    status: "Pending",
    total: "Rp. 6.500.000",
  },
  {
    id: "#RVL-4932",
    customer: "Dika",
    date: "Oct 19, 2023",
    status: "Success",
    total: "Rp. 2.300.000",
  },
  {
    id: "#RVL-4933",
    customer: "Rina",
    date: "Oct 18, 2023",
    status: "Pending",
    total: "Rp. 4.800.000",
  },
  {
    id: "#RVL-4934",
    customer: "Eko",
    date: "Oct 18, 2023",
    status: "Failed",
    total: "Rp. 3.100.000",
  },
  {
    id: "#RVL-4935",
    customer: "Tari",
    date: "Oct 17, 2023",
    status: "Success",
    total: "Rp. 5.200.000",
  },
  {
    id: "#RVL-4936",
    customer: "Andi",
    date: "Oct 17, 2023",
    status: "Pending",
    total: "Rp. 2.900.000",
  },
  {
    id: "#RVL-4937",
    customer: "Sari",
    date: "Oct 16, 2023",
    status: "Success",
    total: "Rp. 4.100.000",
  },
  {
    id: "#RVL-4938",
    customer: "Hadi",
    date: "Oct 16, 2023",
    status: "Failed",
    total: "Rp. 1.600.000",
  },
  {
    id: "#RVL-4939",
    customer: "Putri",
    date: "Oct 15, 2023",
    status: "Pending",
    total: "Rp. 3.700.000",
  },
  {
    id: "#RVL-4940",
    customer: "Reza",
    date: "Oct 15, 2023",
    status: "Success",
    total: "Rp. 2.400.000",
  },
  {
    id: "#RVL-4941",
    customer: "Nina",
    date: "Oct 14, 2023",
    status: "Pending",
    total: "Rp. 5.800.000",
  },
  {
    id: "#RVL-4942",
    customer: "Yudi",
    date: "Oct 14, 2023",
    status: "Failed",
    total: "Rp. 2.100.000",
  },
  {
    id: "#RVL-4943",
    customer: "Wati",
    date: "Oct 13, 2023",
    status: "Success",
    total: "Rp. 3.900.000",
  },
  {
    id: "#RVL-4944",
    customer: "Tono",
    date: "Oct 13, 2023",
    status: "Pending",
    total: "Rp. 4.500.000",
  },
  {
    id: "#RVL-4945",
    customer: "Lusi",
    date: "Oct 12, 2023",
    status: "Success",
    total: "Rp. 6.200.000",
  },
];

// ==================== ORDER TABS COMPONENT ====================
function OrderTabs({
  activeTab,
  onTabChange,
  onSearch,
  searchQuery,
  counts,
}: OrderTabsProps) {
  const tabs = [
    { id: "all", label: "All Orders", count: counts.all },
    { id: "pending", label: "Pending", count: counts.pending },
    { id: "success", label: "Success", count: counts.success },
    { id: "failed", label: "Failed", count: counts.failed },
  ];

  return (
    <div className="flex items-center justify-between px-6 pt-6 pb-4">
      <div className="flex space-x-1 bg-gray-100/80 p-1.5 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-5 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-md shadow-gray-300/50"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            <span className="relative z-10">{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={`ml-2 px-2 py-0.5 text-xs font-bold rounded-full ${
                  activeTab === tab.id
                    ? tab.id === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : tab.id === "success"
                        ? "bg-green-100 text-green-700"
                        : tab.id === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search ID, customer..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 pr-4 py-2.5 border-2 border-gray-200 bg-white rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 hover:border-gray-300 w-72"
        />
      </div>
    </div>
  );
}

// ==================== PAGINATION COMPONENT ====================
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between px-6 py-5 border-t border-gray-200/80 bg-gray-50/50">
      <div className="text-sm text-gray-600 font-medium">
        Showing <span className="font-bold text-gray-900">{startItem}</span> to{" "}
        <span className="font-bold text-gray-900">{endItem}</span> of{" "}
        <span className="font-bold text-gray-900">{totalItems}</span> orders
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg border-2 transition-all duration-200 ${
            currentPage === 1
              ? "border-gray-200 text-gray-400 cursor-not-allowed"
              : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:shadow-md"
          }`}
        >
          <ChevronLeft size={18} />
        </button>

        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-gray-500 font-bold"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                currentPage === page
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30"
                  : "border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:shadow-md"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg border-2 transition-all duration-200 ${
            currentPage === totalPages
              ? "border-gray-200 text-gray-400 cursor-not-allowed"
              : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:shadow-md"
          }`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

// ==================== ORDER TABLE COMPONENT ====================
function OrderTable({ orders }: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="p-6 pt-0">
        <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-lg shadow-gray-200/50">
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              No Orders Found
            </h3>
            <p className="text-sm text-gray-500">
              No orders match your current filters or search
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-0">
      <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-lg shadow-gray-200/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50 border-b border-gray-200/80">
                <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100/80">
              {orders.map((order, index) => (
                <tr
                  key={index}
                  className="transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50/50 hover:via-indigo-50/30 hover:to-purple-50/50 hover:shadow-inner"
                >
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-blue-600 hover:text-blue-700 cursor-pointer">
                      {order.id}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/30">
                        <span className="text-white font-bold text-sm">
                          {order.customer.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {order.customer}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-gray-700">
                      {order.date}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {order.status === "Success" ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></span>
                        <span className="text-xs font-bold text-green-700">
                          {order.status}
                        </span>
                      </span>
                    ) : order.status === "Pending" ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-lg shadow-amber-500/50"></span>
                        <span className="text-xs font-bold text-amber-700">
                          {order.status}
                        </span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/60 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></span>
                        <span className="text-xs font-bold text-red-700">
                          {order.status}
                        </span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="text-sm font-bold text-gray-900">
                      {order.total}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN ORDERS PAGE COMPONENT ====================
export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter orders based on active tab and search query
  const filteredOrders = useMemo(() => {
    let filtered = allOrders;

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter(
        (order) => order.status.toLowerCase() === activeTab.toLowerCase(),
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.customer.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [activeTab, searchQuery]);

  // Paginate orders
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Reset to page 1 when filters change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Calculate counts for each tab
  const counts = useMemo(() => {
    return {
      all: allOrders.length,
      pending: allOrders.filter((o) => o.status === "Pending").length,
      success: allOrders.filter((o) => o.status === "Success").length,
      failed: allOrders.filter((o) => o.status === "Failed").length,
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage and track your customer orders
          </p>
        </div>

        {/* Tabs and Search */}
        <OrderTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          counts={counts}
        />

        {/* Table */}
        <OrderTable orders={paginatedOrders} />

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="px-6 pb-6">
            <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-lg shadow-gray-200/50">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredOrders.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
