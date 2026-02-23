"use client";

import { useState, useMemo } from "react";
import { Download } from "lucide-react";
import PaymentSummaryCards from "./components/PaymentSummaryCards";
import PaymentFilters from "./components/PaymentFilters";
import TransactionTable, { type Transaction } from "./components/TransactionTable";
import LiveSupportBanner from "./components/LiveSupportBanner";
import PayNowModal from "./components/PayNowModal";
import InvoiceModal from "./components/InvoiceModal";

// ── Mock data ─────────────────────────────────────────────────────────────────
const INITIAL_TRANSACTIONS: Transaction[] = [
    { id: "1", txnId: "TXN-89552", date: "Oct 27, 2023", expiresIn: "2h", amount: 3200000, method: "QRIS / E-Wallet", methodType: "qris", status: "PENDING" },
    { id: "2", txnId: "TXN-89231", date: "Oct 24, 2023", amount: 249000, method: "Virtual Account", methodType: "virtual_account", status: "SUCCESS" },
    { id: "3", txnId: "TXN-89104", date: "Oct 12, 2023", amount: 450000, method: "ShopeePay", methodType: "ewallet", status: "SUCCESS" },
    { id: "4", txnId: "TXN-88762", date: "Sep 28, 2023", amount: 3120000, method: "Virtual Account", methodType: "virtual_account", status: "FAILED" },
    { id: "5", txnId: "TXN-90111", date: "Nov 2, 2023", amount: 780000, method: "Virtual Account", methodType: "virtual_account", status: "SUCCESS" },
    { id: "6", txnId: "TXN-90234", date: "Nov 5, 2023", amount: 560000, method: "GoPay", methodType: "ewallet", status: "SUCCESS" },
    { id: "7", txnId: "TXN-90345", date: "Nov 8, 2023", amount: 1200000, method: "Virtual Account", methodType: "virtual_account", status: "SUCCESS" },
    { id: "8", txnId: "TXN-90456", date: "Nov 10, 2023", amount: 890000, method: "ShopeePay", methodType: "ewallet", status: "FAILED" },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PaymentInvoicePage() {
    const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [year, setYear] = useState("2023");

    // Modal state
    const [payNowTxn, setPayNowTxn] = useState<Transaction | null>(null);
    const [invoiceTxn, setInvoiceTxn] = useState<Transaction | null>(null);

    // Filter
    const filtered = useMemo(() => {
        return transactions.filter((t) => {
            const matchSearch =
                search === "" ||
                t.txnId.toLowerCase().includes(search.toLowerCase()) ||
                t.method.toLowerCase().includes(search.toLowerCase());
            const matchStatus = statusFilter === "" || t.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [transactions, search, statusFilter]);

    // Summary stats
    const totalSpent = transactions
        .filter((t) => t.status === "SUCCESS")
        .reduce((sum, t) => sum + t.amount, 0);
    const pendingTxns = transactions.filter((t) => t.status === "PENDING");
    const pendingAmount = pendingTxns.reduce((sum, t) => sum + t.amount, 0);

    // After successful payment — update status to SUCCESS
    const handlePaymentSuccess = (txnId: string) => {
        setTransactions((prev) =>
            prev.map((t) =>
                t.id === txnId ? { ...t, status: "SUCCESS" as const, expiresIn: undefined } : t
            )
        );
    };

    // Export Statement (dummy)
    const handleExportStatement = () => {
        const csv = [
            ["Transaction ID", "Date", "Amount", "Method", "Status"],
            ...transactions.map((t) => [
                t.txnId,
                t.date,
                `Rp. ${t.amount.toLocaleString("id-ID")}`,
                t.method,
                t.status,
            ]),
        ]
            .map((row) => row.join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ravelle-statement-${year}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* ── Header ── */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-stone-800 mb-1">
                        Payments & Invoices
                    </h1>
                    <p className="text-sm text-stone-500">
                        Manage your financial history and settlement documents.
                    </p>
                </div>
                <button
                    onClick={handleExportStatement}
                    className="flex items-center gap-2 text-sm font-semibold text-stone-600 border border-stone-200 hover:bg-stone-50 active:scale-[0.97] px-4 py-2.5 rounded-xl transition-all"
                >
                    <Download className="w-4 h-4" />
                    Export Statement
                </button>
            </div>

            {/* ── Summary Cards ── */}
            <PaymentSummaryCards
                totalSpent={totalSpent}
                pendingAmount={pendingAmount}
                pendingCount={pendingTxns.length}
                savedMethod="Gopay / QRIS"
                savedMethodType="Primary Method"
                growthPercent={12}
            />

            {/* ── Filters ── */}
            <PaymentFilters
                search={search}
                onSearchChange={setSearch}
                status={statusFilter}
                onStatusChange={setStatusFilter}
                year={year}
                onYearChange={setYear}
            />

            {/* ── Transaction Table ── */}
            <TransactionTable
                transactions={filtered}
                onPayNow={setPayNowTxn}
                onViewInvoice={setInvoiceTxn}
            />

            {/* ── Support Banner ── */}
            <LiveSupportBanner />

            {/* ── Modals ── */}
            <PayNowModal
                transaction={payNowTxn}
                onClose={() => setPayNowTxn(null)}
                onPaymentSuccess={handlePaymentSuccess}
            />
            <InvoiceModal
                transaction={invoiceTxn}
                onClose={() => setInvoiceTxn(null)}
            />
        </div>
    );
}