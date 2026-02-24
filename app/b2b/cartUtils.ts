// b2b/cartUtils.ts — Pure localStorage utility, no React

import type { CartItem } from "./keranjang/types";
import type { Product } from "./products/types";

const CART_KEY = "b2b_cart";

export function getCartItems(): CartItem[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(CART_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function saveCartItems(items: CartItem[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addProductToCart(product: Product) {
    const items = getCartItems();
    const existing = items.find((i) => i.product.id === product.id);

    const next = existing
        ? items.map((i) =>
            i.product.id === product.id
                ? { ...i, qty: i.qty + 1 } 
                : i
        )
        : [...items, { product, qty: product.minOrder }];

    saveCartItems(next);
}