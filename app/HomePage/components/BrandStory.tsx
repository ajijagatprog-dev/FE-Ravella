"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function BrandStory() {
  return (
    <section className="relative px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-12 sm:py-16 md:py-28 bg-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center"
      >
        {/* ── IMAGE ── */}
        <div className="relative order-1 lg:order-1 w-full">
          <div className="relative w-full aspect-[3/2] sm:aspect-[4/3] lg:aspect-[4/5] overflow-hidden rounded-lg sm:rounded-xl">
            <img
              src="https://www.ravelle.co.id/images/home1.webp"
              alt="Ravelle Kitchen"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>

        {/* ── TEXT ── */}
        <div className="order-2 lg:order-2 flex flex-col justify-center lg:pl-10">
          <div className="max-w-[480px]">
            {/* Eyebrow */}
            <span
              className="inline-block mb-2 sm:mb-3 text-xs sm:text-sm text-neutral-500 tracking-wide"
              style={{ fontStyle: "italic" }}
            >
              Welcome to Ravelle
            </span>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-light leading-[1.2] mb-3 sm:mb-5 text-neutral-900">
              Quality
              <br />
              Home &amp; Kitchen
              <br />
              Appliances
            </h2>

            {/* Body */}
            <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 font-light">
              From the iconic stand mixer to innovative appliances,
              Ravelle&apos;s appliance suites are designed with the maker in
              mind. Make a meal — and a statement — with our major and small
              kitchen appliances.
            </p>

            {/* CTA */}
            <div className="flex justify-start sm:justify-end">
              <Link
                href="/company"
                className="group inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-black text-white hover:bg-neutral-800 transition-colors duration-300 text-[10px] sm:text-[11px] tracking-widest uppercase font-medium"
              >
                Read More
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
