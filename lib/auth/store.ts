import { randomBytes, randomUUID, pbkdf2Sync } from "node:crypto";

// Mock, in-memory auth store for local development and demos only.
// This is NOT production-ready: data is lost on every restart and there is
// no email verification, rate limiting, or password-reset flow. Replace
// with Supabase Auth (see supabase/migrations/0001_init.sql, which already
// models `customers` as 1:1 with `auth.users`) before going live.

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

const users = new Map<string, MockUser>(); // keyed by lowercased email
const sessions = new Map<string, string>(); // token -> user id

function hashPassword(password: string, salt: string) {
  return pbkdf2Sync(password, salt, 100_000, 64, "sha256").toString("hex");
}

export function createUser(
  name: string,
  email: string,
  password: string,
  role: UserRole = "customer"
) {
  const key = email.toLowerCase();
  if (users.has(key)) {
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
  users.set(key, user);
  return user;
}

// Dev-only seed admin account so the /admin dashboard can be exercised
// without a real identity provider wired up yet. Replace with Supabase
// Auth + a `role` claim (or a `customers.role` column) before production,
// and remove this seed entirely.
const ADMIN_SEED_EMAIL = "admin@appollo.coffee";
const ADMIN_SEED_PASSWORD = process.env.ADMIN_SEED_PASSWORD ?? "AppolloAdmin!2026";
if (!users.has(ADMIN_SEED_EMAIL)) {
  createUser("Appollo Admin", ADMIN_SEED_EMAIL, ADMIN_SEED_PASSWORD, "admin");
}

export function verifyUser(email: string, password: string) {
  const user = users.get(email.toLowerCase());
  if (!user) return null;
  const hash = hashPassword(password, user.salt);
  return hash === user.passwordHash ? user : null;
}

export function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  sessions.set(token, userId);
  return token;
}

export function getUserBySessionToken(token: string | undefined) {
  if (!token) return null;
  const userId = sessions.get(token);
  if (!userId) return null;
  for (const user of users.values()) {
    if (user.id === userId) return user;
  }
  return null;
}

export function deleteSession(token: string | undefined) {
  if (token) sessions.delete(token);
}

export function listUsers() {
  return Array.from(users.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
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
