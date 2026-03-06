"use client";

import TierCard from "./TierCard";

const tiers = [
  {
    name: "Basic",
    min: 0,
    max: 5000000,
    perks: ["1x Point Multiplier", "Free ongkir > Rp 500.000", "Birthday 200 poin"],
  },
  {
    name: "Gold",
    min: 5000001,
    max: 15000000,
    perks: ["1.5x Point Multiplier", "Free ongkir > Rp 200.000", "Early access 24 jam", "Birthday 500 poin"],
  },
  {
    name: "Platinum",
    min: 15000001,
    max: null,
    perks: ["2x Point Multiplier", "Free express semua pesanan", "VIP early access 48 jam", "Personal consultant", "Birthday 1000 poin"],
  },
];

export default function MembershipTiers() {
  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Membership Tiers
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {tiers.length} tiers configured — Based on total lifetime spend
          </p>
        </div>
      </div>

      {/* ── Tier Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier, index) => (
          <TierCard key={tier.name} tier={tier} index={index} />
        ))}
      </div>

    </div>
  );
}