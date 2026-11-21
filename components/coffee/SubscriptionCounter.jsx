"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";

const PLANS = [
  { id: "monthly", label: "Monthly", cadence: "every 4 weeks", price: 18 },
  { id: "bimonthly", label: "Bi-monthly", cadence: "every 8 weeks", price: 16 },
];

function Cup({ on }) {
  return (
    <svg className={`cf-cup ${on ? "cf-cup--on" : ""}`} width="34" height="40" viewBox="0 0 34 40" aria-hidden="true">
      <path d="M5 12 h20 v12 a10 10 0 0 1 -20 0 Z" fill="#b08560" />
      <path d="M25 14 h4 a4 4 0 0 1 0 8 h-4" fill="none" stroke="#b08560" strokeWidth="2.4" />
      <ellipse cx="15" cy="12" rx="10" ry="3" fill="#6b3a1d" />
      <path d="M11 6 q-3 -3 0 -6 M17 6 q-3 -3 0 -6" stroke="#e8d8c0" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export default function SubscriptionCounter() {
  const [qty, setQty] = useState(2);
  const [plan, setPlan] = useState("monthly");

  const active = PLANS.find((p) => p.id === plan);
  const total = active.price * qty;

  return (
    <section className="cf-section" id="subscriptions">
      <Reveal>
        <p className="cf-eyebrow">Subscriptions</p>
        <h2 className="cf-h2">Fresh beans, on repeat</h2>
        <p className="mt-3 max-w-md text-cream/70">
          Choose how often and how many — we roast to order and ship the morning after.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {/* Plans */}
        <Reveal>
          <div className="flex flex-col gap-4">
            {PLANS.map((p) => (
              <button
                key={p.id}
                type="button"
                className="cf-plan text-left"
                aria-pressed={plan === p.id}
                onClick={() => setPlan(p.id)}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-2xl tracking-wide">{p.label}</span>
                  <span className="font-label text-sm text-caramel">${p.price}/bag</span>
                </div>
                <p className="mt-1 text-sm text-cream/60">Delivered {p.cadence}</p>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Counter */}
        <Reveal delay={80}>
          <div className="cf-plan">
            <p className="font-label text-xs uppercase tracking-[0.18em] text-caramel">Bags per delivery</p>

            <div className="cf-cups mt-4" aria-hidden="true">
              {[1, 2, 3, 4].map((n) => (
                <Cup key={n} on={n <= qty} />
              ))}
            </div>

            <div className="mt-5 flex items-center gap-4">
              <button
                type="button"
                className="cf-step-btn"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Decrease bags"
              >
                −
              </button>
              <span className="min-w-[2ch] text-center font-display text-3xl" aria-live="polite">
                {qty}
              </span>
              <button
                type="button"
                className="cf-step-btn"
                onClick={() => setQty((q) => Math.min(4, q + 1))}
                disabled={qty >= 4}
                aria-label="Increase bags"
              >
                +
              </button>

              <div className="ml-auto text-right">
                <p className="font-label text-xs uppercase tracking-[0.14em] text-cream/50">Per delivery</p>
                <p className="font-display text-2xl">${total}</p>
              </div>
            </div>

            <a href="#" className="cf-btn cf-btn--primary mt-6 w-full justify-center">
              Start subscription
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
