export default function OrderStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* TOTAL REVENUE */}
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
        <p className="text-xs font-semibold tracking-wide text-blue-500 uppercase">
          Total Revenue
        </p>
        <h2 className="text-3xl font-bold text-gray-900 mt-2">$45,280.00</h2>
        <p className="text-sm font-medium text-green-600 mt-2">
          ↗ +12.5% vs last month
        </p>
      </div>

      {/* ACTIVE ORDERS */}
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
        <p className="text-xs font-semibold tracking-wide text-blue-500 uppercase">
          Active Orders
        </p>
        <h2 className="text-3xl font-bold text-gray-900 mt-2">124</h2>
        <p className="text-sm font-medium text-green-600 mt-2">
          ↗ +3.2% from yesterday
        </p>
      </div>

      {/* PENDING SHIPMENTS */}
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
        <p className="text-xs font-semibold tracking-wide text-blue-500 uppercase">
          Pending Shipments
        </p>
        <h2 className="text-3xl font-bold text-gray-900 mt-2">18</h2>
        <p className="text-sm font-medium text-red-500 mt-2">
          ↘ -5.1% since Monday
        </p>
      </div>
    </div>
  );
}
