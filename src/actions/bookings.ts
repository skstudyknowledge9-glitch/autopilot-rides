"use server";

import { getDb } from "@/db";
import { bookings, cars } from "@/db/schema";
import { eq, and, or, lt, gt } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getAllBookings() {
  const db = getDb();
  const results = await db
    .select({
      booking: bookings,
      carCompany: cars.company,
      carModel: cars.model,
    })
    .from(bookings)
    .innerJoin(cars, eq(bookings.carId, cars.id));
    
  return results.map(r => ({
    ...r.booking,
    car_company: r.carCompany,
    car_model: r.carModel,
  }));
}

export async function checkCarAvailability(carId: number, startDate: string, endDate: string) {
  const db = getDb();
  
  // Find any confirmed bookings that overlap with requested dates
  const overlapping = await db.select().from(bookings).where(
    and(
      eq(bookings.carId, carId),
      eq(bookings.status, 'confirmed'),
      lt(bookings.startDate, endDate),
      gt(bookings.endDate, startDate)
    )
  ).limit(1);

  return overlapping.length === 0;
}

export async function getAvailableCars(startDate: string, endDate: string, cityLocation?: string) {
  const db = getDb();
  
  // A bit complex in Drizzle, let's do a subquery or left join
  // Easier: get all cars matching city, then filter out booked ones
  let carsQuery = db.select().from(cars).where(eq(cars.isAvailable, true));
  
  if (cityLocation) {
    // @ts-ignore
    carsQuery = db.select().from(cars).where(and(eq(cars.isAvailable, true), eq(cars.cityLocation, cityLocation)));
  }

  const allAvailableCars = await carsQuery;
  
  // Get all conflicting bookings
  const conflictingBookings = await db.select({ carId: bookings.carId }).from(bookings).where(
    and(
      eq(bookings.status, 'confirmed'),
      lt(bookings.startDate, endDate),
      gt(bookings.endDate, startDate)
    )
  );
  
  const bookedCarIds = new Set(conflictingBookings.map(b => b.carId));
  
  return allAvailableCars.filter(c => !bookedCarIds.has(c.id));
}

export async function createBooking(data: {
  carId: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
}) {
  const db = getDb();
  const result = await db.insert(bookings).values({
    carId: data.carId,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    startDate: data.startDate,
    endDate: data.endDate,
    totalPrice: data.totalPrice,
  }).returning();

  revalidatePath("/admin/dashboard");
  return result[0];
}

export async function updateBookingStatus(id: number, status: string) {
  const db = getDb();
  const result = await db.update(bookings).set({ status }).where(eq(bookings.id, id)).returning();
  revalidatePath("/admin/dashboard");
  return result[0];
}
