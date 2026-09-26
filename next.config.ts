import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  logging: {
    browserToTerminal: false,
  },
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/junior-golf/junior-academy/junior-academy-terms",
        destination: "/juniors/academy-terms",
        permanent: true,
      },
      {
        source: "/junior-golf/junior-academy/junior-academy-terms/",
        destination: "/juniors/academy-terms",
        permanent: true,
      },
      {
        source: "/jamfees",
        destination: "/juniors/academy-terms#monthly-schedules",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
