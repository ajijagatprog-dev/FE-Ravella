import OrderStats from "./components/OrderStats";
import OrderTabs from "./components/OrderTabs";
import OrderTable from "./components/OrderTable";

export default function OrderPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Order Management
        </h1>
        <p className="text-gray-500">
          Manage and track all customer orders from here.
        </p>
      </div>

      {/* Stats Cards */}
      <OrderStats />

      {/* Tabs + Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        <OrderTabs />
        <OrderTable />
      </div>
    </div>
  );
}
