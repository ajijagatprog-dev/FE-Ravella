"use client";

import { useState, useMemo, useEffect } from "react";
import { Package, Loader2, ShoppingBag, Clock, CheckCircle2, ChevronRight, Search } from "lucide-react";
import OrderTable from "./components/OrderTable";
import OrderPagination from "./components/OrderPagination";
import OrderDetailModal, { type OrderDetail } from "./components/OrderDetailModal";
import InvoiceModal from "./components/InvoiceModal";
import api from "@/lib/axios";

const PAGE_SIZE = 8;

const TABS = [
    { key: "", label: "Semua Pesanan" },
    { key: "PENDING", label: "Perlu Bayar" },
    { key: "PROCESSING", label: "Diproses" },
    { key: "SHIPPED", label: "Dikirim" },
    { key: "DELIVERED", label: "Selesai" },
];

export default function MyOrdersPage() {
    const [rawOrders, setRawOrders] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
    const [invoiceOrder, setInvoiceOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/customer/orders');
            if (res.data.status === 'success') {
                setRawOrders(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filtered = useMemo(() => {
        return rawOrders.filter((o) => {
            const matchSearch = search === "" || 
                o.order_number.toLowerCase().includes(search.toLowerCase());
            const matchStatus = statusFilter === "" || 
                o.status?.toUpperCase() === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [search, statusFilter, rawOrders]);

    const stats = useMemo(() => {
        return {
            total: rawOrders.length,
            pending: rawOrders.filter(o => o.status?.toUpperCase() === 'PENDING').length,
            completed: rawOrders.filter(o => ['DELIVERED', 'COMPLETED'].includes(o.status?.toUpperCase())).length,
        };
    }, [rawOrders]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleOrderDetail = async (orderId: string) => {
        const orderSummary = rawOrders.find(o => o.id.toString() === orderId);
        if (!orderSummary) return;

        try {
            const res = await api.get(`/customer/orders/${orderSummary.order_number}`);
            if (res.data.status === 'success') {
                const o = res.data.data;
                const d = new Date(o.created_at);
                const formattedDate = d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });

                const addressData = o.shipping_address ? (typeof o.shipping_address === 'string' ? JSON.parse(o.shipping_address) : o.shipping_address) : {};

                const detail: OrderDetail = {
                    id: o.id.toString(),
                    orderNumber: o.order_number,
                    placedAt: formattedDate,
                    status: o.status ? o.status.toUpperCase() : "PENDING",
                    totalAmount: parseFloat(o.total_amount),
                    shippingCost: parseFloat(o.shipping_cost || 0),
                    tax: 0,
                    items: (o.items || []).map((i: any) => ({
                        id: i.id.toString(),
                        productId: i.product_id?.toString(),
                        name: i.product?.name || "Unknown Product",
                        variant: "-",
                        qty: i.quantity,
                        price: parseFloat(i.price),
                        image: i.product?.image || null,
                        hasReview: i.has_review || false,
                        review: i.review || null,
                    })),
                    shippingAddress: {
                        fullName: addressData.recipient_name || "",
                        phone: addressData.phone_number || "",
                        street: addressData.full_address || "",
                        city: addressData.city || "",
                        province: addressData.province || "",
                        postalCode: addressData.postal_code || "",
                    },
                    paymentMethod: o.payment_method || "Xendit",
                    paymentStatus: (o.payment_token || ["PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED"].includes(o.status?.toUpperCase())) ? "PAID" : "PENDING",
                    courier: o.courier,
                    trackingNumber: o.tracking_number,
                };

                setSelectedOrder(detail);
            }
        } catch (error) {
            console.error("Failed to fetch order details:", error);
        }
    };

    const handleViewInvoice = (orderId: string) => {
        // Find in raw orders
        const o = rawOrders.find(o => o.id.toString() === orderId);
        if (!o) return;
        
        const d = new Date(o.created_at);
        const formattedDate = d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
        const addressData = o.shipping_address ? (typeof o.shipping_address === 'string' ? JSON.parse(o.shipping_address) : o.shipping_address) : {};

        const detail: OrderDetail = {
            id: o.id.toString(),
            orderNumber: o.order_number,
            placedAt: formattedDate,
            status: o.status ? o.status.toUpperCase() : "PENDING",
            totalAmount: parseFloat(o.total_amount),
            shippingCost: parseFloat(o.shipping_cost || 0),
            tax: 0,
            items: (o.items || []).map((i: any) => ({
                id: i.id.toString(),
                productId: i.product_id?.toString(),
                name: i.product?.name || "Unknown Product",
                variant: "-",
                qty: i.quantity,
                price: parseFloat(i.price),
                image: i.product?.image || null,
                hasReview: i.has_review || false,
                review: i.review || null,
            })),
            shippingAddress: {
                fullName: addressData.recipient_name || "",
                phone: addressData.phone_number || "",
                street: addressData.full_address || "",
                city: addressData.city || "",
                province: addressData.province || "",
                postalCode: addressData.postal_code || "",
            },
            paymentMethod: o.payment_method || "Xendit",
            paymentStatus: (["PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED"].includes(o.status?.toUpperCase())) ? "PAID" : "PENDING",
            courier: o.courier,
            trackingNumber: o.tracking_number,
        };

        setInvoiceOrder(detail);
    };

    if (loading) {
        return (
            <div className="w-full h-[60vh] flex flex-col justify-center items-center gap-4 text-stone-500">
                <Loader2 className="w-8 h-8 animate-spin text-stone-800" />
                <p className="text-sm font-medium">Memuat Data Pesanan...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-stone-900 tracking-tight mb-1">Daftar Pesanan</h1>
                    <p className="text-sm text-stone-500 font-medium">Kelola dan pantau status pesanan harian Anda.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest">
                    <span>Customer</span>
                    <ChevronRight size={12} />
                    <span className="text-stone-900">Orders</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Total Pesanan</span>
                        <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
                            <ShoppingBag size={14} className="text-stone-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-stone-900">{stats.total}</p>
                </div>
                <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Perlu Dibayar</span>
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                            <Clock size={14} className="text-amber-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-stone-900">{stats.pending}</p>
                </div>
                <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Selesai</span>
                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                            <CheckCircle2 size={14} className="text-green-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-stone-900">{stats.completed}</p>
                </div>
            </div>

            {/* Tabs + Table Section */}
            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-stone-100">
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => { setStatusFilter(tab.key); setPage(1); }}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap rounded-lg transition-all ${
                                    statusFilter === tab.key 
                                    ? "bg-stone-900 text-white" 
                                    : "text-stone-400 hover:text-stone-600 hover:bg-stone-50"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input 
                            type="text"
                            placeholder="Cari ID pesanan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-stone-200 focus:outline-none w-full sm:w-64"
                        />
                    </div>
                </div>

                <OrderTable 
                    orders={paginated} 
                    onOrderDetail={handleOrderDetail} 
                    onViewInvoice={handleViewInvoice}
                />

                <div className="p-5 border-t border-stone-100">
                    <OrderPagination
                        page={page}
                        totalPages={totalPages}
                        total={filtered.length}
                        showing={paginated.length}
                        onPageChange={setPage}
                    />
                </div>
            </div>

            {/* Detail Modal */}
            <OrderDetailModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
            />

            {/* Standalone Invoice Modal */}
            {invoiceOrder && (
                <InvoiceModal
                    order={invoiceOrder}
                    onClose={() => setInvoiceOrder(null)}
                />
            )}
        </div>
    );
}