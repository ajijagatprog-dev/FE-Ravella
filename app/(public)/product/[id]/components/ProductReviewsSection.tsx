"use client";

import { useEffect, useState } from "react";
import { Star, ThumbsUp, MessageSquare, Loader2, User } from "lucide-react";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";

interface Review {
  id: number;
  rating: number;
  comment: string;
  user: {
    name: string;
  };
  created_at: string;
  admin_reply?: string;
}

interface Props {
  productId: string;
  calculatedRating: number;
  totalReviews: number;
  distribution: Record<string, number>;
}


export default function ProductReviewsSection({ productId, calculatedRating, totalReviews, distribution }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchReviews = async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${productId}/reviews`, { params: { page: pageNum } });
      if (res.data.status === "success") {
        const newData = res.data.data.data;
        setReviews(prev => pageNum === 1 ? newData : [...prev, ...newData]);
        setHasMore(res.data.data.next_page_url !== null);
      }
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1);
  }, [productId]);

  const renderStars = (rating: number, size = 14) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={size}
            className={cn(
              s <= Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-stone-200"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-20 bg-white border-t border-stone-100" >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="inline-flex items-center gap-2.5 mb-10">
          <div className="w-4 h-[1px] bg-stone-300" />
          <span className="text-stone-400 font-bold text-[10px] uppercase tracking-[0.25em]">Ulasan Pelanggan</span>
          <div className="w-4 h-[1px] bg-stone-300" />
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          {/* Left: Summary & Stats */}
          <div className="lg:col-span-4 space-y-8">
            <div className="text-center lg:text-left p-8 bg-stone-50 rounded-3xl space-y-4">
              <h3 className="text-5xl font-black text-stone-900 tracking-tight" >
                {calculatedRating.toFixed(1)}
              </h3>
              <div className="flex justify-center lg:justify-start">
                {renderStars(calculatedRating, 24)}
              </div>
              <p className="text-sm font-medium text-stone-500">Berdasarkan {totalReviews} ulasan terverifikasi</p>
            </div>

            {/* Distribution Bars */}
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = distribution[star] || 0;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-stone-400 w-4">{star}</span>
                    <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-400 rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-stone-400 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Reviews List */}
          <div className="lg:col-span-8 space-y-10">
            {reviews.length > 0 ? (
              <div className="divide-y divide-stone-100">
                {reviews.map((review) => (
                  <div key={review.id} className="py-8 first:pt-0">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-800">{review.user.name}</p>
                          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Verified Purchase</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-stone-300">
                         {new Date(review.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="mb-3">
                      {renderStars(review.rating)}
                    </div>

                    <p className="text-sm text-stone-600 leading-relaxed font-light mb-4 italic">
                      "{review.comment}"
                    </p>

                    {review.admin_reply && (
                      <div className="ml-6 mt-4 p-4 bg-stone-50 border-l-2 border-stone-200 rounded-r-2xl">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-2 h-2 rounded-full bg-stone-900" />
                          <p className="text-[10px] font-bold text-stone-900 uppercase tracking-widest">Respon Penjual</p>
                        </div>
                        <p className="text-sm text-stone-500 font-light italic">
                          {review.admin_reply}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : !loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-stone-300">
                <MessageSquare size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-medium">Belum ada ulasan untuk produk ini.</p>
              </div>
            ) : null}

            {loading && (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-stone-300" />
              </div>
            )}

            {hasMore && !loading && (
              <button 
                onClick={() => { setPage(p => p + 1); fetchReviews(page + 1); }}
                className="w-full py-4 border-2 border-stone-100 rounded-2xl text-xs font-bold text-stone-400 uppercase tracking-widest hover:bg-stone-50 hover:text-stone-600 transition-all"
              >
                Muat Lebih Banyak
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
