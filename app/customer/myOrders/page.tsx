"use client";

import { useState, useMemo } from "react";
import { Package } from "lucide-react";
import OrderCard, { type Order } from "./components/OrderCard";
import OrderFilters from "./components/OrderFilters";
import OrderPagination from "./components/OrderPagination";
import OrderDetailModal, { type OrderDetail } from "./components/OrderDetailModal";

// ── Mock orders ───────────────────────────────────────────────────────────────
const MOCK_ORDERS: Order[] = [
    { id: "1", orderNumber: "RH-89231", placedAt: "October 24, 2023", totalAmount: 249.0, estimatedDelivery: "Oct 28, 2023", status: "SHIPPED" },
    { id: "2", orderNumber: "RH-89104", placedAt: "October 12, 2023", totalAmount: 450.0, deliveryDate: "Oct 15, 2023", status: "DELIVERED" },
    { id: "3", orderNumber: "RH-89552", placedAt: "October 27, 2023", totalAmount: 3200.0, estimatedDelivery: "Pending", status: "PROCESSING" },
    { id: "4", orderNumber: "RH-88762", placedAt: "September 28, 2023", totalAmount: 3120.0, deliveryDate: "Sep 29, 2023", status: "CANCELLED" },

    { id: "5", orderNumber: "RH-90111", placedAt: "November 2, 2023", totalAmount: 780.0, estimatedDelivery: "Nov 6, 2023", status: "SHIPPED" },
    { id: "6", orderNumber: "RH-90145", placedAt: "November 5, 2023", totalAmount: 1599.0, deliveryDate: "Nov 9, 2023", status: "DELIVERED" },
    { id: "7", orderNumber: "RH-90200", placedAt: "November 7, 2023", totalAmount: 230.0, estimatedDelivery: "Nov 12, 2023", status: "PROCESSING" },
    { id: "8", orderNumber: "RH-90231", placedAt: "November 10, 2023", totalAmount: 999.0, estimatedDelivery: "Nov 14, 2023", status: "SHIPPED" },
    { id: "9", orderNumber: "RH-90312", placedAt: "November 12, 2023", totalAmount: 640.0, deliveryDate: "Nov 16, 2023", status: "DELIVERED" },
    { id: "10", orderNumber: "RH-90388", placedAt: "November 14, 2023", totalAmount: 120.0, deliveryDate: "Nov 14, 2023", status: "CANCELLED" },
    { id: "11", orderNumber: "RH-90400", placedAt: "November 16, 2023", totalAmount: 2100.0, estimatedDelivery: "Nov 20, 2023", status: "SHIPPED" },
    { id: "12", orderNumber: "RH-90421", placedAt: "November 18, 2023", totalAmount: 350.0, estimatedDelivery: "Nov 23, 2023", status: "PROCESSING" },
    { id: "13", orderNumber: "RH-90510", placedAt: "November 20, 2023", totalAmount: 870.0, deliveryDate: "Nov 24, 2023", status: "DELIVERED" },
    { id: "14", orderNumber: "RH-90577", placedAt: "November 22, 2023", totalAmount: 1450.0, estimatedDelivery: "Nov 27, 2023", status: "SHIPPED" },
    { id: "15", orderNumber: "RH-90600", placedAt: "November 25, 2023", totalAmount: 560.0, estimatedDelivery: "Nov 30, 2023", status: "PROCESSING" },
];

