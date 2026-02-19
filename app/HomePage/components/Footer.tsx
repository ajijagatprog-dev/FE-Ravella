import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const JOST = "'Jost', system-ui, sans-serif";
const CORMORANT = "'Cormorant Garamond', Georgia, serif";

export default function Footer() {
  const companyLinks = [
    { name: "About", href: "/about" },
    { name: "FAQ", href: "/faq" },
  ];

  const customerLinks = [
    { name: "Customer Care", href: "/customer-care" },
    { name: "Service Center", href: "/service-center" },
  ];

  const productLinks = [
    { name: "Cookware", href: "/product?category=cookware" },
    { name: "Home & Kitchen Appliance", href: "/product?category=appliance" },
    { name: "Spatula", href: "/product?category=spatula" },
    { name: "Knife Set", href: "/product?category=knife" },
    { name: "Ezy Series", href: "/product?category=ezy" },
    { name: "Home Living", href: "/product?category=living" },
  ];

  const socialMedia = [
    { name: "WhatsApp", icon: Phone, href: "https://wa.me/628123456789" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/ravelle" },
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/ravelle" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/ravelle" },
  ];

  return (
    <footer
      className="bg-[#edeae5] px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-16 sm:py-20"
      style={{ fontFamily: JOST }}
    >
      <div className="max-w-[1600px] mx-auto">

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">

          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <img
                src="/lg-ravella-gold.png"
                alt="Ravelle Logo"
                className="h-8 w-auto mb-5"
              />
            </div>

            <p
              className="text-sm text-neutral-600 leading-relaxed mb-7 max-w-sm font-light"
              style={{ fontFamily: JOST }}
            >
              Menyediakan peralatan dapur berkualitas premium dengan desain
              modern dan inovatif sejak 2018. Kepercayaan Anda adalah prioritas kami.
            </p>

            {/* Contact */}
            <div className="space-y-3.5 mb-7">
              <a
                href="tel:+628123456789"
                className="flex items-center gap-3 text-sm text-neutral-600 hover:text-neutral-900 transition-colors group"
              >
                <div className="w-8 h-8 bg-white flex items-center justify-center flex-shrink-0 group-hover:bg-neutral-900 transition-colors">
                  <Phone className="w-3.5 h-3.5 group-hover:text-white transition-colors" />
                </div>
                <span className="font-medium tracking-wide">+62 812-3456-7890</span>
              </a>

              <a
                href="mailto:info@ravelle.com"
                className="flex items-center gap-3 text-sm text-neutral-600 hover:text-neutral-900 transition-colors group"
              >
                <div className="w-8 h-8 bg-white flex items-center justify-center flex-shrink-0 group-hover:bg-neutral-900 transition-colors">
                  <Mail className="w-3.5 h-3.5 group-hover:text-white transition-colors" />
                </div>
                <span className="font-medium tracking-wide">info@ravelle.com</span>
              </a>

              <div className="flex items-start gap-3 text-sm text-neutral-600">
                <div className="w-8 h-8 bg-white flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="font-light leading-relaxed">
                  Jl. Industri No. 123<br />
                  Jakarta Selatan, Indonesia
                </span>
              </div>
            </div>

            {/* Social */}
            <div>
              <h5
                className="font-medium text-neutral-800 mb-4 text-[11px] uppercase tracking-[0.22em]"
                style={{ fontFamily: JOST }}
              >
                Ikuti Kami
              </h5>
              <div className="flex flex-wrap gap-2.5">
                {socialMedia.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="w-9 h-9 flex items-center justify-center bg-white text-neutral-600 hover:bg-neutral-900 hover:text-white transition-all duration-300"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h4
              className="font-bold text-neutral-800 mb-6 text-[11px] uppercase tracking-[0.22em]"
              style={{ fontFamily: JOST }}
            >
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm font-light text-neutral-500 hover:text-neutral-900 transition-colors tracking-wide"
                    style={{ fontFamily: JOST }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Links */}
          <div className="lg:col-span-3">
            <h4
              className="font-bold text-neutral-800 mb-6 text-[11px] uppercase tracking-[0.22em]"
              style={{ fontFamily: JOST }}
            >
              Customer
            </h4>
            <ul className="space-y-3">
              {customerLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm font-light text-neutral-500 hover:text-neutral-900 transition-colors tracking-wide"
                    style={{ fontFamily: JOST }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Links */}
          <div className="lg:col-span-3">
            <h4
              className="font-bold text-neutral-800 mb-6 text-[11px] uppercase tracking-[0.22em]"
              style={{ fontFamily: JOST }}
            >
              Products
            </h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm font-light text-neutral-500 hover:text-neutral-900 transition-colors tracking-wide"
                    style={{ fontFamily: JOST }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-7 border-t border-neutral-300/60 flex flex-col sm:flex-row items-center justify-between gap-5">
          <p
            className="text-xs text-neutral-400 font-light tracking-wide text-center sm:text-left"
            style={{ fontFamily: JOST }}
          >
            © 2026 Ravelle. All rights reserved. Made with ❤️ in Indonesia
          </p>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((label) => (
              <a
                key={label}
                href={`/${label.toLowerCase().replace(/ /g, "-")}`}
                className="text-xs text-neutral-400 hover:text-neutral-800 transition-colors font-light tracking-wide"
                style={{ fontFamily: JOST }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}