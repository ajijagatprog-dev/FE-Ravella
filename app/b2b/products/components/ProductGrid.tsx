import { Package } from "lucide-react";
import ProductCard from "./ProductCart";
import type { Product } from "../types";

interface Props {
    products: Product[];
    onAddToOrder: (product: Product) => void;
}

export default function ProductGrid({ products, onAddToOrder }: Props) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-stone-400">
                <Package className="w-12 h-12 mb-3 opacity-25" />
                <p className="text-sm font-semibold">No products found</p>
                <p className="text-xs mt-1">Try adjusting your search or filter</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onAddToOrder={onAddToOrder} />
            ))}
        </div>
    );
}