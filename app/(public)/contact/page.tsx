"use client";

import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  CheckCircle,
  ArrowRight,
  User,
  HeadphonesIcon,
} from "lucide-react";
import { useState } from "react";
import Header from "../../HomePage/components/Header";
import Footer from "../../HomePage/components/Footer";

const JOST = "'Jost', system-ui, sans-serif";
const CORMORANT = "'Cormorant Garamond', Georgia, serif";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 2000);
  };

  const contactInfo = [
    { icon: Phone, title: "Phone", info: "+62 21 1234 5678", subInfo: "Mon–Fri 9AM–6PM", href: "tel:+622112345678" },
    { icon: Mail, title: "Email", info: "hello@ravelle.co.id", subInfo: "24/7 Support", href: "mailto:hello@ravelle.co.id" },
    { icon: MapPin, title: "Head Office", info: "Jl. Sudirman No. 123", subInfo: "Jakarta Pusat 10220", href: "#map" },
    { icon: Clock, title: "Working Hours", info: "Mon–Fri: 9AM–6PM", subInfo: "Sat: 9AM–3PM", href: null },
  ];

  const socialMedia = [
    { icon: Instagram, name: "Instagram", handle: "@ravelle.id", url: "#" },
    { icon: Facebook, name: "Facebook", handle: "Ravelle Indonesia", url: "#" },
    { icon: Twitter, name: "Twitter", handle: "@ravelle_id", url: "#" },
    { icon: Youtube, name: "Youtube", handle: "Ravelle Official", url: "#" },
  ];

  const faqs = [
    { question: "Berapa lama pengiriman produk?", answer: "Pengiriman reguler memakan waktu 2–3 hari kerja. Untuk same-day delivery tersedia di area Jakarta dan sekitarnya." },
    { question: "Apakah produk memiliki garansi?", answer: "Ya, semua produk Ravelle dilengkapi dengan garansi resmi 1 tahun. Garansi mencakup kerusakan manufaktur dan dapat diklaim di service center kami." },
    { question: "Bagaimana cara melakukan retur produk?", answer: "Retur dapat dilakukan dalam 7 hari setelah produk diterima. Hubungi customer service kami untuk proses retur dan pengembalian dana." },
    { question: "Apakah tersedia pembayaran cicilan?", answer: "Ya, kami menyediakan berbagai opsi pembayaran cicilan melalui kartu kredit dan platform payment partner kami dengan tenor 3, 6, atau 12 bulan." },
  ];

  const inputClass = "w-full px-4 py-3.5 bg-white border border-neutral-200 focus:border-neutral-800 focus:outline-none transition-colors text-neutral-900 placeholder:text-neutral-400 text-sm font-light";

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: JOST }}>
      <Header />

      {/* ── HERO ── */}
      <section className="relative h-[380px] sm:h-[440px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80)" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        <div className="relative z-10 h-full flex items-center px-6 md:px-16 lg:px-24">
          <div className="max-w-2xl">

            <div className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-5 h-[1px] bg-white/50" />
              <span className="text-white/70 font-medium text-[11px] uppercase tracking-[0.25em]" style={{ fontFamily: JOST }}>
                Get in Touch
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-4 leading-[1.05]" style={{ fontFamily: CORMORANT, letterSpacing: "-0.01em" }}>
              Contact{" "}
              <em className="font-semibold not-italic" style={{ fontStyle: "italic" }}>
                Ravelle
              </em>
            </h1>

            <div className="w-10 h-[1px] bg-white/30 mb-5" />

            <p className="text-white/70 text-sm sm:text-base font-light leading-relaxed max-w-lg" style={{ fontFamily: JOST }}>
              We're here to help! Reach out to us for any questions, support, or feedback.
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 border border-white/30 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── MAIN ── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40">

        {/* ── CONTACT INFO CARDS ── */}
        <section className="py-16 sm:py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-100">
            {contactInfo.map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href={item.href || "#"}
                  className="group bg-white p-6 sm:p-8 hover:bg-neutral-50 transition-colors duration-300"
                >
                  <div className="w-10 h-10 flex items-center justify-center border border-neutral-200 mb-5 group-hover:bg-neutral-900 group-hover:border-neutral-900 transition-all duration-300">
                    <Icon className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 font-medium mb-2" style={{ fontFamily: JOST }}>
                    {item.title}
                  </p>
                  <p className="text-base font-medium text-neutral-900 mb-1" style={{ fontFamily: JOST }}>
                    {item.info}
                  </p>
                  <p className="text-sm text-neutral-400 font-light" style={{ fontFamily: JOST }}>
                    {item.subInfo}
                  </p>
                </a>
              );
            })}
          </div>
        </section>

        {/* ── FORM & MAP ── */}
        <section className="py-16 sm:py-20 border-t border-neutral-100">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Contact Form */}
            <div className="space-y-8">

              {/* Heading */}
              <div>
                <div className="inline-flex items-center gap-2.5 mb-5">
                  <div className="w-5 h-[1px] bg-neutral-400" />
                  <span className="text-neutral-500 font-medium text-[11px] uppercase tracking-[0.25em]" style={{ fontFamily: JOST }}>
                    Send Message
                  </span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-light text-neutral-900 mb-3 leading-[1.05]" style={{ fontFamily: CORMORANT, letterSpacing: "-0.01em" }}>
                  Let's{" "}
                  <em className="font-semibold not-italic" style={{ fontStyle: "italic" }}>
                    Connect
                  </em>
                </h2>
                <div className="w-8 h-[1px] bg-neutral-200 mb-4" />
                <p className="text-neutral-500 text-sm font-light leading-relaxed" style={{ fontFamily: JOST }}>
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>
              </div>

              {/* Success Message */}
              {submitSuccess && (
                <div className="flex items-center gap-3 p-4 border border-neutral-200 bg-neutral-50" style={{ fontFamily: JOST }}>
                  <CheckCircle className="w-5 h-5 text-neutral-700 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-neutral-900 text-sm">Pesan Terkirim</p>
                    <p className="text-xs text-neutral-500 font-light">Kami akan menghubungi Anda segera.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Name */}
                <div>
                  <label className="block text-[11px] tracking-[0.15em] uppercase text-neutral-500 font-medium mb-2" style={{ fontFamily: JOST }}>
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Your full name" className={`${inputClass} pl-11`} style={{ fontFamily: JOST }} />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] tracking-[0.15em] uppercase text-neutral-500 font-medium mb-2" style={{ fontFamily: JOST }}>
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="your@email.com" className={`${inputClass} pl-11`} style={{ fontFamily: JOST }} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.15em] uppercase text-neutral-500 font-medium mb-2" style={{ fontFamily: JOST }}>
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+62 xxx xxxx xxxx" className={`${inputClass} pl-11`} style={{ fontFamily: JOST }} />
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-[11px] tracking-[0.15em] uppercase text-neutral-500 font-medium mb-2" style={{ fontFamily: JOST }}>
                    Subject *
                  </label>
                  <select name="subject" value={formData.subject} onChange={handleInputChange} required className={inputClass} style={{ fontFamily: JOST }}>
                    <option value="">Select a subject</option>
                    <option value="product">Product Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="sales">Sales Question</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[11px] tracking-[0.15em] uppercase text-neutral-500 font-medium mb-2" style={{ fontFamily: JOST }}>
                    Message *
                  </label>
                  <textarea name="message" value={formData.message} onChange={handleInputChange} required rows={6} placeholder="Tell us how we can help you..." className={inputClass + " resize-none"} style={{ fontFamily: JOST }} />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-neutral-900 text-white text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 group"
                  style={{ fontFamily: JOST }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map & Social */}
            <div className="space-y-6">

              {/* Map */}
              <div className="relative h-[380px] lg:h-[440px] overflow-hidden border border-neutral-100" id="map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.1944491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0e9bcc8!2sJl.%20Jend.%20Sudirman%2C%20Jakarta!5e0!3m2!1sen!2sid!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute top-4 left-4 bg-white border border-neutral-100 px-4 py-3 shadow-md">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-neutral-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-neutral-900 tracking-wide" style={{ fontFamily: JOST }}>Visit Our Office</p>
                      <p className="text-[11px] text-neutral-400 font-light" style={{ fontFamily: JOST }}>Jakarta Pusat</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-neutral-900 p-7">
                <p className="text-[11px] tracking-[0.22em] uppercase text-white/40 font-medium mb-1" style={{ fontFamily: JOST }}>
                  Follow Us
                </p>
                <h3 className="text-3xl font-light text-white mb-1" style={{ fontFamily: CORMORANT }}>
                  Stay <em style={{ fontStyle: "italic" }}>Connected</em>
                </h3>
                <div className="w-6 h-[1px] bg-white/20 mb-5" />
                <p className="text-white/45 text-sm font-light mb-6" style={{ fontFamily: JOST }}>
                  Get the latest updates and tips.
                </p>

                <div className="grid grid-cols-2 gap-px bg-white/10">
                  {socialMedia.map((social, idx) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={idx}
                        href={social.url}
                        className="group flex items-center gap-3 p-4 bg-neutral-900 hover:bg-neutral-800 transition-colors"
                      >
                        <div className="w-8 h-8 flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:border-white transition-all">
                          <Icon className="w-3.5 h-3.5 text-white/70 group-hover:text-neutral-900 transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] tracking-[0.12em] uppercase text-white font-medium" style={{ fontFamily: JOST }}>{social.name}</p>
                          <p className="text-[10px] text-white/40 font-light truncate" style={{ fontFamily: JOST }}>{social.handle}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 sm:py-20 border-t border-neutral-100">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-5 h-[1px] bg-neutral-400" />
              <span className="text-neutral-500 font-medium text-[11px] uppercase tracking-[0.25em]" style={{ fontFamily: JOST }}>
                FAQ
              </span>
              <div className="w-5 h-[1px] bg-neutral-400" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-light text-neutral-900 mb-3" style={{ fontFamily: CORMORANT, letterSpacing: "-0.01em" }}>
              Common{" "}
              <em className="font-semibold not-italic" style={{ fontStyle: "italic" }}>
                Questions
              </em>
            </h2>
            <div className="flex justify-center mb-4">
              <div className="w-8 h-[1px] bg-neutral-200" />
            </div>
            <p className="text-neutral-500 text-sm font-light max-w-xl mx-auto" style={{ fontFamily: JOST }}>
              Find answers to the most frequently asked questions
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-2">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group border border-neutral-100 hover:border-neutral-300 transition-colors overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none">
                  <h3 className="text-base font-medium text-neutral-900 pr-6" style={{ fontFamily: JOST }}>
                    {faq.question}
                  </h3>
                  <div className="w-7 h-7 flex items-center justify-center border border-neutral-200 flex-shrink-0 group-open:bg-neutral-900 group-open:border-neutral-900 transition-all">
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-open:text-white rotate-90 transition-colors" />
                  </div>
                </summary>
                <div className="px-6 pb-5 border-t border-neutral-100">
                  <p className="text-neutral-500 text-sm font-light leading-relaxed pt-4" style={{ fontFamily: JOST }}>
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}