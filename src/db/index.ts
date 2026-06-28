import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getDb() {
  const { env } = getCloudflareContext();
  if (!env || !env.DB) {
    throw new Error("Cloudflare D1 binding (DB) is missing.");
  }
  return drizzle(env.DB, { schema });
}
