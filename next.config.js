/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/aida-public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.ravelle.co.id",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "api.ravelle.exaapk.com",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "api.ravelle.exaapk.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ravelle.sikema.web.id",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "ravelle.sikema.web.id",
        pathname: "/storage/**",
      },
    ],
  },
};

module.exports = nextConfig;
