const steps = [
  {
    n: "01",
    title: "Add the connector",
    body: (
      <>
        In Claude.ai, open <em>Settings → Connectors → Add custom connector</em> and paste{" "}
        <code className="rounded bg-klas-rose/40 px-1.5 py-0.5 text-[0.85em] text-klas-deep">https://mcp.openklas.com/mcp</code>.
      </>
    ),
  },
  {
    n: "02",
    title: "Log in once",
    body: (
      <>Claude redirects you to OpenKLAS. Enter your KLAS credentials on the hosted page. They never leave the server, and Claude never sees them.</>
    ),
  },
  {
    n: "03",
    title: "Just ask",
    body: (
      <>From any new chat: <em>"what's due this week?"</em>, <em>"summarize my last linux lecture"</em>, <em>"draft a polite Korean email to my professor about late submission"</em>. Claude handles the rest.</>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-klas-ivory">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-klas-deep">
            How it works
          </p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl tracking-tight">
            Three steps. Under a minute.
          </h2>
          <p className="mt-4 text-stone-600 text-pretty">
            One-time setup. After that, your AI just knows.
          </p>
        </div>

        <ol className="mt-14 grid gap-6 lg:grid-cols-3">
          {steps.map((s) => (
            <li
              key={s.n}
              className="relative rounded-3xl border border-stone-200 bg-white p-7 shadow-soft"
            >
              <div className="font-display text-5xl text-klas-coral/70">{s.n}</div>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
