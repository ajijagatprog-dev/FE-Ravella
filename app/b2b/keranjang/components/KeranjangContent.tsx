"use client";

import { useCart } from "../useCart";
import CartBreadcrumb from "./CartBreadcrumb";
import MinOrderBanner from "./MinOrderBanner";
import CartItemRow from "./CartItemRow";
import CartActions from "./CartActions";
import OrderSummary from "./OrderSummary";
import EmptyCart from "./EmptyCart";

// Komponen ini HANYA dirender di client (dipanggil via dynamic ssr:false)
// Jadi aman akses localStorage tanpa hydration error
export default function KeranjangContent() {
    const { items, subtotal, totalItems, updateQty, removeItem, clearCart } = useCart();

    return (
        <div className="px-6 py-6 max-w-5xl mx-auto">
            <CartBreadcrumb />

            <div className="mb-6">
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
                    {/* Left — Items */}
                    <div className="lg:col-span-2 space-y-3">
                        {items.map((item) => (
                            <CartItemRow
                                key={item.product.id}
                                item={item}
                                onUpdateQty={updateQty}
                                onRemove={removeItem}
                            />
                        ))}
                        <CartActions onClear={clearCart} />
                    </div>

                    {/* Right — Summary */}
                    <div className="lg:col-span-1">
                        <OrderSummary subtotal={subtotal} totalItems={totalItems} />
                    </div>
                </div>
            )}
        </div>
    );
}