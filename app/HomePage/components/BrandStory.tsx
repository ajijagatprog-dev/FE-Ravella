"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function BrandStory() {
  return (
    <section className="relative px-4 md:px-10 lg:px-40 py-20 md:py-28 bg-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
      >
        {/* ── IMAGE ── */}
        <div className="relative order-1 lg:order-1 w-full flex justify-center">
          <div
            className="relative w-full aspect-[4/5] overflow-hidden"
            style={{
              backgroundImage:
                "url(https://www.ravelle.co.id/images/home1.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/5" />
          </div>
        </div>

        {/* ── TEXT ── */}
        <div className="order-2 lg:order-2 flex flex-col justify-center lg:pl-10">
          <div className="max-w-[480px]">
            {/* Eyebrow */}
            <span
              className="inline-block mb-3 text-sm text-neutral-800"
              style={{ fontStyle: "italic" }}
            >
              Welcome to Ravelle
            </span>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-light leading-[1.2] mb-5 text-neutral-900">
              Quality
              <br />
              Home &amp; Kitchen
              <br />
              Appliances
            </h2>

            {/* Body */}
            <p className="text-neutral-800 text-sm leading-relaxed mb-8 font-light">
              From the iconic stand mixer to innovative appliances,
              Ravelle&apos;s appliance suites are designed with the maker in
              mind. Make a meal — and a statement — with our major and small
              kitchen appliances.
            </p>

            {/* CTA */}
            <div className="flex justify-end">
              <Link
                href="/company"
                className="inline-flex items-center px-8 py-3 bg-black text-white hover:bg-neutral-800 transition-colors duration-300 text-[10px] tracking-widest uppercase font-medium"
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
