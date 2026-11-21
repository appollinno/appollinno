import { randomBytes, randomUUID, pbkdf2Sync } from "node:crypto";
import { readStore, withStore } from "@/lib/server-store";

// Mock, file-backed auth store for local development and demos only.
// This is NOT production-ready: there is no email verification, rate
// limiting, or password-reset flow, and the data file is plaintext on
// disk. Replace with Supabase Auth (see supabase/migrations/0001_init.sql,
// which already models `customers` as 1:1 with `auth.users`) before going
// live. See lib/server-store.ts for why this reads/writes a file instead
// of keeping state in a module-level Map.

export type UserRole = "customer" | "admin";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  createdAt: string;
}

interface AuthData {
  users: MockUser[];
  sessions: Record<string, string>; // token -> user id
}

const STORE_NAME = "auth";
const EMPTY: AuthData = { users: [], sessions: {} };

function load(): AuthData {
  return readStore<AuthData>(STORE_NAME, EMPTY);
}

function hashPassword(password: string, salt: string) {
  return pbkdf2Sync(password, salt, 100_000, 64, "sha256").toString("hex");
}

export function createUser(
  name: string,
  email: string,
  password: string,
  role: UserRole = "customer"
) {
  return withStore<AuthData, MockUser>(STORE_NAME, EMPTY, (data) => {
    const key = email.toLowerCase();
    if (data.users.some((u) => u.email === key)) {
      throw new Error("An account with that email already exists.");
    }
    const salt = randomBytes(16).toString("hex");
    const user: MockUser = {
      id: randomUUID(),
      name,
      email: key,
      passwordHash: hashPassword(password, salt),
      salt,
      role,
      createdAt: new Date().toISOString(),
    };
    return { next: { ...data, users: [...data.users, user] }, result: user };
  });
}

// Dev-only seed admin account so the /admin dashboard can be exercised
// without a real identity provider wired up yet. Replace with Supabase
// Auth + a `role` claim (or a `customers.role` column) before production,
// and remove this seed entirely.
const ADMIN_SEED_EMAIL = "admin@appollo.coffee";
const ADMIN_SEED_PASSWORD = process.env.ADMIN_SEED_PASSWORD ?? "AppolloAdmin!2026";

function ensureAdminSeed() {
  const data = load();
  if (data.users.some((u) => u.email === ADMIN_SEED_EMAIL)) return;
  try {
    createUser("Appollo Admin", ADMIN_SEED_EMAIL, ADMIN_SEED_PASSWORD, "admin");
  } catch {
    // Another module instance / process won the race and seeded it first — fine.
  }
}
ensureAdminSeed();

export function verifyUser(email: string, password: string) {
  const data = load();
  const user = data.users.find((u) => u.email === email.toLowerCase());
  if (!user) return null;
  const hash = hashPassword(password, user.salt);
  return hash === user.passwordHash ? user : null;
}

export function createSession(userId: string) {
  return withStore<AuthData, string>(STORE_NAME, EMPTY, (data) => {
    const token = randomBytes(32).toString("hex");
    return {
      next: { ...data, sessions: { ...data.sessions, [token]: userId } },
      result: token,
    };
  });
}

export function getUserBySessionToken(token: string | undefined) {
  if (!token) return null;
  const data = load();
  const userId = data.sessions[token];
  if (!userId) return null;
  return data.users.find((u) => u.id === userId) ?? null;
}

export function deleteSession(token: string | undefined) {
  if (!token) return;
  withStore<AuthData, void>(STORE_NAME, EMPTY, (data) => {
    const sessions = { ...data.sessions };
    delete sessions[token];
    return { next: { ...data, sessions }, result: undefined };
  });
}

export function listUsers() {
  return [...load().users].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function toPublicUser(user: MockUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}
