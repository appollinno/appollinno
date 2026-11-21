import Link from "next/link";
import { InstagramIcon, FacebookIcon, YoutubeIcon } from "@/components/icons/SocialIcons";
import { NewsletterForm } from "@/components/home/NewsletterForm";

const CURRENT_YEAR = new Date().getFullYear();

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All Coffee" },
      { href: "/shop?category=Single+Origin", label: "Single Origin" },
      { href: "/shop?category=Blends", label: "Blends" },
      { href: "/shop?category=Decaf", label: "Decaf" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/our-story", label: "Our Story" },
      { href: "/journal", label: "Coffee Journal" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/account", label: "My Account" },
      { href: "/account/orders", label: "Order Tracking" },
      { href: "/contact", label: "Shipping & Returns" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border bg-charcoal text-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl tracking-tight-display">
              Appollo<span className="text-caramel">.</span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
              Specialty coffee, roasted in small batches and sourced with
              purpose. Wake up the beans.
            </p>
            <div className="mt-6 flex items-center gap-4 text-cream/70">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Appollo Coffee Shop on Instagram"
                className="transition-colors hover:text-cream"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Appollo Coffee Shop on Facebook"
                className="transition-colors hover:text-cream"
              >
                <FacebookIcon size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Appollo Coffee Shop on YouTube"
                className="transition-colors hover:text-cream"
              >
                <YoutubeIcon size={18} />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-cream/50">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/80 transition-colors hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-cream/10 pt-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="font-display text-xl">Stay in the loop</h3>
              <p className="mt-2 max-w-sm text-sm text-cream/70">
                New arrivals, brewing guides, and first access to limited
                lots — straight to your inbox.
              </p>
            </div>
            <NewsletterForm variant="dark" />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-cream/10 pt-8 text-xs text-cream/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {CURRENT_YEAR} Appollo Coffee Shop. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/contact" className="hover:text-cream">
              Business Info
            </Link>
            <span>Maputo · Mozambique</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
