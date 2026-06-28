const fs = require('fs');
const crypto = require('crypto');

// Generate SHA-256 hash of "autopilot2024" for the admin user
const adminPasswordHash = crypto.createHash('sha256').update('autopilot2024').digest('hex');

const INDIAN_CARS = [
  // Maruti Suzuki
  { company: 'Maruti Suzuki', model: 'Swift', fuelVariant: 'Petrol', price: 1500, type: 'Hatchback' },
  { company: 'Maruti Suzuki', model: 'Baleno', fuelVariant: 'Petrol', price: 1800, type: 'Hatchback' },
  { company: 'Maruti Suzuki', model: 'Dzire', fuelVariant: 'Petrol', price: 1800, type: 'Sedan' },
  { company: 'Maruti Suzuki', model: 'Brezza', fuelVariant: 'Petrol', price: 2500, type: 'SUV' },
  { company: 'Maruti Suzuki', model: 'Fronx', fuelVariant: 'Petrol', price: 2200, type: 'SUV' },
  { company: 'Maruti Suzuki', model: 'Ertiga', fuelVariant: 'CNG', price: 2800, type: 'MPV', seats: 7 },
  { company: 'Maruti Suzuki', model: 'Grand Vitara', fuelVariant: 'Hybrid', price: 3500, type: 'SUV' },
  { company: 'Maruti Suzuki', model: 'XL6', fuelVariant: 'Petrol', price: 3200, type: 'MPV', seats: 6 },
  { company: 'Maruti Suzuki', model: 'Jimny', fuelVariant: 'Petrol', price: 3000, type: 'SUV' },
  { company: 'Maruti Suzuki', model: 'Invicto', fuelVariant: 'Hybrid', price: 4500, type: 'MPV', seats: 7 },
  
  // Tata Motors
  { company: 'Tata Motors', model: 'Tiago', fuelVariant: 'Petrol', price: 1400, type: 'Hatchback' },
  { company: 'Tata Motors', model: 'Tigor', fuelVariant: 'CNG', price: 1600, type: 'Sedan' },
  { company: 'Tata Motors', model: 'Altroz', fuelVariant: 'Diesel', price: 1900, type: 'Hatchback' },
  { company: 'Tata Motors', model: 'Punch', fuelVariant: 'Petrol', price: 2000, type: 'SUV' },
  { company: 'Tata Motors', model: 'Nexon', fuelVariant: 'EV', price: 3000, type: 'SUV' },
  { company: 'Tata Motors', model: 'Curvv', fuelVariant: 'EV', price: 3500, type: 'SUV' },
  { company: 'Tata Motors', model: 'Harrier', fuelVariant: 'Diesel', price: 4000, type: 'SUV' },
  { company: 'Tata Motors', model: 'Safari', fuelVariant: 'Diesel', price: 4500, type: 'SUV', seats: 7 },
  
  // Hyundai
  { company: 'Hyundai', model: 'Grand i10 Nios', fuelVariant: 'Petrol', price: 1500, type: 'Hatchback' },
  { company: 'Hyundai', model: 'i20', fuelVariant: 'Petrol', price: 2000, type: 'Hatchback' },
  { company: 'Hyundai', model: 'Aura', fuelVariant: 'CNG', price: 1800, type: 'Sedan' },
  { company: 'Hyundai', model: 'Venue', fuelVariant: 'Petrol', price: 2400, type: 'SUV' },
  { company: 'Hyundai', model: 'Creta', fuelVariant: 'Diesel', price: 3500, type: 'SUV' },
  { company: 'Hyundai', model: 'Verna', fuelVariant: 'Petrol', price: 3000, type: 'Sedan' },
  { company: 'Hyundai', model: 'Alcazar', fuelVariant: 'Diesel', price: 4200, type: 'SUV', seats: 7 },
  { company: 'Hyundai', model: 'Tucson', fuelVariant: 'Diesel', price: 6000, type: 'SUV' },
  { company: 'Hyundai', model: 'Ioniq 5', fuelVariant: 'EV', price: 8000, type: 'SUV' },
  
  // Mahindra
  { company: 'Mahindra', model: 'XUV 3XO', fuelVariant: 'Petrol', price: 2500, type: 'SUV' },
  { company: 'Mahindra', model: 'Thar', fuelVariant: 'Diesel', price: 3500, type: 'SUV', seats: 4 },
  { company: 'Mahindra', model: 'Thar ROXX', fuelVariant: 'Diesel', price: 4500, type: 'SUV' },
  { company: 'Mahindra', model: 'Scorpio Classic', fuelVariant: 'Diesel', price: 3800, type: 'SUV', seats: 7 },
  { company: 'Mahindra', model: 'Scorpio N', fuelVariant: 'Diesel', price: 4500, type: 'SUV', seats: 7 },
  { company: 'Mahindra', model: 'XUV700', fuelVariant: 'Diesel', price: 5000, type: 'SUV', seats: 7 },
  { company: 'Mahindra', model: 'Bolero Neo', fuelVariant: 'Diesel', price: 2800, type: 'SUV', seats: 7 },
  
  // Kia
  { company: 'Kia', model: 'Sonet', fuelVariant: 'Petrol', price: 2400, type: 'SUV' },
  { company: 'Kia', model: 'Seltos', fuelVariant: 'Diesel', price: 3400, type: 'SUV' },
  { company: 'Kia', model: 'Carens', fuelVariant: 'Diesel', price: 3800, type: 'MPV', seats: 7 },
  
  // Toyota
  { company: 'Toyota', model: 'Glanza', fuelVariant: 'Petrol', price: 1800, type: 'Hatchback' },
  { company: 'Toyota', model: 'Taisor', fuelVariant: 'Petrol', price: 2200, type: 'SUV' },
  { company: 'Toyota', model: 'Rumion', fuelVariant: 'CNG', price: 2800, type: 'MPV', seats: 7 },
  { company: 'Toyota', model: 'Urban Cruiser Hyryder', fuelVariant: 'Hybrid', price: 3800, type: 'SUV' },
  { company: 'Toyota', model: 'Innova Crysta', fuelVariant: 'Diesel', price: 4500, type: 'MPV', seats: 7 },
  { company: 'Toyota', model: 'Innova Hycross', fuelVariant: 'Hybrid', price: 5500, type: 'MPV', seats: 7 },
  { company: 'Toyota', model: 'Fortuner', fuelVariant: 'Diesel', price: 8000, type: 'SUV', seats: 7 },
  { company: 'Toyota', model: 'Hilux', fuelVariant: 'Diesel', price: 7500, type: 'Pickup', seats: 5 },
  { company: 'Toyota', model: 'Camry', fuelVariant: 'Hybrid', price: 8500, type: 'Sedan' },
  
  // Honda
  { company: 'Honda', model: 'Amaze', fuelVariant: 'Petrol', price: 1800, type: 'Sedan' },
  { company: 'Honda', model: 'City', fuelVariant: 'Petrol', price: 2500, type: 'Sedan' },
  { company: 'Honda', model: 'Elevate', fuelVariant: 'Petrol', price: 2800, type: 'SUV' },
  
  // MG
  { company: 'MG', model: 'Comet EV', fuelVariant: 'EV', price: 1500, type: 'Hatchback', seats: 4 },
  { company: 'MG', model: 'Windsor EV', fuelVariant: 'EV', price: 3000, type: 'Crossover' },
  { company: 'MG', model: 'Astor', fuelVariant: 'Petrol', price: 2600, type: 'SUV' },
  { company: 'MG', model: 'Hector', fuelVariant: 'Diesel', price: 4000, type: 'SUV' },
  { company: 'MG', model: 'Hector Plus', fuelVariant: 'Diesel', price: 4500, type: 'SUV', seats: 7 },
  { company: 'MG', model: 'ZS EV', fuelVariant: 'EV', price: 4500, type: 'SUV' },
  { company: 'MG', model: 'Gloster', fuelVariant: 'Diesel', price: 9000, type: 'SUV', seats: 7 },
  
  // Skoda
  { company: 'Skoda', model: 'Kushaq', fuelVariant: 'Petrol', price: 3000, type: 'SUV' },
  { company: 'Skoda', model: 'Slavia', fuelVariant: 'Petrol', price: 3000, type: 'Sedan' },
  { company: 'Skoda', model: 'Kodiaq', fuelVariant: 'Petrol', price: 8000, type: 'SUV', seats: 7 },
  
  // Volkswagen
  { company: 'Volkswagen', model: 'Taigun', fuelVariant: 'Petrol', price: 3000, type: 'SUV' },
  { company: 'Volkswagen', model: 'Virtus', fuelVariant: 'Petrol', price: 3000, type: 'Sedan' },
  { company: 'Volkswagen', model: 'Tiguan', fuelVariant: 'Petrol', price: 7500, type: 'SUV' }
];