// ── Mock detail — replace with real API fetch by ID ───────────────────────────
const MOCK_DETAILS: Record<string, OrderDetail> = {
    "1": {
        id: "1",
        orderNumber: "RH-89231",
        placedAt: "October 24, 2023",
        status: "SHIPPED",
        totalAmount: 1249.0,
        shippingCost: 0,
        tax: 112.41,
        estimatedDelivery: "Oct 28, 2023",
        items: [
            { id: "i1", name: "Scandinavian Lounge Chair", variant: "Cream / Oak", qty: 1, price: 849.0 },
            { id: "i2", name: "Minimal Side Table", variant: "Walnut", qty: 2, price: 199.0 },
        ],
        shippingAddress: {
            fullName: "Sarah Jenkins",
            phone: "+1 234 567 8900",
            street: "123 Maple Street",
            city: "San Francisco",
            province: "California",
            postalCode: "94102",
        },
        paymentMethod: "Visa •••• 4242",
        paymentStatus: "PAID",
    },

    "2": {
        id: "2",
        orderNumber: "RH-89104",
        placedAt: "October 12, 2023",
        status: "DELIVERED",
        totalAmount: 450.0,
        shippingCost: 15.0,
        tax: 40.5,
        deliveryDate: "Oct 15, 2023",
        items: [
            { id: "i1", name: "Ceramic Table Lamp", variant: "Sage Green", qty: 1, price: 210.0 },
            { id: "i2", name: "Linen Throw Pillow Set", variant: "Natural", qty: 2, price: 92.25 },
        ],
        shippingAddress: {
            fullName: "Michael Brown",
            phone: "+1 111 222 3333",
            street: "78 Sunset Blvd",
            city: "Los Angeles",
            province: "California",
            postalCode: "90001",
        },
        paymentMethod: "Mastercard •••• 8891",
        paymentStatus: "PAID",
    },

    "3": {
        id: "3",
        orderNumber: "RH-89552",
        placedAt: "October 27, 2023",
        status: "PROCESSING",
        totalAmount: 3200.0,
        shippingCost: 0,
        tax: 288.0,
        estimatedDelivery: "Pending",
        items: [
            { id: "i1", name: "Modular Sectional Sofa", variant: "Dark Grey / 4-Seat", qty: 1, price: 2912.0 },
        ],
        shippingAddress: {
            fullName: "Daniel Lee",
            phone: "+1 999 888 7777",
            street: "456 Market Street, Suite 300",
            city: "San Francisco",
            province: "California",
            postalCode: "94105",
        },
        paymentMethod: "Bank Transfer",
        paymentStatus: "PENDING",
    },

    "4": {
        id: "4",
        orderNumber: "RH-88762",
        placedAt: "September 28, 2023",
        status: "CANCELLED",
        totalAmount: 3120.0,
        shippingCost: 0,
        tax: 0,
        deliveryDate: "Sep 29, 2023",
        items: [
            { id: "i1", name: "Outdoor Dining Set", variant: "Teak / 6-Seat", qty: 1, price: 3120.0 },
        ],
        shippingAddress: {
            fullName: "Olivia Martinez",
            phone: "+1 555 666 7777",
            street: "22 Ocean Drive",
            city: "Miami",
            province: "Florida",
            postalCode: "33101",
        },
        paymentMethod: "Visa •••• 4242",
        paymentStatus: "FAILED",
    },

    "5": {
        id: "5",
        orderNumber: "RH-90111",
        placedAt: "November 2, 2023",
        status: "SHIPPED",
        totalAmount: 780.0,
        shippingCost: 20,
        tax: 70.2,
        estimatedDelivery: "Nov 6, 2023",
        items: [
            { id: "i1", name: "Modern Bookshelf", variant: "White", qty: 1, price: 580.0 },
            { id: "i2", name: "Desk Organizer", variant: "Black", qty: 2, price: 100.0 },
        ],
        shippingAddress: {
            fullName: "Emma Wilson",
            phone: "+1 444 555 6666",
            street: "9 Broadway Ave",
            city: "New York",
            province: "New York",
            postalCode: "10001",
        },
        paymentMethod: "PayPal",
        paymentStatus: "PAID",
    },

    "6": {
        id: "6",
        orderNumber: "RH-90145",
        placedAt: "November 5, 2023",
        status: "DELIVERED",
        totalAmount: 1599.0,
        shippingCost: 0,
        tax: 143.91,
        deliveryDate: "Nov 9, 2023",
        items: [
            { id: "i1", name: "King Size Bed Frame", variant: "Oak", qty: 1, price: 1599.0 },
        ],
        shippingAddress: {
            fullName: "William Johnson",
            phone: "+1 333 444 5555",
            street: "77 Lake View",
            city: "Chicago",
            province: "Illinois",
            postalCode: "60007",
        },
        paymentMethod: "Visa •••• 1111",
        paymentStatus: "PAID",
    },

    "7": {
        id: "7",
        orderNumber: "RH-90200",
        placedAt: "November 7, 2023",
        status: "PROCESSING",
        totalAmount: 230.0,
        shippingCost: 10,
        tax: 20.7,
        estimatedDelivery: "Nov 12, 2023",
        items: [
            { id: "i1", name: "Wall Clock", variant: "Black", qty: 1, price: 120.0 },
            { id: "i2", name: "Floating Shelf", variant: "Oak", qty: 1, price: 110.0 },
        ],
        shippingAddress: {
            fullName: "Sophia Davis",
            phone: "+1 222 333 4444",
            street: "10 Pine Street",
            city: "Seattle",
            province: "Washington",
            postalCode: "98101",
        },
        paymentMethod: "Bank Transfer",
        paymentStatus: "PENDING",
    },

    "8": {
        id: "8",
        orderNumber: "RH-90231",
        placedAt: "November 10, 2023",
        status: "SHIPPED",
        totalAmount: 999.0,
        shippingCost: 0,
        tax: 89.91,
        estimatedDelivery: "Nov 14, 2023",
        items: [
            { id: "i1", name: "Glass Coffee Table", variant: "Clear", qty: 1, price: 999.0 },
        ],
        shippingAddress: {
            fullName: "James Anderson",
            phone: "+1 777 888 9999",
            street: "500 Elm Street",
            city: "Houston",
            province: "Texas",
            postalCode: "77001",
        },
        paymentMethod: "Visa •••• 7777",
        paymentStatus: "PAID",
    },

    "9": {
        id: "9",
        orderNumber: "RH-90312",
        placedAt: "November 12, 2023",
        status: "DELIVERED",
        totalAmount: 640.0,
        shippingCost: 25,
        tax: 57.6,
        deliveryDate: "Nov 16, 2023",
        items: [
            { id: "i1", name: "TV Console", variant: "Walnut", qty: 1, price: 640.0 },
        ],
        shippingAddress: {
            fullName: "Lucas Thomas",
            phone: "+1 111 999 8888",
            street: "89 Hill Road",
            city: "Denver",
            province: "Colorado",
            postalCode: "80014",
        },
        paymentMethod: "Mastercard •••• 2222",
        paymentStatus: "PAID",
    },

    "10": {
        id: "10",
        orderNumber: "RH-90388",
        placedAt: "November 14, 2023",
        status: "CANCELLED",
        totalAmount: 120.0,
        shippingCost: 0,
        tax: 0,
        deliveryDate: "Nov 14, 2023",
        items: [
            { id: "i1", name: "Decorative Vase", variant: "White", qty: 2, price: 60.0 },
        ],
        shippingAddress: {
            fullName: "Mia Clark",
            phone: "+1 333 222 1111",
            street: "44 King Street",
            city: "Boston",
            province: "Massachusetts",
            postalCode: "02108",
        },
        paymentMethod: "Visa •••• 3333",
        paymentStatus: "FAILED",
    },

    "11": {
        id: "11",
        orderNumber: "RH-90400",
        placedAt: "November 16, 2023",
        status: "SHIPPED",
        totalAmount: 2100.0,
        shippingCost: 0,
        tax: 189.0,
        estimatedDelivery: "Nov 20, 2023",
        items: [
            { id: "i1", name: "Leather Recliner", variant: "Brown", qty: 1, price: 2100.0 },
        ],
        shippingAddress: {
            fullName: "Henry Walker",
            phone: "+1 888 777 6666",
            street: "72 Green Avenue",
            city: "Phoenix",
            province: "Arizona",
            postalCode: "85001",
        },
        paymentMethod: "PayPal",
        paymentStatus: "PAID",
    },

    "12": {
        id: "12",
        orderNumber: "RH-90421",
        placedAt: "November 18, 2023",
        status: "PROCESSING",
        totalAmount: 350.0,
        shippingCost: 15,
        tax: 31.5,
        estimatedDelivery: "Nov 23, 2023",
        items: [
            { id: "i1", name: "Study Desk", variant: "Black", qty: 1, price: 350.0 },
        ],
        shippingAddress: {
            fullName: "Ava Harris",
            phone: "+1 123 987 6543",
            street: "19 River Street",
            city: "Portland",
            province: "Oregon",
            postalCode: "97035",
        },
        paymentMethod: "Bank Transfer",
        paymentStatus: "PENDING",
    },

    "13": {
        id: "13",
        orderNumber: "RH-90510",
        placedAt: "November 20, 2023",
        status: "DELIVERED",
        totalAmount: 870.0,
        shippingCost: 0,
        tax: 78.3,
        deliveryDate: "Nov 24, 2023",
        items: [
            { id: "i1", name: "Office Chair", variant: "Grey", qty: 2, price: 435.0 },
        ],
        shippingAddress: {
            fullName: "Noah Martin",
            phone: "+1 321 654 9870",
            street: "88 Grand Blvd",
            city: "Atlanta",
            province: "Georgia",
            postalCode: "30301",
        },
        paymentMethod: "Visa •••• 9090",
        paymentStatus: "PAID",
    },

    "14": {
        id: "14",
        orderNumber: "RH-90577",
        placedAt: "November 22, 2023",
        status: "SHIPPED",
        totalAmount: 1450.0,
        shippingCost: 30,
        tax: 130.5,
        estimatedDelivery: "Nov 27, 2023",
        items: [
            { id: "i1", name: "Dining Table Set", variant: "Walnut / 4-Seat", qty: 1, price: 1450.0 },
        ],
        shippingAddress: {
            fullName: "Isabella Young",
            phone: "+1 456 789 1230",
            street: "101 Sunset Street",
            city: "Las Vegas",
            province: "Nevada",
            postalCode: "88901",
        },
        paymentMethod: "Mastercard •••• 4545",
        paymentStatus: "PAID",
    },

    "15": {
        id: "15",
        orderNumber: "RH-90600",
        placedAt: "November 25, 2023",
        status: "PROCESSING",
        totalAmount: 560.0,
        shippingCost: 20,
        tax: 50.4,
        estimatedDelivery: "Nov 30, 2023",
        items: [
            { id: "i1", name: "Accent Armchair", variant: "Blue", qty: 1, price: 560.0 },
        ],
        shippingAddress: {
            fullName: "Ethan Moore",
            phone: "+1 654 321 7890",
            street: "200 Ocean Avenue",
            city: "San Diego",
            province: "California",
            postalCode: "92101",
        },
        paymentMethod: "Visa •••• 1212",
        paymentStatus: "PENDING",
    },
};

const PAGE_SIZE = 5;

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MyOrdersPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [dateRange, setDateRange] = useState("3m");
    const [page, setPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

    const filtered = useMemo(() => {
        return MOCK_ORDERS.filter((o) => {
            const matchSearch = search === "" || o.orderNumber.toLowerCase().includes(search.toLowerCase());
            const matchStatus = statusFilter === "" || o.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [search, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleSearch = (v: string) => { setSearch(v); setPage(1); };
    const handleStatus = (v: string) => { setStatusFilter(v); setPage(1); };
    const handleDate = (v: string) => { setDateRange(v); setPage(1); };

    // Replace with: const res = await fetch(`/api/orders/${id}`); setSelectedOrder(await res.json());
    const handleOrderDetail = (orderId: string) => {
        const detail = MOCK_DETAILS[orderId];
        if (detail) setSelectedOrder(detail);
    };

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