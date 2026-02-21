import WelcomeHeader from "./components/WelcomeHeader";
import MembershipCard from "./components/MembershipCard";
import SummaryCards from "./components/SummaryCards";
import RecentOrders from "./components/RecentOrders";
import PointHistory from "./components/PointHistory";

export default function CustomerDashboardPage() {
    return (
        <div className="w-full max-w-7xl mx-auto space-y-8">
            {/* Welcome */}
            <WelcomeHeader />

            {/* Membership */}
            <MembershipCard />

            {/* Summary */}
            <SummaryCards />

            {/* Bottom Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                    <RecentOrders />
                </div>

                <PointHistory />
            </div>
        </div>
    );
}