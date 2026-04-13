"use client";

import { CreditCard } from "lucide-react";

export default function PaymentHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">B2B Payment &amp; Invoice Hub</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Kelola aktivitas keuangan dan riwayat transaksi Ravelle Fashion.
        </p>
      </div>
    </div>
  );
}