const STATS = [
  { value: "12", label: "Origin Countries" },
  { value: "2019", label: "Roasting Since" },
  { value: "48hr", label: "Roast-to-Ship" },
  { value: "100%", label: "Direct Trade Lots" },
];

export function IntroStatement() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-24 text-center md:px-8">
      <p className="font-display text-2xl leading-snug tracking-tight-display md:text-4xl">
        Appollo exists for the ten minutes a day that are entirely yours —
        the kettle warming, the grinder humming, the first sip that actually
        wakes you up. We obsess over sourcing and roasting so that moment is
        worth protecting.
      </p>

      <dl className="mt-14 grid grid-cols-2 gap-8 border-t border-border pt-10 sm:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <dd className="font-display text-3xl text-primary md:text-4xl">
              {stat.value}
            </dd>
            <dt className="mt-1 text-xs uppercase tracking-wide text-foreground-muted">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
