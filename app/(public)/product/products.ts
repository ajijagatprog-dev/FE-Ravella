export interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    image: string;
    category: string;
    rating: number;
    reviews: number;
    badge: string;
    discount: number;
    features: string[];
    inStock: boolean;
    isNew: boolean;
    description: string;
    specifications: Record<string, string>;
}

const STORAGE_KEY = "ravelle_public_products";

export const defaultProducts: Product[] = [
    {
        id: 1,
        name: "Ravelle Airflex Vacuum Cleaner",
        price: 598900,
        originalPrice: 798900,
        image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&q=80",
        category: "homeliving",
        rating: 4.8,
        reviews: 124,
        badge: "Best Seller",
        discount: 25,
        features: ["HEPA Filter", "Cordless", "2h Battery"],
        inStock: true,
        isNew: false,
        description:
            "Vacuum cleaner cordless dengan teknologi HEPA filter untuk pembersihan maksimal. Dilengkapi baterai tahan lama hingga 2 jam.",
        specifications: {
            Power: "120W",
            Battery: "2000mAh",
            Weight: "2.5kg",
            Warranty: "1 Year",
        },
    },
    {
        id: 2,
        name: "Ravelle SOLIS Dehumidifier & Air Purifier 2in1 2L",
        price: 1399900,
        originalPrice: 1799900,
        image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80",
        category: "homeliving",
        rating: 4.9,
        reviews: 89,
        badge: "Premium",
        discount: 22,
        features: ["2-in-1", "Smart Sensor", "Ultra Quiet"],
        inStock: true,
        isNew: true,
        description:
            "Dehumidifier dan air purifier 2 in 1 dengan smart sensor otomatis. Menjaga kelembapan dan kualitas udara ruangan Anda secara bersamaan dengan teknologi terkini.",
        specifications: {
            Capacity: "2L",
            Coverage: "30m²",
            "Noise Level": "35dB",
            Warranty: "1 Year",
        },
    },
    {
        id: 3,
        name: "Ravelle High Speed Hair Dryer-grey",
        price: 799900,
        originalPrice: 899900,
        image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80",
        category: "homeliving",
        rating: 4.7,
        reviews: 156,
        badge: "Popular",
        discount: 20,
        features: ["Digital Display", "Auto Shutoff", "Portable"],
        inStock: true,
        isNew: false,
        description:
            "Hair dryer berkecepatan tinggi dengan teknologi digital untuk hasil terbaik. Dilengkapi fitur auto shutoff dan tampilan digital yang modern.",
        specifications: {
            Power: "1600W",
            "Heat Settings": "3 Levels",
            Weight: "0.5kg",
            Warranty: "1 Year",
        },
    },
    {
        id: 4,
        name: "Ravelle Luxe Air Purifier HEPA13 + Anti-Allergen",
        price: 1199900,
        originalPrice: 1499900,
        image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80",
        category: "homeliving",
        rating: 4.9,
        reviews: 203,
        badge: "Premium",
        discount: 20,
        features: ["HEPA13", "Anti-Allergen", "Smart Mode"],
        inStock: true,
        isNew: false,
        description:
            "Air purifier premium dengan HEPA13 filter yang mampu menyaring 99.97% partikel allergen. Dilengkapi smart mode untuk otomatisasi penyaringan udara.",
        specifications: {
            Filter: "HEPA13",
            Coverage: "50m²",
            CADR: "300m³/h",
            Warranty: "1 Year",
        },
    },
    {
        id: 5,
        name: "Ravelle Ezy Squeenze Citrus Juicer - Cream",
        price: 559900,
        originalPrice: 749900,
        image: "https://images.unsplash.com/photo-1622480916113-9000ac49b79d?w=500&q=80",
        category: "ezy",
        rating: 4.6,
        reviews: 98,
        badge: "New",
        discount: 25,
        features: ["Easy Squeeze", "BPA Free", "Compact"],
        inStock: true,
        isNew: true,
        description:
            "Juicer compact yang mudah digunakan untuk memeras jeruk dan buah sitrus lainnya. Material BPA free dan desain yang compact untuk dapur modern.",
        specifications: {
            Power: "100W",
            Material: "BPA Free Plastic",
            Features: "Easy Squeeze, Compact",
            Warranty: "1 Year",
        },
    },
    {
        id: 6,
        name: "Ravelle Smart Rice Cooker 1.8L",
        price: 899900,
        originalPrice: 1199900,
        image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&q=80",
        category: "appliance",
        rating: 4.8,
        reviews: 234,
        badge: "Best Seller",
        discount: 25,
        features: ["Smart Cook", "Keep Warm", "Non-stick"],
        inStock: true,
        isNew: false,
        description:
            "Rice cooker pintar dengan teknologi smart cook untuk hasil nasi sempurna. Lapisan anti-lengket premium dan fitur keep warm otomatis.",
        specifications: {
            Capacity: "1.8L",
            Power: "600W",
            Material: "Non-stick coating",
            Warranty: "1 Year",
        },
    },
    {
        id: 7,
        name: "Ravelle Premium Blender 2L",
        price: 699900,
        originalPrice: 899900,
        image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&q=80",
        category: "appliance",
        rating: 4.7,
        reviews: 167,
        badge: "Popular",
        discount: 22,
        features: ["800W Motor", "Glass Jar", "6 Speeds"],
        inStock: true,
        isNew: false,
        description:
            "Blender premium dengan motor 800W untuk hasil blending sempurna. Dilengkapi jar kaca berkualitas tinggi dan 6 tingkat kecepatan.",
        specifications: {
            Power: "800W",
            Capacity: "2L",
            Material: "Glass Jar",
            Warranty: "1 Year",
        },
    },
    {
        id: 8,
        name: "Ravelle Professional Knife Set 8pcs",
        price: 1299900,
        originalPrice: 1799900,
        image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&q=80",
        category: "knife",
        rating: 4.9,
        reviews: 145,
        badge: "Premium",
        discount: 28,
        features: ["German Steel", "Ergonomic", "Block Included"],
        inStock: true,
        isNew: true,
        description:
            "Set pisau profesional 8 pieces dengan material German steel berkualitas tinggi. Desain ergonomis dan dilengkapi wooden block untuk penyimpanan.",
        specifications: {
            Material: "German Stainless Steel",
            Pieces: "8pcs",
            Includes: "Wooden Block",
            Warranty: "1 Year",
        },
    },
];

/** kept for backward-compat — same as defaultProducts */
export const products = defaultProducts;

export function getProducts(): Product[] {
    if (typeof window === "undefined") return defaultProducts;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as Product[];
    } catch { /* ignore */ }
    return defaultProducts;
}

export function saveProducts(items: Product[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("ravelle_products_updated"));
}
