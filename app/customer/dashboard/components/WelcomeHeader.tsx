import { Bell, ShoppingCart } from "lucide-react";

export default function WelcomeHeader() {
    return (
        <div className="flex items-start justify-between">
            <div>
                <h1 className="text-3xl font-black text-stone-800 tracking-tight">
                    Welcome back, Sarah!
                </h1>
                <p className="text-sm text-stone-500 mt-1">
                    Manage your account, track orders, and view your loyalty status.
                </p>
            </div>
        </div>
    );
}