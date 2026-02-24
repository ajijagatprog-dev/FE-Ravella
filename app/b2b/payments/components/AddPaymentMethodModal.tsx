"use client";

import { useState } from "react";
import { X, AlertCircle, CheckCircle2, Building2, QrCode, CreditCard } from "lucide-react";
import { PaymentMethod } from "../types";

interface AddPaymentMethodModalProps {
  onClose: () => void;
  onAdd: (pm: PaymentMethod) => void;
}

const BANKS = ["BCA", "Mandiri", "BNI", "BRI", "CIMB", "Permata"];

export default function AddPaymentMethodModal({ onClose, onAdd }: AddPaymentMethodModalProps) {
  const [type, setType] = useState<"VA" | "QRIS" | "Card">("VA");
  const [bank, setBank] = useState("BCA");
  const [accountNumber, setAccountNumber] = useState("");
  const [added, setAdded] = useState(false);

  function handleSubmit() {
    if (type === "VA" && !accountNumber.trim()) return;

    const pm: PaymentMethod = {
      id: "pm" + Date.now(),
      type,
      label:
        type === "VA"
          ? `${bank} Virtual Account`
          : type === "QRIS"
          ? "QRIS"
          : "Kartu Kredit/Debit",
      detail:
        type === "VA"
          ? accountNumber
          : type === "QRIS"
          ? "Scan QR untuk bayar"
          : "****-****-****-****",
      bank: type === "VA" ? bank : undefined,
    };

    onAdd(pm);
    setAdded(true);
    setTimeout(onClose, 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Tambah Metode Pembayaran</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={17} />
          </button>
        </div>

        {added ? (
          <div className="flex flex-col items-center py-10 gap-3 px-6">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 size={30} className="text-green-500" />
            </div>
            <p className="font-bold text-gray-800">Metode Berhasil Ditambahkan!</p>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4">
            {/* Type selector */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
                Jenis Pembayaran
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { value: "VA" as const,   icon: <Building2 size={18} />,  label: "Virtual Account" },
                    { value: "QRIS" as const, icon: <QrCode size={18} />,     label: "QRIS" },
                    { value: "Card" as const, icon: <CreditCard size={18} />, label: "Kartu" },
                  ] as const
                ).map(({ value, icon, label }) => (
                  <button
                    key={value}
                    onClick={() => setType(value)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-colors ${
                      type === value
                        ? "bg-blue-50 border-blue-500 text-blue-600"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* VA fields */}
            {type === "VA" && (
              <>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Bank
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {BANKS.map((b) => (
                      <button
                        key={b}
                        onClick={() => setBank(b)}
                        className={`py-2 rounded-lg border text-sm font-medium transition-colors ${
                          bank === b
                            ? "bg-blue-600 text-white border-blue-600"
                            : "text-gray-600 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Nomor Virtual Account
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Masukkan nomor VA"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </>
            )}

            {/* QRIS info */}
            {type === "QRIS" && (
              <div className="bg-gray-50 rounded-xl p-4 text-center text-sm text-gray-500 border border-dashed border-gray-200">
                <QrCode size={36} className="mx-auto mb-2 text-gray-300" />
                QR code akan digenerate otomatis saat checkout.
              </div>
            )}

            {/* Card info */}
            {type === "Card" && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2">
                <AlertCircle size={13} className="mt-0.5 shrink-0" />
                Kartu kredit/debit akan diverifikasi melalui Midtrans saat transaksi pertama.
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}