"use client";

import { useState, useMemo, useEffect } from "react";
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";

import StatsCards from "./StatsCards";
import PaymentMethodsSection from "./PaymentMethodsSection";
import TransactionTable from "./TransactionTable";
import PayNowModal from "./PayNowModal";
import FilterDrawer from "./FilterDrawer";
import AddPaymentMethodModal from "./AddPaymentMethodModal";
import PaymentHeader from "./PaymentHeader";

import {
  Transaction,
  PaymentMethod,
  FilterStatus,
  FilterMethod,
  INIT_PAYMENT_METHODS,
  ITEMS_PER_PAGE,
} from "../types";

export default function PaymentClient() {
  // ─── State ──────────────────────────────────────────────────────────────────
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payMethods, setPayMethods] = useState<PaymentMethod[]>(INIT_PAYMENT_METHODS);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/customer/orders')
      .then(res => {
        if (res.data?.status === 'success') {
          const formatted = res.data.data.map((o: any) => {
            const date = new Date(o.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
            return {
              id: o.order_number,
              date: date,
              method: o.payment_method === 'VA' ? 'VA' : 'QRIS',
              amount: parseFloat(o.total_amount) || 0,
              status: (o.status !== 'PENDING' || o.payment_token) ? "Paid" : "Pending",
              description: `Wholesale Order ${o.order_number}`
            };
          });
          setTransactions(formatted);
        }
      })
      .catch(err => console.error("Failed to fetch payments", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Modals
  const [payTarget, setPayTarget] = useState<Transaction | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showAddMethod, setShowAddMethod] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
  const [methodFilter, setMethodFilter] = useState<FilterMethod>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // ─── Derived ────────────────────────────────────────────────────────────────
  const isFiltered =
    statusFilter !== "All" || methodFilter !== "All" || searchQuery.trim() !== "";

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchStatus = statusFilter === "All" || t.status === statusFilter;
      const matchMethod = methodFilter === "All" || t.method === methodFilter;
      const matchSearch =
        !searchQuery ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchMethod && matchSearch;
    });
  }, [transactions, statusFilter, methodFilter, searchQuery]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  const totalPaid = useMemo(
    () => transactions.filter((t) => t.status === "Paid").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const totalPending = useMemo(
    () => transactions.filter((t) => t.status === "Pending").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const pendingCount = transactions.filter((t) => t.status === "Pending").length;

  function handlePaySuccess(id: string) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Paid", isNew: false } : t))
    );
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  function handleStatusFilter(v: FilterStatus) {
    setStatusFilter(v);
    setCurrentPage(1);
  }

  function handleMethodFilter(v: FilterMethod) {
    setMethodFilter(v);
    setCurrentPage(1);
  }

  function handleSearchChange(q: string) {
    setSearchQuery(q);
    setCurrentPage(1);
  }

  function handleResetFilters() {
    setStatusFilter("All");
    setMethodFilter("All");
    setSearchQuery("");
    setCurrentPage(1);
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-12 text-gray-400 gap-3 min-h-[50vh]">
        <Loader2 size={24} className="animate-spin text-blue-500" />
        <p>Loading Payments...</p>
      </div>
    );
  }

  return (
    <>
      {/* Header with "Add Payment Method" button */}
      <PaymentHeader onAddPaymentMethod={() => setShowAddMethod(true)} />

      {/* Stats summary cards */}
      <StatsCards
        totalPaid={totalPaid}
        totalPending={totalPending}
        pendingCount={pendingCount}
      />

      {/* Saved payment methods list */}
      <PaymentMethodsSection
        methods={payMethods}
        onAdd={() => setShowAddMethod(true)}
        onDelete={(id) => setPayMethods((p) => p.filter((m) => m.id !== id))}
        onSetPrimary={(id) =>
          setPayMethods((p) => p.map((m) => ({ ...m, isPrimary: m.id === id })))
        }
      />

      {/* Transaction history table with search, filter chips, pagination */}
      <TransactionTable
        transactions={filteredTransactions}
        currentPage={currentPage}
        totalPages={totalPages}
        filteredCount={filteredTransactions.length}
        statusFilter={statusFilter}
        methodFilter={methodFilter}
        searchQuery={searchQuery}
        isFiltered={isFiltered}
        onPageChange={handlePageChange}
        onOpenFilter={() => setShowFilter(true)}
        onSearchChange={handleSearchChange}
        onClearStatusFilter={() => handleStatusFilter("All")}
        onClearMethodFilter={() => handleMethodFilter("All")}
        onClearSearch={() => handleSearchChange("")}
        onResetAll={handleResetFilters}
        onPayNow={(trx) => setPayTarget(trx)}
      />

      {/* ── Modals ── */}
      {payTarget && (
        <PayNowModal
          transaction={payTarget}
          onClose={() => setPayTarget(null)}
          onSuccess={(id) => {
            handlePaySuccess(id);
            setTimeout(() => setPayTarget(null), 300);
          }}
        />
      )}

      {showFilter && (
        <FilterDrawer
          statusFilter={statusFilter}
          setStatusFilter={handleStatusFilter}
          methodFilter={methodFilter}
          setMethodFilter={handleMethodFilter}
          onClose={() => setShowFilter(false)}
          onReset={handleResetFilters}
        />
      )}

      {showAddMethod && (
        <AddPaymentMethodModal
          onClose={() => setShowAddMethod(false)}
          onAdd={(pm) => setPayMethods((p) => [...p, pm])}
        />
      )}
    </>
  );
}