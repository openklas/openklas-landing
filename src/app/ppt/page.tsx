"use client";

import dynamic from "next/dynamic";

// PDF.js can't run during SSR (it touches `window`), so we lazy-load
// the viewer client-side only.
const PdfViewer = dynamic(() => import("./PdfViewer"), {
  ssr: false,
  loading: () => (
    <main className="fixed inset-0 bg-klas-ivory flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/loading.gif"
        alt="Loading"
        className="h-16 w-16 [image-rendering:pixelated]"
      />
    </main>
  ),
});

export default function PresentationPage() {
  return <PdfViewer />;
}
