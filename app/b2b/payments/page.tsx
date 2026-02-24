import PaymentClient from "./components/PaymentClient";

// Server Component — no "use client" needed here
export default function PaymentsPage() {
  return (
    <div className="text-gray-800 p-6 min-h-screen bg-gray-50">
      <PaymentClient />

      {/* Static footer — safe to render on server */}
      <div className="mt-8 flex items-center justify-between text-xs text-gray-400 border-t border-gray-200 pt-5">
        <p>© 2023 Ravelle Fashion Portal. All rights reserved.</p>
        <div className="flex items-center gap-5">
          <span className="hover:text-gray-600 transition-colors cursor-pointer">Security Statement</span>
          <span className="hover:text-gray-600 transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-gray-600 transition-colors cursor-pointer">Contact Finance</span>
        </div>
      </div>
    </div>
  );
}