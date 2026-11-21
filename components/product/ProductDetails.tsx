import type { Product } from "@/lib/types";

export function ProductDetails({ product }: { product: Product }) {
  return (
    <div className="mt-10 grid gap-10 border-t border-border pt-10 md:grid-cols-2">
      <div>
        <h2 className="font-display text-xl">Origin</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between border-b border-border pb-2">
            <dt className="text-foreground-muted">Country</dt>
            <dd>{product.origin.country}</dd>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <dt className="text-foreground-muted">Region</dt>
            <dd>{product.origin.region}</dd>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <dt className="text-foreground-muted">Farm / Cooperative</dt>
            <dd>{product.origin.farmOrCooperative}</dd>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <dt className="text-foreground-muted">Altitude</dt>
            <dd>
              {product.origin.altitudeMeters[0]}–{product.origin.altitudeMeters[1]}m
            </dd>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <dt className="text-foreground-muted">Roast Level</dt>
            <dd>{product.roastLevel}</dd>
          </div>
          <div className="flex justify-between pb-2">
            <dt className="text-foreground-muted">Process</dt>
            <dd>{product.process}</dd>
          </div>
        </dl>

        <h3 className="mt-8 font-display text-lg">Tasting Notes</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.tastingNotes.map((note) => (
            <span
              key={note}
              className="border border-border px-3 py-1 text-xs uppercase tracking-wide text-foreground-muted"
            >
              {note}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl">Brewing Recommendations</h2>
        <table className="mt-4 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-foreground-muted">
              <th className="py-2 font-medium">Method</th>
              <th className="py-2 font-medium">Ratio</th>
              <th className="py-2 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {product.brewingRecommendations.map((rec) => (
              <tr key={rec.method} className="border-b border-border">
                <td className="py-3">{rec.method}</td>
                <td className="py-3">{rec.ratio}</td>
                <td className="py-3">{rec.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-sm text-foreground-muted">{product.description}</p>
      </div>
    </div>
  );
}
