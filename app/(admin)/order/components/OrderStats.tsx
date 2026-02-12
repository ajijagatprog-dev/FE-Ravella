export default function OrderStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <p className="text-sm text-gray-500">TOTAL REVENUE</p>
        <h2 className="text-2xl font-bold mt-2">$45,280.00</h2>
        <p className="text-green-600 text-sm mt-1">+12.5% vs last month</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <p className="text-sm text-gray-500">ACTIVE ORDERS</p>
        <h2 className="text-2xl font-bold mt-2">124</h2>
        <p className="text-green-600 text-sm mt-1">+3.2% from yesterday</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border text-gray-800">
        <p className="text-sm text-gray-500">PENDING SHIPMENTS</p>
        <h2 className="text-2xl font-bold mt-2">18</h2>
        <p className="text-red-500 text-sm mt-1">-5.1% since Monday</p>
      </div>
    </div>
  );
}
