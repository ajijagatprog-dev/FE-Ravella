"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Share2,
  Volume2,
  VolumeX,
  Play,
  ChevronRight,
  Check,
} from "lucide-react";
import Link from "next/link";

interface VideoFeedItemProps {
  product: {
    id: number;
    name: string;
    price: number;
    description: string;
    videoUrl: string;
    image: string;
  };
  isActive: boolean;
}

export default function VideoFeedItem({
  product,
  isActive,
}: VideoFeedItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1200);
  const [copied, setCopied] = useState(false);

  /* ─── Playback control ──────────────────────────────────────────── */
  useEffect(() => {
    if (isActive) {
      videoRef.current?.play().catch(() => setIsPlaying(false));
      mobileVideoRef.current?.play().catch(() => {});
      bgVideoRef.current?.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      mobileVideoRef.current?.pause();
      bgVideoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  /* ─── Sync mute to video elements ──────────────────────────────── */
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
    if (mobileVideoRef.current) mobileVideoRef.current.muted = isMuted;
  }, [isMuted]);

  const togglePlay = () => {
    const vid = videoRef.current || mobileVideoRef.current;
    if (!vid) return;
    if (isPlaying) {
      vid.pause();
    } else {
      vid.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((prev) => {
      setLikeCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/product/${product.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* user cancelled */
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const formatCount = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  const isYouTube =
    product.videoUrl.includes("youtube.com") ||
    product.videoUrl.includes("youtu.be");
  let embedUrl = product.videoUrl;
  if (isYouTube) {
    const m = product.videoUrl.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/,
    );
    if (m?.[1])
      embedUrl = `https://www.youtube.com/embed/${m[1]}?autoplay=${isActive ? 1 : 0}&mute=1&controls=0&loop=1&playlist=${m[1]}`;
  }

  /* ─── Shared sub-components ─────────────────────────────────────── */

  const SidebarActions = () => (
    <div className="flex flex-col items-center gap-5 z-20">
      {/* Like */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={handleLike}
        className="flex flex-col items-center gap-1"
      >
        <motion.div
          animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
          className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${isLiked ? "bg-red-500" : "bg-white/15 hover:bg-white/25"}`}
        >
          <Heart
            className={`w-5 h-5 transition-all ${isLiked ? "fill-white text-white scale-110" : "text-white"}`}
          />
        </motion.div>
        <span className="text-[10px] text-white font-semibold">
          {formatCount(likeCount)}
        </span>
      </motion.button>

      {/* Share */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={handleShare}
        className="flex flex-col items-center gap-1"
      >
        <div className="w-11 h-11 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center transition-all">
          {copied ? (
            <Check className="w-5 h-5 text-green-400" />
          ) : (
            <Share2 className="w-5 h-5 text-white" />
          )}
        </div>
        <span className="text-[10px] text-white font-semibold">
          {copied ? "Copied!" : "Share"}
        </span>
      </motion.button>

      {/* Mute — always shown */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={toggleMute}
        className="flex flex-col items-center gap-1"
      >
        <div
          className={`w-11 h-11 backdrop-blur-md rounded-full flex items-center justify-center transition-all ${isMuted ? "bg-white/15 hover:bg-white/25" : "bg-amber-500/80 hover:bg-amber-500"}`}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </div>
        <span className="text-[10px] text-white font-semibold">
          {isMuted ? "Muted" : "Sound"}
        </span>
      </motion.button>
    </div>
  );

  /* Featured product card */
  const ProductCard = ({ compact = false }: { compact?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Link href={`/product/${product.id}`} className="group block mb-2">
        <h3
          className={`${compact ? "text-sm" : "text-base sm:text-lg"} font-semibold text-white drop-shadow-lg group-hover:text-neutral-300 transition-colors leading-tight`}
        >
          {product.name}
        </h3>
        <p
          className={`${compact ? "text-[10px]" : "text-xs sm:text-sm"} text-white/75 line-clamp-2 mt-0.5 font-light leading-relaxed`}
        >
          {product.description}
        </p>
      </Link>

      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400 }}
        className="flex items-center gap-3 bg-white/12 backdrop-blur-xl border border-white/20 rounded-2xl p-2.5 w-full max-w-[280px] overflow-hidden shadow-lg"
      >
        {/* Product image */}
        <div className="w-12 h-12 bg-white/10 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=200";
            }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[9px] text-white/55 font-bold uppercase tracking-widest mb-0.5">
            Featured Product
          </p>
          <p className="text-white font-bold text-xs truncate">
            {formatPrice(product.price)}
          </p>
        </div>

        {/* CTA */}
        <Link
          href={`/product/${product.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0 flex items-center gap-0.5 px-3 py-1.5 bg-white text-black text-[9px] font-black uppercase tracking-wider rounded-lg hover:bg-neutral-200 transition-colors whitespace-nowrap"
        >
          Beli <ChevronRight className="w-2.5 h-2.5" />
        </Link>
      </motion.div>
    </motion.div>
  );

  const MusicLabel = () => (
    <div className="flex items-center gap-1.5">
      <div className="w-3.5 h-3.5 rounded-full border border-white/40 flex items-center justify-center animate-spin-slow">
        <div className="w-1 h-1 bg-white rounded-full" />
      </div>
      <span className="text-[9px] text-white/40 tracking-widest uppercase font-medium">
        Original Sound · Ravelle Official
      </span>
    </div>
  );

  const PlayOverlay = ({ size = "md" }: { size?: "sm" | "md" }) => (
    <AnimatePresence>
      {!isPlaying && !isYouTube && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        >
          <div
            className={`${size === "sm" ? "w-14 h-14" : "w-20 h-20"} bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center`}
          >
            <Play
              className={`${size === "sm" ? "w-7 h-7 ml-1" : "w-10 h-10 ml-2"} text-white fill-white`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  /* ═══════════════════════════════════════════════════════════════════ */
  return (
    <div className="relative w-full h-screen bg-black snap-start overflow-hidden flex items-center justify-center">
      {/* ── DESKTOP ────────────────────────────────────────────────── */}

      {/* Blurred BG */}
      <div className="hidden md:block absolute inset-0 z-0">
        {!isYouTube ? (
          <video
            ref={bgVideoRef}
            src={product.videoUrl}
            className="w-full h-full object-cover scale-110"
            muted
            loop
            playsInline
          />
        ) : (
          <div className="w-full h-full bg-neutral-900" />
        )}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />
      </div>

      {/* Center layout: card + sidebar */}
      <div className="hidden md:flex relative z-10 items-center justify-center gap-5 h-full px-4">
        {/* ── 9:16 card ──────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/10 cursor-pointer bg-black"
          style={{ aspectRatio: "9/16", height: "min(90vh, 700px)" }}
          onClick={togglePlay}
        >
          {isYouTube ? (
            <iframe
              src={embedUrl}
              className="w-full h-full pointer-events-none"
              allow="autoplay; encrypted-media"
              style={{ border: 0 }}
            />
          ) : (
            /* object-contain so landscape media isn't cropped */
            <video
              ref={videoRef}
              src={product.videoUrl}
              className="w-full h-full object-contain"
              loop
              muted={isMuted}
              playsInline
            />
          )}

          <PlayOverlay size="sm" />

          {/* Gradients */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

          {/* Product card at bottom */}
          <div className="absolute left-3 bottom-6 right-3 z-20">
            <ProductCard compact />
          </div>

          {/* Music label */}
          <div className="absolute bottom-2 left-3 z-20">
            <MusicLabel />
          </div>
        </div>

        {/* Sidebar actions */}
        <SidebarActions />
      </div>

      {/* ── MOBILE ─────────────────────────────────────────────────── */}

      {/* Fullscreen video */}
      <div className="md:hidden absolute inset-0 z-10" onClick={togglePlay}>
        {isYouTube ? (
          <iframe
            src={embedUrl}
            className="w-full h-full pointer-events-none"
            allow="autoplay; encrypted-media"
            style={{ border: 0 }}
          />
        ) : (
          <video
            ref={mobileVideoRef}
            src={product.videoUrl}
            className="w-full h-full object-contain bg-black"
            loop
            muted={isMuted}
            playsInline
          />
        )}
        <PlayOverlay />
      </div>

      {/* Mobile gradients */}
      <div className="md:hidden absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-20" />
      <div className="md:hidden absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none z-20" />

      {/* Mobile sidebar (right side) */}
      <div className="md:hidden absolute right-3 bottom-28 z-30">
        <SidebarActions />
      </div>

      {/* Mobile product info (bottom-left, clearing sidebar) */}
      <div
        className="md:hidden absolute left-4 bottom-8 z-30"
        style={{ right: "72px" }}
      >
        <ProductCard />
      </div>

      {/* Mobile music label */}
      <div className="md:hidden absolute bottom-2 left-4 z-30">
        <MusicLabel />
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
