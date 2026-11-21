import Reveal from "@/components/Reveal";

export default function CoffeeHero() {
  return (
    <section className="cf-hero" id="top">
      {/*
        To use a real looping video, drop a file at /public/hero.mp4 and
        uncomment the <video> below (it will sit above the animated backdrop).
        <video className="cf-hero__video" autoPlay muted loop playsInline poster="/hero-poster.jpg">
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      */}
      <div className="cf-hero__bg" aria-hidden="true" />
      <div className="cf-hero__overlay" aria-hidden="true" />

      {/* floating beans + steam backdrop */}
      <svg className="cf-hero__beans" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="#d15c30" opacity="0.14">
          <ellipse cx="180" cy="160" rx="16" ry="10" transform="rotate(25 180 160)" />
          <ellipse cx="1010" cy="240" rx="14" ry="9" transform="rotate(-18 1010 240)" />
          <ellipse cx="320" cy="640" rx="18" ry="11" transform="rotate(40 320 640)" />
          <ellipse cx="920" cy="610" rx="13" ry="8" transform="rotate(-30 920 610)" />
          <ellipse cx="620" cy="110" rx="12" ry="8" transform="rotate(10 620 110)" />
        </g>
      </svg>
      <svg className="cf-steam" width="120" height="90" viewBox="0 0 120 90" style={{ position: "absolute", top: "14%", zIndex: -1 }} aria-hidden="true">
        <g fill="none" stroke="#e8d8c0" strokeWidth="3" strokeLinecap="round" opacity="0.4">
          <path d="M40 80 q-10 -20 0 -34 q8 -12 0 -24" />
          <path d="M60 82 q-8 -18 0 -32 q10 -14 0 -26" />
          <path d="M80 80 q-10 -20 0 -34 q8 -12 0 -24" />
        </g>
      </svg>

      <Reveal>
        <p className="cf-eyebrow">Small-batch · Est. in your cup</p>
      </Reveal>

      <Reveal delay={80}>
        <h1 className="cf-ember mt-4" style={{ fontFamily: "var(--font-marker), cursive", fontSize: "clamp(3.4rem, 15vw, 7rem)", lineHeight: 0.9, letterSpacing: "0.04em" }}>
          APPOLLO
        </h1>
      </Reveal>

      <Reveal delay={160}>
        <p className="mt-5 max-w-xl text-lg text-cream/80">
          Crafting exceptional coffee, one roast at a time.
        </p>
      </Reveal>

      <Reveal delay={240}>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a href="#roasts" className="cf-btn cf-btn--primary">
            <svg className="cf-btn__steam" width="24" height="18" viewBox="0 0 24 18" fill="none" stroke="#2a160b" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M9 16 q-4 -6 0 -10" />
              <path d="M15 16 q-4 -6 0 -10" />
            </svg>
            Shop our roasts
          </a>
          <a href="#brewing" className="cf-btn cf-btn--ghost">Learn to brew</a>
        </div>
      </Reveal>
    </section>
  );
}
