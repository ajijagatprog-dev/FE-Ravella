"use client";

interface Tier {
  name: string;
  min: number;
  max: number | null;
  perks: string[];
}

interface TierCardProps {
  tier: Tier;
  index?: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

// ─── Per-tier visual config ───────────────────────────────────────────────────
const TIER_CONFIG: Record<
  string,
  {
    accent: string;
    badge: string;
    icon: string;
    bar: string;
    ring: string;
    label: string;
  }
> = {
  Basic: {
    accent: "from-slate-100 to-slate-50",
    badge: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
    icon: "bg-slate-100 text-slate-500",
    bar: "bg-slate-400",
    ring: "ring-slate-200",
    label: "Entry Level",
  },
  Gold: {
    accent: "from-amber-50 to-yellow-50",
    badge: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
    icon: "bg-amber-100 text-amber-500",
    bar: "bg-amber-400",
    ring: "ring-amber-200",
    label: "Most Popular",
  },
  Platinum: {
    accent: "from-blue-50 to-indigo-50",
    badge: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
    icon: "bg-blue-100 text-blue-500",
    bar: "bg-blue-500",
    ring: "ring-blue-200",
    label: "Premium",
  },
};

// ─── Tier Icons ───────────────────────────────────────────────────────────────
function TierIcon({ name }: { name: string }) {
  if (name === "Gold") {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    );
  }
  if (name === "Platinum") {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

// ─── Check Icon ───────────────────────────────────────────────────────────────
function CheckIcon({ className }: { className: string }) {
  return (
    <svg className={`w-3.5 h-3.5 shrink-0 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TierCard({ tier, index = 0, onEdit, onDelete }: TierCardProps) {
  const cfg = TIER_CONFIG[tier.name] ?? TIER_CONFIG["Basic"];
  const isGold = tier.name === "Gold";

  return (
    <div
      className={`relative flex flex-col bg-white rounded-2xl border shadow-sm overflow-hidden
        hover:shadow-md transition-all duration-200
        ring-1 ${cfg.ring}
        ${isGold ? "md:-translate-y-1 md:shadow-md" : ""}
      `}
    >
      {/* Popular badge for Gold */}
      {isGold && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-white shadow-sm">
            ★ Popular
          </span>
        </div>
      )}

      {/* ── Gradient Header ── */}
      <div className={`bg-gradient-to-br ${cfg.accent} px-5 pt-5 pb-4`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.icon}`}>
            <TierIcon name={tier.name} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-800">{tier.name}</h3>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badge}`}>
                {cfg.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {tier.max
                ? `Rp ${tier.min.toLocaleString('id-ID')} – Rp ${tier.max.toLocaleString('id-ID')}`
                : `Rp ${tier.min.toLocaleString('id-ID')}+`}
            </p>
          </div>
        </div>

        {/* Spend range bar */}
        <div className="mt-3 h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className={`h-full rounded-full ${cfg.bar}`}
            style={{ width: index === 0 ? "33%" : index === 1 ? "66%" : "100%" }}
          />
        </div>
      </div>

      {/* ── Perks ── */}
      <div className="px-5 py-4 flex-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Perks & Benefits
        </p>
        <ul className="space-y-2">
          {tier.perks.map((perk) => (
            <li key={perk} className="flex items-center gap-2.5 text-sm text-slate-700">
              <CheckIcon className={
                tier.name === "Gold" ? "text-amber-500" :
                  tier.name === "Platinum" ? "text-blue-500" :
                    "text-slate-400"
              } />
              {perk}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Footer ── */}
      <div className="px-5 pb-4 flex gap-2">
        <button
          onClick={onEdit}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-colors
          ${isGold
              ? "bg-amber-400 text-white hover:bg-amber-500 border-amber-400"
              : tier.name === "Platinum"
                ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
            }`
          }>
          Edit Tier
        </button>
        {onDelete && (
          <button
            onClick={onDelete}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
            title="Delete Tier"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}