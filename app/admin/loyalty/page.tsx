"use client";

import { useState } from "react";
import GlobalPointSettings from "./components/ GlobalPointSettings";
import MembershipTiers from "./components/MembershipTiers";
import CustomerLoyaltyTable from "./components/ CustomerLoyaltyTable";
import { Lock, Unlock } from "lucide-react";

export default function LoyaltyPage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Loyalty Management
          </h1>
          <p className="text-sm text-gray-500">
            Configure membership tiers, manage point economy, and monitor engagement.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm border
            ${isEditing
              ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }
          `}
        >
          {isEditing ? <Unlock size={16} /> : <Lock size={16} />}
          {isEditing ? "Exit Edit Mode" : "Edit Loyalty System"}
        </button>
      </div>

      <GlobalPointSettings isEditing={isEditing} setIsEditing={setIsEditing} />
      <MembershipTiers isEditing={isEditing} />
      <CustomerLoyaltyTable />
    </div>
  );
}
