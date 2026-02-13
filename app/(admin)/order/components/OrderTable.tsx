"use client";

interface Order {
  id: string;
  customer: string;
  date: string;
  status: "Success" | "Pending" | "Failed";
  total: string;
}

interface OrderTableProps {
  orders: Order[];
}

export default function OrderTable({ orders }: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-lg shadow-gray-200/50">
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              No Orders Found
            </h3>
            <p className="text-sm text-gray-500">
              No orders match your current filters or search
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-0">
      <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-lg shadow-gray-200/50">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50 border-b border-gray-200/80">
              <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100/80">
            {orders.map((order, index) => (
              <tr
                key={index}
                className="transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50/50 hover:via-indigo-50/30 hover:to-purple-50/50 hover:shadow-inner"
              >
                <td className="px-6 py-5">
                  <span className="text-sm font-bold text-blue-600 hover:text-blue-700 cursor-pointer">
                    {order.id}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/30">
                      <span className="text-white font-bold text-sm">
                        {order.customer.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {order.customer}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-medium text-gray-700">
                    {order.date}
                  </span>
                </td>
                <td className="px-6 py-5">
                  {order.status === "Success" ? (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></span>
                      <span className="text-xs font-bold text-green-700">
                        {order.status}
                      </span>
                    </span>
                  ) : order.status === "Pending" ? (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-lg shadow-amber-500/50"></span>
                      <span className="text-xs font-bold text-amber-700">
                        {order.status}
                      </span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/60 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></span>
                      <span className="text-xs font-bold text-red-700">
                        {order.status}
                      </span>
                    </span>
                  )}
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="text-sm font-bold text-gray-900">
                    {order.total}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
