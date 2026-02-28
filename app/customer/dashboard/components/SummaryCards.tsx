export default function SummaryCards() {
    const cards = [
        { title: "Active Orders", value: 2 },
        { title: "Total Spending", value: "$3,420" },
        { title: "Coupons Available", value: 3 },
    ];

    return (
        <div className="grid md:grid-cols-3 gap-6">
            {cards.map((card) => (
                <div
                    key={card.title}
                    className="bg-white p-5 rounded-2xl shadow-sm border"
                >
                    <p className="text-sm text-gray-500">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {card.value}
                    </p>
                </div>
            ))}
        </div>
    );
}