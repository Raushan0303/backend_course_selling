/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  experimental: {
    esmExternals: 'loose', // This will help with pdfjs-dist import issues
  },
  images: {
    domains: ['randomuser.me', 'avatars.githubusercontent.com'],
  },
  transpilePackages: ['framer-motion'],
};

export default nextConfig;
