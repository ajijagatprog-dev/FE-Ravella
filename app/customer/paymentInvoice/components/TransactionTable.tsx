"use client";

import { useState } from "react";
import { Building2, Wallet, Download, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import PaymentStatusBadge, { type PaymentStatus } from "./PaymentStatusBadge";
import { cn } from "@/lib/utils";

export interface Transaction {
    id: string;
    txnId: string;
    date: string;
    expiresIn?: string;
    amount: number;
    method: string;
    methodType: "virtual_account" | "ewallet" | "qris";
    status: PaymentStatus;
}

const methodIcon = {
    virtual_account: Building2,
    ewallet: Wallet,
    qris: Wallet,
};

const PAGE_SIZE = 5;

interface Props {
    transactions: Transaction[];
    onPayNow: (txn: Transaction) => void;
    onViewInvoice: (txn: Transaction) => void;
}

export default function TransactionTable({ transactions, onPayNow, onViewInvoice }: Props) {
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
    const paginated = transactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-stone-100 bg-stone-50/60">
                {["Transaction ID", "Date", "Amount", "Payment Method", "Status", "Action"].map((h) => (
                    <p key={h} className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                        {h}
                    </p>
                ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-stone-100">
                {paginated.length === 0 ? (
                    <div className="py-16 text-center text-stone-400">
                        <p className="text-sm">No transactions found</p>
                    </div>
                ) : (
                    paginated.map((txn) => {
                        const Icon = methodIcon[txn.methodType];
                        const isPending = txn.status === "PENDING";
                        const isFailed = txn.status === "FAILED";
                        const isSuccess = txn.status === "SUCCESS";

                        return (
                            <div
                                key={txn.id}
                                className={cn(
                                    "flex flex-col md:grid md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto] gap-2 md:gap-4 items-start md:items-center px-6 py-4 hover:bg-stone-50/60 transition-colors",
                                    isFailed && "opacity-60"
                                )}
                            >
                                {/* TXN ID */}
                                <div>
                                    <p className="text-sm font-bold text-stone-800">{txn.txnId}</p>
                                    {isPending && txn.expiresIn && (
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <AlertCircle className="w-3 h-3 text-amber-500" />
                                            <p className="text-[10px] text-amber-500 font-semibold">
                                                Expires in {txn.expiresIn}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Date */}
                                <p className="text-sm text-stone-500">{txn.date}</p>

                                {/* Amount */}
                                <p className={cn(
                                    "text-sm font-bold",
                                    isPending ? "text-amber-600" : isFailed ? "text-stone-400" : "text-stone-800"
                                )}>
                                    Rp. {txn.amount.toLocaleString("id-ID")}
                                </p>

                                {/* Method */}
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-md bg-stone-100 flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-3.5 h-3.5 text-stone-500" />
                                    </div>
                                    <span className="text-sm text-stone-600">{txn.method}</span>
                                </div>

                                {/* Status */}
                                <PaymentStatusBadge status={txn.status} />

                                {/* Action */}
                                <div className="flex justify-start md:justify-end">
                                    {isPending && (
                                        <button
                                            onClick={() => onPayNow(txn)}
                                            className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.97] px-4 py-2 rounded-lg transition-all"
                                        >
                                            Pay Now
                                        </button>
                                    )}
                                    {isSuccess && (
                                        <button
                                            onClick={() => onViewInvoice(txn)}
                                            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            Invoice
                                        </button>
                                    )}
                                    {isFailed && (
                                        <span className="text-xs text-stone-400 px-3 py-2">—</span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-6 py-3.5 border-t border-stone-100 bg-stone-50/40">
                <p className="text-xs text-stone-400">
                    Showing{" "}
                    <span className="font-semibold text-stone-600">{paginated.length}</span>
                    {" "}of{" "}
                    <span className="font-semibold text-stone-600">{transactions.length}</span>
                    {" "}transactions
                </p>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-400 disabled:opacity-30 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={cn(
                                "w-7 h-7 rounded-lg text-xs font-semibold transition-all",
                                page === p
                                    ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                                    : "text-stone-500 hover:bg-stone-100"
                            )}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-400 disabled:opacity-30 transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}