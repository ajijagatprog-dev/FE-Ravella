const activities = [
  {
    title: "New Order #12344",
    desc: "2 minutes ago by Sarah Jenkins",
  },
  {
    title: "New Loyalty Member",
    desc: "15 minutes ago from California, US",
  },
  {
    title: "B2B Application Approved",
    desc: "1 hour ago",
  },
  {
    title: "Inventory Synced",
    desc: "3 hours ago",
  },
  {
    title: "Low Stock Warning",
    desc: "5 hours ago",
  },
];

export default function RecentOrders() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">Latest Activity</h3>
        <button className="text-sm text-blue-600 hover:underline">
          View All
        </button>
      </div>

      <ul className="space-y-4">
        {activities.map((item, i) => (
          <li key={i} className="flex gap-3">
            <div className="w-2 h-2 mt-2 rounded-full bg-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-800">{item.title}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
