"use server";

import { getDb } from "@/db";
import { cars } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getAllCars(filters?: { company?: string; fuelVariant?: string; cityLocation?: string }) {
  const db = getDb();
  let query = db.select().from(cars);

  const conditions = [];
  if (filters?.company) conditions.push(eq(cars.company, filters.company));
  if (filters?.fuelVariant) conditions.push(eq(cars.fuelVariant, filters.fuelVariant));
  if (filters?.cityLocation) conditions.push(eq(cars.cityLocation, filters.cityLocation));

  if (conditions.length > 0) {
    // @ts-ignore
    query = query.where(and(...conditions));
  }

  const results = await query;
  return results;
}

export async function getCarById(id: number) {
  const db = getDb();
  const result = await db.select().from(cars).where(eq(cars.id, id)).limit(1);
  return result[0];
}

export async function createCar(data: {
  company: string;
  model: string;
  fuelVariant: string;
  pricePerDay: number;
  description?: string;
  features?: string[];
  seats?: number;
  rangeMi?: string;
  topSpeed?: string;
  autonomyLevel?: string;
  imageUrl?: string;
  cityLocation: string;
}) {
  const db = getDb();
  const slug = `${data.company}-${data.model}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+$/, "");

  const result = await db.insert(cars).values({
    company: data.company,
    model: data.model,
    fuelVariant: data.fuelVariant,
    pricePerDay: data.pricePerDay,
    description: data.description || "",
    features: data.features || [],
    seats: data.seats || 5,
    rangeMi: data.rangeMi || "",
    topSpeed: data.topSpeed || "",
    autonomyLevel: data.autonomyLevel || "",
    imageUrl: data.imageUrl || `/cars/${slug}.jpg`,
    cityLocation: data.cityLocation,
    isAvailable: true,
  }).returning();

  revalidatePath("/admin/dashboard");
  revalidatePath("/cars");
  return result[0];
}

export async function updateCar(id: number, data: Partial<typeof cars.$inferInsert>) {
  const db = getDb();
  const result = await db.update(cars).set(data).where(eq(cars.id, id)).returning();
  revalidatePath("/admin/dashboard");
  revalidatePath("/cars");
  return result[0];
}

export async function deleteCar(id: number) {
  const db = getDb();
  await db.delete(cars).where(eq(cars.id, id));
  revalidatePath("/admin/dashboard");
  revalidatePath("/cars");
  return { success: true };
}

export async function getCompaniesWithModels() {
  const db = getDb();
  const result = await db.select({ company: cars.company, model: cars.model }).from(cars);
  
  const map: Record<string, string[]> = {};
  for (const row of result) {
    if (!map[row.company]) map[row.company] = [];
    if (!map[row.company].includes(row.model)) map[row.company].push(row.model);
  }
  return map;
}
