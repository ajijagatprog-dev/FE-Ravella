"use client";

import { useState } from "react";
import B2bTable from "./B2bTable";
import UserManagementStats from "./UserManagementStats";

// ─── Mock data — ganti dengan fetch dari API/server action ─────────────────────
const MOCK_DATA = [
  {
    id: "1",
    name: "Global Apparel Ltd",
    email: "NPWP 01.234.567.8-012.000",
    type: "B2B PARTNER",
    status: "Active",
    lastTransaction: { amount: "$4,250.00", date: "Oct 24, 2023" },
  },
  {
    id: "2",
    name: "Sarah Jenkins",
    email: "sarah.j@email.com",
    type: "Retail",
    status: "Active",
    lastTransaction: { amount: "$120.50", date: "2 hours ago" },
  },
  {
    id: "3",
    name: "Urban Vogue Co.",
    email: "NPWP 12.345.678.9-101.000",
    type: "B2B PARTNER",
    status: "Pending Review",
    lastTransaction: null,
  },
  {
    id: "4",
    name: "Michael Roberts",
    email: "m.roberts@email.com",
    type: "Retail",
    status: "Inactive",
    lastTransaction: { amount: "$15.00", date: "Jan 12, 2023" },
  },
  {
    id: "5",
    name: "Luxe Threads Co.",
    email: "NPWP 22.111.000.3-400.000",
    type: "B2B PARTNER",
    status: "Active",
    lastTransaction: { amount: "$12,800.00", date: "Nov 1, 2023" },
  },
  {
    id: "6",
    name: "Emily Tan",
    email: "emily.tan@email.com",
    type: "Retail",
    status: "Active",
    lastTransaction: { amount: "$320.00", date: "3 days ago" },
  },
];

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { key: "b2b",     label: "B2B Partners",          count: 48   },
  { key: "retail",  label: "Retail Customers",       count: 1204 },
  { key: "pending", label: "Pending Verifications",  count: 12   },
];

// ─── Props dari Server Component (bisa pass data hasil fetch) ─────────────────
interface UserManagementClientProps {
  initialData?: typeof MOCK_DATA;
  totalUsers?: number;
  b2bPartners?: number;
  pendingVerifications?: number;
  retailCustomers?: number;
}

export default function UserManagementClient({
  initialData = MOCK_DATA,
  totalUsers = 1252,
  b2bPartners = 48,
  pendingVerifications = 12,
  retailCustomers = 1204,
}: UserManagementClientProps) {
  const [activeTab, setActiveTab] = useState<string>("b2b");
  const [page, setPage]           = useState(1);
  const [limit, setLimit]         = useState(10);

  return (
    <div className="space-y-6">

      {/* ── Stats Cards ── */}
      <UserManagementStats
        totalUsers={totalUsers}
        b2bPartners={b2bPartners}
        pendingVerifications={pendingVerifications}
        retailCustomers={retailCustomers}
      />

      {/* ── Tabs ── */}
      <div className="flex items-center gap-0 border-b border-slate-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setPage(1); }}
            className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "text-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
            <span
              className={`inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full text-xs font-bold transition-colors ${
                activeTab === tab.key
                  ? tab.key === "pending"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {tab.count.toLocaleString()}
            </span>
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <B2bTable
        data={initialData}
        columns={[]}
        isLoading={false}
        page={page}
        limit={limit}
        total={totalUsers}
        handlePageChange={(p) => setPage(p)}
        handleLimitChange={(l) => { setLimit(l); setPage(1); }}
      />
    </div>
  );
}