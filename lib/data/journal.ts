import type { JournalArticle } from "@/lib/types";
import { img } from "@/lib/data/images";

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: "j1",
    slug: "dialing-in-pour-over",
    title: "Dialing In the Perfect Pour Over",
    excerpt:
      "Grind size, bloom time, and pour rate — the three variables that separate a flat cup from a vivid one.",
    category: "Brewing Guides",
    readMinutes: 6,
    date: "2026-10-18",
    coverImage: img("pourover", 0, "Hand pouring water over a coffee filter"),
    body: [
      "Pour over brewing rewards patience. The goal is an even, saturated bed of coffee that extracts at a consistent rate from first pour to last drip.",
      "Start with a 1:16 ratio — 20g of coffee to 320g of water — ground to a medium-fine consistency, roughly the texture of coarse sand.",
      "Bloom with twice the coffee's weight in water (40g) and let it sit for 30-45 seconds. This releases trapped CO2 and sets up even extraction for the rest of the pour.",
      "Pour in slow, concentric circles, keeping the water level steady. Aim to finish your total pour by the 2:30 mark, with full drawdown by 3:00.",
      "Taste, adjust grind size before ratio, and keep a brewing log. Small changes compound into a noticeably better cup within a week.",
    ],
  },
  {
    id: "j2",
    slug: "inside-ethiopia-yirgacheffe",
    title: "Inside Yirgacheffe: Coffee's Birthplace",
    excerpt:
      "A look at the cooperatives and altitude that make Ethiopian washed coffees some of the most prized in the world.",
    category: "Origins",
    readMinutes: 8,
    date: "2026-09-20",
    coverImage: img("plantation", 1, "Highland coffee farm terrain in Ethiopia"),
    body: [
      "Ethiopia is widely considered the birthplace of Coffea arabica, and Yirgacheffe — a small district within the Gedeo Zone — produces some of its most distinctive expressions.",
      "Grown between 1,900 and 2,200 meters, the altitude slows cherry development, concentrating sugars and acids that translate into the floral, citrus-driven cups the region is known for.",
      "Most lots pass through washing stations run by cooperatives like Konga, where cherries are pulped, fermented, and dried on raised beds within 24 hours of picking.",
      "That short window between harvest and processing is one of the biggest levers on cup quality — and one reason we pay a premium for cooperative-processed lots.",
    ],
  },
  {
    id: "j3",
    slug: "cold-brew-concentrate-at-home",
    title: "Cold Brew Concentrate, Simplified",
    excerpt:
      "No special equipment required — just coarse grounds, cold water, and eighteen patient hours.",
    category: "Recipes",
    readMinutes: 4,
    date: "2026-08-02",
    coverImage: img("frenchpress", 1, "Coarse coffee grounds steeping for cold brew"),
    body: [
      "Cold brew concentrate is forgiving and makes a great base for both black coffee and milk drinks.",
      "Combine 100g of coarsely ground coffee with 500g of room-temperature filtered water in a large jar. Stir to saturate all the grounds.",
      "Cover and steep at room temperature or in the fridge for 16-18 hours. Longer steeps intensify body and bitterness, so start at 16 hours and adjust to taste.",
      "Strain through a fine mesh sieve lined with a paper filter. Store the concentrate in the fridge for up to two weeks.",
      "Dilute 1:1 with water or milk over ice. For a sweeter cup, try our Brazil Cerrado — its low acidity shines in cold extraction.",
    ],
  },
  {
    id: "j4",
    slug: "the-craft-of-roasting",
    title: "The Craft of Roasting: From Green to Gold",
    excerpt:
      "What actually happens inside the drum during a roast — and why timing matters more than temperature alone.",
    category: "Craft",
    readMinutes: 7,
    date: "2026-07-11",
    coverImage: img("roasting", 0, "Industrial coffee roaster drum in action"),
    body: [
      "Roasting transforms green, grassy-smelling coffee seeds into the aromatic beans we grind and brew. The process hinges on two key moments: first crack and the decision point that follows.",
      "As beans heat past 196°C (385°F), trapped moisture and gases cause them to audibly crack — the first of two expansion points.",
      "Our roasters pull light roasts moments after first crack to preserve delicate floral and fruit notes, while darker roasts are carried further to develop body and caramelized sugars.",
      "Every batch is logged — charge temperature, development time ratio, drop temperature — so we can replicate (or deliberately vary) a profile harvest to harvest.",
    ],
  },
  {
    id: "j5",
    slug: "espresso-ratios-explained",
    title: "Espresso Ratios, Explained Simply",
    excerpt:
      "Why '1:2' matters more than grams and seconds alone, and how to use it to fix a sour or bitter shot.",
    category: "Brewing Guides",
    readMinutes: 5,
    date: "2026-06-05",
    coverImage: img("barista", 2, "Barista pulling an espresso shot at the machine"),
    body: [
      "A espresso ratio describes how much liquid you extract relative to the dry coffee dose. A 1:2 ratio from an 18g dose yields 36g of liquid espresso.",
      "If your shot tastes sour, your extraction is likely under-developed — grind finer or extend the brew time slightly.",
      "If it tastes bitter or harsh, you've likely over-extracted — grind coarser or pull the shot shorter.",
      "Our Midnight Espresso Blend is dialed for an 18g in, 36g out, 28-30 second shot, but every grinder and machine is different — use this as a starting point, not a rule.",
    ],
  },
  {
    id: "j6",
    slug: "milk-texturing-latte-art-basics",
    title: "Milk Texturing & Latte Art Basics",
    excerpt:
      "The physics of microfoam, and the pour technique behind a clean heart or rosetta.",
    category: "Craft",
    readMinutes: 6,
    date: "2026-05-14",
    coverImage: img("latte", 0, "Latte art poured in a ceramic cup"),
    body: [
      "Good latte art starts before the pour — with properly textured milk. Aim for microfoam: tiny, uniform bubbles that give milk a glossy, paint-like consistency.",
      "Submerge the steam wand just below the surface at an angle to create a whirlpool, introducing air only in the first few seconds, then tucking the tip deeper to texture without adding more volume.",
      "For a heart, pour from height to fill the cup, then drop low and pour through the center in the last second, pulling through to finish the point.",
      "Practice with our Midnight Espresso Blend — its thick, stable crema gives you a longer working window to perfect your pour.",
    ],
  },
];

export function getArticleBySlug(slug: string) {
  return JOURNAL_ARTICLES.find((a) => a.slug === slug);
}
