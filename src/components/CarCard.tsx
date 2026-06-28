"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Car, Zap, Battery, MapPin, Users, Star } from "lucide-react";

interface CarData {
  id: number;
  company: string;
  model: string;
  fuelVariant: string;
  pricePerDay: number;
  description: string;
  features: string[] | string;
  seats: number;
  autonomyLevel: string;
  rangeMi: string;
  topSpeed: string;
  imageUrl: string;
  isAvailable: boolean;
  cityLocation: string;
}

interface CarCardProps {
  car: CarData;
  startDate?: string;
  endDate?: string;
  index?: number;
}

const companyColors: Record<string, string> = {
  "Maruti Suzuki": "from-blue-500/20 to-blue-900/30",
  "Tata Motors": "from-sky-500/20 to-sky-900/30",
  "Hyundai": "from-slate-400/20 to-slate-800/30",
  "Mahindra": "from-red-500/20 to-red-900/30",
  "Kia": "from-red-400/20 to-red-800/30",
  "Toyota": "from-red-600/20 to-red-950/30",
  "Honda": "from-zinc-400/20 to-zinc-800/30",
  "MG": "from-emerald-500/20 to-emerald-900/30",
  "Skoda": "from-green-500/20 to-green-900/30",
  "Volkswagen": "from-blue-600/20 to-blue-950/30",
};

const companyAccents: Record<string, string> = {
  "Maruti Suzuki": "text-blue-400",
  "Tata Motors": "text-sky-400",
  "Hyundai": "text-slate-300",
  "Mahindra": "text-red-400",
  "Kia": "text-red-400",
  "Toyota": "text-red-500",
  "Honda": "text-zinc-300",
  "MG": "text-emerald-400",
  "Skoda": "text-green-400",
  "Volkswagen": "text-blue-500",
};

export default function CarCard({ car, startDate, endDate, index = 0 }: CarCardProps) {
  const gradient = companyColors[car.company] || "from-blue-500/20 to-blue-900/30";
  const accent = companyAccents[car.company] || "text-blue-400";
  
  let href = `/cars/${car.id}`;
  if (startDate && endDate) {
    href += `?start=${startDate}&end=${endDate}`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={href} className="block group">
        <div className="glass-card rounded-2xl overflow-hidden card-hover">
          {/* Image Area */}
          <div
            className={`relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}
          >
            <Car className={`w-20 h-20 ${accent} opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500`} />

            {/* Location Badge */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/40 backdrop-blur-sm text-white border border-white/10">
                <MapPin className="w-3 h-3 text-indigo-400" />
                {car.cityLocation}
              </span>
            </div>

            {/* Fuel Badge */}
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">
                <Battery className="w-3 h-3" />
                {car.fuelVariant}
              </span>
            </div>

            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Company & Model */}
            <div className="mb-3">
              <p className={`text-xs font-semibold ${accent} uppercase tracking-wider mb-1`}>
                {car.company}
              </p>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                {car.model}
              </h3>
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-400 line-clamp-2 mb-4 h-10">
              {car.description}
            </p>

            {/* Specs Mini */}
            <div className="flex items-center gap-4 mb-5 text-sm text-neutral-400 border-t border-white/5 pt-4">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-neutral-500" />
                <span>{car.seats} Seats</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Premium</span>
              </div>
            </div>

            {/* Price & Action */}
            <div className="flex items-center justify-between mt-auto">
              <div>
                <span className="text-2xl font-bold text-white">₹{car.pricePerDay.toLocaleString("en-IN")}</span>
                <span className="text-neutral-500 text-sm"> / day</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                <Zap className="w-5 h-5 text-neutral-400 group-hover:text-black transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
