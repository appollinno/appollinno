import type { Metadata } from "next";
import { allCreditedImages } from "@/lib/data/images";

export const metadata: Metadata = {
  title: "Image Credits",
  description: "Attribution for the Wikimedia Commons photography used across Appollo Coffee Shop.",
};

export default function CreditsPage() {
  const images = allCreditedImages();

  return (
    <div className="mx-auto max-w-4xl px-5 py-28 md:px-8">
      <h1 className="font-display text-3xl tracking-tight-display md:text-4xl">
        Image Credits
      </h1>
      <p className="mt-4 text-foreground-muted">
        Every photograph on this site is real, licensed coffee photography
        from{" "}
        <a
          href="https://commons.wikimedia.org"
          target="_blank"
          rel="noreferrer noopener"
          className="underline"
        >
          Wikimedia Commons
        </a>
        , credited below as required by their Creative Commons licenses.
        See{" "}
        <a
          href="https://github.com/appollinno/appollinno/blob/claude/appollo-coffee-shop-bicqnc/docs/IMAGE_SOURCING.md"
          className="underline"
        >
          docs/IMAGE_SOURCING.md
        </a>{" "}
        for how these were sourced.
      </p>

      <ul className="mt-10 divide-y divide-border">
        {images.map((img) => (
          <li key={img.path} className="flex items-center justify-between gap-4 py-3 text-sm">
            <span className="text-foreground-muted">{img.artist || "Unknown"}</span>
            <span className="text-right">
              <a href={img.source} target="_blank" rel="noreferrer noopener" className="underline">
                {img.license}
              </a>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
