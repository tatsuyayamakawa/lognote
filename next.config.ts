import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 応急処置: Vercelの画像最適化上限に達したため、最適化を無効化
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "lognote.biz",
        port: "",
        pathname: "/api/og",
      },
    ],
    localPatterns: [
      {
        pathname: "/api/og",
        search: "**",
      },
      {
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
