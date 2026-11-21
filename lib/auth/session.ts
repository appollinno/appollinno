import { cookies } from "next/headers";
import { getUserBySessionToken, toPublicUser } from "@/lib/auth/store";

const SESSION_COOKIE = "appollo_session";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const user = getUserBySessionToken(token);
  return user ? toPublicUser(user) : null;
}

export async function getCurrentAdmin() {
  const user = await getCurrentUser();
  return user?.role === "admin" ? user : null;
}
