import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

// Next.js can compile different routes (route handlers vs. pages) into
// separate module graphs, even within one `next start` process — so a
// plain module-level `Map` is NOT reliably shared across them (a write in
// one route handler may be invisible to a page rendered by a different
// bundle). This file-backed store sidesteps that by always reading from
// and writing straight to disk, which is one real, shared resource no
// matter how the JS modules get split up.
//
// This is still a MOCK persistence layer for local development and demos
// only — replace with Supabase/Postgres (see supabase/migrations) before
// production. It will not work on read-only/ephemeral filesystems (e.g.
// standard Vercel serverless deployments).
const DATA_DIR = path.join(process.cwd(), ".data");

function filePath(name: string) {
  return path.join(DATA_DIR, `${name}.json`);
}

function lockPath(name: string) {
  return path.join(DATA_DIR, `${name}.lock`);
}

function acquireLock(name: string, retries = 50) {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  const lock = lockPath(name);
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // "wx" fails if the file already exists — a simple mutual-exclusion
      // primitive, sufficient for this mock store's low write volume.
      closeSync(openSync(lock, "wx"));
      return;
    } catch {
      // Busy-wait briefly; fine for a dev/demo store, not a production lock.
      const until = Date.now() + 20;
      while (Date.now() < until) {
        /* spin */
      }
    }
  }
  throw new Error(`Timed out acquiring lock for store "${name}"`);
}

function releaseLock(name: string) {
  try {
    unlinkSync(lockPath(name));
  } catch {
    // already released or never created — fine.
  }
}

export function readStore<T>(name: string, fallback: T): T {
  try {
    const raw = readFileSync(filePath(name), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStore<T>(name: string, data: T): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(filePath(name), JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Atomically read-modify-write a store: acquires an exclusive lock, loads
 * the current value (or `fallback`), passes it to `mutate` (which returns
 * the next value to persist), writes it, then releases the lock. Using
 * this instead of separate readStore/writeStore calls is what actually
 * prevents two concurrent requests from racing on the same file.
 */
export function withStore<T, R>(
  name: string,
  fallback: T,
  mutate: (current: T) => { next: T; result: R }
): R {
  acquireLock(name);
  try {
    const current = readStore<T>(name, fallback);
    const { next, result } = mutate(current);
    writeStore(name, next);
    return result;
  } finally {
    releaseLock(name);
  }
}
