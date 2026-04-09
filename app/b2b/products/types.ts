export type ProductBadge = "NEW" | "LIMITED" | "PREMIUM" | "SALE" | null;

export interface Product {
    id: string;
    sku: string;
    name: string;
    price: number;
    msrp: number;
    badge: ProductBadge;
    minOrder: number;
    stock: number;
    category: string;
    image: string;
    inStock: boolean;
    features: string[];
    specifications?: Record<string, string>;
    description: string;
    media?: { type: 'image' | 'video'; url: string }[];
}

export type Category = "All Products" | "Home & Kitchen Appliance" | "Knife set" | "ezy series" | "home living" | "keyboard";