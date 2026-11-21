import Orb from "@/components/Orb";
import Reveal from "@/components/Reveal";
import StyleCarousel from "@/components/StyleCarousel";

export const metadata = {
  title: "Higgsfield — Direct cinematic AI video",
  description:
    "Higgsfield turns one prompt into cinematic video — real camera moves, consistent characters and film-grade light.",
};

const FEATURES = [
  {
    title: "Real camera control",
    body: "Direct dolly, orbit, crash-zoom and FPV moves with a tap. Shots that feel shot, not sampled.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m22 8-6 4 6 4V8Z" />
        <rect x="2" y="6" width="14" height="12" rx="2" />
      </svg>
    ),
  },
  {
    title: "Character consistency",
    body: "Lock a face and keep it identical across every shot, angle and scene — no drift, no re-rolls.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    ),
  },
  {
    title: "Film-grade output",
    body: "Export up to 4K with cinematic color, depth and grain baked in — ready to cut, straight out.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 18l1.9-5.8 5.8-1.9-5.8-1.9L12 3Z" />
      </svg>
    ),
  },
];

export default function HiggsfieldPage() {
  return (
    <div className="hf">
      {/* ---------- Nav ---------- */}
      <header className="fixed top-0 z-40 w-full">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="#top" className="text-lg font-semibold tracking-tight">
            higgsfield
          </a>
          <div className="hidden items-center gap-8 text-sm text-white/55 md:flex">
            <a href="#presets" className="transition-colors hover:text-white">Motions</a>
            <a href="#features" className="transition-colors hover:text-white">Features</a>
            <a href="/" className="transition-colors hover:text-white">Appollo ↗</a>
          </div>
          <a href="#" className="pill pill--ghost !px-4 !py-2 text-sm">Log in</a>
        </nav>
      </header>

      <main id="top">
        {/* ---------- Hero ---------- */}
        <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-28 pb-20 text-center">
          <Reveal>
            <p className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs tracking-[0.14em] text-white/55 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--cyan)]" />
              Cinematic AI video, directed
            </p>
          </Reveal>

          <Orb />

          <Reveal delay={60}>
            <h1 className="mt-10 max-w-4xl text-balance text-[clamp(3rem,9vw,7rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
              Shoot it like you{" "}
              <span className="font-serif font-normal italic text-white/90">mean it</span>.
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/60">
              Higgsfield turns one prompt into cinematic video — real camera moves,
              consistent characters and film-grade light.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a href="#" className="pill pill--primary">Start creating free</a>
              <a href="#" className="pill pill--ghost">
                <span className="wave" aria-hidden="true">
                  <span /><span /><span /><span /><span />
                </span>
                Watch the reel
              </a>
            </div>
          </Reveal>
        </section>

        {/* ---------- Presets carousel ---------- */}
        <section id="presets" className="py-24">
          <Reveal className="mx-auto mb-10 max-w-6xl px-6">
            <h2 className="text-balance text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-tight tracking-[-0.03em]">
              A camera crew in{" "}
              <span className="font-serif font-normal italic text-white/90">every preset</span>.
            </h2>
            <p className="mt-3 max-w-md text-white/55">
              Pick a motion, drop your subject in. Drag to explore the moves.
            </p>
          </Reveal>

          <Reveal delay={60}>
            <StyleCarousel />
          </Reveal>
        </section>

        {/* ---------- Features ---------- */}
        <section id="features" className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 60}>
                <div className="text-[var(--cyan)]">{f.icon}</div>
                <h3 className="mt-5 text-xl font-medium tracking-tight">{f.title}</h3>
                <p className="mt-2 leading-relaxed text-white/55">{f.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- Closing CTA ---------- */}
        <section className="mx-auto max-w-4xl px-6 pt-16 pb-10 text-center">
          <Reveal>
            <h2 className="text-balance text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              Your first shot is{" "}
              <span className="font-serif font-normal italic text-white/90">one prompt</span> away.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <a href="#" className="pill pill--primary mt-8">Start creating free</a>
          </Reveal>
        </section>
      </main>

      {/* ---------- Footer wordmark ---------- */}
      <footer className="relative mt-10 overflow-hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 pb-6 text-sm text-white/40">
          <span>© {new Date().getFullYear()} Higgsfield. A concept landing page.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">Discord</a>
            <a href="#" className="hover:text-white">Careers</a>
          </div>
        </div>
        <div className="flex justify-center overflow-hidden">
          <span className="wordmark">higgsfield</span>
        </div>
      </footer>
    </div>
  );
}
