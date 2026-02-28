"use client";

import TierCard from "./TierCard";

const tiers = [
  {
    name: "Basic",
    min: 0,
    max: 500,
    perks: ["1x Point Multiplier", "Early access to sales"],
  },
  {
    name: "Gold",
    min: 501,
    max: 2000,
    perks: ["1.2x Point Multiplier", "Free standard shipping", "Birthday offer"],
  },
  {
    name: "Platinum",
    min: 2001,
    max: null,
    perks: ["1.5x Point Multiplier", "VIP support", "Exclusive drops"],
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
            {tiers.length} tiers configured
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Tier
        </button>
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