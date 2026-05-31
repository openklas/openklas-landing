import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-klas-ivory">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl bg-klas-deep p-10 sm:p-14 text-center text-white shadow-soft">
          <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <Image src="/logo.png" alt="" width={48} height={48} />
          </div>
          <h3 className="font-display text-3xl sm:text-4xl tracking-tight">
            Ready to skip the busywork?
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/70 text-pretty">
            One-time setup. Works with whatever AI you already pay for.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="https://claude.ai/settings/connectors"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-klas-deep hover:bg-klas-rose/40 transition"
            >
              Add to Claude →
            </Link>
            <Link
              href="https://github.com/openklas/openklas"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              View on GitHub
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} OpenKLAS · Built by{" "}
            <Link href="https://github.com/univerxe" className="underline decoration-stone-400 hover:text-klas-deep">
              @univerxe
            </Link>
          </p>
          <div className="flex items-center gap-5">
            <Link href="https://github.com/openklas/openklas" className="hover:text-klas-deep">GitHub</Link>
            <Link href="https://openklas.com/docs" className="hover:text-klas-deep">API</Link>
            <Link href="https://openklas.com/mcp" className="hover:text-klas-deep">MCP</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
