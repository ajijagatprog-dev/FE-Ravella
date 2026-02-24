"use client";

import { useState } from "react";
import { Plus, MapPin } from "lucide-react";
import AddressCard, { type Address } from "./components/AddressCard";
import AddNewCard from "./components/AddNewCard";
import AddressFormModal from "./components/AddressFormModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import AddressFaqBanner from "./components/AddressFaqBanner";

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
    const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
    const [formOpen, setFormOpen] = useState(false);
    const [editData, setEditData] = useState<Address | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const deleteTarget = addresses.find((a) => a.id === deleteId);
    const canAddMore = addresses.length < MAX_ADDRESSES;

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleOpenAdd = () => {
        setEditData(null);
        setFormOpen(true);
    };

    const handleOpenEdit = (address: Address) => {
        setEditData(address);
        setFormOpen(true);
    };

    const handleSave = (data: Omit<Address, "id" | "isPrimary">) => {
        if (editData) {
            setAddresses((prev) =>
                prev.map((a) => (a.id === editData.id ? { ...a, ...data } : a))
            );
        } else {
            const newAddress: Address = {
                ...data,
                id: Date.now().toString(),
                isPrimary: addresses.length === 0,
            };
            setAddresses((prev) => [...prev, newAddress]);
        }
    };

    const handleDelete = () => {
        if (!deleteId) return;
        setAddresses((prev) => {
            const wasDefault = prev.find((a) => a.id === deleteId)?.isPrimary;
            const filtered = prev.filter((a) => a.id !== deleteId);
            if (wasDefault && filtered.length > 0) {
                filtered[0] = { ...filtered[0], isPrimary: true };
            }
            return filtered;
        });
        setDeleteId(null);
    };

    const handleSetPrimary = (id: string) => {
        setAddresses((prev) =>
            prev.map((a) => ({ ...a, isPrimary: a.id === id }))
        );
    };

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