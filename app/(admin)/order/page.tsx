"use client";

import { useMemo, useState, useEffect } from "react";
import OrderTabs from "./components/OrderTabs";
import OrderTable from "./components/OrderTable";
import Pagination from "./Pagination";
import OrderStats from "./components/OrderStats";
import { allOrders } from "./data";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // ================= FILTER =================
  const filteredOrders = useMemo(() => {
    let filtered = [...allOrders];

    if (activeTab !== "all") {
      filtered = filtered.filter(
        (order) => order.status.toLowerCase() === activeTab.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(q) ||
          order.customer.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [activeTab, searchQuery]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  // ================= COUNTS (SELALU DARI allOrders) =================
  const counts = useMemo(() => {
    return {
      all: allOrders.length,
      pending: allOrders.filter(
        (o) => o.status.toLowerCase() === "pending"
      ).length,
      success: allOrders.filter(
        (o) => o.status.toLowerCase() === "success"
      ).length,
      failed: allOrders.filter(
        (o) => o.status.toLowerCase() === "failed"
      ).length,
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-6 space-y-6">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Orders</h1>
          <p className="text-sm text-gray-500">
            Manage and track customer orders
          </p>
        </div>

        <OrderStats counts={counts} />

        <OrderTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          counts={counts}
        />

        <OrderTable orders={paginatedOrders} />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
