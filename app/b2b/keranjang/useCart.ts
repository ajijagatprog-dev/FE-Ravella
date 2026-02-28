"use client";

import { useState, useCallback, useEffect } from "react";
import { getCartItems, saveCartItems } from "../cartUtils";
import type { CartItem } from "./types";

export function useCart() {
    const [items, setItems] = useState<CartItem[]>(() => getCartItems());
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    const updateQty = useCallback((productId: string, qty: number) => {
        setItems((prev) => {
            const next = prev.map((i) =>
                i.product.id === productId
                    ? { ...i, qty: Math.max(1, qty) }
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

    return { items, hydrated, updateQty, removeItem, clearCart, totalItems, subtotal };
}