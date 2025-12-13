import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Script from "next/script";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7839828582645189"
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />
      <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
