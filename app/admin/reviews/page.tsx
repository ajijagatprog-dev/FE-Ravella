"use client";

import { useEffect, useState } from "react";
import {
  Star,
  CheckCircle,
  XCircle,
  MessageSquare,
  User,
  Package,
  Loader2,
  Search,
  Filter,
  ExternalLink,
} from "lucide-react";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Review {
  id: number;
  product_id: number;
  user_id: number;
  order_id: number;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  admin_reply: string | null;
  created_at: string;
  product: {
    name: string;
    image: string;
  };
  user: {
    name: string;
    email: string;
  };
}

export default function ReviewManagementPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/reviews", {
        params: {
          status: statusFilter !== "all" ? statusFilter : undefined,
          search: searchTerm || undefined,
        },
      });
      if (res.data.status === "success") {
        setReviews(res.data.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const handleAction = async (id: number, status: "approved" | "rejected") => {
    try {
      setActionLoading(id);
      const res = await api.put(`/admin/reviews/${id}/status`, { status });
      if (res.data.status === "success") {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r)),
        );
      }
    } catch (err) {
      alert("Gagal memperbarui status ulasan.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReply = async (id: number) => {
    try {
      setActionLoading(id);
      const res = await api.put(`/admin/reviews/${id}/reply`, {
        admin_reply: replyText,
      });
      if (res.data.status === "success") {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, admin_reply: replyText } : r)),
        );
        setReplyingTo(null);
        setReplyText("");
      }
    } catch (err) {
      alert("Gagal mengirim balasan.");
    } finally {
      setActionLoading(null);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const lowerStatus = status.toLowerCase();
    const styles: Record<string, string> = {
      pending: "bg-amber-50 text-amber-600 border-amber-200",
      approved: "bg-emerald-50 text-emerald-600 border-emerald-200",
      rejected: "bg-rose-50 text-rose-600 border-rose-200",
    };

    const currentStyle =
      styles[lowerStatus] || "bg-stone-50 text-stone-500 border-stone-200";

    return (
      <span
        className={cn(
          "text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider",
          currentStyle,
        )}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-tight">
            Review Moderation
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Kelola dan moderasi ulasan produk dari pelanggan.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari ulasan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchReviews()}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 text-gray-900 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none w-full md:w-64 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Stats / Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { label: "Semua", value: "all" },
          { label: "Pending", value: "pending" },
          { label: "Approved", value: "approved" },
          { label: "Rejected", value: "rejected" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
              statusFilter === f.value
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-sm font-medium text-gray-500">
            Memuat data ulasan...
          </p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-6">
            <MessageSquare size={40} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Tidak Ada Ulasan</h3>
          <p className="text-sm text-gray-400 mt-2 max-w-xs">
            Ulasan yang Anda cari tidak ditemukan atau belum ada data masuk.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Product & User Info */}
                <div className="lg:w-1/3 flex items-start gap-4 pr-6 lg:border-r border-gray-50">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden">
                    <img
                      src={review.product.image}
                      alt={review.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {review.product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User size={12} />
                      </div>
                      <p className="text-xs font-medium text-gray-500 truncate">
                        {review.user.name}
                      </p>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">
                      ORDER #{review.order_id}
                    </p>
                  </div>
                </div>

                {/* Center: Review Content */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={cn(
                            s <= review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-200",
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-medium text-gray-400">
                      {new Date(review.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-sm text-gray-700 leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </div>

                  {review.admin_reply ? (
                    <div className="ml-6 flex items-start gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                      <MessageSquare
                        size={16}
                        className="text-blue-600 mt-0.5 shrink-0"
                      />
                      <div>
                        <p className="text-[10px] font-bold text-blue-900 uppercase tracking-widest mb-1">
                          Balasan Anda
                        </p>
                        <p className="text-sm text-blue-700 italic">
                          {review.admin_reply}
                        </p>
                      </div>
                    </div>
                  ) : replyingTo === review.id ? (
                    <div className="ml-6 space-y-3 animate-in slide-in-from-top-2">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Tulis balasan..."
                        className="w-full px-4 py-3 bg-white border border-blue-200 rounded-2xl text-gray-900 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none min-h-[100px] resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => handleReply(review.id)}
                          disabled={!replyText || actionLoading === review.id}
                          className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-200 flex items-center gap-2"
                        >
                          {actionLoading === review.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : null}
                          Kirim Balasan
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Right: Actions */}
                <div className="lg:w-48 flex flex-col gap-2 justify-center pl-6 lg:border-l border-gray-50">
                  <div className="mb-2">
                    <StatusBadge status={review.status} />
                  </div>

                  {review.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleAction(review.id, "approved")}
                        disabled={actionLoading === review.id}
                        className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                      >
                        {actionLoading === review.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <CheckCircle size={14} />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(review.id, "rejected")}
                        disabled={actionLoading === review.id}
                        className="w-full py-2.5 bg-white text-rose-600 border border-rose-100 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle size={14} />
                        Reject
                      </button>
                    </>
                  )}

                  {review.status === "approved" &&
                    !review.admin_reply &&
                    !replyingTo && (
                      <button
                        onClick={() => setReplyingTo(review.id)}
                        className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                      >
                        <MessageSquare size={14} />
                        Balas Ulasan
                      </button>
                    )}

                  <Link
                    href={`/product/${review.product_id}`}
                    target="_blank"
                    className="w-full py-2.5 text-gray-400 hover:text-gray-600 transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={14} />
                    Lihat Produk
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
