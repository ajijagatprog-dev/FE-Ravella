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
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (isActive) {
      videoRef.current?.play().catch(() => setIsPlaying(false));
      bgVideoRef.current?.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      bgVideoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const isYouTube =
    product.videoUrl.includes("youtube.com") ||
    product.videoUrl.includes("youtu.be");

  let embedUrl = product.videoUrl;
  if (isYouTube) {
    const ytMatch = product.videoUrl.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/,
    );
    if (ytMatch && ytMatch[1]) {
      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=${isActive ? 1 : 0}&mute=1&controls=0&loop=1&playlist=${ytMatch[1]}`;
    }
  }

  /* ─────────────────────────────────────────────────────────────────────── */
  /*  SHARED UI PIECES                                                        */
  /* ─────────────────────────────────────────────────────────────────────── */

  const SidebarActions = ({ className = "" }: { className?: string }) => (
    <div className={`flex flex-col items-center gap-5 z-20 ${className}`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsLiked(!isLiked);
        }}
        className="flex flex-col items-center gap-1 group"
      >
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all backdrop-blur-md ${isLiked ? "bg-red-500" : "bg-white/10 hover:bg-white/20"}`}
        >
          <Heart
            className={`w-5 h-5 ${isLiked ? "fill-white text-white" : "text-white"}`}
          />
        </div>
        <span className="text-[10px] text-white font-medium">1.2k</span>
      </button>

      <button className="flex flex-col items-center gap-1">
        <div className="w-11 h-11 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all">
          <Share2 className="w-5 h-5 text-white" />
        </div>
        <span className="text-[10px] text-white font-medium">Share</span>
      </button>

      {!isYouTube && (
        <button
          onClick={toggleMute}
          className="w-11 h-11 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </button>
      )}
    </div>
  );

  const ProductOverlay = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Link
        href={`/product/${product.id}`}
        className="group inline-flex flex-col gap-1"
      >
        <h3 className="text-base font-semibold text-white drop-shadow-lg group-hover:text-neutral-300 transition-colors">
          {product.name}
        </h3>
        <p className="text-[11px] text-white/80 line-clamp-2 mb-2 font-light leading-relaxed">
          {product.description}
        </p>
      </Link>
      <motion.div
        whileHover={{ y: -3 }}
        className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 p-2.5 rounded-xl max-w-[210px] overflow-hidden"
      >
        <div className="w-10 h-10 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] text-white/60 font-bold uppercase tracking-wider mb-0.5">
            Featured Product
          </p>
          <p className="text-white font-bold text-[11px] mb-0.5 truncate">
            {formatPrice(product.price)}
          </p>
          <Link
            href={`/product/${product.id}`}
            className="inline-flex items-center gap-0.5 text-[9px] font-black uppercase tracking-[0.15em] text-white hover:text-neutral-300 transition-colors"
          >
            Buy Now <ChevronRight className="w-2.5 h-2.5" />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );

  const MusicLabel = () => (
    <div className="flex items-center gap-1.5">
      <div className="w-3.5 h-3.5 rounded-full border border-white/40 flex items-center justify-center animate-spin-slow">
        <div className="w-1 h-1 bg-white rounded-full" />
      </div>
      <span className="text-[9px] text-white/40 tracking-widest uppercase font-medium">
        Original Sound - Ravelle Official
      </span>
    </div>
  );

  /* ─────────────────────────────────────────────────────────────────────── */

  return (
    <div className="relative w-full h-screen bg-black snap-start overflow-hidden flex items-center justify-center">
      {/* ═══════════════════════════════════════════════════════════════════
          DESKTOP: TikTok-style centered 9:16 card + blurred BG
      ═══════════════════════════════════════════════════════════════════ */}

      {/* Blurred background video — desktop only */}
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
        <div className="absolute inset-0 bg-black/55 backdrop-blur-2xl" />
      </div>

      {/* Centered card */}
      <div className="hidden md:flex relative z-10 items-center gap-5 h-full justify-center">
        {/* 9:16 card */}
        <div
          className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/10 cursor-pointer"
          style={{ aspectRatio: "9/16", height: "min(90vh, 700px)" }}
          onClick={togglePlay}
        >
          {/* Media */}
          {isYouTube ? (
            <iframe
              src={embedUrl}
              className="w-full h-full pointer-events-none"
              allow="autoplay; encrypted-media"
              style={{ border: 0 }}
            />
          ) : (
            <video
              ref={videoRef}
              src={product.videoUrl}
              className="w-full h-full object-cover"
              loop
              muted={isMuted}
              playsInline
            />
          )}

          {/* Play indicator */}
          <AnimatePresence>
            {!isPlaying && !isYouTube && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gradient overlays */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

          {/* Product info bottom-left inside card */}
          <div className="absolute left-3 bottom-5 right-3 z-20">
            <ProductOverlay />
          </div>

          {/* Music label bottom */}
          <div className="absolute bottom-2 left-3 z-20">
            <MusicLabel />
          </div>
        </div>

        {/* Action sidebar to the right of the card */}
        <SidebarActions />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          MOBILE: original fullscreen layout
      ═══════════════════════════════════════════════════════════════════ */}

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
            ref={!videoRef.current ? videoRef : undefined}
            src={product.videoUrl}
            className="w-full h-full object-cover"
            loop
            muted={isMuted}
            playsInline
          />
        )}
        <AnimatePresence>
          {!isPlaying && !isYouTube && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                <Play className="w-10 h-10 text-white fill-white ml-2" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile gradients */}
      <div className="md:hidden absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-20" />
      <div className="md:hidden absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-20" />

      {/* Mobile sidebar */}
      <div className="md:hidden absolute right-2 bottom-24 z-30">
        <SidebarActions />
      </div>

      {/* Mobile product info */}
      <div className="md:hidden absolute left-4 bottom-8 right-16 z-30 max-w-sm">
        <ProductOverlay />
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
