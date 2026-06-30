/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ]
  },
  env: {
    NEXT_PUBLIC_RAZORPAY_KEY: process.env.RAZORPAY_KEY || 'rzp_test_xxxxx'
  }
};

module.exports = nextConfig;
