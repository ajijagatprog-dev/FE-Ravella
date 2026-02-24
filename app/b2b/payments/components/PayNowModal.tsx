"use client";

import { useState } from "react";
import { X, AlertCircle, Loader2, CheckCircle2, QrCode, Building2 } from "lucide-react";
import { Transaction, formatRp } from "../types";

type PayStep = "confirm" | "processing" | "success";

interface PayNowModalProps {
  transaction: Transaction;
  onClose: () => void;
  onSuccess: (id: string) => void;
}

export default function PayNowModal({ transaction, onClose, onSuccess }: PayNowModalProps) {
  const [step, setStep] = useState<PayStep>("confirm");

  function handlePay() {
    setStep("processing");
    // TODO Midtrans: window.snap.pay(snapToken, { onSuccess, onPending, onError })
    setTimeout(() => {
      setStep("success");
      onSuccess(transaction.id);
    }, 2200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={step === "processing" ? undefined : onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800">
            {step === "success" ? "Pembayaran Berhasil" : "Konfirmasi Pembayaran"}
          </h2>
          {step !== "processing" && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
            >
              <X size={17} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {step === "confirm" && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">ID Transaksi</span>
                  <span className="font-semibold text-gray-800">{transaction.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tanggal</span>
                  <span className="text-gray-700">{transaction.date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Metode</span>
                  <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                    {transaction.method === "QRIS" ? <QrCode size={13} /> : <Building2 size={13} />}
                    {transaction.method}
                  </span>
                </div>
                <div className="flex justify-between text-sm items-start gap-4">
                  <span className="text-gray-500 shrink-0">Keterangan</span>
                  <span className="text-gray-600 text-right text-xs leading-relaxed">
                    {transaction.description}
                  </span>
                </div>
                <div className="border-t border-blue-200 pt-3 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total Tagihan</span>
                  <span className="text-xl font-bold text-blue-600">{formatRp(transaction.amount)}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl p-3">
                <AlertCircle size={13} className="mt-0.5 shrink-0 text-amber-500" />
                Pastikan saldo mencukupi. Transaksi tidak dapat dibatalkan setelah diproses via payment gateway.
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handlePay}
                  className="flex-1 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all"
                >
                  Bayar Sekarang
                </button>
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center py-10 gap-4">
              <Loader2 size={40} className="text-blue-600 animate-spin" />
              <p className="font-semibold text-gray-700">Memproses pembayaran...</p>
              <p className="text-xs text-gray-400 text-center">
                Sedang terhubung ke payment gateway.
                <br />Jangan tutup halaman ini.
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center py-5 gap-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 size={36} className="text-green-500" />
              </div>
              <div className="text-center">
                <p className="font-bold text-lg text-gray-800">Pembayaran Dikonfirmasi!</p>
                <p className="text-sm text-gray-500 mt-1">
                  {transaction.id} telah ditandai sebagai{" "}
                  <span className="text-green-600 font-semibold">Lunas</span>.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl px-8 py-3 text-center w-full">
                <p className="text-xl font-bold text-gray-800">{formatRp(transaction.amount)}</p>
                <p className="text-xs text-gray-400 mt-0.5">berhasil diproses</p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Selesai
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}