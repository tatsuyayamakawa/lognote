import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { getBaseURL } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollToTop } from "@/components/layout/scroll-to-top";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "整えて、創る。",
    template: "%s | 整えて、創る。",
    absolute: "整えて、創る。 - ネット集客に強い整体院サイトを制作",
  },
  description:
    "身体を整え、思考を整え、コードを書く。ネット集客に強い整体院サイトを制作。",
  keywords: ["ブログ", "技術", "日常", "思考", "プログラミング", "整える"],
  authors: [{ name: "整えて、創る。" }],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: getBaseURL(),
    title: "整えて、創る。",
    description:
      "身体を整え、思考を整え、コードを書く。ネット集客に強い整体院サイトを制作。",
    siteName: "整えて、創る。",
  },
  twitter: {
    card: "summary_large_image",
    title: "整えて、創る。",
    description:
      "身体を整え、思考を整え、コードを書く。ネット集客に強い整体院サイトを制作。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="整えて、創る。 RSS Feed"
          href="/feed.xml"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ScrollToTop />
          <GoogleAnalytics />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
