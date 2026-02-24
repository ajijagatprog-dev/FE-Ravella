"use client";

import { useState, useEffect, useCallback } from "react";
import type { CartItem } from "./types";
import type { Product } from "../products/types";

const CART_KEY = "b2b_cart";

function readCart(): CartItem[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(CART_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function writeCart(items: CartItem[]) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function useCart() {
    const [items, setItems] = useState<CartItem[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setItems(readCart());
        setHydrated(true);
    }, []);

    const addToCart = useCallback((product: Product, qty = 1) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.product.id === product.id);
            const next = existing
                ? prev.map((i) =>
                    i.product.id === product.id
                        ? { ...i, qty: i.qty + qty }
                        : i
                )
                : [...prev, { product, qty: Math.max(product.minOrder, qty) }];
            writeCart(next);
            return next;
        });
    }, []);

    const updateQty = useCallback((productId: string, qty: number) => {
        setItems((prev) => {
            const next = prev.map((i) =>
                i.product.id === productId ? { ...i, qty: Math.max(i.product.minOrder, qty) } : i
            );
            writeCart(next);
            return next;
        });
    }, []);

    const removeItem = useCallback((productId: string) => {
        setItems((prev) => {
            const next = prev.filter((i) => i.product.id !== productId);
            writeCart(next);
            return next;
        });
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
        localStorage.removeItem(CART_KEY);
    }, []);

    const totalItems = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);

    return { items, hydrated, addToCart, updateQty, removeItem, clearCart, totalItems, subtotal };
}