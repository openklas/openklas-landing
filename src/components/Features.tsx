"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Feature = {
  src: string;
  eyebrow: string;
  title: string;
  body: string;
};

const features: Feature[] = [
  {
    src: "/ss-watch.png",
    eyebrow: "Lectures left to watch",
    title: "One question. Every course. Aggregate progress.",
    body: "Claude scans every recorded-lecture board for you and reports back exactly which weeks remain in which subjects, with durations and deadlines included.",
  },
  {
    src: "/ss-hw1.png",
    eyebrow: "Homework triage",
    title: "Every deadline, ranked by what actually matters.",
    body: "Ask once. Get pending, overdue, and submitted assignments across every subject in a single response, sorted by deadline, with overdue items flagged.",
  },
  {
    src: "/ss-hw2.png",
    eyebrow: "Assignment drill-down",
    title: "Format, deadline, content checklist, all in one prompt.",
    body: "Stop opening four KLAS tabs to figure out what an assignment wants. Claude pulls the full task detail and surfaces it as a clean checklist.",
  },
  {
    src: "/ss-materials.png",
    eyebrow: "PDF Q&A (RAG)",
    title: "Talk to your lecture PDFs like they're a tutor.",
    body: "Upload your slides once. Ask anything later. Voyage AI embeddings + pgvector + Ollama keep the answers grounded, per-user, isolated by design.",
  },
  {
    src: "/ss-summarize.png",
    eyebrow: "Lecture summarization",
    title: "From an hour-long video to study-ready notes.",
    body: "Download → Whisper transcription → Claude-written summary, optionally saved straight to your Obsidian vault. Walk into class already prepped.",
  },
  {
    src: "/ss-email.png",
    eyebrow: "Korean email drafting",
    title: "One English sentence in. A polite Korean email out.",
    body: "Need to ask for a late-submission extension? Claude looks up the assignment, finds the right professor, and drafts a respectful Korean email ready to send.",
  },
];

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

function FeatureRow({ feature, index }: { feature: Feature; index: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const reversed = index % 2 === 1;

  return (
    <div
      ref={ref}
      className={[
        "grid items-center gap-12 lg:gap-20 lg:grid-cols-2",
        "transition-all duration-1000 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
      ].join(" ")}
    >
      <div
        className={[
          "relative w-full",
          reversed ? "lg:order-2" : "",
          "transition-all duration-[1100ms] ease-out delay-100",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
        ].join(" ")}
      >
        <Image
          src={feature.src}
          alt={feature.title}
          width={1400}
          height={1600}
          sizes="(min-width: 1024px) 50vw, 92vw"
          className="w-full h-auto select-none"
          priority={index < 2}
        />
      </div>

      <div
        className={[
          "max-w-xl",
          reversed ? "lg:order-1" : "",
          "transition-all duration-[1100ms] ease-out delay-200",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        ].join(" ")}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-klas-deep">
          {feature.eyebrow}
        </p>
        <h3 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-tight text-balance">
          {feature.title}
        </h3>
        <p className="mt-5 text-base sm:text-lg leading-relaxed text-stone-600 text-pretty">
          {feature.body}
        </p>
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="bg-white border-y border-stone-200/80">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-2xl text-center mb-20 sm:mb-28">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-klas-deep">
            What it does
          </p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl tracking-tight">
            Six things your AI can do
            <span className="italic text-klas-deep"> on your behalf.</span>
          </h2>
          <p className="mt-4 text-stone-600 text-pretty">
            Scroll through. Every screenshot is a real Claude conversation backed by OpenKLAS.
          </p>
        </div>

        <div className="space-y-32 sm:space-y-40">
          {features.map((f, i) => (
            <FeatureRow key={f.src} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
