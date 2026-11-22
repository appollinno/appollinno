import { Hero } from "@/components/home/Hero";
import { IntroStatement } from "@/components/home/IntroStatement";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { BestSellers } from "@/components/home/BestSellers";
import { CraftsmanshipStory } from "@/components/home/CraftsmanshipStory";
import { BrewingExperience } from "@/components/home/BrewingExperience";
import { Testimonials } from "@/components/home/Testimonials";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { PRODUCTS } from "@/lib/data/products";
import { TESTIMONIALS } from "@/lib/data/testimonials";
import { img } from "@/lib/data/images";

const featured = PRODUCTS.filter((p) => p.featured);
const bestSellers = PRODUCTS.filter((p) => p.bestSeller);

const brewingSteps = [
  {
    title: "Grind Fresh",
    description:
      "Grind just before brewing — a burr grinder set to medium-fine keeps extraction even and consistent.",
    image: img("beans_closeup", 2, "Freshly ground coffee beans"),
  },
  {
    title: "Bloom & Pour",
    description:
      "Bloom with twice the coffee's weight in water, then pour in slow, steady circles for an even extraction.",
    image: img("pourover", 0, "Pouring water over coffee in a brewing setup"),
  },
  {
    title: "Pour & Savour",
    description:
      "Let it drawdown fully, then pour into your favourite cup. Taste, adjust, and brew again tomorrow.",
    image: img("latte", 1, "Finished cup of coffee with latte art"),
  },
];

export default function Home() {
  return (
    <>
      <Hero image={img("plantation", 2, "Sunlit coffee farm terraces at golden hour")} />
      <IntroStatement />
      <FeaturedCollection products={featured} />
      <BestSellers products={bestSellers} />
      <CraftsmanshipStory image={img("roasting", 0, "Roaster tending a commercial coffee roasting drum")} />
      <BrewingExperience steps={brewingSteps} />
      <Testimonials testimonials={TESTIMONIALS} />
      <NewsletterSection />
    </>
  );
}
