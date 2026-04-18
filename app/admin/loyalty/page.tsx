"use client";

import { useState } from "react";
import GlobalPointSettings from "./components/GlobalPointSettings";
import MembershipTiers from "./components/MembershipTiers";
import CustomerLoyaltyTable from "./components/CustomerLoyaltyTable";
import { Lock, Unlock } from "lucide-react";

export default function LoyaltyPage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      {/* ── Page Header (Nempel/Integrated Look) ── */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-5 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Loyalty Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
              Configure membership tiers, manage point economy, and monitor customer engagement.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm border shrink-0
                ${isEditing
                  ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }
              `}
            >
              {isEditing ? <Unlock size={16} /> : <Lock size={16} />}
              <span className="hidden xs:inline">{isEditing ? "Exit Edit Mode" : "Edit Loyalty System"}</span>
              <span className="xs:hidden">{isEditing ? "Exit" : "Edit"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="px-4 sm:px-6 lg:px-8 space-y-8 pb-10">
        <GlobalPointSettings isEditing={isEditing} setIsEditing={setIsEditing} />
        <MembershipTiers isEditing={isEditing} />
        <CustomerLoyaltyTable />
      </div>
    </div>
  );
}
