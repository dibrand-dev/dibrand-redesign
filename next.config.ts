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
    return [
      {
        source: '/software-development',
        destination: '/software-outsourcing',
        permanent: true,
      },
      {
        source: '/en/software-development',
        destination: '/en/software-outsourcing',
        permanent: true,
      },
      {
        source: '/es/software-development',
        destination: '/es/software-outsourcing',
        permanent: true,
      }
    ];
  },
  async rewrites() {
    return [
      {
        source: '/terms-of-service',
        destination: '/en/terms',
      },
      {
        source: '/es/terminos-del-servicio',
        destination: '/es/terms',
      },
      {
        source: '/privacy-policy',
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
