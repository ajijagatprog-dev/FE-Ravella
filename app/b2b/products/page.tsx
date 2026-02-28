"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import CatalogHeader from "./components/CatalogHeader";
import CatalogFilters from "./components/CatalogFilters";
import ProductGrid from "./components/ProductGrid";
import CatalogPagination from "./components/CatalogPagination";
import AddToOrderToast from "./components/AddToOrderToast";
import QuickOrderModal from "./components/QuickOrderModal";
import { MOCK_PRODUCTS } from "./mockData";
import type { Category, Product } from "./types";
import { addProductToCart } from "../cartUtils"; // ← dari b2b/cartUtils

const PAGE_SIZE = 8;

export default function B2BProductsPage() {
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<Category>("All Products");
    const [page, setPage] = useState(1);
    const [toastProduct, setToastProduct] = useState<string | null>(null);
    const [quickOrderOpen, setQuickOrderOpen] = useState(false);

    const filtered = useMemo(() => {
        return MOCK_PRODUCTS.filter((p) => {
            const matchSearch =
                search === "" ||
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.sku.toLowerCase().includes(search.toLowerCase());
            const matchCategory =
                activeCategory === "All Products" || p.category === activeCategory;
            return matchSearch && matchCategory;
        });
    }, [search, activeCategory]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleSearchChange = (v: string) => { setSearch(v); setPage(1); };
    const handleCategoryChange = (c: Category) => { setActiveCategory(c); setPage(1); };

    const handleAddToOrder = (product: Product) => {
        addProductToCart(product); // ← pure function, tidak ada React state
        setToastProduct(product.name);
    };

    const handleExportPDF = () => {
        alert("Generating catalog PDF...\n\n(Connect to real PDF export API in production)");
    };

    const handleQuickOrderSubmit = () => {
        router.push("/b2b/keranjang");
    };

    return (
        <div className="px-6 py-6 max-w-screen-xl mx-auto">
            <CatalogHeader
                total={MOCK_PRODUCTS.length}
                onExportPDF={handleExportPDF}
                onQuickOrder={() => setQuickOrderOpen(true)}
            />
            <CatalogFilters
                search={search}
                onSearchChange={handleSearchChange}
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
            />
            <ProductGrid products={paginated} onAddToOrder={handleAddToOrder} />
            <CatalogPagination
                page={page}
                totalPages={totalPages}
                totalItems={filtered.length}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
            />
            <div className="mt-8 pt-5 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
                <p>© 2024 Ravelle Fashion B2B. Trade pricing exclusive of VAT.</p>
                <div className="flex items-center gap-4">
                    <a href="#" className="hover:text-stone-600 transition-colors">Terms of Sale</a>
                    <a href="#" className="hover:text-stone-600 transition-colors">Shipping Policy</a>
                    <a href="#" className="hover:text-stone-600 transition-colors">Support Portal</a>
                </div>
            </div>
            <AddToOrderToast productName={toastProduct} onClose={() => setToastProduct(null)} />
            <QuickOrderModal
                open={quickOrderOpen}
                onClose={() => setQuickOrderOpen(false)}
                onSubmit={handleQuickOrderSubmit}
            />
        </div>
    );
}