"use client";

import { ShoppingBag, Star, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface LoyaltySettings {
  earning_multiplier: number;
  redemption_value: number;
  point_expiration: number;
  loyalty_enabled: boolean;
}

export default function HowToEarnTab() {
  const [settings, setSettings] = useState<LoyaltySettings | null>(null);

  useEffect(() => {
    // Fetch loyalty settings (public endpoint)
    api
      .get("/admin/loyalty/settings")
      .then((res) => {
        if (res.data.status === "success") {
          setSettings(res.data.data);
        }
      })
      .catch(() => {
        // fallback to defaults if fetch fails
        setSettings({
          earning_multiplier: 10,
          redemption_value: 5,
          point_expiration: 12,
          loyalty_enabled: true,
        });
      });
  }, []);

  const multiplier = settings?.earning_multiplier ?? 10;
  const redemption = settings?.redemption_value ?? 5;
  const expiration = settings?.point_expiration ?? 12;

  const earnWays = [
    {
      icon: ShoppingBag,
      label: "Belanja Produk",
      desc: `Dapatkan ${multiplier} poin setiap Rp 10.000 yang kamu belanjakan (berlaku setelah pesanan DELIVERED)`,
      points: `${multiplier} pts / Rp 10.000`,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Star,
      label: "Tulis Ulasan",
      desc: "Dapatkan poin tambahan untuk setiap ulasan produk yang terverifikasi",
      points: "Bonus pts",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      icon: Share2,
      label: "Tukar Poin",
      desc: `Setiap 1 poin setara diskon Rp ${redemption.toLocaleString("id-ID")}. Poin berlaku selama ${expiration} bulan.`,
      points: `1 pt = Rp ${redemption}`,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Settings Summary Box */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex flex-wrap gap-6">
        <div>
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-0.5">
            Perolehan Poin
          </p>
          <p className="text-sm font-bold text-blue-700">
            {multiplier} pts / Rp 10.000
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-0.5">
            Nilai Tukar
          </p>
          <p className="text-sm font-bold text-blue-700">
            1 pt = Rp {redemption.toLocaleString("id-ID")}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-0.5">
            Masa Berlaku Poin
          </p>
          <p className="text-sm font-bold text-blue-700">{expiration} bulan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {earnWays.map(
          ({ icon: Icon, label, desc, points, iconBg, iconColor }) => (
            <div
              key={label}
              className="border border-stone-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-sm transition-all"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${iconBg}`}
              >
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <p className="text-sm font-bold text-stone-800 mb-1">{label}</p>
              <p className="text-xs text-stone-500 leading-relaxed mb-3">
                {desc}
              </p>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                {points}
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
