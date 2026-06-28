// Complete dataset of self-driving car companies and their models
export interface CarModel {
  company: string;
  model: string;
  fuelVariant: "Electric" | "Hybrid" | "Hydrogen" | "Gasoline";
  pricePerDay: number;
  description: string;
  features: string[];
  seats: number;
  range: string;
  topSpeed: string;
  autonomyLevel: string;
}

export const COMPANIES = [
  "Tesla",
  "Waymo",
  "Cruise",
  "Zoox",
  "Mercedes-Benz",
  "BMW",
  "Volvo",
  "NIO",
] as const;

export type CompanyName = (typeof COMPANIES)[number];

export const COMPANY_MODELS: Record<CompanyName, string[]> = {
  Tesla: ["Model S", "Model 3", "Model X", "Model Y", "Cybertruck"],
  Waymo: ["Jaguar I-PACE (Waymo One)", "Zeekr RT"],
  Cruise: ["Cruise Origin", "Chevy Bolt EV"],
  Zoox: ["Zoox Robotaxi"],
  "Mercedes-Benz": ["EQS (Drive Pilot)", "S-Class (Drive Pilot)"],
  BMW: ["iX (Level 3)", "i7 (Highway Assistant)"],
  Volvo: ["EX90 (Ride Pilot)", "XC90 (Pilot Assist)"],
  NIO: ["ET7 (NAD)", "ES8 (NIO Pilot)"],
};

export const FUEL_VARIANTS = [
  "Electric",
  "Hybrid",
  "Hydrogen",
  "Gasoline",
] as const;

