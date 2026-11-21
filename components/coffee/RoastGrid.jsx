import Reveal from "@/components/Reveal";

const ROASTS = [
  {
    name: "Yirgacheffe",
    origin: "Ethiopia",
    level: "Light roast",
    notes: "Jasmine · bergamot · peach",
    bagFrom: "#8a4a2a",
    bagTo: "#b9743f",
    curve: "M2,46 C22,44 34,34 52,24 S82,14 98,13",
  },
  {
    name: "Huila",
    origin: "Colombia",
    level: "Medium roast",
    notes: "Caramel · red apple · cocoa",
    bagFrom: "#7a3f22",
    bagTo: "#a5622f",
    curve: "M2,47 C24,45 36,32 54,21 S84,10 98,9",
  },
  {
    name: "Cerrado",
    origin: "Brazil",
    level: "Medium-dark",
    notes: "Dark chocolate · hazelnut",
    bagFrom: "#5f3119",
    bagTo: "#8a4e28",
    curve: "M2,47 C26,46 38,30 56,18 S86,7 98,6",
  },
  {
    name: "Mandheling",
    origin: "Sumatra",
    level: "Dark roast",
    notes: "Cedar · molasses · spice",
    bagFrom: "#43220f",
    bagTo: "#6b3a1d",
    curve: "M2,48 C28,47 40,28 58,15 S88,5 98,4",
  },
];

function Bag({ from, to, name }) {
  return (
    <svg className="cf-bag" viewBox="0 0 160 160" role="img" aria-label={`${name} coffee bag`}>
      <defs>
        <linearGradient id={`bag-${name}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect x="44" y="26" width="72" height="108" rx="8" fill={`url(#bag-${name})`} />
      {/* folded top */}
      <path d="M44 34 L80 22 L116 34 L116 26 Q116 20 110 20 L50 20 Q44 20 44 26 Z" fill={to} opacity="0.9" />
      {/* label band */}
      <rect x="54" y="66" width="52" height="40" rx="5" fill="#e8d8c0" opacity="0.92" />
      <circle cx="80" cy="80" r="7" fill="none" stroke="#4a2c1a" strokeWidth="2.2" />
      <path d="M80 73 v14 M73 80 h14" stroke="#4a2c1a" strokeWidth="2.2" />
      <rect x="62" y="96" width="36" height="3.4" rx="1.7" fill="#9b5f3a" />
      {/* valve */}
      <circle cx="80" cy="46" r="4.5" fill="#2a160b" opacity="0.6" />
    </svg>
  );
}

export default function RoastGrid() {
  return (
    <section className="cf-section" id="roasts">
      <Reveal>
        <p className="cf-eyebrow">Our roasts</p>
        <h2 className="cf-h2">Beans with a story</h2>
        <p className="mt-3 max-w-md text-cream/70">
          Hover a bag to trace its roast curve — temperature against time, the way we dial in every batch.
        </p>
      </Reveal>

      <div className="cf-roast-grid mt-10">
        {ROASTS.map((r, i) => (
          <Reveal key={r.name} delay={i * 80}>
            <article className="cf-roast-card">
              <Bag from={r.bagFrom} to={r.bagTo} name={r.name} />

              {/* roast curve, draws on hover */}
              <svg className="mt-4 w-full" height="46" viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true">
                <line x1="2" y1="48" x2="98" y2="48" stroke="#e8d8c0" strokeWidth="0.6" opacity="0.2" />
                <line x1="2" y1="48" x2="2" y2="6" stroke="#e8d8c0" strokeWidth="0.6" opacity="0.2" />
                <path
                  className="cf-roast-line"
                  d={r.curve}
                  pathLength="1"
                  fill="none"
                  stroke="#d15c30"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl tracking-wide">{r.name}</h3>
                  <p className="text-sm text-cream/55">{r.origin}</p>
                </div>
                <span className="cf-chip">{r.level}</span>
              </div>
              <p className="mt-2 text-sm text-cream/65">{r.notes}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
