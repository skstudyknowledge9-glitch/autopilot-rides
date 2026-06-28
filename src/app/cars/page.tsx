"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Filter, Car, SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import { getAllCars } from "@/actions/cars";

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

const FUEL_OPTIONS = ["All", "Petrol", "Diesel", "CNG", "Hybrid", "EV"];
const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹2,000", min: 0, max: 2000 },
  { label: "₹2,000 – ₹4,000", min: 2000, max: 4000 },
  { label: "₹4,000+", min: 4000, max: Infinity },
];

function CarsPageContent() {
  const searchParams = useSearchParams();
  const initialCompany = searchParams.get("company") || "All";
  const startDate = searchParams.get("start") || "";
  const endDate = searchParams.get("end") || "";

  const [cars, setCars] = useState<CarData[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCompany, setSelectedCompany] = useState(initialCompany);
  const [selectedFuel, setSelectedFuel] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getAllCars().then((data) => {
      setCars(data as unknown as CarData[]);
      const uniqueCompanies = [...new Set(data.map((c: any) => c.company))] as string[];
      setCompanies(["All", ...uniqueCompanies.sort()]);
      setLoading(false);
    });
  }, []);

  const filteredCars = cars.filter((car) => {
    if (selectedCompany !== "All" && car.company !== selectedCompany)
      return false;
    if (selectedFuel !== "All" && car.fuelVariant !== selectedFuel)
      return false;

    const priceRange = PRICE_RANGES[selectedPriceRange];
    if (car.pricePerDay < priceRange.min || car.pricePerDay >= priceRange.max)
      return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        car.company.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query) ||
        car.description.toLowerCase().includes(query) ||
        car.cityLocation.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const activeFilters =
    (selectedCompany !== "All" ? 1 : 0) +
    (selectedFuel !== "All" ? 1 : 0) +
    (selectedPriceRange !== 0 ? 1 : 0);

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-8 gradient-hero border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-end gap-6"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-space-grotesk)] text-white mb-4">
                Our Fleet
              </h1>
              <p className="text-neutral-400 text-lg max-w-xl">
                Explore our collection of premium vehicles available for rent across Telangana.
              </p>
            </div>
            
            <div className="w-full md:w-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search models, cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 bg-neutral-900 border border-neutral-800 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl py-3 text-white font-medium"
              >
                <SlidersHorizontal className="w-5 h-5" />
                {showFilters ? "Hide Filters" : `Show Filters ${activeFilters > 0 ? `(${activeFilters})` : ""}`}
              </button>
            </div>

            {/* Filters Sidebar */}
            <div className={`lg:w-64 flex-shrink-0 space-y-8 ${showFilters ? "block" : "hidden lg:block"}`}>
              <div className="glass p-6 rounded-2xl sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Filter className="w-5 h-5 text-indigo-400" />
                    Filters
                  </h3>
                  {activeFilters > 0 && (
                    <button
                      onClick={() => {
                        setSelectedCompany("All");
                        setSelectedFuel("All");
                        setSelectedPriceRange(0);
                      }}
                      className="text-xs text-neutral-400 hover:text-white"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Brand Filter */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-3">
                      Brand
                    </label>
                    <div className="space-y-2">
                      {companies.map((company) => (
                        <label key={company} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedCompany === company ? 'bg-indigo-600 border-indigo-600' : 'border-neutral-700 group-hover:border-indigo-500'}`}>
                            {selectedCompany === company && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <span className={`text-sm ${selectedCompany === company ? 'text-white' : 'text-neutral-300 group-hover:text-white'}`}>
                            {company}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="w-full h-px bg-white/5" />

                  {/* Fuel Filter */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-3">
                      Fuel Variant
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {FUEL_OPTIONS.map((fuel) => (
                        <button
                          key={fuel}
                          onClick={() => setSelectedFuel(fuel)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            selectedFuel === fuel
                              ? "bg-indigo-600 text-white"
                              : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white border border-white/5"
                          }`}
                        >
                          {fuel}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="w-full h-px bg-white/5" />

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-3">
                      Daily Rate
                    </label>
                    <div className="space-y-2">
                      {PRICE_RANGES.map((range, idx) => (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative w-5 h-5 rounded-full border border-neutral-700 flex items-center justify-center">
                            {selectedPriceRange === idx && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
                          </div>
                          <span className={`text-sm ${selectedPriceRange === idx ? 'text-white' : 'text-neutral-300 group-hover:text-white'}`}>
                            {range.label}
                          </span>
                          <input
                            type="radio"
                            name="priceRange"
                            className="hidden"
                            checked={selectedPriceRange === idx}
                            onChange={() => setSelectedPriceRange(idx)}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between text-sm text-neutral-400">
                <p>Showing <span className="text-white font-medium">{filteredCars.length}</span> vehicles</p>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
                  <p className="text-neutral-400">Loading fleet...</p>
                </div>
              ) : filteredCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCars.map((car, idx) => (
                    <CarCard key={car.id} car={car} index={idx} startDate={startDate} endDate={endDate} />
                  ))}
                </div>
              ) : (
                <div className="glass rounded-3xl p-12 text-center">
                  <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Car className="w-10 h-10 text-neutral-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">No vehicles found</h3>
                  <p className="text-neutral-400 mb-6">
                    We couldn't find any vehicles matching your current filters.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCompany("All");
                      setSelectedFuel("All");
                      setSelectedPriceRange(0);
                      setSearchQuery("");
                    }}
                    className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

// Icon helper
function Check({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function CarsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-neutral-950"><div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" /></div>}>
      <CarsPageContent />
    </Suspense>
  );
}
