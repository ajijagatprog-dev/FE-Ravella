export default function PointHistory() {
    const history = [
        { label: "Purchase Reward", point: "+150" },
        { label: "Product Review", point: "+50" },
        { label: "Redemption", point: "-500" },
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border text-gray-500">
            <h3 className="font-semibold mb-4 text-black">Point History</h3>

            <div className="space-y-3">
                {history.map((item, i) => (
                    <div key={i} className="flex justify-between">
                        <p className="text-sm text-gray-600">{item.label}</p>
                        <p className="font-semibold">{item.point}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}