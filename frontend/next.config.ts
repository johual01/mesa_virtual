import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // output: 'export', // Comentado temporalmente para permitir funcionalidades dinámicas
  images: {
    unoptimized: true, // Necesario si se usa export más tarde
  },
};

export default nextConfig;
