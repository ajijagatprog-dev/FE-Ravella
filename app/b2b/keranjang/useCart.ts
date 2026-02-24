"use client";

import { useState, useCallback } from "react";
import { getCartItems, saveCartItems } from "../cartUtils";
import type { CartItem } from "./types";

// Hook ini aman karena hanya dipanggil dari KeranjangContent
// yang di-import dengan ssr:false — tidak pernah jalan di server
export function useCart() {
    const [items, setItems] = useState<CartItem[]>(() => getCartItems());

    const updateQty = useCallback((productId: string, qty: number) => {
        setItems((prev) => {
            const item = prev.find((i) => i.product.id === productId);
            const minQty = item?.product.minOrder ?? 1;
            const next = prev.map((i) =>
                i.product.id === productId
                    ? { ...i, qty: Math.max(minQty, qty) }
                    : i
            );
            saveCartItems(next);
            return next;
        });
    }, []);

    const removeItem = useCallback((productId: string) => {
        setItems((prev) => {
            const next = prev.filter((i) => i.product.id !== productId);
            saveCartItems(next);
            return next;
        });
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
        localStorage.removeItem("b2b_cart");
    }, []);

    const totalItems = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);

    return { items, updateQty, removeItem, clearCart, totalItems, subtotal };
}