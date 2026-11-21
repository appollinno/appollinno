"use client";

import { useRef, useState } from "react";
import Reveal from "@/components/Reveal";

const GUIDES = [
  {
    method: "Pour Over",
    equipment: "Dripper · paper filter · gooseneck kettle · scale",
    ratio: "15 g coffee · 250 g water · 93°C",
    steps: [
      "Rinse the filter and warm the dripper.",
      "Add medium-fine grounds; make a small well.",
      "Bloom with 50 g water, wait 35 seconds.",
      "Pour in slow spirals to 250 g; aim for 2:45 total.",
    ],
  },
  {
    method: "Aeropress",
    equipment: "Aeropress · paper filter · kettle · scale",
    ratio: "16 g coffee · 230 g water · 85°C",
    steps: [
      "Insert filter, rinse, add medium grounds.",
      "Pour 230 g water, stir 3 times.",
      "Steep 1 minute 30 seconds.",
      "Press gently for 25–30 seconds and stop at the hiss.",
    ],
  },
  {
    method: "Espresso",
    equipment: "Espresso machine · 58 mm portafilter · tamper · scale",
    ratio: "18 g in · 36 g out · 25–30 s",
    steps: [
      "Dose 18 g, distribute and tamp level.",
      "Lock in and start the shot immediately.",
      "Target 36 g out in 25–30 seconds.",
      "Dial grind finer if it runs fast, coarser if slow.",
    ],
  },
];

function DripIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 4 h14 l-2 5 H7 Z" stroke="#b08560" strokeWidth="1.5" strokeLinejoin="round" />
      <path className="cf-drip" d="M12 10 v6" pathLength="1" stroke="#d15c30" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 18 h8 l-1 2 H9 Z" stroke="#b08560" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export default function BrewingGuides() {
  const [open, setOpen] = useState(0);
  const refs = useRef([]);

  return (
    <section className="cf-section" id="brewing">
      <Reveal>
        <p className="cf-eyebrow">Brewing guides</p>
        <h2 className="cf-h2">Brew it like we do</h2>
        <p className="mt-3 max-w-md text-cream/70">
          Three ways to get the most from your beans. Tap a method for the full recipe.
        </p>
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-8">
          {GUIDES.map((g, i) => {
            const isOpen = open === i;
            return (
              <div className="cf-guide" data-open={isOpen} key={g.method}>
                <button
                  type="button"
                  className="cf-guide__head"
                  aria-expanded={isOpen}
                  aria-controls={`guide-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <DripIcon />
                  <span className="cf-guide__title">{g.method}</span>
                  <svg className="cf-guide__chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div
                  id={`guide-${i}`}
                  className="cf-guide__panel"
                  style={{ maxHeight: isOpen ? refs.current[i]?.scrollHeight ?? 600 : 0 }}
                >
                  <div className="cf-guide__panel-inner" ref={(el) => (refs.current[i] = el)}>
                    <p className="font-label text-xs uppercase tracking-[0.14em] text-caramel">{g.ratio}</p>
                    <p className="mt-2 text-sm text-cream/60">
                      <span className="text-cream/80">Equipment:</span> {g.equipment}
                    </p>
                    <ol className="mt-4 space-y-2">
                      {g.steps.map((s, n) => (
                        <li key={n} className="flex gap-3 text-cream/80">
                          <span className="font-label text-sm text-emberglow">{String(n + 1).padStart(2, "0")}</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
