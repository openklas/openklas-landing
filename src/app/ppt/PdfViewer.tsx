"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// PDF.js worker via CDN (matches react-pdf's bundled pdfjs version).
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const MOBILE_BREAKPOINT = 768; // Tailwind md
const SIDEBAR_WIDTH_DESKTOP = 224; // w-56

export default function PdfViewer() {
  const [numPages, setNumPages] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sidebarScrollRef = useRef<HTMLDivElement | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement | null>(null);
  const cooldownRef = useRef(false);

  const isLoading = !pdfLoaded;

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerSize({
          w: containerRef.current.clientWidth,
          h: containerRef.current.clientHeight,
        });
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Desktop: slide fits in available area assuming 16:9 page.
  // Mobile: grid items sized so multiple fit per row + several per screen.
  const slideWidth = useMemo(() => {
    if (!containerSize.w || !containerSize.h) return 0;
    if (isMobile) {
      // One slide per row, full width minus tiny breathing room.
      const horizontalPadding = 24;
      return Math.max(120, Math.floor(containerSize.w - horizontalPadding));
    }
    const horizontalUsable =
      containerSize.w - (sidebarOpen ? SIDEBAR_WIDTH_DESKTOP : 0) - 64;
    const verticalUsable = containerSize.h - 80;
    return Math.max(
      120,
      Math.floor(Math.min(horizontalUsable, verticalUsable * (16 / 9))),
    );
  }, [containerSize, sidebarOpen, isMobile]);

  const scrollToPage = useCallback(
    (target: number, behavior: ScrollBehavior = "smooth") => {
      const wrap = mobileScrollRef.current;
      if (!wrap) return;
      const el = wrap.querySelector<HTMLElement>(`[data-mob-page="${target}"]`);
      if (el) el.scrollIntoView({ behavior, block: "start" });
    },
    [],
  );

  const goToPage = useCallback(
    (target: number) => {
      if (target < 1 || target > numPages || target === pageNum) return;
      setPageNum(target);
      if (isMobile) {
        scrollToPage(target);
        setSidebarOpen(false); // auto-close on mobile
      }
    },
    [numPages, pageNum, isMobile, scrollToPage],
  );

  const goNext = useCallback(() => {
    setPageNum((p) => {
      const next = p >= numPages ? p : p + 1;
      if (isMobile && next !== p) scrollToPage(next);
      return next;
    });
  }, [numPages, isMobile, scrollToPage]);

  const goPrev = useCallback(() => {
    setPageNum((p) => {
      const next = p <= 1 ? p : p - 1;
      if (isMobile && next !== p) scrollToPage(next);
      return next;
    });
  }, [isMobile, scrollToPage]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowRight" ||
        e.key === "ArrowDown" ||
        e.key === " " ||
        e.key === "PageDown"
      ) {
        e.preventDefault();
        goNext();
      } else if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowUp" ||
        e.key === "PageUp"
      ) {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Home") {
        e.preventDefault();
        setPageNum(1);
        if (isMobile) scrollToPage(1);
      } else if (e.key === "End") {
        e.preventDefault();
        setPageNum(numPages);
        if (isMobile) scrollToPage(numPages);
      } else if (e.key === "s" || e.key === "S") {
        setSidebarOpen((v) => !v);
      } else if (e.key === "Escape") {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, numPages, isMobile, scrollToPage]);

  // Wheel — desktop only (mobile uses native scroll)
  useEffect(() => {
    if (isMobile) return;
    const handler = (e: WheelEvent) => {
      if (cooldownRef.current) return;
      if ((e.target as HTMLElement)?.closest?.("[data-pdf-sidebar]")) return;
      if (Math.abs(e.deltaY) < 20) return;
      cooldownRef.current = true;
      setTimeout(() => {
        cooldownRef.current = false;
      }, 450);
      if (e.deltaY > 0) goNext();
      else goPrev();
    };
    window.addEventListener("wheel", handler, { passive: true });
    return () => window.removeEventListener("wheel", handler);
  }, [goNext, goPrev, isMobile]);

  // Mobile: track which page is most visible via IntersectionObserver
  useEffect(() => {
    if (!isMobile || numPages === 0) return;
    const wrap = mobileScrollRef.current;
    if (!wrap) return;

    let visible = new Map<number, number>(); // page -> intersection ratio
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const n = Number((e.target as HTMLElement).dataset.mobPage);
          if (!n) continue;
          if (e.isIntersecting) visible.set(n, e.intersectionRatio);
          else visible.delete(n);
        }
        if (visible.size === 0) return;
        // Pick the page with the largest intersection ratio.
        let best = pageNum;
        let bestRatio = -1;
        for (const [n, r] of visible) {
          if (r > bestRatio) {
            bestRatio = r;
            best = n;
          }
        }
        setPageNum(best);
      },
      { root: wrap, threshold: [0.25, 0.5, 0.75, 1] },
    );

    wrap.querySelectorAll<HTMLElement>("[data-mob-page]").forEach((el) => {
      obs.observe(el);
    });
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, numPages]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (!sidebarOpen) return;
    const el = document.querySelector<HTMLElement>(
      `[data-thumb="${pageNum}"]`,
    );
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [pageNum, sidebarOpen]);

  return (
    <main
      ref={containerRef}
      className="fixed inset-0 bg-black overflow-hidden flex select-none"
    >
      {/* Overlay loader */}
      {isLoading && (
        <div className="absolute inset-0 z-40 bg-klas-ivory flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/loading.gif"
            alt="Loading"
            className="h-16 w-16 [image-rendering:pixelated]"
          />
        </div>
      )}

      <Document
        file="/presentation.pdf"
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages);
          setPdfLoaded(true);
        }}
        loading={<div />}
        error={
          <div className="m-auto text-red-400 text-sm">Failed to load PDF.</div>
        }
        className="contents"
      >
        {/* Mobile backdrop when sidebar is open */}
        {isMobile && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className={`md:hidden absolute inset-0 z-10 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
              sidebarOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          />
        )}

        {/* Sidebar */}
        <aside
          data-pdf-sidebar
          aria-hidden={!sidebarOpen}
          className={`absolute left-0 top-0 z-20 h-full w-56 max-w-[78vw] bg-neutral-900/95 backdrop-blur-md border-r border-white/10 will-change-transform transition-transform duration-300 ease-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {numPages > 0 && (
            <div
              ref={sidebarScrollRef}
              className="h-full overflow-y-auto pt-16 pb-4 px-3 space-y-3"
            >
              {Array.from({ length: numPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  data-thumb={n}
                  onClick={() => goToPage(n)}
                  className={`group block w-full text-left rounded-md overflow-hidden transition ring-2 ${
                    n === pageNum
                      ? "ring-white/90"
                      : "ring-transparent hover:ring-white/30"
                  }`}
                >
                  <div className="bg-white">
                    <Page
                      pageNumber={n}
                      width={184}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </div>
                  <div
                    className={`px-2 py-1 text-[11px] font-mono tabular-nums ${
                      n === pageNum ? "text-white" : "text-white/50"
                    }`}
                  >
                    {n}
                  </div>
                </button>
              ))}
            </div>
          )}
        </aside>

        {/* Sidebar toggle button */}
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label={sidebarOpen ? "Hide pages" : "Show pages"}
          className="absolute top-4 left-4 z-30 grid place-items-center h-10 w-10 rounded-md bg-white/10 hover:bg-white/20 text-white/80 backdrop-blur transition"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </button>

        {/* Main slide area */}
        <div
          className={`relative flex-1 h-full overflow-hidden transition-[padding] duration-300 ease-out ${
            sidebarOpen && !isMobile ? "md:pl-56" : "pl-0"
          }`}
        >
          {slideWidth > 0 && numPages > 0 && (
            <>
              {/* ─── Mobile: grid view with multiple pages per row ────── */}
              {isMobile ? (
                <div
                  ref={mobileScrollRef}
                  className="h-full w-full overflow-y-auto overscroll-contain pt-16 pb-12 px-3"
                >
                  <div className="flex flex-col gap-3 items-center">
                    {Array.from({ length: numPages }, (_, i) => i + 1).map(
                      (n) => (
                        <div
                          key={n}
                          data-mob-page={n}
                          className={`flex justify-center rounded-sm overflow-hidden ring-2 transition ${
                            n === pageNum
                              ? "ring-white/80"
                              : "ring-transparent"
                          }`}
                        >
                          <Page
                            pageNumber={n}
                            width={slideWidth}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            className="shadow-2xl"
                          />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ) : (
                /* ─── Desktop: single-slide view ───────────────────────── */
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {Array.from({ length: numPages }, (_, i) => i + 1).map(
                        (n) => (
                          <div
                            key={n}
                            className={
                              n === pageNum
                                ? "relative"
                                : "absolute inset-0 invisible pointer-events-none"
                            }
                          >
                            <Page
                              pageNumber={n}
                              width={slideWidth}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                              className="shadow-2xl"
                            />
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Bottom progress bar */}
          {numPages > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
              <div
                className="h-full bg-white/80 transition-[width] duration-300 ease-out"
                style={{ width: `${(pageNum / numPages) * 100}%` }}
              />
            </div>
          )}

          {/* Page counter */}
          {numPages > 0 && (
            <div className="absolute bottom-3 right-4 text-white/40 text-xs font-mono tabular-nums">
              {pageNum} / {numPages}
            </div>
          )}
        </div>
      </Document>
    </main>
  );
}
