import { Download, Plus } from "lucide-react";
import StatsCards from "./components/StatsCards";
import OrdersClient from "./components/OrdersClient";

export default function B2BOrdersPage() {
  return (
    <div className="text-gray-800 p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order History</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Track, manage and view details for all wholesale shipments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
            <Download size={15} />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={15} />
            New Order
          </button>
        </div>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Interactive: Tabs + Table + Pagination + Modal */}
      <OrdersClient />
    </div>
  );
}