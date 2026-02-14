interface Props {
  counts: {
    all: number;
    pending: number;
    success: number;
    failed: number;
  };
}

export default function OrderStats({ counts }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 sm:px-6">

      {/* Total Orders */}
      <div className="relative bg-white p-5 rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1 tabular-nums">
              {counts.all}
            </h3>
            <p className="text-xs text-slate-400 mt-1">All time orders</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Pending Orders */}
      <div className="relative bg-white p-5 rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-yellow-600">Pending Orders</p>
            <h3 className="text-3xl font-bold text-yellow-700 mt-1 tabular-nums">
              {counts.pending}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <p className="text-xs text-amber-500">Awaiting process</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Success Orders */}
      <div className="relative bg-white p-5 rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-green-600">Success Orders</p>
            <h3 className="text-3xl font-bold text-green-700 mt-1 tabular-nums">
              {counts.success}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
              </svg>
              <p className="text-xs text-emerald-500">Completed</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

    </div>
  );
}