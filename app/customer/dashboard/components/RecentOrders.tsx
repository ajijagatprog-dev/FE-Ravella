export default function RecentOrders() {
    const orders = [
        { id: "#RH-89231", total: "$1,249.00", status: "Shipped" },
        { id: "#RH-89104", total: "$450.00", status: "Delivered" },
        { id: "#RH-88762", total: "$312.00", status: "Delivered" },
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border text-gray-500">
            <h3 className="font-semibold mb-4 text-black">Recent Orders</h3>

            <div className="space-y-3">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="flex justify-between items-center border-b pb-3"
                    >
                        <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-xs text-gray-500">{order.status}</p>
                        </div>
                        <p className="font-semibold">{order.total}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}