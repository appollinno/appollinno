import type { Product } from "@/lib/types";
import { img } from "@/lib/data/images";

function variants(
  base: number,
  overrides?: Partial<{ stock250: number; stock500: number; stock1kg: number }>
): Product["variants"] {
  const { stock250 = 42, stock500 = 24, stock1kg = 10 } = overrides ?? {};
  return [
    {
      id: "250g",
      weightGrams: 250,
      label: "250g Bag",
      priceCents: base,
      sku: "",
      stock: stock250,
    },
    {
      id: "500g",
      weightGrams: 500,
      label: "500g Bag",
      priceCents: Math.round(base * 1.8),
      sku: "",
      stock: stock500,
    },
    {
      id: "1kg",
      weightGrams: 1000,
      label: "1kg Bag",
      priceCents: Math.round(base * 3.3),
      sku: "",
      stock: stock1kg,
    },
  ];
}

function withSku(id: string, list: Product["variants"]): Product["variants"] {
  return list.map((v) => ({ ...v, sku: `APC-${id}-${v.weightGrams}` }));
}

export const PRODUCTS: Product[] = [
  {
    id: "ethiopia-yirgacheffe",
    slug: "ethiopia-yirgacheffe",
    name: "Ethiopia Yirgacheffe",
    category: "Single Origin",
    tagline: "Bergamot, jasmine, and bright stone fruit",
    description:
      "Grown above 1,900 meters in the birthplace of Arabica, this washed Yirgacheffe is floral and luminous — the lot we return to every harvest. Expect a tea-like body with a citrus-blossom finish that lingers long after the cup cools.",
    origin: {
      country: "Ethiopia",
      region: "Yirgacheffe, Gedeo Zone",
      farmOrCooperative: "Konga Cooperative",
      altitudeMeters: [1900, 2200],
    },
    roastLevel: "Light",
    process: "Washed",
    tastingNotes: ["Jasmine", "Bergamot", "Peach", "Honey"],
    brewingRecommendations: [
      { method: "Pour Over (V60)", ratio: "1:16", time: "2:45" },
      { method: "Chemex", ratio: "1:17", time: "4:00" },
      { method: "Aeropress", ratio: "1:14", time: "1:30" },
    ],
    images: [
      img("beans_closeup", 0, "Light-roasted Ethiopia Yirgacheffe beans"),
      img("cherries", 0, "Ripe coffee cherries on the branch in Ethiopia"),
      img("plantation", 0, "Highland coffee plantation at altitude"),
    ],
    variants: withSku("ETH-YIR", variants(1650)),
    rating: 4.8,
    reviewCount: 212,
    reviews: [
      {
        id: "r1",
        author: "Marcus T.",
        rating: 5,
        title: "Cleanest cup I've brewed all year",
        body: "Floral, bright, almost tea-like. V60 at 1:16 is the sweet spot.",
        date: "2026-09-02",
      },
      {
        id: "r2",
        author: "Priya N.",
        rating: 5,
        title: "Jasmine in a cup, no joke",
        body: "This is what got me into light roasts. Zero bitterness.",
        date: "2026-08-14",
      },
    ],
    bestSeller: true,
    featured: true,
  },
  {
    id: "colombia-huila",
    slug: "colombia-huila",
    name: "Colombia Huila",
    category: "Single Origin",
    tagline: "Caramel sweetness, red apple, cocoa",
    description:
      "Sourced from smallholder farms in the volcanic soils of Huila, this caramel-forward cup is the house favourite for a reason: balanced, sweet, and forgiving across every brew method.",
    origin: {
      country: "Colombia",
      region: "Huila",
      farmOrCooperative: "Cooperativa Agrocafe",
      altitudeMeters: [1600, 1900],
    },
    roastLevel: "Medium",
    process: "Washed",
    tastingNotes: ["Caramel", "Red Apple", "Cocoa", "Brown Sugar"],
    brewingRecommendations: [
      { method: "Drip / Batch Brew", ratio: "1:16", time: "5:00" },
      { method: "Pour Over (V60)", ratio: "1:15", time: "3:00" },
      { method: "Espresso", ratio: "1:2", time: "0:28" },
    ],
    images: [
      img("beans_closeup", 1, "Medium-roast Colombia Huila coffee beans"),
      img("plantation", 1, "Coffee farm in the hills of Huila, Colombia"),
      img("cherries", 1, "Hand holding ripe coffee cherries"),
    ],
    variants: withSku("COL-HUI", variants(1450)),
    rating: 4.7,
    reviewCount: 304,
    reviews: [
      {
        id: "r1",
        author: "Diane K.",
        rating: 5,
        title: "Our everyday bag",
        body: "Balanced, sweet, never bitter. Great for drip or espresso.",
        date: "2026-10-01",
      },
      {
        id: "r2",
        author: "Olu A.",
        rating: 4,
        title: "Reliable and smooth",
        body: "Consistent bag to bag. Caramel notes really come through.",
        date: "2026-07-22",
      },
    ],
    bestSeller: true,
  },
  {
    id: "kenya-nyeri-aa",
    slug: "kenya-nyeri-aa",
    name: "Kenya Nyeri AA",
    category: "Single Origin",
    tagline: "Blackcurrant, tomato, vivid acidity",
    description:
      "A double-A grade lot from the slopes of Mount Kenya, washed and sun-dried for a cup with signature Kenyan brightness — juicy, winey, and structured with a long blackcurrant finish.",
    origin: {
      country: "Kenya",
      region: "Nyeri County",
      farmOrCooperative: "Gathaithi Factory",
      altitudeMeters: [1700, 2000],
    },
    roastLevel: "Light",
    process: "Washed",
    tastingNotes: ["Blackcurrant", "Tomato", "Grapefruit", "Brown Spice"],
    brewingRecommendations: [
      { method: "Pour Over (V60)", ratio: "1:16", time: "2:50" },
      { method: "Aeropress", ratio: "1:13", time: "1:45" },
      { method: "Cupping / Immersion", ratio: "1:18", time: "4:00" },
    ],
    images: [
      img("beans_closeup", 2, "Kenya AA grade green-tinted roasted beans"),
      img("cherries", 2, "Ripe red coffee cherries ready for harvest"),
      img("plantation", 2, "Coffee plantation terraces on volcanic slopes"),
    ],
    variants: withSku("KEN-NYE", variants(1750)),
    rating: 4.6,
    reviewCount: 128,
    reviews: [
      {
        id: "r1",
        author: "Grace M.",
        rating: 5,
        title: "Vivid and juicy",
        body: "Tastes like berries. Not for people who want a 'safe' cup.",
        date: "2026-06-18",
      },
    ],
    new: true,
  },
  {
    id: "guatemala-antigua",
    slug: "guatemala-antigua",
    name: "Guatemala Antigua",
    category: "Single Origin",
    tagline: "Chocolate, spice, and smoky depth",
    description:
      "Shade-grown in volcanic soil around Antigua, this cup delivers a rounded, chocolatey body with a gentle spice and smoky undertone — a favourite for espresso and moka pot alike.",
    origin: {
      country: "Guatemala",
      region: "Antigua Valley",
      farmOrCooperative: "Finca El Injerto",
      altitudeMeters: [1500, 1700],
    },
    roastLevel: "Medium-Dark",
    process: "Washed",
    tastingNotes: ["Dark Chocolate", "Clove", "Toasted Nut", "Molasses"],
    brewingRecommendations: [
      { method: "Espresso", ratio: "1:2.2", time: "0:30" },
      { method: "Moka Pot", ratio: "1:10", time: "4:30" },
      { method: "Drip / Batch Brew", ratio: "1:16", time: "5:00" },
    ],
    images: [
      img("beans_closeup", 3, "Dark roasted Guatemala Antigua coffee beans"),
      img("roasting", 0, "Coffee roaster drum roasting beans"),
      img("plantation", 3, "Volcanic highland coffee farm in Guatemala"),
    ],
    variants: withSku("GUA-ANT", variants(1550)),
    rating: 4.7,
    reviewCount: 176,
    reviews: [
      {
        id: "r1",
        author: "Fernando R.",
        rating: 5,
        title: "Best espresso bag we sell",
        body: "Rich crema, chocolate forward. My go-to.",
        date: "2026-09-29",
      },
    ],
    bestSeller: true,
  },
  {
    id: "sumatra-mandheling",
    slug: "sumatra-mandheling",
    name: "Sumatra Mandheling",
    category: "Single Origin",
    tagline: "Earthy, syrupy, cedar and dark cherry",
    description:
      "Processed using the traditional Indonesian 'giling basah' wet-hulling method, this Mandheling is heavy-bodied and low-acid with earthy, cedar-like depth — a cup built for cool mornings.",
    origin: {
      country: "Indonesia",
      region: "North Sumatra",
      farmOrCooperative: "Mandheling Smallholder Collective",
      altitudeMeters: [1100, 1500],
    },
    roastLevel: "Dark",
    process: "Natural",
    tastingNotes: ["Cedar", "Dark Cherry", "Earth", "Tobacco"],
    brewingRecommendations: [
      { method: "French Press", ratio: "1:15", time: "4:00" },
      { method: "Espresso", ratio: "1:2", time: "0:30" },
      { method: "Cold Brew", ratio: "1:8", time: "16:00" },
    ],
    images: [
      img("beans_closeup", 4, "Dark roast Sumatra Mandheling coffee beans"),
      img("frenchpress", 0, "French press brewing dark roast coffee"),
      img("coffeeplant", 0, "Coffee plant leaves in Sumatran highlands"),
    ],
    variants: withSku("SUM-MAN", variants(1500)),
    rating: 4.5,
    reviewCount: 94,
    reviews: [
      {
        id: "r1",
        author: "James O.",
        rating: 4,
        title: "Heavy and earthy",
        body: "Great in a French press. Not for the faint of heart.",
        date: "2026-05-11",
      },
    ],
  },
  {
    id: "rwanda-nyamasheke",
    slug: "rwanda-nyamasheke",
    name: "Rwanda Nyamasheke",
    category: "Single Origin",
    tagline: "Red currant, orange zest, delicate florals",
    description:
      "Grown along the shores of Lake Kivu by women-led smallholder cooperatives, this lot is vibrant and delicate — a rising star among East African coffees with a clean, fruited finish.",
    origin: {
      country: "Rwanda",
      region: "Nyamasheke, Lake Kivu",
      farmOrCooperative: "Abahuzamugambi Cooperative",
      altitudeMeters: [1700, 1950],
    },
    roastLevel: "Light",
    process: "Washed",
    tastingNotes: ["Red Currant", "Orange Zest", "Floral", "Light Honey"],
    brewingRecommendations: [
      { method: "Pour Over (V60)", ratio: "1:16", time: "2:45" },
      { method: "Aeropress", ratio: "1:14", time: "1:40" },
    ],
    images: [
      img("beans_closeup", 5, "Light roast Rwanda Nyamasheke coffee beans"),
      img("cherries", 3, "Coffee cherries from Lake Kivu region"),
    ],
    variants: withSku("RWA-NYA", variants(1700)),
    rating: 4.6,
    reviewCount: 61,
    reviews: [
      {
        id: "r1",
        author: "Helena S.",
        rating: 5,
        title: "A beautiful discovery",
        body: "Delicate and fruited, like orange blossom tea with body.",
        date: "2026-08-30",
      },
    ],
    new: true,
  },
  {
    id: "costa-rica-tarrazu",
    slug: "costa-rica-tarrazu",
    name: "Costa Rica Tarrazú",
    category: "Single Origin",
    tagline: "Honey-processed, orange marmalade, toffee",
    description:
      "Honey-processed on raised beds above San Marcos de Tarrazú, this cup is syrupy and sweet with marmalade acidity and a long toffee finish — a brewer's favourite for its consistency.",
    origin: {
      country: "Costa Rica",
      region: "Tarrazú",
      farmOrCooperative: "Finca La Pastora",
      altitudeMeters: [1500, 1800],
    },
    roastLevel: "Medium",
    process: "Honey",
    tastingNotes: ["Orange Marmalade", "Toffee", "Almond", "Vanilla"],
    brewingRecommendations: [
      { method: "Pour Over (V60)", ratio: "1:15", time: "3:00" },
      { method: "Drip / Batch Brew", ratio: "1:16", time: "5:00" },
    ],
    images: [
      img("beans_closeup", 6, "Medium roast Costa Rica Tarrazu coffee beans"),
      img("plantation", 4, "Coffee farm terraces in Tarrazu, Costa Rica"),
    ],
    variants: withSku("CRI-TAR", variants(1600)),
    rating: 4.6,
    reviewCount: 88,
    reviews: [
      {
        id: "r1",
        author: "Ana L.",
        rating: 5,
        title: "Syrupy and sweet",
        body: "Tastes like marmalade on toast. Love this one.",
        date: "2026-04-19",
      },
    ],
  },
  {
    id: "brazil-cerrado",
    slug: "brazil-cerrado",
    name: "Brazil Cerrado",
    category: "Single Origin",
    tagline: "Hazelnut, milk chocolate, low acidity",
    description:
      "A natural-processed lot from the high plains of Cerrado Mineiro, nutty and smooth with a soft, round body — an ideal everyday cup and the backbone of our house blends.",
    origin: {
      country: "Brazil",
      region: "Cerrado Mineiro",
      farmOrCooperative: "Fazenda Santa Inês",
      altitudeMeters: [1000, 1250],
    },
    roastLevel: "Medium",
    process: "Natural",
    tastingNotes: ["Hazelnut", "Milk Chocolate", "Caramel", "Low Acidity"],
    brewingRecommendations: [
      { method: "Espresso", ratio: "1:2", time: "0:27" },
      { method: "Drip / Batch Brew", ratio: "1:16", time: "5:00" },
    ],
    images: [
      img("beans_closeup", 7, "Medium roast Brazil Cerrado coffee beans"),
      img("roasting", 1, "Coffee beans cooling after roasting"),
    ],
    variants: withSku("BRA-CER", variants(1350)),
    rating: 4.5,
    reviewCount: 142,
    reviews: [
      {
        id: "r1",
        author: "Tomás V.",
        rating: 4,
        title: "Solid daily driver",
        body: "Nutty, smooth, never fails. Great value too.",
        date: "2026-03-02",
      },
    ],
  },
  {
    id: "signature-house-blend",
    slug: "signature-house-blend",
    name: "Signature House Blend",
    category: "Blends",
    tagline: "Our founding roast — balanced, bold, year-round",
    description:
      "A rotating blend of Brazilian and Colombian lots, roasted to showcase chocolate and caramel with just enough brightness to keep things interesting. The bag we started Appollo with.",
    origin: {
      country: "Brazil & Colombia",
      region: "Cerrado Mineiro & Huila",
      farmOrCooperative: "Appollo Blend Program",
      altitudeMeters: [1200, 1800],
    },
    roastLevel: "Medium",
    process: "Washed",
    tastingNotes: ["Milk Chocolate", "Caramel", "Walnut", "Soft Citrus"],
    brewingRecommendations: [
      { method: "Drip / Batch Brew", ratio: "1:16", time: "5:00" },
      { method: "Espresso", ratio: "1:2", time: "0:28" },
      { method: "French Press", ratio: "1:15", time: "4:00" },
    ],
    images: [
      img("packaging", 0, "Coffee bag packaging for signature house blend"),
      img("beans_closeup", 8, "Blended medium roast coffee beans"),
    ],
    variants: withSku("SIG-HSE", variants(1250)),
    rating: 4.8,
    reviewCount: 410,
    reviews: [
      {
        id: "r1",
        author: "Rae P.",
        rating: 5,
        title: "The bag I buy on autopilot",
        body: "Never disappoints, works in every brewer I own.",
        date: "2026-10-12",
      },
    ],
    bestSeller: true,
    featured: true,
  },
  {
    id: "midnight-espresso-blend",
    slug: "midnight-espresso-blend",
    name: "Midnight Espresso Blend",
    category: "Blends",
    tagline: "Dark, syrupy, built for milk drinks",
    description:
      "A dark-roasted blend engineered for espresso — thick crema, dark chocolate and roasted almond, cuts cleanly through milk without turning bitter.",
    origin: {
      country: "Guatemala & Indonesia",
      region: "Antigua & North Sumatra",
      farmOrCooperative: "Appollo Blend Program",
      altitudeMeters: [1100, 1700],
    },
    roastLevel: "Dark",
    process: "Natural",
    tastingNotes: ["Dark Chocolate", "Roasted Almond", "Molasses", "Cedar"],
    brewingRecommendations: [
      { method: "Espresso", ratio: "1:2.2", time: "0:30" },
      { method: "Moka Pot", ratio: "1:10", time: "4:30" },
    ],
    images: [
      img("barista", 0, "Barista pulling an espresso shot"),
      img("latte", 0, "Latte art poured over espresso"),
    ],
    variants: withSku("MID-ESP", variants(1400)),
    rating: 4.7,
    reviewCount: 198,
    reviews: [
      {
        id: "r1",
        author: "Carla B.",
        rating: 5,
        title: "Perfect for flat whites",
        body: "Thick crema, cuts through milk beautifully.",
        date: "2026-07-07",
      },
    ],
    bestSeller: true,
  },
  {
    id: "decaf-colombia-swiss-water",
    slug: "decaf-colombia-swiss-water",
    name: "Decaf Colombia (Swiss Water Process)",
    category: "Decaf",
    tagline: "All the flavour, none of the caffeine",
    description:
      "Decaffeinated using the chemical-free Swiss Water Process, this Colombian lot keeps its caramel sweetness and body — proof that decaf doesn't mean flavourless.",
    origin: {
      country: "Colombia",
      region: "Huila",
      farmOrCooperative: "Cooperativa Agrocafe",
      altitudeMeters: [1600, 1900],
    },
    roastLevel: "Medium",
    process: "Washed",
    tastingNotes: ["Caramel", "Cocoa", "Soft Citrus", "Round Body"],
    brewingRecommendations: [
      { method: "Drip / Batch Brew", ratio: "1:16", time: "5:00" },
      { method: "Pour Over (V60)", ratio: "1:15", time: "3:00" },
    ],
    images: [
      img("dripcoffee", 0, "Drip coffee maker brewing decaf coffee"),
      img("beans_closeup", 9, "Decaf medium roast coffee beans"),
    ],
    variants: withSku("DEC-COL", variants(1500)),
    rating: 4.4,
    reviewCount: 57,
    reviews: [
      {
        id: "r1",
        author: "Nina F.",
        rating: 4,
        title: "Genuinely tastes like coffee",
        body: "Finally a decaf that isn't watery or flat.",
        date: "2026-02-14",
      },
    ],
  },
];

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  )
    .slice(0, limit)
    .concat(
      PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category)
    )
    .slice(0, limit);
}

export const CATEGORIES = [
  "Single Origin",
  "Blends",
  "Decaf",
] as const;
