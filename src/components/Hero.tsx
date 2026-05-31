import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background illustration: blue sky on top, green meadow on bottom */}
      <div
        aria-hidden
        className="absolute inset-0 bg-no-repeat bg-cover"
        style={{
          backgroundImage: "url('/bg-meadow.png')",
          backgroundPosition: "30% 100%",
        }}
      />
      {/* Top-left mascot + wordmark logo */}
      <div className="relative mx-auto max-w-6xl px-6 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-sans font-bold text-xl tracking-tight text-klas-ink"
          style={{ textShadow: "0 1px 10px rgba(255,255,255,0.9)" }}
        >
          <Image
            src="/logo.png"
            alt=""
            width={36}
            height={36}
            priority
            className="drop-shadow"
          />
          <span>
            Open<span className="text-klas-deep">KLAS</span>
          </span>
        </Link>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pt-12 pb-24 sm:pt-20 sm:pb-32 text-center">
        <h1
          className="font-display text-5xl sm:text-7xl leading-[1.05] tracking-tight text-balance text-klas-ink"
          style={{ textShadow: "0 1px 18px rgba(255,255,255,0.85)" }}
        >
          Less clicking,
          <span className="italic text-klas-deep"> more learning.</span>
        </h1>

        <p
          className="mx-auto mt-6 max-w-xl text-sm sm:text-base leading-relaxed text-stone-800 text-pretty font-medium"
          style={{ textShadow: "0 1px 14px rgba(255,255,255,0.9)" }}
        >
          The open-source MCP server that bridges{" "}
          <strong className="text-klas-ink">KLAS</strong> (Kwangwoon
          University's LMS) and your favorite AI assistant. Stop copy-pasting
          deadlines into ChatGPT. Just ask.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="https://claude.ai/customize/connectors"
            className="inline-flex items-center gap-2 rounded-full bg-klas-deep px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-klas-ink transition"
          >
            Add to Claude
            <ArrowRight />
          </Link>
          <Link
            href="https://github.com/openklas/openklas"
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-klas-ink hover:bg-klas-ivory transition"
          >
            <GitHubLogo /> Star on GitHub
          </Link>
        </div>

        <p
          className="mt-6 text-xs text-stone-700 font-medium"
          style={{ textShadow: "0 1px 10px rgba(255,255,255,0.95)" }}
        >
          Works with Claude, ChatGPT (MCP), Cursor, and any MCP-compatible AI.
        </p>
      </div>
    </section>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function GitHubLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.66.5 12.02c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.27-.01-.99-.01-1.94-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 5.8 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.58.23 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.26 5.7.41.36.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.13 0 .31.21.67.8.55C20.21 21.4 23.5 17.09 23.5 12.02 23.5 5.66 18.35.5 12 .5z" />
    </svg>
  );
}
