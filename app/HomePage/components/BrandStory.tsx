import Link from "next/link";

export default function BrandStory() {
  return (
    <section className="relative px-4 md:px-10 lg:px-40 py-28 bg-white overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-black/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* TEXT */}
        <div>
          <span className="inline-block mb-5 font-semibold tracking-[0.3em] uppercase text-xs text-black">
            Welcome to Ravelle
          </span>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-black">
            Quality Home & Kitchen
            <br />
            Appliances
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-xl">
            At <span className="font-semibold text-black">Ravelle</span>, from
            the iconic stand mixer to innovative appliances, every product is
            thoughtfully designed for modern homes — combining performance,
            elegance, and durability.
          </p>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-10 mb-12">
            <div className="group">
              <h4 className="text-3xl font-bold text-black mb-1 group-hover:text-primary transition">
                100%
              </h4>
              <p className="text-sm text-gray-500">Quality-Driven Design</p>
            </div>

            <div className="group">
              <h4 className="text-3xl font-bold text-black mb-1 group-hover:text-primary transition">
                Thoughtfully Built
              </h4>
              <p className="text-sm text-gray-500">
                Engineered for Modern Homes
              </p>
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/company"
            className="inline-flex items-center gap-3 px-6 py-3 
            bg-gradient-to-r from-slate-800 to-slate-900 
            text-white font-bold rounded-xl
            border-2 border-slate-700
            shadow-lg hover:shadow-xl
            hover:gap-4 hover:from-slate-900 hover:to-black
            transition-all duration-300 group
            active:scale-95"
          >
            READ MORE
            <span className="text-xl text-orange-400 group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </Link>
        </div>

        {/* IMAGE */}
        <div className="relative group">
          <div
            className="relative aspect-square rounded-[32px] overflow-hidden shadow-2xl
            transition-transform duration-700 ease-out group-hover:-translate-y-2"
            style={{
              backgroundImage:
                "url(https://www.ravelle.co.id/images/home1.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-transparent" />
          </div>

          {/* FLOATING BADGE */}
          <div
            className="absolute -bottom-6 -right-6 bg-white px-6 py-4 rounded-2xl
            shadow-xl text-sm font-semibold text-black"
          >
            Trusted by modern households
          </div>
        </div>
      </div>
    </section>
  );
}
