"use client";

import { useEffect, useState } from "react";

// A static fallback for SSR/prerendering (Next.js's Cache Components
// validator flags any `new Date()` read during prerendering, even inside a
// Client Component, since its SSR pass still executes the render). The
// real year is filled in client-side after mount, per Next's own
// recommended fix ("defer the read into useEffect").
const BUILD_YEAR_FALLBACK = 2026;

export function CopyrightYear() {
  const [year, setYear] = useState(BUILD_YEAR_FALLBACK);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <>{year}</>;
}
