import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['your-image-domain.com'], // 'res.cloudinary.com'
  },
  experimental: {
    turbo: false, // writeFileを使うため、Turbopackを無効にしてWebpackを使用
  }
};

export default nextConfig;
