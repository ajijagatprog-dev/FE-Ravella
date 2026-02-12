export default function OrderTabs() {
  return (
    <div className="flex items-center justify-between px-6 pt-6">
      <div className="flex space-x-6 text-sm font-medium">
        <button className="text-blue-600 border-b-2 border-blue-600 pb-2">
          All Orders
        </button>
        <button className="text-gray-500 hover:text-gray-700 pb-2">
          Pending
        </button>
        <button className="text-gray-500 hover:text-gray-700 pb-2">
          Success
        </button>
        <button className="text-gray-500 hover:text-gray-700 pb-2">
          Failed
        </button>
      </div>

      <input
        type="text"
        placeholder="Search ID, customer..."
        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
