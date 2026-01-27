import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";

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
    {
      name: "WhatsApp",
      icon: Phone,
      href: "https://wa.me/628123456789",
      color: "hover:bg-green-500",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com/ravella",
      color: "hover:bg-pink-500",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://facebook.com/ravella",
      color: "hover:bg-blue-600",
    },
    {
      name: "YouTube",
      icon: Youtube,
      href: "https://youtube.com/ravella",
      color: "hover:bg-red-600",
    },
  ];

  return (
    <footer className="bg-[#e8e5e0] px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-16 sm:py-20">
      <div className="max-w-[1600px] mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">
          {/* Brand Section - Larger */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <img
                src="/lg-ravella-gold.png"
                alt="Ravella Logo"
                className="h-10 w-auto mb-4"
              />
            </div>

            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6 max-w-sm">
              Menyediakan peralatan dapur berkualitas premium dengan desain
              modern dan inovatif sejak 2018. Kepercayaan Anda adalah prioritas
              kami.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a
                href="tel:+628123456789"
                className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#c4a574] transition-colors group"
              >
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center group-hover:bg-[#c4a574] transition-colors">
                  <Phone className="w-4 h-4 group-hover:text-white" />
                </div>
                <span className="font-medium">+62 812-3456-7890</span>
              </a>

              <a
                href="mailto:info@ravella.com"
                className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#c4a574] transition-colors group"
              >
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center group-hover:bg-[#c4a574] transition-colors">
                  <Mail className="w-4 h-4 group-hover:text-white" />
                </div>
                <span className="font-medium">info@ravella.com</span>
              </a>

              <div className="flex items-start gap-3 text-sm text-gray-700">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="font-medium leading-relaxed">
                  Jl. Industri No. 123
                  <br />
                  Jakarta Selatan, Indonesia
                </span>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h5 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                Ikuti Kami
              </h5>
              <div className="flex flex-wrap gap-3">
                {socialMedia.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className={`w-10 h-10 flex items-center justify-center rounded-full
                        bg-white border border-gray-300 text-gray-700
                        hover:text-white hover:border-transparent
                        transition-all duration-300 hover:scale-110 hover:shadow-lg
                        ${social.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wide">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-gray-700">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="font-medium hover:text-[#c4a574] transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c4a574] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Links */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wide">
              Customer
            </h4>
            <ul className="space-y-3 text-sm text-gray-700">
              {customerLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="font-medium hover:text-[#c4a574] transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c4a574] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Links */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wide">
              Products
            </h4>
            <ul className="space-y-3 text-sm text-gray-700">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="font-medium hover:text-[#c4a574] transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c4a574] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-400/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs sm:text-sm text-gray-700 font-medium text-center sm:text-left">
            © 2026 Ravella. All rights reserved. Made with ❤️ in Indonesia
          </p>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-gray-700 font-medium">
            <a
              href="/privacy"
              className="hover:text-[#c4a574] transition-colors"
            >
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-[#c4a574] transition-colors">
              Terms of Service
            </a>
            <a
              href="/cookies"
              className="hover:text-[#c4a574] transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
