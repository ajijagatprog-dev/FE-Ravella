"use client";

import { useCart } from "../useCart";
import CartBreadcrumb from "./CartBreadcrumb";
import MinOrderBanner from "./MinOrderBanner";
import CartItemRow from "./CartItemRow";
import CartActions from "./CartActions";
import OrderSummary from "./OrderSummary";
import EmptyCart from "./EmptyCart";

export default function KeranjangPage() {
    const { items, hydrated, subtotal, totalItems, updateQty, removeItem, clearCart } = useCart();

    // Prevent hydration mismatch
    if (!hydrated) {
        return (
            <div className="px-6 py-6 max-w-screen-xl mx-auto">
                <div className="h-8 w-48 bg-stone-100 rounded-xl animate-pulse mb-2" />
                <div className="h-6 w-72 bg-stone-100 rounded-xl animate-pulse mb-6" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-36 bg-stone-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                    <div className="h-96 bg-stone-100 rounded-2xl animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="px-6 py-6 max-w-screen-xl mx-auto">
            {/* Breadcrumb */}
            <CartBreadcrumb />

            {/* Page Header */}
            <div className="mb-5">
                <h1 className="text-2xl font-black text-stone-800 tracking-tight">
                    Shopping Cart
                </h1>
                <p className="text-sm text-stone-500 mt-0.5">
                    Review your wholesale selections and adjust quantities before final checkout.
                </p>
            </div>

            {items.length === 0 ? (
                <EmptyCart />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Left — Cart Items */}
                    <div className="lg:col-span-2 space-y-3">
                        {/* Min Order Banner */}
                        <MinOrderBanner subtotal={subtotal} />

                        {/* Items */}
                        {items.map((item) => (
                            <CartItemRow
                                key={item.product.id}
                                item={item}
                                onUpdateQty={updateQty}
                                onRemove={removeItem}
                            />
                        ))}

                        {/* Actions */}
                        <CartActions onClear={clearCart} />
                    </div>

                    {/* Right — Order Summary */}
                    <div className="lg:col-span-1">
                        <OrderSummary subtotal={subtotal} totalItems={totalItems} />
                    </div>
                </div>
            )}
        </div>
    );
}