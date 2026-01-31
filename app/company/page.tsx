"use client";

import {
  Award,
  Users,
  Globe,
  TrendingUp,
  Heart,
  Shield,
  Sparkles,
  Target,
  Zap,
  Star,
  CheckCircle,
  ArrowRight,
  Quote,
  MapPin,
  Mail,
  Phone,
  Package,
  Palette,
  MessageCircle,
  Handshake,
} from "lucide-react";
import { useState } from "react";
import Header from "../HomePage/components/Header";
import Footer from "../HomePage/Footer";

export default function Company() {
  const [activeTimeline, setActiveTimeline] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "700ms" }} />

        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full mb-6 hover:bg-white/20 transition-all">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-white font-bold text-sm uppercase tracking-wide">
                About Ravella
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Kitchen Innovation{" "}
              <span className="block mt-2 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Since 2020
              </span>
            </h1>
            <p className="text-gray-200 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
              Providing premium quality kitchen appliances with modern and
              innovative designs to make your cooking activities easier
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-bold hover:shadow-2xl hover:scale-105 transition-all">
                Contact Us
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full font-bold hover:bg-white/20 transition-all">
                View Products
              </button>
            </div>
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
        {/* Company Story */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-start">
            {/* Left Side - Images */}
            <div className="relative space-y-6">
              {/* Main Kitchen Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80"
                  alt="Ravella Kitchen Setup"
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Product Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl h-64 sm:h-80 lg:h-72 group">
                <img
                  src="https://cdn.shopify.com/s/files/1/0931/2382/files/Products_A2_480x480.gif?v=1718387274"
                  alt="Ravella Products"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Floating Rating Badge */}
              <div className="absolute top-6 right-6 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-white fill-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-gray-900">4.8</div>
                    <div className="text-xs text-gray-600">Rating</div>
                  </div>
                </div>
              </div>

              {/* Decorative Element */}
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full blur-3xl opacity-50 -z-10" />
            </div>

            {/* Right Side - Content */}
            <div className="space-y-6 lg:space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full">
                <Quote className="w-4 h-4 text-orange-600" />
                <span className="text-orange-600 font-bold text-sm">
                  Our Story
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1]">
                Improve the{" "}
                <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  Living Quality
                </span>
              </h2>

              <div className="space-y-6">
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  Since its debut in{" "}
                  <span className="font-bold text-orange-600">2020</span>,
                  RAVELLE has continued to improve the living quality of
                  Indonesian families especially during the pandemic time by
                  consistently carrying these values in all of its products:
                </p>

                {/* Core Values List */}
                <div className="bg-gradient-to-br from-orange-50 via-pink-50/80 to-purple-50/60 rounded-2xl p-6 sm:p-8 border-2 border-orange-100/50 shadow-sm">
                  <ul className="space-y-3">
                    {[
                      "Quality everyday life",
                      "Joyful experience",
                      "Inner strength and independency",
                      "Honesty and communicative",
                      "Clarity and transparency",
                    ].map((value, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-gray-800"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-600 flex-shrink-0 mt-2.5" />
                        <span className="text-base sm:text-lg font-medium">
                          {value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Excellence Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              Ravelle{" "}
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Product
              </span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
              These values are consistently translated into all RAVELLE products
              through:
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="space-y-4">
              {[
                {
                  text: "Modern and innovative product designs.",
                  icon: Sparkles,
                  gradient: "from-orange-500 to-pink-500",
                },
                {
                  text: "Colourful, creative and unique shapes and sizes",
                  icon: Palette,
                  gradient: "from-pink-500 to-purple-500",
                },
                {
                  text: "Excellent built quality for product durability.",
                  icon: Shield,
                  gradient: "from-purple-500 to-blue-500",
                },
                {
                  text: "Open and positive product communications to convey accurate information.",
                  icon: MessageCircle,
                  gradient: "from-blue-500 to-cyan-500",
                },
                {
                  text: "Responsive customer service combined with excellent product knowledge for better customer piece of mind.",
                  icon: Users,
                  gradient: "from-cyan-500 to-teal-500",
                },
                {
                  text: "Fostering good and ethical working relationship with our business partners and customers alike.",
                  icon: Handshake,
                  gradient: "from-teal-500 to-green-500",
                },
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={i}
                    className="group flex items-start gap-4 sm:gap-6 bg-white rounded-2xl p-5 sm:p-6 md:p-7 border-2 border-gray-100 hover:border-orange-200 transition-all hover:shadow-lg"
                  >
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md`}
                    >
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-600 flex-shrink-0 mt-2.5" />
                        <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                          {feature.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-2xl">
            {/* Animated Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1000ms" }} />

            <div className="relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
                  Proud Achievements
                </h2>
                <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
                  Numbers that prove our dedication to delivering the best
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {[
                  {
                    icon: Users,
                    value: "10,000+",
                    label: "Happy Customers",
                    color: "from-orange-400 to-orange-600",
                  },
                  {
                    icon: Award,
                    value: "6+",
                    label: "Years Experience",
                    color: "from-pink-400 to-pink-600",
                  },
                  {
                    icon: Globe,
                    value: "50+",
                    label: "Cities in Indonesia",
                    color: "from-purple-400 to-purple-600",
                  },
                  {
                    icon: TrendingUp,
                    value: "99%",
                    label: "Customer Satisfaction",
                    color: "from-blue-400 to-blue-600",
                  },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="text-center group">
                      <div
                        className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}
                      >
                        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm sm:text-base text-gray-300 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Vision &{" "}
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Mission
              </span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Our goals and direction to create positive impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {/* Vision */}
            <div className="group relative bg-gradient-to-br from-orange-500 to-pink-500 rounded-3xl p-8 sm:p-10 md:p-12 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black mb-4">Vision</h3>
                <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                  To become the leading kitchen appliance brand in Indonesia,
                  known for innovation, premium quality, and high customer trust
                  by 2030.
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="group relative bg-white rounded-3xl p-8 sm:p-10 md:p-12 border-2 border-gray-100 hover:border-orange-200 transition-all hover:shadow-2xl overflow-hidden">
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-50 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">
                  Mission
                </h3>
                <ul className="space-y-3 text-gray-700 text-base sm:text-lg">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                    <span>Deliver innovative high-quality products</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                    <span>Provide best-in-class customer service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                    <span>Continuously innovate based on market needs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Our{" "}
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Journey
              </span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Important milestones we've achieved since our inception
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-pink-500 to-purple-500" />

            <div className="space-y-12">
              {[
                {
                  year: "2020",
                  title: "RAVELLE Founded",
                  description:
                    "Started our journey with a vision to provide quality kitchen appliances for every Indonesian home.",
                  icon: Star,
                },
                {
                  year: "2021",
                  title: "Product Expansion",
                  description:
                    "Launched complete product lines including rice cookers, blenders, and juicers with modern technology.",
                  icon: TrendingUp,
                },
                {
                  year: "2023",
                  title: "10,000+ Customers",
                  description:
                    "Reached milestone of 10,000+ satisfied customers across Indonesia with 4.8/5 rating.",
                  icon: Users,
                },
                {
                  year: "2024",
                  title: "Quality Award",
                  description:
                    "Received 'Best Kitchen Appliance Brand' award from Indonesia Home & Living Awards.",
                  icon: Award,
                },
                {
                  year: "2026",
                  title: "Continuous Innovation",
                  description:
                    "Launching smart kitchen appliances with IoT technology for the kitchen of the future.",
                  icon: Zap,
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className={`relative flex items-center gap-8 ${
                      i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                    }`}
                    onMouseEnter={() => setActiveTimeline(i)}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-8 sm:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 border-4 border-white shadow-lg z-10" />

                    {/* Content */}
                    <div
                      className={`flex-1 ${i % 2 === 0 ? "sm:text-right" : "sm:text-left"} ml-20 sm:ml-0`}
                    >
                      <div
                        className={`group bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 ${
                          activeTimeline === i
                            ? "scale-105 border-orange-300"
                            : ""
                        }`}
                      >
                        <div
                          className={`flex items-center gap-4 mb-4 ${i % 2 === 0 ? "sm:justify-end" : "sm:justify-start"}`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-3xl font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                            {item.year}
                          </div>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden sm:block flex-1" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}