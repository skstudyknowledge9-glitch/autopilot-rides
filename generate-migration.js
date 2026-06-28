const fs = require('fs');

const SEED_CARS = [
  {
    company: "Tesla",
    model: "Model S",
    fuel_variant: "Electric",
    price_per_day: 350,
    description: "The ultimate electric sedan with Autopilot and unmatched performance.",
    features: JSON.stringify(["Autopilot", "Yoke Steering", "Panoramic Roof", "Premium Audio"]),
    seats: 5,
    range_mi: "396 mi",
    top_speed: "200 mph",
    autonomy_level: "Level 3",
    image_url: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1000",
  },
  {
    company: "Tesla",
    model: "Model 3",
    fuel_variant: "Electric",
    price_per_day: 220,
    description: "Compact, efficient, and packed with Tesla's signature autonomous features.",
    features: JSON.stringify(["Full Self-Driving Capability", "Minimalist Interior", "Glass Roof"]),
    seats: 5,
    range_mi: "358 mi",
    top_speed: "162 mph",
    autonomy_level: "Level 2+",
    image_url: "https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&q=80&w=1000",
  },
  {
    company: "Waymo",
    model: "Jaguar I-PACE",
    fuel_variant: "Electric",
    price_per_day: 400,
    description: "Fully autonomous ride-hailing vehicle equipped with Waymo Driver.",
    features: JSON.stringify(["Waymo Driver", "Lidar Sensors", "Leather Seats", "Spacious Cabin"]),
    seats: 4,
    range_mi: "246 mi",
    top_speed: "124 mph",
    autonomy_level: "Level 4",
    image_url: "https://images.unsplash.com/photo-1606016159991-d85c88df3637?auto=format&fit=crop&q=80&w=1000",
  }
];

let sql = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cars (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company TEXT NOT NULL,
  model TEXT NOT NULL,
  fuel_variant TEXT NOT NULL,
  price_per_day REAL NOT NULL,
  description TEXT,
  features TEXT DEFAULT '[]',
  seats INTEGER DEFAULT 5,
  range_mi TEXT,
  top_speed TEXT,
  autonomy_level TEXT,
  image_url TEXT,
  is_available INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  car_id INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  total_price REAL NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

-- Seed Admin User
-- Password is 'autopilot2024' (SHA-256 hash)
INSERT INTO users (username, password_hash) VALUES ('admin', '412eb6944e05b9bbf5103c274da5cf525cc9cfb9cfce8cf861053ef1803dc489');

-- Seed Cars
`;

SEED_CARS.forEach(c => {
  sql += `INSERT INTO cars (company, model, fuel_variant, price_per_day, description, features, seats, range_mi, top_speed, autonomy_level, image_url, is_available) VALUES ('${c.company.replace(/'/g, "''")}', '${c.model.replace(/'/g, "''")}', '${c.fuel_variant.replace(/'/g, "''")}', ${c.price_per_day}, '${c.description.replace(/'/g, "''")}', '${c.features.replace(/'/g, "''")}', ${c.seats}, '${c.range_mi.replace(/'/g, "''")}', '${c.top_speed.replace(/'/g, "''")}', '${c.autonomy_level.replace(/'/g, "''")}', '${c.image_url.replace(/'/g, "''")}', 1);\n`;
});

fs.mkdirSync('migrations', {recursive: true});
fs.writeFileSync('migrations/0001_init.sql', sql);
console.log('Migration generated.');
