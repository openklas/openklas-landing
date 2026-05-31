import "./globals.css";
import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OpenKLAS",
  description:
    "Open-source MCP server that bridges KLAS (Kwangwoon University's LMS) and your favorite AI assistant.",
  openGraph: {
    title: "OpenKLAS",
    description:
      "Connect KLAS to Claude, ChatGPT, or any MCP-compatible AI. Stop copy-pasting deadlines.",
    url: "https://openklas.com",
    siteName: "OpenKLAS",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable}`}>
      <body className="bg-klas-ivory text-klas-ink antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
