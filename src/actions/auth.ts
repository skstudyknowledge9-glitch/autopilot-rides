"use server";

import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { signToken, setAuthCookie, removeAuthCookie } from "@/lib/auth";

export async function loginAdmin(username: string, passwordPlain: string) {
  const db = getDb();

  // Hash password using Web Crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(passwordPlain);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.username, username), eq(users.passwordHash, hashHex)))
    .limit(1);

  if (user.length === 0) {
    return { error: "Invalid credentials" };
  }

  const token = await signToken({
    userId: user[0].id,
    username: user[0].username,
    role: user[0].role || "admin",
  });

  await setAuthCookie(token);
  return { success: true };
}

export async function logoutAdmin() {
  await removeAuthCookie();
  return { success: true };
}
