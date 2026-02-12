"use client";

const data = [
  { day: "MON", value: 40 },
  { day: "TUE", value: 65 },
  { day: "WED", value: 55 },
  { day: "THU", value: 85, active: true },
  { day: "FRI", value: 45 },
  { day: "SAT", value: 70 },
  { day: "SUN", value: 60 },
];

export default function PendapatanChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Sales Trend</h3>
          <p className="text-sm text-gray-500">
            Revenue analytics over the last 7 days
          </p>
        </div>

        <button className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition">
          Weekly View
        </button>
      </div>

      {/* CHART */}
      <div className="flex items-end justify-between gap-3 h-40">
        {data.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-1">
            <div className="w-full flex items-end h-full">
              <div
                className={`w-full rounded-xl transition-all duration-500
                  ${item.active ? "bg-blue-600" : "bg-blue-100"}`}
                style={{ height: `${item.value}%` }}
              />
            </div>
            <span className="text-[10px] font-medium text-gray-400">
              {item.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