const CITIES = ['Hyderabad', 'Secunderabad', 'Warangal'];

let sql = `-- Seed Admin User
INSERT INTO users (username, password_hash, role) VALUES ('admin', '${adminPasswordHash}', 'admin');\n\n`;

sql += `-- Seed Indian Fleet\n`;

INDIAN_CARS.forEach((c, index) => {
  const city = CITIES[index % CITIES.length];
  const features = JSON.stringify(['Air Conditioning', 'Power Steering', 'Bluetooth', 'Airbags']);
  const seats = c.seats || 5;
  
  // For demo, standard images based on type
  let imageUrl = '/cars/default-suv.jpg';
  if (c.type === 'Hatchback') imageUrl = '/cars/default-hatchback.jpg';
  if (c.type === 'Sedan') imageUrl = '/cars/default-sedan.jpg';
  if (c.type === 'MPV') imageUrl = '/cars/default-mpv.jpg';

  sql += `INSERT INTO cars (company, model, fuel_variant, price_per_day, description, features, seats, range_mi, top_speed, autonomy_level, image_url, is_available, city_location) VALUES ('${c.company}', '${c.model}', '${c.fuelVariant}', ${c.price}, 'A premium ${c.type} suitable for city and highway driving.', '${features}', ${seats}, 'N/A', 'N/A', 'Level 0', '${imageUrl}', 1, '${city}');\n`;
});

fs.mkdirSync('drizzle', { recursive: true });
fs.writeFileSync('drizzle/0001_seed.sql', sql);
console.log('Seed SQL generated at drizzle/0001_seed.sql');
