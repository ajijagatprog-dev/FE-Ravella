"use client";

import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Navigation,
  ChevronRight,
  Wrench,
  Shield,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import Header from "../../HomePage/components/Header";
import Footer from "../../HomePage/components/Footer";

interface ServiceLocation {
  city: string;
  address: string;
  phone: string;
  phoneType: string;
  mapUrl: string;
  mapEmbedUrl: string;
}

export default function ServiceCenterPage() {
  const [activeLocation, setActiveLocation] = useState<number | null>(null);

  const serviceLocations: ServiceLocation[] = [
    {
      city: "JAKARTA 1",
      address:
        "Ruko Cempaka Mas, Jl. Cempaka Mas Selatan, Blok J No. 35, Sumur Batu, Kec Kemayoran, Jakarta Pusat",
      phone: "0838 7100 3555",
      phoneType: "Telp",
      mapUrl: "https://maps.google.com/?q=Cempaka+Mas+Jakarta",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.4!2d106.87!3d-6.17!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCempaka+Mas!5e0!3m2!1sid!2sid",
    },
    {
      city: "JAKARTA 2",
      address:
        "Jl. Mitra Sunter Boulevard Blok No. A23 – A26, Sunter Jaya, Kec. Tj. Priok, Jakarta",
      phone: "0819 7785 8826",
      phoneType: "WA Only",
      mapUrl: "https://maps.google.com/?q=Mitra+Sunter+Boulevard+Jakarta",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2!2d106.87!3d-6.14!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSunter+Boulevard!5e0!3m2!1sid!2sid",
    },
    {
      city: "SEMARANG",
      address:
        "Jl. Airlangga Timur, No. 15B, Pleburan, Semarang Selatan, Jawa Tengah",
      phone: "0812 8884 7820",
      phoneType: "Telp",
      mapUrl: "https://maps.google.com/?q=Pleburan+Semarang",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.5!2d110.41!3d-6.99!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPleburan+Semarang!5e0!3m2!1sid!2sid",
    },
    {
      city: "SURABAYA",
      address:
        "Jl. Biliton No. 43 A Gubeng, Kec Gubeng, Kota Surabaya, Jawa Timur",
      phone: "0851 6277 6788",
      phoneType: "Telp",
      mapUrl: "https://maps.google.com/?q=Gubeng+Surabaya",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.6!2d112.75!3d-7.27!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sGubeng+Surabaya!5e0!3m2!1sid!2sid",
    },
  ];

  const serviceFeatures = [
    {
      icon: Wrench,
      title: "Perbaikan Profesional",
      desc: "Teknisi berpengalaman siap menangani semua produk Ravelle Anda",
    },
    {
      icon: Shield,
      title: "Garansi Resmi",
      desc: "Layanan servis bergaransi dengan suku cadang original",
    },
    {
      icon: Headphones,
      title: "Konsultasi Gratis",
      desc: "Konsultasi dan diagnosa awal tanpa biaya untuk semua pelanggan",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── HERO BANNER ── */}
      <section className="relative h-[380px] sm:h-[440px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/ServiceCenter/service-center.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        <div className="relative z-10 h-full flex items-center px-6 md:px-16 lg:px-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-5 h-[1px] bg-white/50" />
              <span className="text-white/70 font-medium text-[11px] uppercase tracking-[0.25em]">
                Ravelle Indonesia
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Service <span className="font-normal">Center</span>
            </h1>

            <div className="w-10 h-[1px] bg-white/30 mb-5" />

            <p className="text-white/70 text-sm sm:text-base font-light leading-relaxed max-w-lg">
              Temukan layanan servis resmi Ravelle terdekat di kota Anda.
              Teknisi profesional siap membantu perawatan dan perbaikan produk
              Anda.
            </p>
          </div>
        </div>
      </section>

      {/* ── SERVICE FEATURES ── */}
      <section className="border-b border-neutral-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40">
          <div className="grid sm:grid-cols-3 gap-px bg-neutral-100">
            {serviceFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="group bg-white p-8 sm:p-10 hover:bg-neutral-50 transition-colors duration-300 text-center"
                >
                  <div className="w-12 h-12 mx-auto flex items-center justify-center border border-neutral-200 mb-5 group-hover:bg-neutral-900 group-hover:border-neutral-900 transition-all duration-300">
                    <Icon className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-2 tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── LOCATIONS SECTION ── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40">
        <section className="py-16 sm:py-24">
          {/* Section Header */}
          <div className="text-center mb-14 sm:mb-20">
            <div className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-5 h-[1px] bg-neutral-400" />
              <span className="text-neutral-500 font-medium text-[11px] uppercase tracking-[0.25em]">
                Our Locations
              </span>
              <div className="w-5 h-[1px] bg-neutral-400" />
            </div>

            <h2
              className="text-4xl sm:text-5xl font-light text-neutral-900 mb-3 leading-[1.05]"
              style={{ letterSpacing: "-0.01em" }}
            >
              Find Our{" "}
              <em
                className="font-semibold not-italic"
                style={{ fontStyle: "italic" }}
              >
                Service Center
              </em>
            </h2>

            <div className="flex justify-center mb-4">
              <div className="w-8 h-[1px] bg-neutral-200" />
            </div>

            <p className="text-neutral-500 text-sm font-light max-w-xl mx-auto leading-relaxed">
              Kunjungi service center resmi Ravelle terdekat di kota Anda untuk
              layanan perbaikan, perawatan, dan konsultasi produk.
            </p>
          </div>

          {/* Location Cards Grid */}
          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            {serviceLocations.map((location, idx) => (
              <div
                key={idx}
                className="group border border-neutral-100 hover:border-neutral-300 transition-all duration-500 overflow-hidden"
                onMouseEnter={() => setActiveLocation(idx)}
                onMouseLeave={() => setActiveLocation(null)}
              >
                {/* Card Header */}
                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <div className="inline-flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-neutral-900 text-white">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-medium">
                          Service Center
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-wide">
                        {location.city}
                      </h3>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center border border-neutral-200 group-hover:bg-neutral-900 group-hover:border-neutral-900 transition-all duration-300 flex-shrink-0 mt-2">
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3 mb-4">
                    <Navigation className="w-3.5 h-3.5 text-neutral-300 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-neutral-500 font-light leading-relaxed">
                      {location.address}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-[1px] bg-neutral-100 mb-4" />

                  {/* Contact & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <a
                      href={`tel:${location.phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-2.5 group/phone"
                    >
                      <div className="w-8 h-8 flex items-center justify-center border border-neutral-200 group-hover/phone:bg-neutral-900 group-hover/phone:border-neutral-900 transition-all duration-300">
                        <Phone className="w-3.5 h-3.5 text-neutral-500 group-hover/phone:text-white transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">
                          {location.phone}
                        </p>
                        <p className="text-[10px] text-neutral-400 font-light uppercase tracking-wider">
                          ({location.phoneType})
                        </p>
                      </div>
                    </a>

                    <a
                      href={location.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-neutral-500 hover:text-neutral-900 font-medium transition-colors group/dir"
                    >
                      <span>Directions</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover/dir:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Embedded Map */}
                <div
                  className="relative overflow-hidden transition-all duration-500"
                  style={{
                    height: activeLocation === idx ? "200px" : "0px",
                  }}
                >
                  <iframe
                    src={location.mapEmbedUrl}
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── OPERATING HOURS ── */}
        <section className="py-16 sm:py-20 border-t border-neutral-100">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left - Info */}
            <div>
              <div className="inline-flex items-center gap-2.5 mb-5">
                <div className="w-5 h-[1px] bg-neutral-400" />
                <span className="text-neutral-500 font-medium text-[11px] uppercase tracking-[0.25em]">
                  Operating Hours
                </span>
              </div>

              <h2
                className="text-4xl sm:text-5xl font-light text-neutral-900 mb-3 leading-[1.05]"
                style={{ letterSpacing: "-0.01em" }}
              >
                Jam{" "}
                <em
                  className="font-semibold not-italic"
                  style={{ fontStyle: "italic" }}
                >
                  Operasional
                </em>
              </h2>

              <div className="w-8 h-[1px] bg-neutral-200 mb-5" />

              <p className="text-neutral-500 text-sm font-light leading-relaxed mb-8 max-w-md">
                Seluruh service center Ravelle beroperasi pada jam kerja
                berikut. Kami menyarankan untuk menghubungi terlebih dahulu
                sebelum berkunjung.
              </p>

              {/* Schedule */}
              <div className="space-y-3">
                {[
                  { day: "Senin – Jumat", time: "09:00 – 17:00 WIB" },
                  { day: "Sabtu", time: "09:00 – 14:00 WIB" },
                  { day: "Minggu & Hari Libur", time: "Tutup" },
                ].map((schedule, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-4 px-5 border border-neutral-100 hover:border-neutral-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm font-medium text-neutral-900">
                        {schedule.day}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-light ${schedule.time === "Tutup" ? "text-red-400" : "text-neutral-500"}`}
                    >
                      {schedule.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - CTA */}
            <div className="flex flex-col justify-center">
              <div className="bg-neutral-900 p-8 sm:p-10">
                <div className="w-12 h-12 flex items-center justify-center border border-white/20 mb-6">
                  <MessageCircle className="w-5 h-5 text-white/70" />
                </div>

                <p className="text-[11px] tracking-[0.22em] uppercase text-white/40 font-medium mb-2">
                  Butuh Bantuan?
                </p>

                <h3 className="text-2xl sm:text-3xl font-light text-white mb-2">
                  Hubungi <em style={{ fontStyle: "italic" }}>Customer Care</em>
                </h3>

                <div className="w-6 h-[1px] bg-white/20 mb-5" />

                <p className="text-white/45 text-sm font-light mb-8 leading-relaxed">
                  Tim customer care kami siap membantu Anda melalui WhatsApp
                  atau telepon untuk informasi lebih lanjut mengenai layanan
                  service center.
                </p>

                <div className="space-y-3">
                  <a
                    href="https://wa.me/628197858826"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-green-500/20 border border-green-400/30">
                      <MessageCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] tracking-[0.12em] uppercase text-white font-medium">
                        WhatsApp
                      </p>
                      <p className="text-[10px] text-white/40 font-light">
                        Chat langsung dengan CS kami
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all" />
                  </a>

                  <a
                    href="tel:+62838710035555"
                    className="group flex items-center gap-4 p-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-blue-500/20 border border-blue-400/30">
                      <Phone className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] tracking-[0.12em] uppercase text-white font-medium">
                        Telepon
                      </p>
                      <p className="text-[10px] text-white/40 font-light">
                        Hubungi hotline service center
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
