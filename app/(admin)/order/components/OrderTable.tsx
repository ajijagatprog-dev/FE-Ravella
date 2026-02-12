const orders = [
  {
    id: "#RVL-4921",
    customer: "Fadil",
    date: "Oct 24, 2023",
    status: "Success",
    total: "Rp. 2.000.000",
  },
  {
    id: "#RVL-4922",
    customer: "Anan",
    date: "Oct 24, 2023",
    status: "Pending",
    total: "Rp. 3.500.000",
  },
  {
    id: "#RVL-4923",
    customer: "Fardan",
    date: "Oct 23, 2023",
    status: "Failed",
    total: "Rp. 2.500.000",
  },
];

export default function OrderTable() {
  return (
    <div className="p-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="py-3">ORDER ID</th>
            <th className="py-3">CUSTOMER</th>
            <th className="py-3">DATE</th>
            <th className="py-3">PAYMENT STATUS</th>
            <th className="py-3 text-right">TOTAL</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order, index) => (
            <tr key={index} className="border-b hover:bg-gray-50 text-gray-500">
              <td className="py-4 font-medium text-blue-600">{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.date}</td>
              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === "Success"
                      ? "bg-green-100 text-green-600"
                      : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="text-right font-medium">{order.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
