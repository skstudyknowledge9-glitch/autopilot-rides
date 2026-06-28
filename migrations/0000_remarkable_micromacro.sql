CREATE TABLE `bookings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`car_id` integer NOT NULL,
	`customer_name` text NOT NULL,
	`customer_email` text NOT NULL,
	`customer_phone` text,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`total_price` real NOT NULL,
	`status` text DEFAULT 'confirmed',
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`car_id`) REFERENCES `cars`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `cars` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company` text NOT NULL,
	`model` text NOT NULL,
	`fuel_variant` text NOT NULL,
	`price_per_day` real NOT NULL,
	`description` text,
	`features` text DEFAULT '[]',
	`seats` integer DEFAULT 5,
	`range_mi` text,
	`top_speed` text,
	`autonomy_level` text,
	`image_url` text,
	`is_available` integer DEFAULT true,
	`city_location` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'admin',
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);