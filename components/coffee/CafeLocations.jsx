"use client";

import { useEffect, useState } from "react";
import Reveal from "@/components/Reveal";

const LOCATIONS = [
  {
    id: "baixa",
    name: "Appollo — Baixa",
    address: "Av. 25 de Setembro, Maputo",
    hours: "Mon–Sat 6:30–19:00 · Sun 8:00–14:00",
    x: 32,
    y: 44,
  },
  {
    id: "sommer",
    name: "Appollo — Sommerschield",
    address: "Rua dos Desportistas, Maputo",
    hours: "Mon–Fri 7:00–18:00 · Sat 8:00–16:00",
    x: 58,
    y: 30,
  },
  {
    id: "matola",
    name: "Appollo — Matola",
    address: "Av. da Namaacha, Matola",
    hours: "Daily 7:00–20:00",
    x: 72,
    y: 64,
  },
];

export default function CafeLocations() {
  const [active, setActive] = useState(null);
  const loc = LOCATIONS.find((l) => l.id === active);

  useEffect(() => {
    if (!active) return;
    const onKey = (e) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <section className="cf-section" id="cafes">
      <Reveal>
        <p className="cf-eyebrow">Our cafés</p>
        <h2 className="cf-h2">Find a warm seat</h2>
        <p className="mt-3 max-w-md text-cream/70">
          Three homes for Appollo. Tap a pin for hours and to order ahead.
        </p>
      </Reveal>

      <Reveal delay={80}>
        <div className="cf-map mt-8" role="group" aria-label="Map of Appollo café locations">
          {/* stylized streets */}
          <svg viewBox="0 0 100 56" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <g stroke="#e8d8c0" strokeWidth="0.4" opacity="0.14" fill="none">
              <path d="M0 20 H100 M0 38 H100 M22 0 V56 M50 0 V56 M78 0 V56" />
              <path d="M0 10 L100 48" opacity="0.6" />
            </g>
          </svg>

          {LOCATIONS.map((l) => (
            <button
              key={l.id}
              type="button"
              className="cf-pin"
              style={{ left: `${l.x}%`, top: `${l.y}%` }}
              onClick={() => setActive(l.id)}
              aria-label={`${l.name} — view details`}
            >
              <svg className="cf-pin__dot" width="34" height="42" viewBox="0 0 34 42" aria-hidden="true">
                <path d="M17 41 C6 28 2 22 2 15 a15 15 0 0 1 30 0 c0 7 -4 13 -15 26 Z" fill="#d15c30" />
                <circle cx="17" cy="15" r="6" fill="#4a2c1a" />
              </svg>
            </button>
          ))}
        </div>
      </Reveal>

      {loc && (
        <div
          className="cf-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={loc.name}
          onClick={() => setActive(null)}
        >
          <div className="cf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-2xl tracking-wide">{loc.name}</h3>
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close"
                className="cf-step-btn !h-9 !w-9 !text-base"
              >
                ×
              </button>
            </div>
            <p className="mt-3 text-cream/75">{loc.address}</p>
            <p className="mt-1 font-label text-xs uppercase tracking-[0.12em] text-caramel">{loc.hours}</p>
            <a href="#" className="cf-btn cf-btn--primary mt-6 w-full justify-center">
              Order ahead
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
