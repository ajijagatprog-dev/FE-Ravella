export default function MembershipCard() {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-black">Gold Membership</h3>
                    <p className="text-sm text-gray-500">Current Tier</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400">POINTS BALANCE</p>
                    <p className="text-2xl font-bold text-blue-600">2,450</p>
                </div>
            </div>

            <div className="mt-4">
                <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div className="bg-blue-600 h-2 rounded-full w-[75%]" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    75% progress to Platinum
                </p>
            </div>
        </div>
    );
}