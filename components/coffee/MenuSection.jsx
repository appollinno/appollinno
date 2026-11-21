import Reveal from "@/components/Reveal";

const MENU = [
  {
    group: "Espresso Bar",
    items: [
      { name: "Espresso", price: 90 },
      { name: "Macchiato", price: 110 },
      { name: "Cortado", price: 130 },
      { name: "Cappuccino", price: 160 },
      { name: "Flat White", price: 170 },
      { name: "Mocha", price: 190 },
    ],
  },
  {
    group: "Filter & Brew",
    items: [
      { name: "Pour Over · single origin", price: 180 },
      { name: "Aeropress", price: 170 },
      { name: "Cold Brew", price: 190 },
      { name: "Batch Filter", price: 120 },
    ],
  },
  {
    group: "Bites",
    items: [
      { name: "Butter Croissant", price: 150 },
      { name: "Pastel de Nata", price: 90 },
      { name: "Banana Bread", price: 140 },
      { name: "Almond Cookie", price: 80 },
    ],
  },
];

export default function MenuSection() {
  return (
    <section className="cf-section" id="menu">
      <Reveal>
        <p className="cf-eyebrow">The menu</p>
        <h2 className="cf-h2">At the counter</h2>
        <p className="mt-3 max-w-md text-cream/70">
          Pulled, poured and baked in-house each morning. Prices in MZN.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-10 md:grid-cols-3">
        {MENU.map((col, i) => (
          <Reveal key={col.group} delay={i * 80}>
            <h3 className="font-display text-2xl tracking-wide text-emberglow">{col.group}</h3>
            <ul className="mt-5 space-y-3.5">
              {col.items.map((it) => (
                <li key={it.name} className="flex items-baseline gap-3">
                  <span className="text-cream/85">{it.name}</span>
                  <span className="flex-1 translate-y-[-3px] border-b border-dotted border-cream/25" aria-hidden="true" />
                  <span className="font-label text-sm text-caramel">{it.price}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
