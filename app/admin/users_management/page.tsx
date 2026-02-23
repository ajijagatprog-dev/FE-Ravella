// app/user-managements/page.tsx
// ✅ Server Component — TIDAK pakai "use client"

import UserManagementClient from "./components/UserManagementClient";

export const metadata = {
  title: "User Management | Ravelle Fashion Admin",
  description: "Manage retail customers and B2B partners",
};

export default async function UsersManagementPage() {
  // Nanti bisa fetch data di sini dari API/DB:
  // const stats = await fetchStats();
  // const users = await fetchUsers({ page: 1, limit: 10 });

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Integrated User Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage retail customers and B2B partners, monitor transaction
            activity, and handle verifications.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export List
          </button>

          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Create User
          </button>
        </div>
      </div>

      {/* ── Client Component: Stats + Tabs + Table ── */}
      {/*
        Pass hasil fetch dari server ke sini kalau sudah ada API:
        <UserManagementClient
          initialData={users.data}
          totalUsers={stats.totalUsers}
          b2bPartners={stats.b2bPartners}
          pendingVerifications={stats.pendingVerifications}
          retailCustomers={stats.retailCustomers}
        />
      */}
      <UserManagementClient />
    </div>
  );
}