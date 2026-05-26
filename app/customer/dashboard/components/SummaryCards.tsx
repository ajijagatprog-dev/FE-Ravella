"use client";

import { Truck, Heart, Tag, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function SummaryCards({
  orders,
  profile,
}: {
  orders: any[];
  profile: any;
}) {
  const [loyaltyPoints, setLoyaltyPoints] = useState<number | null>(null);

  useEffect(() => {
    // Cepat ambil poin dari profile dulu (sudah ada dari dashboard fetch)
    if (profile?.loyalty_points !== undefined) {
      setLoyaltyPoints(profile.loyalty_points ?? 0);
    }
  }, [profile]);

  const activeOrdersCount =
    orders?.filter(
      (o) =>
        !["DELIVERED", "CANCELLED", "COMPLETED"].includes(
          o.status.toUpperCase(),
        ),
    ).length || 0;

  const displayPoints = loyaltyPoints ?? profile?.loyalty_points ?? 0;

  const cards = [
    {
      title: "Active Orders",
      value: activeOrdersCount,
      subtitle:
        activeOrdersCount > 0 ? "Sedang diproses" : "Tidak ada order aktif",
      subtitleColor: activeOrdersCount > 0 ? "text-blue-500" : "text-stone-400",
      icon: Truck,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      href: "/customer/myOrders",
    },
    {
      title: "Loyalty Points",
      value: displayPoints.toLocaleString("id-ID"),
      subtitle:
        displayPoints > 0
          ? "Tukar dengan reward"
          : "Mulai belanja untuk earn poin",
      subtitleColor: displayPoints > 0 ? "text-emerald-600" : "text-stone-400",
      icon: Tag,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      href: "/customer/loyaltyMembership",
    },
    {
      title: "Wishlist",
      value: 0,
      subtitle: "Fitur segera hadir",
      subtitleColor: "text-stone-400",
      icon: Heart,
      iconBg: "bg-rose-100",
      iconColor: "text-rose-500",
      href: "#",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(
        ({
          title,
          value,
          subtitle,
          subtitleColor,
          icon: Icon,
          iconBg,
          iconColor,
          href,
        }) => (
          <Link
            key={title}
            href={href}
            className="group bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:border-blue-200 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
              >
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
            </div>
            <p className="text-3xl font-black text-stone-800 mb-0.5 truncate">
              {value}
            </p>
            <p className="text-sm font-semibold text-stone-600 mb-1">{title}</p>
            <p className={`text-xs font-medium ${subtitleColor}`}>{subtitle}</p>
          </Link>
        ),
      )}
    </div>
  );
}
