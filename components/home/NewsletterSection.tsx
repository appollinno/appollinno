import { NewsletterForm } from "@/components/home/NewsletterForm";

export function NewsletterSection() {
  return (
    <section className="border-y border-border bg-ivory py-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 text-center md:px-8">
        <h2 className="font-display text-3xl tracking-tight-display md:text-4xl">
          Join the Appollo List
        </h2>
        <p className="mt-3 max-w-md text-foreground-muted">
          Roast-day notifications, brewing guides, and 10% off your first
          order — no spam, unsubscribe anytime.
        </p>
        <div className="mt-8 flex w-full justify-center">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
