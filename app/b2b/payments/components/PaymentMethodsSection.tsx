"use client";

import { Plus, Building2, QrCode, CreditCard, Star, Trash2 } from "lucide-react";
import { PaymentMethod } from "../types";

interface PaymentMethodsSectionProps {
  methods: PaymentMethod[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onSetPrimary: (id: string) => void;
}

function MethodIcon({ type }: { type: PaymentMethod["type"] }) {
  if (type === "QRIS") return <QrCode size={15} className="text-blue-500" />;
  if (type === "Card") return <CreditCard size={15} className="text-purple-500" />;
  return <Building2 size={15} className="text-green-600" />;
}

export default function PaymentMethodsSection({
  methods,
  onAdd,
  onDelete,
  onSetPrimary,
}: PaymentMethodsSectionProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800">Metode Pembayaran Tersimpan</h3>
      </div>

      <div className="space-y-2">
        {methods.length === 0 ? (
          <div className="text-center py-6 text-sm text-gray-400">
            Belum ada metode pembayaran.{" "}
            <button onClick={onAdd} className="text-blue-500 font-medium hover:underline">
              Tambah sekarang
            </button>
          </div>
        ) : (
          methods.map((pm) => (
            <div
              key={pm.id}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
                pm.isPrimary
                  ? "bg-blue-50 border-blue-200"
                  : "bg-gray-50 border-gray-100 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    pm.isPrimary ? "bg-blue-100" : "bg-white border border-gray-200"
                  }`}
                >
                  <MethodIcon type={pm.type} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                    {pm.label}
                    {pm.isPrimary && (
                      <span className="px-1.5 py-0.5 text-xs font-bold bg-blue-600 text-white rounded">
                        Utama
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">{pm.detail}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {!pm.isPrimary && (
                  <button
                    onClick={() => onSetPrimary(pm.id)}
                    title="Jadikan utama"
                    className="p-1.5 rounded-lg hover:bg-yellow-50 text-gray-300 hover:text-yellow-400 transition-colors"
                  >
                    <Star size={15} />
                  </button>
                )}
                <button
                  onClick={() => onDelete(pm.id)}
                  title="Hapus"
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}