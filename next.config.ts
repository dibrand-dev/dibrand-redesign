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
};

export default nextConfig;
