import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { getBaseURL } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

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
    absolute: "整えて、創る。 | ネット集客に強い整体院サイトを制作",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // 管理画面とログイン画面ではヘッダー・フッターを非表示
  const isAdminOrAuth =
    pathname.startsWith("/admin") || pathname.startsWith("/auth");

  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="整えて、創る。 RSS Feed"
          href="/feed.xml"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7839828582645189"
          crossOrigin="anonymous"
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
          <GoogleAnalytics />
          <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
            {!isAdminOrAuth && <Header />}
            <main>{children}</main>
            {!isAdminOrAuth && <Footer />}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
