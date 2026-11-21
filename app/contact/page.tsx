import type { Metadata } from "next";
import { MapPin, Mail, Phone } from "lucide-react";
import { InstagramIcon, FacebookIcon, YoutubeIcon } from "@/components/icons/SocialIcons";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Appollo Coffee Shop — support, wholesale, and press.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-28 md:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Contact
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight-display md:text-5xl">
          We&apos;d Love to Hear From You
        </h1>
        <p className="mt-4 text-foreground-muted">
          Questions about an order, wholesale inquiries, or just want to talk
          coffee — reach out below.
        </p>
      </div>

      <div className="mt-14 grid gap-14 md:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="font-display text-xl">Business Information</h2>
          <ul className="mt-6 space-y-5 text-sm">
            <li className="flex gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-accent" />
              <span>
                Appollo Coffee Shop Roastery
                <br />
                Avenida 24 de Julho, Maputo, Mozambique
              </span>
            </li>
            <li className="flex gap-3">
              <Mail size={18} className="mt-0.5 shrink-0 text-accent" />
              <a href="mailto:hello@appollo.coffee" className="hover:underline">
                hello@appollo.coffee
              </a>
            </li>
            <li className="flex gap-3">
              <Phone size={18} className="mt-0.5 shrink-0 text-accent" />
              <a href="tel:+258840000000" className="hover:underline">
                +258 84 000 0000
              </a>
            </li>
          </ul>

          <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-foreground-muted">
            Hours
          </h3>
          <p className="mt-2 text-sm text-foreground-muted">
            Monday – Saturday, 7:00 – 18:00
            <br />
            Sunday, 8:00 – 14:00
          </p>

          <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-foreground-muted">
            Follow Us
          </h3>
          <div className="mt-3 flex gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Instagram"
              className="text-foreground-muted hover:text-foreground"
            >
              <InstagramIcon size={20} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Facebook"
              className="text-foreground-muted hover:text-foreground"
            >
              <FacebookIcon size={20} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="YouTube"
              className="text-foreground-muted hover:text-foreground"
            >
              <YoutubeIcon size={20} />
            </a>
          </div>

          <a
            href="https://www.openstreetmap.org/search?query=Avenida%2024%20de%20Julho%2C%20Maputo%2C%20Mozambique"
            target="_blank"
            rel="noreferrer noopener"
            className="mt-10 inline-block border-b border-foreground pb-1 text-sm font-semibold uppercase tracking-wide"
          >
            Get Directions →
          </a>
        </div>

        <div>
          <h2 className="font-display text-xl">Send a Message</h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
