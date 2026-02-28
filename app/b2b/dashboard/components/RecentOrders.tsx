"use client";

import { Eye } from "lucide-react";

interface Order {
    id: string;
    date: string;
    amount: string;
    status: string;
}

interface RecentOrdersProps {
    orders: Order[];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-gray-900">Pesanan Terbaru</h2>
                <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">Lihat Semua</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-4">ID Pesanan</th>
                            <th className="px-6 py-4">Tanggal</th>
                            <th className="px-6 py-4">Jumlah</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {orders.map((order, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">{order.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 font-medium">{order.date}</td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">{order.amount}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${order.status === "Processing" ? "bg-blue-100 text-blue-600" :
                                            order.status === "Shipped" ? "bg-emerald-100 text-emerald-600" :
                                                "bg-gray-100 text-gray-600"
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button className="p-2 rounded-lg hover:bg-blue-50 text-gray-300 hover:text-blue-600 transition-all">
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
