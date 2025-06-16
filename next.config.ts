import type { NextConfig } from 'next';

import './env/server';

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: { typedRoutes: true },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**', // Or a more specific path if needed, but /a/** is common for Google profile pics
      },
    ],
  },
};

export default nextConfig;
