"use client";

import { Search } from "lucide-react";
import { OrderTabsProps } from "../types";

export default function OrderTabs({
  activeTab,
  onTabChange,
  onSearch,
  searchQuery,
  counts,
}: OrderTabsProps) {
  const tabs = [
    { id: "all", label: "All Orders", count: counts.all },
    { id: "pending", label: "Pending", count: counts.pending },
    { id: "success", label: "Success", count: counts.success },
    { id: "failed", label: "Failed", count: counts.failed },
  ];

  return (
    <div className="flex items-center justify-between px-6 pt-6 pb-4">
      <div className="flex space-x-1 bg-gray-100/80 p-1.5 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-5 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-gray-200 text-gray-700">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search ID, customer..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 pr-4 py-2.5 border-2 border-gray-200 bg-white rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-blue-500 w-72"
        />
      </div>
    </div>
  );
}
