"use client";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Stat {
  label: string;
  value: string | number;
  sub?: string;
  trend?: { value: string; up: boolean };
  icon: React.ReactNode;
  color: "blue" | "violet" | "amber" | "emerald";
}

const COLOR_MAP = {
  blue: {
    icon: "bg-blue-100 text-blue-600",
    trend: { up: "text-emerald-600", down: "text-red-500" },
    accent: "bg-blue-600",
  },
  violet: {
    icon: "bg-violet-100 text-violet-600",
    trend: { up: "text-emerald-600", down: "text-red-500" },
    accent: "bg-violet-600",
  },
  amber: {
    icon: "bg-amber-100 text-amber-600",
    trend: { up: "text-emerald-600", down: "text-red-500" },
    accent: "bg-amber-500",
  },
  emerald: {
    icon: "bg-emerald-100 text-emerald-600",
    trend: { up: "text-emerald-600", down: "text-red-500" },
    accent: "bg-emerald-600",
  },
};

// ─── Single Stat Card ─────────────────────────────────────────────────────────
function StatCard({ stat }: { stat: Stat }) {
  const c = COLOR_MAP[stat.color];
  return (
    <div className="relative bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      {/* Subtle top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${c.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
          <p className="text-2xl font-bold text-slate-800 tabular-nums">{stat.value.toLocaleString()}</p>
          {stat.sub && <p className="text-xs text-slate-400 mt-0.5">{stat.sub}</p>}
          {stat.trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${stat.trend.up ? c.trend.up : c.trend.down}`}>
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d={stat.trend.up ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                />
              </svg>
              {stat.trend.value}
            </div>
          )}
        </div>

        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${c.icon}`}>
          {stat.icon}
        </div>
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

// ─── Main Export ─────────────────────────────────────────────────────────────
interface UserManagementStatsProps {
  totalUsers?: number;
  b2bPartners?: number;
  pendingVerifications?: number;
  retailCustomers?: number;
}

export default function UserManagementStats({
  totalUsers = 1252,
  b2bPartners = 48,
  pendingVerifications = 12,
  retailCustomers = 1204,
}: UserManagementStatsProps) {
  const stats: Stat[] = [
    {
      label: "Total Users",
      value: totalUsers,
      sub: "Across all types",
      trend: { value: "+8.2% this month", up: true },
      icon: <UsersIcon />,
      color: "blue",
    },
    {
      label: "B2B Partners",
      value: b2bPartners,
      sub: "Active partnerships",
      trend: { value: "+3 this week", up: true },
      icon: <BuildingIcon />,
      color: "violet",
    },
    {
      label: "Pending Verifications",
      value: pendingVerifications,
      sub: "Awaiting review",
      trend: { value: "Needs attention", up: false },
      icon: <ClockIcon />,
      color: "amber",
    },
    {
      label: "Retail Customers",
      value: retailCustomers,
      sub: "Registered shoppers",
      trend: { value: "+124 this month", up: true },
      icon: <ShoppingBagIcon />,
      color: "emerald",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((s) => (
        <StatCard key={s.label} stat={s} />
      ))}
    </div>
  );
}
