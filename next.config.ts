import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 클라우드플레어 Pages 최적화 - 정적 배포용
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // 환경변수 설정
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // 빌드 최적화
  experimental: {
    optimizeCss: true,
  },
  
  // 컴파일러 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 헤더 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // 리다이렉트 설정
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
      // 법적 페이지 trailing slash 통일
      {
        source: '/terms',
        destination: '/terms/',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/privacy/',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/about/',
        permanent: true,
      },
      {
        source: '/data-source',
        destination: '/data-source/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
