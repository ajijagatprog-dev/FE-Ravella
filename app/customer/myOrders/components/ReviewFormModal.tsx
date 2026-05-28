"use client";

import { useState, useEffect } from "react";
import {
  X,
  Star,
  Loader2,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: {
    id: string;
    name: string;
    image?: string;
  };
  orderId: string;
  existingReview?: {
    id: number;
    rating: number;
    comment: string;
  } | null;
}

export default function ReviewFormModal({
  isOpen,
  onClose,
  onSuccess,
  product,
  orderId,
  existingReview,
}: Props) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setRating(existingReview ? existingReview.rating : 5);
      setComment(existingReview ? existingReview.comment || "" : "");
      setSubmitted(false);
      setError(null);
    }
  }, [isOpen, existingReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        rating,
        comment,
      };

      const res = existingReview
        ? await api.put(`/reviews/${existingReview.id}`, payload)
        : await api.post("/reviews", {
            product_id: product.id,
            order_id: orderId,
            ...payload,
          });

      if (res.data.status === "success") {
        setSubmitted(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Gagal menyimpan ulasan. Silakan coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Success State */}
          {submitted ? (
            <div className="p-10 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 animate-bounce">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-900">
                  {existingReview ? "Ulasan Diperbarui!" : "Ulasan Terkirim!"}
                </h3>
                <p className="text-sm text-stone-500 mt-2">
                  {existingReview
                    ? "Perubahan ulasan Anda berhasil disimpan. Ulasan akan diperbarui setelah diverifikasi kembali oleh admin."
                    : "Terima kasih atas ulasan Anda. Ulasan akan tampil setelah diverifikasi oleh admin."}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-stone-800">
                  {existingReview ? "Edit Ulasan" : "Beri Ulasan"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-stone-50 rounded-xl text-stone-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Product Info */}
                <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl">
                  <div className="w-12 h-12 rounded-lg bg-white border border-stone-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-stone-200" />
                    )}
                  </div>
                  <p className="text-sm font-bold text-stone-700 line-clamp-2">
                    {product.name}
                  </p>
                </div>

                {/* Rating Input */}
                <div className="text-center space-y-3">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                    Kualitas Produk
                  </p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="transition-transform active:scale-90"
                      >
                        <Star
                          size={32}
                          className={cn(
                            "transition-colors",
                            (hover || rating) >= star
                              ? "fill-amber-400 text-amber-400"
                              : "fill-stone-100 text-stone-200",
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm font-bold text-amber-600">
                    {rating === 5
                      ? "Sangat Puas"
                      : rating === 4
                        ? "Puas"
                        : rating === 3
                          ? "Cukup"
                          : rating === 2
                            ? "Kurang"
                            : "Sangat Kurang"}
                  </p>
                </div>

                {/* Comment Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                    Bagikan Pengalaman Anda
                  </label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Apa yang membuat Anda suka/tidak suka dengan produk ini?"
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 text-sm placeholder:text-stone-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none transition-all resize-none"
                  />
                </div>

                {error && (
                  <p className="text-xs font-medium text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-100 italic">
                    {error}
                  </p>
                )}

                {/* Footer / Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold text-sm tracking-widest uppercase hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {existingReview
                        ? "Sedang Menyimpan..."
                        : "Sedang Mengirim..."}
                    </>
                  ) : existingReview ? (
                    "Simpan Perubahan"
                  ) : (
                    "Kirim Ulasan"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
