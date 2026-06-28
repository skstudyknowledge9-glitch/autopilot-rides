import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").default("admin"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const cars = sqliteTable("cars", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  company: text("company").notNull(),
  model: text("model").notNull(),
  fuelVariant: text("fuel_variant").notNull(),
  pricePerDay: real("price_per_day").notNull(), // Stored in INR
  description: text("description"),
  features: text("features", { mode: "json" }).$type<string[]>().default([]),
  seats: integer("seats").default(5),
  rangeMi: text("range_mi"),
  topSpeed: text("top_speed"),
  autonomyLevel: text("autonomy_level"),
  imageUrl: text("image_url"),
  isAvailable: integer("is_available", { mode: "boolean" }).default(true),
  cityLocation: text("city_location").notNull(), // e.g., Hyderabad, Secunderabad, Warangal
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  carId: integer("car_id")
    .notNull()
    .references(() => cars.id, { onDelete: "cascade" }),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  startDate: text("start_date").notNull(), // ISO string YYYY-MM-DD
  endDate: text("end_date").notNull(),     // ISO string YYYY-MM-DD
  totalPrice: real("total_price").notNull(), // Base Price + 18% GST
  status: text("status").default("confirmed"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
