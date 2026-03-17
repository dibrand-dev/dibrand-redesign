import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mdvyvqphumrciekgjlfb.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [];
  },
  async rewrites() {
    return [
      // Terms of Service
      {
        source: '/terms-of-service',
        destination: '/en/terms',
      },
      {
        source: '/en/terms-of-service',
        destination: '/en/terms',
      },
      {
        source: '/es/terminos-del-servicio',
        destination: '/es/terms',
      },
      // Privacy Policy
      {
        source: '/privacy-policy',
        destination: '/en/privacy',
      },
      {
        source: '/en/privacy-policy',
        destination: '/en/privacy',
      },
      {
        source: '/es/politica-de-privacidad',
        destination: '/es/privacy',
      }
    ];
  },

};

export default nextConfig;
