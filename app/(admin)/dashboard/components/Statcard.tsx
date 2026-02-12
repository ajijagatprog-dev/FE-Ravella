type StatCardProps = {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
};

export default function StatCard({
  title,
  value,
  change,
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <span
          className={`text-xs font-semibold ${
            trend === "up" ? "text-green-600" : "text-red-500"
          }`}
        >
          {change}
        </span>
      </div>

      <h2 className="mt-2 text-2xl font-bold text-gray-800">{value}</h2>
    </div>
  );
}
