"use client";

import { CreditCard } from "lucide-react";

interface PaymentHeaderProps {
  onAddPaymentMethod: () => void;
}

export default function PaymentHeader({ onAddPaymentMethod }: PaymentHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">B2B Payment &amp; Invoice Hub</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Kelola aktivitas keuangan dan riwayat transaksi Ravelle Fashion.
        </p>
      </div>
      <button
        onClick={onAddPaymentMethod}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all"
      >
        <CreditCard size={15} />
        Add Payment Method
      </button>
    </div>
  );
}