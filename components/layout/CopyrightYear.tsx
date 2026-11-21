"use client";

import { useSyncExternalStore } from "react";

// The year genuinely differs between the server's prerender and the
// client, so useSyncExternalStore (not a setState-in-effect, which
// eslint-plugin-react-hooks now flags) is the React-recommended way to
// read it: getServerSnapshot supplies the build-time fallback for SSR,
// and getSnapshot supplies the real value once mounted in the browser.
function subscribe() {
  return () => {};
}

function getSnapshot() {
  return new Date().getFullYear();
}

const BUILD_YEAR_FALLBACK = 2026;
function getServerSnapshot() {
  return BUILD_YEAR_FALLBACK;
}

export function CopyrightYear() {
  const year = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return <>{year}</>;
}
