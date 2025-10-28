import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "어서오개 - 강아지 동반 장소 추천",
  description: "전국 강아지 동반 가능한 카페, 공원, 호텔, 식당을 추천해드립니다.",
  keywords: "강아지 동반, 반려견, 카페, 공원, 호텔, 식당, 추천",
  openGraph: {
    title: "어서오개 - 강아지 동반 장소 추천",
    description: "전국 강아지 동반 가능한 카페, 공원, 호텔, 식당을 추천해드립니다.",
    type: "website",
    locale: "ko_KR",
  },
  alternates: {
    types: {
      'application/rss+xml': [
        { url: '/rss.xml', title: '어서오개 전체 RSS' },
        { url: '/rss-blog.xml', title: '어서오개 블로그 RSS' },
        { url: '/rss-guide.xml', title: '어서오개 가이드 RSS' },
      ],
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
