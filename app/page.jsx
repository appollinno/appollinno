import "./coffee.css";
import CoffeeHero from "@/components/coffee/CoffeeHero";
import RoastGrid from "@/components/coffee/RoastGrid";
import MenuSection from "@/components/coffee/MenuSection";
import SubscriptionCounter from "@/components/coffee/SubscriptionCounter";
import BrewingGuides from "@/components/coffee/BrewingGuides";
import CafeLocations from "@/components/coffee/CafeLocations";

export default function Page() {
  return (
    <>
      {/* ---------- Nav ---------- */}
      <header className="fixed top-0 z-40 w-full">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="#top" className="font-display text-2xl tracking-wide">appollo</a>
          <div className="hidden items-center gap-8 font-label text-xs uppercase tracking-[0.14em] text-cream/65 md:flex">
            <a href="#roasts" className="transition-colors hover:text-cream">Roasts</a>
            <a href="#menu" className="transition-colors hover:text-cream">Menu</a>
            <a href="#subscriptions" className="transition-colors hover:text-cream">Subscribe</a>
            <a href="#brewing" className="transition-colors hover:text-cream">Brewing</a>
            <a href="#cafes" className="transition-colors hover:text-cream">Cafés</a>
          </div>
          <a href="#roasts" className="cf-btn cf-btn--primary !py-2 !px-4 !text-[0.7rem]">Shop</a>
        </nav>
      </header>

      <main>
        <CoffeeHero />
        <RoastGrid />
        <MenuSection />
        <SubscriptionCounter />
        <BrewingGuides />
        <CafeLocations />
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="relative overflow-hidden border-t border-cream/10 pt-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <p className="font-display text-2xl tracking-wide">appollo</p>
              <p className="mt-2 max-w-xs text-sm text-cream/60">
                Small-batch coffee, roasted with care and served warm.
              </p>
            </div>
            <div>
              <p className="font-label text-xs uppercase tracking-[0.16em] text-caramel">Visit</p>
              <p className="mt-2 text-sm text-cream/70">Av. 25 de Setembro, Maputo</p>
              <p className="text-sm text-cream/70">Daily · 6:30–20:00</p>
            </div>
            <div>
              <p className="font-label text-xs uppercase tracking-[0.16em] text-caramel">Follow</p>
              <div className="mt-2 flex gap-5 text-sm text-cream/70">
                <a href="#" className="hover:text-cream">Instagram</a>
                <a href="#" className="hover:text-cream">YouTube</a>
              </div>
              <a href="/higgsfield" className="mt-4 inline-block text-xs text-cream/40 hover:text-cream/70">
                View the Higgsfield concept ↗
              </a>
            </div>
          </div>

          <p className="mt-10 font-label text-xs text-cream/40">
            © {new Date().getFullYear()} Appollo Coffee. A concept site.
          </p>
        </div>

        <div className="mt-6 flex justify-center overflow-hidden" aria-hidden="true">
          <span className="cf-wordmark">appollo</span>
        </div>
      </footer>
    </>
  );
}
