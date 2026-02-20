import GlobalPointSettings from "./components/ GlobalPointSettings";
import MembershipTiers from "./components/MembershipTiers";
import CustomerLoyaltyTable from "./components/ CustomerLoyaltyTable";

export default function LoyaltyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Loyalty Management
        </h1>
        <p className="text-sm text-gray-500">
          Configure membership tiers, manage point economy, and monitor engagement.
        </p>
      </div>

      <GlobalPointSettings />
      <MembershipTiers />
      <CustomerLoyaltyTable />
    </div>
  );
}
