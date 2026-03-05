"use client";

import { useState, useEffect } from "react";
import { Plus, MapPin } from "lucide-react";
import AddressCard, { type Address } from "./components/AddressCard";
import AddNewCard from "./components/AddNewCard";
import AddressFormModal from "./components/AddressFormModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import AddressFaqBanner from "./components/AddressFaqBanner";
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";

// ── Dummy data ────────────────────────────────────────────────────────────────
const INITIAL_ADDRESSES: Address[] = [
    {
        id: "1",
        label: "Home",
        isPrimary: true,
        fullName: "Budi Setiawan",
        phone: "+62 812-3456-7890",
        street: "Jl. Sudirman No. 45, Apartemen City View Tower A Lt. 12, Kec. Kebayoran Baru",
        city: "Jakarta Selatan",
        province: "DKI Jakarta",
        postalCode: "12190",
    },
    {
        id: "2",
        label: "Office",
        isPrimary: false,
        fullName: "Budi Setiawan (Work)",
        phone: "+62 812-3456-7890",
        street: "Gedung Menara Mandiri, Lt. 18 Unit B, Jl. Jend. Sudirman Kav 54-55",
        city: "Jakarta Selatan",
        province: "DKI Jakarta",
        postalCode: "12190",
    },
    {
        id: "3",
        label: "Parents' House",
        isPrimary: false,
        fullName: "Ani Wijaya",
        phone: "+62 856-7890-1234",
        street: "Komp. Perumahan Green Lake City, Cluster Asia No. 88",
        city: "Cipondoh, Kota Tangerang",
        province: "Banten",
        postalCode: "15147",
    },
];

const MAX_ADDRESSES = 10;

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SavedAddressPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [formOpen, setFormOpen] = useState(false);
    const [editData, setEditData] = useState<Address | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const deleteTarget = addresses.find((a) => a.id === deleteId);
    const canAddMore = addresses.length < MAX_ADDRESSES;

    const fetchAddresses = async () => {
        try {
            const res = await api.get('/customer/addresses');
            if (res.data.status === 'success') {
                const mapped = res.data.data.map((a: any) => ({
                    id: a.id.toString(),
                    label: a.label,
                    isPrimary: a.is_primary,
                    fullName: a.recipient_name,
                    phone: a.phone_number,
                    street: a.full_address,
                    city: a.city,
                    province: a.province,
                    postalCode: a.postal_code,
                }));
                setAddresses(mapped);
            }
        } catch (error) {
            console.error("Failed to fetch addresses:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch on mount
    useEffect(() => {
        fetchAddresses();
    }, []);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleOpenAdd = () => {
        setEditData(null);
        setFormOpen(true);
    };

    const handleOpenEdit = (address: Address) => {
        setEditData(address);
        setFormOpen(true);
    };

    const handleSave = async (data: Omit<Address, "id" | "isPrimary">) => {
        setLoading(true);
        try {
            const payload = {
                label: data.label,
                recipient_name: data.fullName,
                phone_number: data.phone,
                full_address: data.street,
                city: data.city,
                province: data.province,
                postal_code: data.postalCode,
                is_primary: addresses.length === 0, // Ensure first is primary
            };

            if (editData) {
                await api.put(`/customer/addresses/${editData.id}`, payload);
            } else {
                await api.post('/customer/addresses', payload);
            }
            await fetchAddresses();
        } catch (error) {
            console.error("Failed to save address", error);
        } finally {
            setLoading(false);
        }
        setFormOpen(false);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setLoading(true);
        try {
            await api.delete(`/customer/addresses/${deleteId}`);
            await fetchAddresses();
        } catch (error) {
            console.error("Failed to delete", error);
        } finally {
            setLoading(false);
            setDeleteId(null);
        }
    };

    const handleSetPrimary = async (id: string) => {
        setLoading(true);
        try {
            await api.put(`/customer/addresses/${id}/primary`);
            await fetchAddresses();
        } catch (error) {
            console.error("Failed to set primary", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && addresses.length === 0) {
        return (
            <div className="w-full h-[60vh] flex flex-col justify-center items-center gap-4 text-stone-500">
                <Loader2 className="w-8 h-8 animate-spin text-stone-800" />
                <p className="text-sm font-medium">Loading Addresses...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* ── Header ── */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-stone-800 mb-1">Saved Addresses</h1>
                    <p className="text-sm text-stone-500">
                        Manage your delivery locations for faster checkout.
                    </p>
                </div>
            </div>

            {/* ── Counter ── */}
            <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>
                        <span className="font-semibold text-stone-600">{addresses.length}</span>
                        {" "}of{" "}
                        <span className="font-semibold text-stone-600">{MAX_ADDRESSES}</span>
                        {" "}addresses saved
                    </span>
                </div>
                {/* Progress bar */}
                <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden max-w-[120px]">
                    <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${(addresses.length / MAX_ADDRESSES) * 100}%` }}
                    />
                </div>
            </div>

            {/* ── Address Grid ── */}
            {addresses.length === 0 ? (
                // Empty state
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-stone-200">
                    <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
                        <MapPin className="w-7 h-7 text-stone-300" />
                    </div>
                    <p className="text-sm font-semibold text-stone-500 mb-1">No addresses saved yet</p>
                    <p className="text-xs text-stone-400 mb-5">Add your first delivery address to get started</p>
                    <button
                        onClick={handleOpenAdd}
                        className="flex items-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Address
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {addresses.map((address) => (
                        <AddressCard
                            key={address.id}
                            address={address}
                            onEdit={handleOpenEdit}
                            onDelete={(id) => setDeleteId(id)}
                            onSetPrimary={handleSetPrimary}
                        />
                    ))}
                    {canAddMore && <AddNewCard onClick={handleOpenAdd} />}
                </div>
            )}

            {/* ── FAQ Banner ── */}
            <AddressFaqBanner />

            {/* ── Modals ── */}
            <AddressFormModal
                open={formOpen}
                editData={editData}
                onClose={() => setFormOpen(false)}
                onSave={handleSave}
            />

            <DeleteConfirmModal
                open={!!deleteId}
                addressLabel={deleteTarget?.label ?? ""}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
}