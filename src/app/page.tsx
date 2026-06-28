"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Shield, Clock, Car, ChevronRight,
  Sparkles, Globe, Battery, Star, ArrowRight,
  CalendarDays, MapPin
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import { getAllCars } from "@/actions/cars";
import { getAvailableCars } from "@/actions/bookings";

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

const CITIES = ["Hyderabad", "Secunderabad", "Warangal"];

export default function HomePage() {
  const [featuredCars, setFeaturedCars] = useState<CarData[]>([]);
  const [availableCars, setAvailableCars] = useState<CarData[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cityLocation, setCityLocation] = useState("");
  const [checkedAvailability, setCheckedAvailability] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  useEffect(() => {
    getAllCars({ isAvailable: "true" } as any).then((res) => {
      setFeaturedCars((res as unknown as CarData[]).slice(0, 6));
    });
  }, []);

  const checkAvailability = async () => {
    if (!startDate || !endDate) return;
    setLoadingAvailability(true);
    try {
      const data = await getAvailableCars(startDate, endDate, cityLocation || undefined);
      setAvailableCars(data as unknown as CarData[]);
      setCheckedAvailability(true);
    } finally {
      setLoadingAvailability(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern opacity-50" />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="max-w-4xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-sm text-blue-300 mb-8"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>Premium Car Rentals in Telangana</span>
              <ChevronRight className="w-4 h-4" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-space-grotesk)] leading-tight mb-6"
            >
              Self-Drive <br />
              <span className="gradient-text">Freedom</span>
              <br />
              Across the State
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg sm:text-xl text-neutral-400 mb-10 max-w-2xl leading-relaxed"
            >
              Experience the ultimate journey with our premium fleet. Available now in Hyderabad, Secunderabad, and Warangal. Unbeatable prices, zero compromises.
            </motion.p>

            {/* Availability Checker Widget */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="glass p-4 rounded-2xl md:rounded-full inline-flex flex-col md:flex-row items-center gap-4 border border-white/5"
            >
              <div className="flex items-center gap-3 px-4 py-2 w-full md:w-auto">
                <MapPin className="w-5 h-5 text-neutral-400" />
                <select
                  value={cityLocation}
                  onChange={(e) => setCityLocation(e.target.value)}
                  className="bg-transparent text-white focus:outline-none w-full appearance-none"
                >
                  <option value="" className="bg-neutral-900">Any City</option>
                  {CITIES.map(c => <option key={c} value={c} className="bg-neutral-900">{c}</option>)}
                </select>
              </div>

              <div className="hidden md:block w-px h-8 bg-neutral-800" />

              <div className="flex items-center gap-3 px-4 py-2 w-full md:w-auto">
                <CalendarDays className="w-5 h-5 text-neutral-400" />
                <input
                  type="date"
                  min={today}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-white focus:outline-none [color-scheme:dark] w-full"
                />
              </div>

              <div className="hidden md:block w-px h-8 bg-neutral-800" />

              <div className="flex items-center gap-3 px-4 py-2 w-full md:w-auto">
                <CalendarDays className="w-5 h-5 text-neutral-400" />
                <input
                  type="date"
                  min={startDate || today}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-white focus:outline-none [color-scheme:dark] w-full"
                />
              </div>

              <button
                onClick={checkAvailability}
                disabled={!startDate || !endDate || loadingAvailability}
                className="w-full md:w-auto px-8 py-3 bg-white text-black font-medium rounded-full hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loadingAvailability ? "Searching..." : "Search Cars"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== SEARCH RESULTS ========== */}
      <AnimatePresence>
        {checkedAvailability && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="py-12 bg-neutral-950 border-t border-white/5"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)]">
                  Available Vehicles
                </h2>
                <button
                  onClick={() => setCheckedAvailability(false)}
                  className="text-neutral-400 hover:text-white text-sm"
                >
                  Clear Results
                </button>
              </div>

              {availableCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {availableCars.map((car) => (
                    <CarCard key={car.id} car={car} startDate={startDate} endDate={endDate} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 glass rounded-3xl">
                  <p className="text-xl text-neutral-400 mb-2">No cars available for these dates.</p>
                  <p className="text-neutral-500">Please try selecting different dates or cities.</p>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ========== FEATURED FLEET ========== */}
      <section className="py-24 relative overflow-hidden bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4">
                Our Premium Fleet
              </h2>
              <p className="text-neutral-400 text-lg">
                Choose from our selection of Indian mass-market and premium vehicles for your next journey.
              </p>
            </div>
            <Link
              href="/cars"
              className="group inline-flex items-center gap-2 text-white font-medium px-6 py-3 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all"
            >
              View All Cars
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="py-24 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Shield,
                title: "Safety First",
                desc: "All vehicles undergo rigorous maintenance and sanitization before every rental."
              },
              {
                icon: Zap,
                title: "Instant Booking",
                desc: "Book your favorite car in seconds. No lengthy paperwork or hidden fees."
              },
              {
                icon: Globe,
                title: "Anywhere in Telangana",
                desc: "Pick up and drop off available across major hubs like Hyderabad and Warangal."
              }
            ].map((feature, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 mx-auto bg-neutral-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-500">
                  <feature.icon className="w-8 h-8 text-indigo-400 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
