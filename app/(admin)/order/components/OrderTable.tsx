"use client";

import { OrderTableProps } from "../types";

export default function OrderTable({ orders }: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="px-4 sm:px-6">
        <div className="bg-white rounded-2xl border shadow-sm p-10 text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            No Orders Found
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Try changing your filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6">
      <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right font-semibold text-gray-700 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order.uid} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-semibold text-blue-600">
                  {order.id}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {order.customer}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {order.date}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status.toLowerCase() === "success"
                        ? "bg-green-100 text-green-700"
                        : order.status.toLowerCase() === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-semibold text-gray-900">
                  {order.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
