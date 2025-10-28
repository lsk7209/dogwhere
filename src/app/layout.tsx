import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: '어서오개 - 강아지 동반 장소 추천',
    template: '%s | 어서오개'
  },
  description: "전국 강아지 동반 가능한 카페, 공원, 호텔, 식당을 추천해드립니다.",
  keywords: "강아지 동반, 반려견, 카페, 공원, 호텔, 식당, 추천",
  authors: [{ name: '어서오개 팀' }],
  creator: '어서오개',
  publisher: '어서오개',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://dogswhere.com'),
  openGraph: {
    title: "어서오개 - 강아지 동반 장소 추천",
    description: "전국 강아지 동반 가능한 카페, 공원, 호텔, 식당을 추천해드립니다.",
    type: "website",
    locale: "ko_KR",
    siteName: '어서오개',
  },
  twitter: {
    card: 'summary_large_image',
    title: '어서오개 - 강아지 동반 장소 추천',
    description: '전국 강아지 동반 가능한 카페, 공원, 호텔, 식당을 추천해드립니다.',
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [
        { url: '/rss.xml', title: '어서오개 전체 RSS' },
        { url: '/rss-blog.xml', title: '어서오개 블로그 RSS' },
        { url: '/rss-guide.xml', title: '어서오개 가이드 RSS' },
      ],
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="naver-site-verification" content="de812d24cc21601e61c8a2af4b42d13fc2b5097f" />
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3050601904412736"
          crossOrigin="anonymous"
        ></script>
        
        {/* Pretendard 폰트 */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css" 
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pt-16">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
