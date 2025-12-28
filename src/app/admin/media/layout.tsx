import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "メディア管理",
};

export default function MediaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
