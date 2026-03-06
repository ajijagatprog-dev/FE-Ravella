"use client";

import { useState, useEffect, useCallback } from "react";
import B2bTable from "./B2bTable";
import UserManagementStats from "./UserManagementStats";
import api from "@/lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserStats {
  total_users: number;
  users_trend: number;
  new_this_month: number;
  b2b_partners: number;
  b2b_new_this_month: number;
  pending_verifications: number;
  retail_customers: number;
  retail_new_this_month: number;
}

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TAB_KEYS = [
  { key: "all", label: "All Users", roleFilter: undefined },
  { key: "b2b", label: "B2B Partners", roleFilter: "b2b" },
  { key: "retail", label: "Retail Customers", roleFilter: "customer" },
] as const;

export default function UserManagementClient() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [users, setUsers] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/admin/users/stats');
      if (res.data.status === 'success') {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch user stats", error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentTab = TAB_KEYS.find(t => t.key === activeTab);
      const res = await api.get('/admin/users', {
        params: {
          page,
          limit,
          role: currentTab?.roleFilter || undefined,
        }
      });
      if (res.data.status === 'success') {
        const fetchResponse = res.data.data;
        setUsers(fetchResponse.data || []);
        setTotalUsers(fetchResponse.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, activeTab]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Action handler for B2B verify/reject, etc.
  const handleUserAction = async (userId: number, action: string) => {
    try {
      let payload: Record<string, string> = {};
      if (action === 'approve') payload = { b2b_status: 'approved' };
      else if (action === 'reject') payload = { b2b_status: 'rejected' };

      await api.put(`/admin/users/${userId}`, payload);
      // Refresh data
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error("Failed to update user", error);
      alert("Failed to update user. Please try again.");
    }
  };

  // Tab counts from stats
  const getTabCount = (key: string): number => {
    if (!stats) return 0;
    switch (key) {
      case "all": return stats.total_users;
      case "b2b": return stats.b2b_partners + stats.pending_verifications;
      case "retail": return stats.retail_customers;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Stats Cards ── */}
      <UserManagementStats
        totalUsers={stats?.total_users ?? 0}
        b2bPartners={stats?.b2b_partners ?? 0}
        pendingVerifications={stats?.pending_verifications ?? 0}
        retailCustomers={stats?.retail_customers ?? 0}
        usersTrend={stats?.users_trend ?? 0}
        newThisMonth={stats?.new_this_month ?? 0}
        b2bNewThisMonth={stats?.b2b_new_this_month ?? 0}
        retailNewThisMonth={stats?.retail_new_this_month ?? 0}
        isLoading={statsLoading}
      />

      {/* ── Tabs ── */}
      <div className="flex items-center gap-0 border-b border-slate-200">
        {TAB_KEYS.map((tab) => (
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
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-500"
                }`}
            >
              {getTabCount(tab.key).toLocaleString()}
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
        onUserAction={handleUserAction}
      />
    </div>
  );
}