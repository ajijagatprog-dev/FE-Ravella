import Link from "next/link";

const JOST = "'Jost', system-ui, sans-serif";
const CORMORANT = "'Cormorant Garamond', Georgia, serif";

export default function BrandStory() {
  return (
    <section
      className="relative px-4 md:px-10 lg:px-40 py-20 md:py-28 bg-white overflow-hidden"
      style={{ fontFamily: JOST }}
    >
      <div className="relative max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* ── TEXT ── */}
        <div>

          {/* Eyebrow — matches screenshot: monospace-feel, tight tracking */}
          <span
            className="inline-block mb-5 font-medium tracking-[0.28em] uppercase text-[11px] text-neutral-500"
            style={{ fontFamily: JOST }}
          >
            Welcome to Ravelle
          </span>

          {/* Heading — Cormorant Garamond, same weight & style as screenshot */}
          <h2
            className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.08] mb-6 text-neutral-900"
            style={{ fontFamily: CORMORANT, letterSpacing: "-0.01em" }}
          >
            Quality
            <br />
            Home &amp; Kitchen
            <br />
            Appliances
          </h2>

          {/* Body — Jost light, matches screenshot paragraph weight */}
          <p
            className="text-neutral-600 text-base md:text-lg leading-relaxed mb-10 max-w-xl font-light"
            style={{ fontFamily: JOST }}
          >
            From the iconic stand mixer to innovative appliances,{" "}
            <span className="font-medium text-neutral-900">Ravelle&apos;s</span>{" "}
            appliance suites are designed with the maker in mind. Make a meal —
            and a statement — with our major and small kitchen appliances.
          </p>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-10 mb-12 border-t border-neutral-100 pt-8">
            <div>
              <h4
                className="text-3xl md:text-4xl font-light text-neutral-900 mb-1"
                style={{ fontFamily: CORMORANT }}
              >
                100%
              </h4>
              <p
                className="text-xs text-neutral-400 tracking-[0.15em] uppercase font-medium"
                style={{ fontFamily: JOST }}
              >
                Quality-Driven Design
              </p>
            </div>
            <div>
              <h4
                className="text-2xl md:text-3xl font-light text-neutral-900 mb-1 leading-tight"
                style={{ fontFamily: CORMORANT }}
              >
                Thoughtfully
                <br />Built
              </h4>
              <p
                className="text-xs text-neutral-400 tracking-[0.15em] uppercase font-medium"
                style={{ fontFamily: JOST }}
              >
                Engineered for Modern Homes
              </p>
            </div>
          </div>

          {/* CTA — solid black rectangular, matches screenshot exactly */}
          <Link
            href="/company"
            className="inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white hover:bg-black transition-colors duration-300 text-[11px] tracking-[0.25em] uppercase font-medium"
            style={{ fontFamily: JOST }}
          >
            Read More
          </Link>
        </div>

        {/* ── IMAGE ── */}
        <div className="relative">
          {/* Main image — no rounded corners, matches clean editorial style */}
          <div
            className="relative aspect-square overflow-hidden"
            style={{
              backgroundImage: "url(https://www.ravelle.co.id/images/home1.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/5" />
          </div>

          {/* Floating badge — clean white card, no border radius */}
          <div
            className="absolute -bottom-5 -right-2 md:-right-6 bg-white px-5 py-3.5 shadow-lg border border-neutral-100"
            style={{ fontFamily: JOST }}
          >
            <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-medium mb-0.5">
              Trusted by
            </p>
            <p className="text-sm font-medium text-neutral-900 tracking-wide">
              Modern Households
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}