export const SEED_CARS: CarModel[] = [
  // Tesla
  {
    company: "Tesla",
    model: "Model S",
    fuelVariant: "Electric",
    pricePerDay: 350,
    description:
      "The flagship Tesla sedan with full self-driving capability. Ludicrous acceleration meets autonomous luxury.",
    features: [
      "Autopilot FSD",
      "17-inch Cinematic Display",
      "Tri-Motor AWD",
      "Glass Roof",
      "Premium Audio",
    ],
    seats: 5,
    range: "405 mi",
    topSpeed: "200 mph",
    autonomyLevel: "Level 3",
  },
  {
    company: "Tesla",
    model: "Model 3",
    fuelVariant: "Electric",
    pricePerDay: 220,
    description:
      "The most popular electric self-driving sedan. Perfect blend of performance, range, and autonomous tech.",
    features: [
      "Autopilot FSD",
      "15.4-inch Display",
      "Dual Motor AWD",
      "Ambient Lighting",
      "Heated Seats",
    ],
    seats: 5,
    range: "358 mi",
    topSpeed: "162 mph",
    autonomyLevel: "Level 2+",
  },
  {
    company: "Tesla",
    model: "Model X",
    fuelVariant: "Electric",
    pricePerDay: 420,
    description:
      "The self-driving SUV with iconic falcon-wing doors. Spacious luxury meets cutting-edge autonomy.",
    features: [
      "Autopilot FSD",
      "Falcon Wing Doors",
      "6-Seat Config",
      "HEPA Filtration",
      "Towing 9,500 lbs",
    ],
    seats: 6,
    range: "348 mi",
    topSpeed: "163 mph",
    autonomyLevel: "Level 3",
  },
  {
    company: "Tesla",
    model: "Model Y",
    fuelVariant: "Electric",
    pricePerDay: 280,
    description:
      "Compact SUV with Tesla's full autonomous stack. The versatile self-driving crossover for every journey.",
    features: [
      "Autopilot FSD",
      "Panoramic Roof",
      "68 cu ft Cargo",
      "Dual Motor AWD",
      "Camp Mode",
    ],
    seats: 5,
    range: "310 mi",
    topSpeed: "155 mph",
    autonomyLevel: "Level 2+",
  },
  {
    company: "Tesla",
    model: "Cybertruck",
    fuelVariant: "Electric",
    pricePerDay: 500,
    description:
      "The revolutionary stainless-steel electric truck with autonomous capabilities. Unlike anything on the road.",
    features: [
      "Autopilot FSD",
      "Exoskeleton Body",
      "Tri-Motor AWD",
      "Vault Bed",
      "Armor Glass",
    ],
    seats: 5,
    range: "340 mi",
    topSpeed: "130 mph",
    autonomyLevel: "Level 2+",
  },
  // Waymo
  {
    company: "Waymo",
    model: "Jaguar I-PACE (Waymo One)",
    fuelVariant: "Electric",
    pricePerDay: 380,
    description:
      "Waymo's flagship robotaxi built on the Jaguar I-PACE platform. True Level 4 autonomy — no driver needed.",
    features: [
      "Level 4 Full Autonomy",
      "360° LiDAR",
      "Rider Screen",
      "Climate Pre-Conditioning",
      "Wheelchair Accessible",
    ],
    seats: 4,
    range: "292 mi",
    topSpeed: "124 mph",
    autonomyLevel: "Level 4",
  },
  {
    company: "Waymo",
    model: "Zeekr RT",
    fuelVariant: "Electric",
    pricePerDay: 340,
    description:
      "Next-gen Waymo robotaxi purpose-built for autonomous ride-hailing. The future of urban mobility.",
    features: [
      "Level 4 Full Autonomy",
      "6th-Gen Waymo Driver",
      "Spacious Cabin",
      "Smart Doors",
      "App Control",
    ],
    seats: 4,
    range: "310 mi",
    topSpeed: "112 mph",
    autonomyLevel: "Level 4",
  },
  // Cruise
  {
    company: "Cruise",
    model: "Cruise Origin",
    fuelVariant: "Electric",
    pricePerDay: 360,
    description:
      "Purpose-built autonomous vehicle with no steering wheel or pedals. A living room on wheels.",
    features: [
      "Level 5 Design",
      "Face-to-Face Seating",
      "No Steering Wheel",
      "Sliding Doors",
      "Night Vision",
    ],
    seats: 4,
    range: "250 mi",
    topSpeed: "90 mph",
    autonomyLevel: "Level 5",
  },
  {
    company: "Cruise",
    model: "Chevy Bolt EV",
    fuelVariant: "Electric",
    pricePerDay: 200,
    description:
      "Cruise-modified Bolt EV with advanced self-driving sensors. Affordable autonomous driving for everyone.",
    features: [
      "Cruise AV Stack",
      "LiDAR Array",
      "Emergency Braking",
      "Lane Keeping",
      "Adaptive Cruise",
    ],
    seats: 5,
    range: "259 mi",
    topSpeed: "93 mph",
    autonomyLevel: "Level 3",
  },
  // Zoox
  {
    company: "Zoox",
    model: "Zoox Robotaxi",
    fuelVariant: "Electric",
    pricePerDay: 400,
    description:
      "Bi-directional autonomous vehicle designed from scratch. No front or back — it drives both ways.",
    features: [
      "Bi-Directional Drive",
      "Carriage-Style Seating",
      "4-Wheel Steering",
      "Airbag Cocoon",
      "100+ Sensors",
    ],
    seats: 4,
    range: "200 mi",
    topSpeed: "75 mph",
    autonomyLevel: "Level 5",
  },
  // Mercedes-Benz
  {
    company: "Mercedes-Benz",
    model: "EQS (Drive Pilot)",
    fuelVariant: "Electric",
    pricePerDay: 550,
    description:
      "The world's first legally approved Level 3 autonomous luxury sedan. Supreme comfort meets certified autonomy.",
    features: [
      "Drive Pilot L3",
      "Hyperscreen 56-inch",
      "Burmester 4D Sound",
      "Air Suspension",
      "Rear Luxury Package",
    ],
    seats: 5,
    range: "350 mi",
    topSpeed: "130 mph",
    autonomyLevel: "Level 3",
  },
  {
    company: "Mercedes-Benz",
    model: "S-Class (Drive Pilot)",
    fuelVariant: "Hybrid",
    pricePerDay: 480,
    description:
      "The iconic S-Class with Drive Pilot autonomy. A century of luxury engineering meets self-driving technology.",
    features: [
      "Drive Pilot L3",
      "OLED Rear Display",
      "E-Active Body Control",
      "Hot Stone Massage Seats",
      "Fragrance System",
    ],
    seats: 5,
    range: "510 mi",
    topSpeed: "155 mph",
    autonomyLevel: "Level 3",
  },
  // BMW
  {
    company: "BMW",
    model: "iX (Level 3)",
    fuelVariant: "Electric",
    pricePerDay: 450,
    description:
      "BMW's electric flagship SUV with Level 3 highway autonomy. The ultimate self-driving machine.",
    features: [
      "Highway Assistant L3",
      "Curved iDrive Display",
      "Bowers & Wilkins 4D",
      "Shy Tech Sensors",
      "Crystal Controls",
    ],
    seats: 5,
    range: "324 mi",
    topSpeed: "124 mph",
    autonomyLevel: "Level 3",
  },
  {
    company: "BMW",
    model: "i7 (Highway Assistant)",
    fuelVariant: "Electric",
    pricePerDay: 580,
    description:
      "The electric 7 Series with hands-free highway driving. Theater-like rear cabin for the ultimate passenger experience.",
    features: [
      "Highway Assistant L3",
      "31-inch Theater Screen",
      "Executive Lounge",
      "Cashmere Wool Trim",
      "Sky Lounge Roof",
    ],
    seats: 5,
    range: "318 mi",
    topSpeed: "149 mph",
    autonomyLevel: "Level 3",
  },
  // Volvo
  {
    company: "Volvo",
    model: "EX90 (Ride Pilot)",
    fuelVariant: "Electric",
    pricePerDay: 380,
    description:
      "Volvo's safest vehicle ever with unsupervised highway driving. Scandinavian design meets autonomous innovation.",
    features: [
      "Ride Pilot L3",
      "LiDAR Standard",
      "Google Built-In",
      "Bowers & Wilkins Audio",
      "Wool Blend Interior",
    ],
    seats: 7,
    range: "300 mi",
    topSpeed: "112 mph",
    autonomyLevel: "Level 3",
  },
  {
    company: "Volvo",
    model: "XC90 (Pilot Assist)",
    fuelVariant: "Hybrid",
    pricePerDay: 320,
    description:
      "The award-winning luxury SUV with advanced pilot assist. Safe, sustainable, and semi-autonomous.",
    features: [
      "Pilot Assist L2+",
      "Orrefors Crystal Shift",
      "Air Suspension",
      "360° Camera",
      "Clean Zone Climate",
    ],
    seats: 7,
    range: "520 mi",
    topSpeed: "130 mph",
    autonomyLevel: "Level 2+",
  },
  // NIO
  {
    company: "NIO",
    model: "ET7 (NAD)",
    fuelVariant: "Electric",
    pricePerDay: 350,
    description:
      "NIO's flagship sedan with NIO Autonomous Driving. Swappable batteries and cutting-edge Chinese EV tech.",
    features: [
      "NIO NAD",
      "Battery Swap",
      "AQUILA Super Sensing",
      "ADAM Supercomputer",
      "PanoCinema AR/VR",
    ],
    seats: 5,
    range: "370 mi",
    topSpeed: "124 mph",
    autonomyLevel: "Level 2+",
  },
  {
    company: "NIO",
    model: "ES8 (NIO Pilot)",
    fuelVariant: "Electric",
    pricePerDay: 400,
    description:
      "Premium electric SUV with NOMI AI assistant and full autonomous suite. Luxury meets intelligence.",
    features: [
      "NIO Pilot",
      "NOMI AI Companion",
      "Battery Swap",
      "Women's Space",
      "Queen Seat Package",
    ],
    seats: 6,
    range: "310 mi",
    topSpeed: "124 mph",
    autonomyLevel: "Level 2+",
  },
];
