"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import CatalogHeader from "./components/CatalogHeader";
import CatalogFilters from "./components/CatalogFilters";
import ProductGrid from "./components/ProductGrid";
import CatalogPagination from "./components/CatalogPagination";
import AddToOrderToast from "./components/AddToOrderToast";
import QuickOrderModal from "./components/QuickOrderModal";
import type { Category, Product } from "./types";
import { addProductToCart } from "../cartUtils"; // ← dari b2b/cartUtils
import api from "@/lib/axios";

const PAGE_SIZE = 8;

export default function B2BProductsPage() {
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<Category>("All Products");
    const [page, setPage] = useState(1);
    const [toastProduct, setToastProduct] = useState<string | null>(null);
    const [quickOrderOpen, setQuickOrderOpen] = useState(false);

    const [products, setProducts] = useState<Product[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products', {
                params: {
                    limit: PAGE_SIZE,
                    page,
                    search: search || undefined,
                    category: activeCategory !== "All Products" ? activeCategory : undefined
                }
            });
            if (res.data.status === 'success') {
                setProducts(res.data.data.data);
                setTotalProducts(res.data.data.total);
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, search, activeCategory]);

    const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));

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
                total={totalProducts}
                onExportPDF={handleExportPDF}
                onQuickOrder={() => setQuickOrderOpen(true)}
            />
            <CatalogFilters
                search={search}
                onSearchChange={handleSearchChange}
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
            />
            <ProductGrid products={products} onAddToOrder={handleAddToOrder} />
            <CatalogPagination
                page={page}
                totalPages={totalPages}
                totalItems={totalProducts}
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