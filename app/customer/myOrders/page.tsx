"use client";

import { useState, useMemo, useEffect } from "react";
import { Package, Loader2 } from "lucide-react";
import OrderCard, { type Order } from "./components/OrderCard";
import OrderFilters from "./components/OrderFilters";
import OrderPagination from "./components/OrderPagination";
import OrderDetailModal, { type OrderDetail } from "./components/OrderDetailModal";
import api from "@/lib/axios";

const PAGE_SIZE = 5;

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MyOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [dateRange, setDateRange] = useState("3m");
    const [page, setPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/customer/orders');
                if (res.data.status === 'success') {
                    const mapped: Order[] = res.data.data.map((o: any) => {
                        const d = new Date(o.created_at);
                        const formattedDate = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                        return {
                            id: o.id.toString(),
                            orderNumber: o.order_number,
                            placedAt: formattedDate,
                            totalAmount: parseFloat(o.total_amount),
                            status: o.status ? o.status.toUpperCase() : "PENDING",
                        };
                    });
                    setOrders(mapped);
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filtered = useMemo(() => {
        return orders.filter((o) => {
            const matchSearch = search === "" || o.orderNumber.toLowerCase().includes(search.toLowerCase());
            const matchStatus = statusFilter === "" || o.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [search, statusFilter, orders]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleSearch = (v: string) => { setSearch(v); setPage(1); };
    const handleStatus = (v: string) => { setStatusFilter(v); setPage(1); };
    const handleDate = (v: string) => { setDateRange(v); setPage(1); };

    const handleOrderDetail = async (orderId: string) => {
        const orderSummary = orders.find(o => o.id === orderId);
        if (!orderSummary) return;

        try {
            const res = await api.get(`/customer/orders/${orderSummary.orderNumber}`);
            if (res.data.status === 'success') {
                const o = res.data.data;
                const d = new Date(o.created_at);
                const formattedDate = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

                const addressData = o.shipping_address ? JSON.parse(o.shipping_address) : {};

                const detail: OrderDetail = {
                    id: o.id.toString(),
                    orderNumber: o.order_number,
                    placedAt: formattedDate,
                    status: o.status ? o.status.toUpperCase() : "PENDING",
                    totalAmount: parseFloat(o.total_amount),
                    shippingCost: 0,
                    tax: 0,
                    items: (o.items || []).map((i: any) => ({
                        id: i.id.toString(),
                        name: i.product?.name || "Unknown Product",
                        variant: "-",
                        qty: i.quantity,
                        price: parseFloat(i.price),
                    })),
                    shippingAddress: {
                        fullName: addressData.recipient_name || "",
                        phone: addressData.phone_number || "",
                        street: addressData.full_address || "",
                        city: addressData.city || "",
                        province: addressData.province || "",
                        postalCode: addressData.postal_code || "",
                    },
                    paymentMethod: o.payment_method || "N/A",
                    paymentStatus: o.payment_token ? "PAID" : "PENDING",
                };

                setSelectedOrder(detail);
            }
        } catch (error) {
            console.error("Failed to fetch order details:", error);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-[60vh] flex flex-col justify-center items-center gap-4 text-stone-500">
                <Loader2 className="w-8 h-8 animate-spin text-stone-800" />
                <p className="text-sm font-medium">Loading Orders...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-stone-800 mb-1">Order History</h1>
                <p className="text-sm text-stone-500">
                    Review and manage your past furniture and home decor purchases.
                </p>
            </div>

            {/* Filters */}
            <div className="mb-4">
                <OrderFilters
                    search={search}
                    onSearchChange={handleSearch}
                    status={statusFilter}
                    onStatusChange={handleStatus}
                    dateRange={dateRange}
                    onDateRangeChange={handleDate}
                />
            </div>

            {/* Order List */}
            {paginated.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-stone-400">
                    <Package className="w-12 h-12 mb-3 opacity-25" />
                    <p className="text-sm font-medium">No orders found</p>
                    <p className="text-xs mt-1">Try adjusting your search or filter</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {paginated.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onOrderDetail={handleOrderDetail}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            <OrderPagination
                page={page}
                totalPages={totalPages}
                total={filtered.length}
                showing={paginated.length}
                onPageChange={setPage}
            />

            {/* Modal */}
            <OrderDetailModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
            />
        </div>
    );
}