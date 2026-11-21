import type { Metadata } from "next";
import { StoryBlock } from "@/components/story/StoryBlock";
import { img } from "@/lib/data/images";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "How Appollo Coffee Shop sources, roasts, and ships specialty coffee — and why sustainability sits at the center of it.",
};

export default function OurStoryPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-28 md:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Our Story
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight-display md:text-6xl">
          Coffee, Traced Back to Its Source
        </h1>
        <p className="mt-6 text-lg text-foreground-muted">
          Appollo started in 2019 with a simple frustration: most coffee on
          shelves told you nothing about where it came from, or who grew it.
          We set out to build a roaster that treats sourcing as seriously as
          the roast itself.
        </p>
      </div>

      <div className="mt-8 divide-y divide-border">
        <StoryBlock
          eyebrow="Beginnings"
          title="A roaster built on curiosity"
          paragraphs={[
            "Appollo Coffee Shop opened as a single roaster in a converted warehouse, with one cupping table and a list of farms we wanted to visit in person before buying a single bag of green coffee.",
            "That principle hasn't changed. Every origin on our shelf is one our buying team has either visited directly or sourced through an importer we've worked with for years and trust completely.",
          ]}
          image={img("roasting", 0, "Roaster working at a commercial coffee roasting machine")}
        />

        <StoryBlock
          eyebrow="Sourcing"
          title="Direct relationships, fair pricing"
          reverse
          paragraphs={[
            "We pay above Fairtrade minimums on every contract, and publish the price we paid for each origin on its product page — not because we're required to, but because transparency is the whole point.",
            "Long-term contracts give our partner farms and cooperatives the stability to invest in processing infrastructure, which is where a huge amount of cup quality is actually won or lost.",
          ]}
          image={img("plantation", 0, "Coffee farm terraces on a hillside")}
        />

        <StoryBlock
          eyebrow="Growers"
          title="The people behind every lot"
          paragraphs={[
            "From the Konga Cooperative in Ethiopia's Gedeo Zone to smallholder family farms in Huila, Colombia, every origin page on our site names the specific farm or cooperative behind that coffee.",
            "We believe knowing who grew your coffee — and how — makes the cup taste like more than just caffeine.",
          ]}
          image={img("coffeeplant", 0, "Coffea arabica plant with ripening cherries")}
        />

        <StoryBlock
          eyebrow="Sustainability"
          title="Shade-grown, low-impact, accountable"
          reverse
          paragraphs={[
            "Over 80% of the coffee we buy is shade-grown under native canopy, which protects biodiversity and reduces the need for chemical fertilizer.",
            "Our bags are compostable kraft with a home-compostable inner lining, and we offset shipping emissions on every order over 1kg. We're not perfect yet — but we report our numbers honestly in our annual sourcing report.",
          ]}
          image={img("cherries", 0, "Ripe coffee cherries on the branch")}
        />

        <StoryBlock
          eyebrow="Roasting Philosophy"
          title="Roast to reveal, not to disguise"
          paragraphs={[
            "We roast to highlight what's distinctive about an origin, not to flatten every bag into the same dark, generic profile. That means lighter roasts on washed, high-altitude lots, and more development time on naturals and lower-altitude coffees that need it.",
            "Every batch is logged and cupped before it ships. If it doesn't taste the way that lot should, it doesn't go out the door.",
          ]}
          image={img("barista", 0, "Barista preparing coffee with care")}
        />
      </div>
    </div>
  );
}
