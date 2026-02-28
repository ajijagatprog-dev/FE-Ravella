"use client";

import { Search } from "lucide-react";

const STATUS_OPTIONS = [
    { label: "All Status", value: "" },
    { label: "Success", value: "SUCCESS" },
    { label: "Pending", value: "PENDING" },
    { label: "Failed", value: "FAILED" },
];

const YEAR_OPTIONS = ["2023", "2022", "2021"];

interface Props {
    search: string;
    onSearchChange: (v: string) => void;
    status: string;
    onStatusChange: (v: string) => void;
    year: string;
    onYearChange: (v: string) => void;
}

export default function PaymentFilters({
    search, onSearchChange,
    status, onStatusChange,
    year, onYearChange,
}: Props) {
    return (
        <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Filter by Transaction ID or Method..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent placeholder:text-stone-400 text-stone-700 transition-shadow"
                />
            </div>

            {/* Status */}
            <div className="relative">
                <select
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="appearance-none pl-3.5 pr-8 py-2.5 text-sm rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 text-stone-700 min-w-[130px] cursor-pointer"
                >
                    {STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
                <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Year */}
            <div className="relative">
                <select
                    value={year}
                    onChange={(e) => onYearChange(e.target.value)}
                    className="appearance-none pl-3.5 pr-8 py-2.5 text-sm rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 text-stone-700 min-w-[100px] cursor-pointer"
                >
                    {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
                <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
}