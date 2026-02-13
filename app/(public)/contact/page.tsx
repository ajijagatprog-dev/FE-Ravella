"use client";

import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Sparkles,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  CheckCircle,
  ArrowRight,
  User,
  Zap,
  Shield,
  HeadphonesIcon,
} from "lucide-react";
import { useState } from "react";
import Header from "../../HomePage/components/Header";
import Footer from "../../HomePage/components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      info: "+62 21 1234 5678",
      subInfo: "Mon-Fri 9AM-6PM",
      gradient: "from-orange-500 to-pink-500",
      href: "tel:+622112345678",
    },
    {
      icon: Mail,
      title: "Email",
      info: "hello@ravella.co.id",
      subInfo: "24/7 Support",
      gradient: "from-pink-500 to-purple-500",
      href: "mailto:hello@ravella.co.id",
    },
    {
      icon: MapPin,
      title: "Head Office",
      info: "Jl. Sudirman No. 123",
      subInfo: "Jakarta Pusat 10220",
      gradient: "from-purple-500 to-blue-500",
      href: "#map",
    },
    {
      icon: Clock,
      title: "Working Hours",
      info: "Mon - Fri: 9AM - 6PM",
      subInfo: "Sat: 9AM - 3PM",
      gradient: "from-blue-500 to-cyan-500",
      href: null,
    },
  ];

  const socialMedia = [
    {
      icon: Instagram,
      name: "Instagram",
      handle: "@ravella.id",
      color: "hover:bg-pink-600",
      url: "#",
    },
    {
      icon: Facebook,
      name: "Facebook",
      handle: "Ravella Indonesia",
      color: "hover:bg-blue-600",
      url: "#",
    },
    {
      icon: Twitter,
      name: "Twitter",
      handle: "@ravella_id",
      color: "hover:bg-sky-500",
      url: "#",
    },
    {
      icon: Youtube,
      name: "Youtube",
      handle: "Ravella Official",
      color: "hover:bg-red-600",
      url: "#",
    },
  ];

  const faqs = [
    {
      question: "Berapa lama pengiriman produk?",
      answer:
        "Pengiriman reguler memakan waktu 2-3 hari kerja. Untuk same-day delivery tersedia di area Jakarta dan sekitarnya.",
    },
    {
      question: "Apakah produk memiliki garansi?",
      answer:
        "Ya, semua produk Ravella dilengkapi dengan garansi resmi 1 tahun. Garansi mencakup kerusakan manufaktur dan dapat diklaim di service center kami.",
    },
    {
      question: "Bagaimana cara melakukan retur produk?",
      answer:
        "Retur dapat dilakukan dalam 7 hari setelah produk diterima. Hubungi customer service kami untuk proses retur dan pengembalian dana.",
    },
    {
      question: "Apakah tersedia pembayaran cicilan?",
      answer:
        "Ya, kami menyediakan berbagai opsi pembayaran cicilan melalui kartu kredit dan platform payment partner kami dengan tenor 3, 6, atau 12 bulan.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[400px] sm:h-[450px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "700ms" }}
        />

        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full mb-6 hover:bg-white/20 transition-all">
              <MessageCircle className="w-4 h-4 text-orange-400" />
              <span className="text-white font-bold text-sm uppercase tracking-wide">
                GET IN TOUCH
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Contact{" "}
              <span className="block mt-2 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Ravella
              </span>
            </h1>

            <p className="text-gray-200 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              We're here to help! Reach out to us for any questions, support, or
              feedback
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40">
        {/* Contact Info Cards */}
        <section className="py-16 sm:py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href={item.href || "#"}
                  className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-gray-100 hover:border-orange-200"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}
                    >
                      <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-base font-semibold text-gray-700 mb-1">
                      {item.info}
                    </p>
                    <p className="text-sm text-gray-500">{item.subInfo}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Contact Form & Map Section */}
        <section className="py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16">
            {/* Contact Form */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full mb-6">
                  <Send className="w-4 h-4 text-orange-600" />
                  <span className="text-orange-600 font-bold text-sm">
                    Send Message
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
                  Let's{" "}
                  <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                    Connect
                  </span>
                </h2>

                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  Fill out the form below and our team will get back to you
                  within 24 hours.
                </p>
              </div>

              {/* Success Message */}
              {submitSuccess && (
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-900">
                      Message Sent Successfully!
                    </p>
                    <p className="text-sm text-emerald-700">
                      We'll get back to you soon.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your full name"
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your@email.com"
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+62 xxx xxxx xxxx"
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 cursor-pointer"
                  >
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
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder="Tell us how we can help you..."
                    className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              {/* Map */}
              <div
                className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-100"
                id="map"
              >
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
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        Visit Our Office
                      </p>
                      <p className="text-sm text-gray-600">Jakarta Pusat</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl" />

                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-white mb-4">
                    Follow Us
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Stay connected and get the latest updates
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {socialMedia.map((social, idx) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={idx}
                          href={social.url}
                          className={`group flex items-center gap-3 p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 hover:bg-white/20 transition-all ${social.color}`}
                        >
                          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-white text-sm">
                              {social.name}
                            </p>
                            <p className="text-xs text-gray-300 truncate">
                              {social.handle}
                            </p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-100 rounded-full mb-6">
              <HeadphonesIcon className="w-4 h-4 text-purple-600" />
              <span className="text-purple-600 font-bold text-sm">
                FREQUENTLY ASKED
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Common{" "}
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Find answers to the most frequently asked questions
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white rounded-2xl border-2 border-gray-100 hover:border-orange-200 transition-all shadow-sm hover:shadow-lg overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-lg font-bold text-gray-900 pr-8">
                    {faq.question}
                  </h3>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center flex-shrink-0 group-open:rotate-180 transition-transform">
                    <ArrowRight className="w-5 h-5 text-white rotate-90" />
                  </div>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
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
