/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  reactStrictMode: true, // Change this to false if you want to disable Strict Mode temporarily
};

module.exports = nextConfig;
