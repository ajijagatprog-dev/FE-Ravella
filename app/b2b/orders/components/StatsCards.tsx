import { TrendingUp, ShoppingCart, FileText } from "lucide-react";

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Revenue Month */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
        <div className="bg-green-100 p-2 rounded-lg">
          <span className="text-green-600 text-xl">💵</span>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Revenue Month</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">Rp. 42,500.80</p>
          {/* <p className="text-xs text-green-500 font-medium mt-1 flex items-center gap-1">
            <TrendingUp size={12} />
            +12.5% from last month
          </p> */}
        </div>
      </div>

      {/* Active Orders */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <ShoppingCart className="text-blue-600" size={22} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Active Orders</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">48</p>
          <p className="text-xs text-gray-400 mt-1">12 orders currently in transit</p>
        </div>
      </div>

      {/* Pending Quotes */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
        <div className="bg-orange-100 p-2 rounded-lg">
          <FileText className="text-orange-500" size={22} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Pending Quotes</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">07</p>
          <p className="text-xs text-gray-400 mt-1">Requiring immediate review</p>
        </div>
      </div>
    </div>
  );
}