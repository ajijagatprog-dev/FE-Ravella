"use client";

import { useState, useEffect } from "react";
import B2bTable from "./B2bTable";
import UserManagementStats from "./UserManagementStats";
import api from "@/lib/axios";

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { key: "all", label: "All Users", count: 0 },
  { key: "b2b", label: "B2B Partners", count: 0 },
  { key: "retail", label: "Retail Customers", count: 0 },
];

export default function UserManagementClient() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [users, setUsers] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // We fetch counts or stats in a real app, but for now we'll put 0 or derive from API response
  // Assuming API gives total items

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/users', {
        params: {
          page,
          limit,
          // type: activeTab !== 'all' ? activeTab : undefined // If your backend handles this
        }
      });
      if (res.data.status === 'success') {
        const fetchResponse = res.data.data;
        // Adjust based on your API's pagination format, usually fetchResponse.data is the array
        setUsers(fetchResponse.data || []);
        setTotalUsers(fetchResponse.total || 0);

        // Update tab counts if you want, or handle them via distinct endpoints
        TABS[0].count = fetchResponse.total || 0;
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, activeTab]);

  return (
    <div className="space-y-6">

      {/* ── Stats Cards ── */}
      <UserManagementStats
        totalUsers={totalUsers}
        b2bPartners={TABS[1].count}
        pendingVerifications={0}
        retailCustomers={TABS[2].count}
      />

      {/* ── Tabs ── */}
      <div className="flex items-center gap-0 border-b border-slate-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setPage(1); }}
            className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === tab.key
                ? "text-blue-600"
                : "text-slate-500 hover:text-slate-700"
              }`}
          >
            {tab.label}
            <span
              className={`inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full text-xs font-bold transition-colors ${activeTab === tab.key
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
        data={users}
        columns={[]}
        isLoading={isLoading}
        page={page}
        limit={limit}
        total={totalUsers}
        handlePageChange={(p) => setPage(p)}
        handleLimitChange={(l) => { setLimit(l); setPage(1); }}
      />
    </div>
  );
}