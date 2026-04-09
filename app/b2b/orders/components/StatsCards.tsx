import { ShoppingCart, FileText } from "lucide-react";

interface Props {
  revenueMonth: number;
  activeOrders: number;
  pendingQuotes: number;
}

export default function StatsCards({ revenueMonth, activeOrders, pendingQuotes }: Props) {
  const formatPrice = (val: number) => "Rp. " + val.toLocaleString("id-ID");
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Revenue Month */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
        <div className="bg-green-100 p-2 rounded-lg">
          <span className="text-green-600 text-xl">💵</span>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Revenue (Total Delivered/Paid)</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{formatPrice(revenueMonth)}</p>
        </div>
      </div>

      {/* Active Orders */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <ShoppingCart className="text-blue-600" size={22} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Active Orders</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{activeOrders}</p>
          <p className="text-xs text-gray-400 mt-1">Orders currently processing</p>
        </div>
      </div>

      {/* Pending Quotes */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
        <div className="bg-orange-100 p-2 rounded-lg">
          <FileText className="text-orange-500" size={22} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Pending Approvals</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{pendingQuotes}</p>
          <p className="text-xs text-gray-400 mt-1">Requiring immediate review</p>
        </div>
      </div>
    </div>
  );
}