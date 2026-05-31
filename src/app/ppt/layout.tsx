import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenKLAS · Presentation",
  description: "OpenKLAS / KLAS MCP presentation slides.",
  robots: { index: false, follow: false },
};

export default function PresentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
