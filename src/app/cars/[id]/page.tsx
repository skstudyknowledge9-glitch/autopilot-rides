"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car, Zap, Battery, Gauge, Users, Star, ArrowLeft,
  CalendarDays, CheckCircle, XCircle, Shield, Clock,
  Sparkles, ChevronRight, MapPin, Receipt
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCarById } from "@/actions/cars";
import { checkCarAvailability, createBooking } from "@/actions/bookings";

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

const companyGradients: Record<string, string> = {
  "Maruti Suzuki": "from-blue-500/20 via-blue-900/10 to-navy-950",
  "Tata Motors": "from-sky-500/20 via-sky-900/10 to-navy-950",
  "Hyundai": "from-slate-400/20 via-slate-800/10 to-navy-950",
  "Mahindra": "from-red-500/20 via-red-900/10 to-navy-950",
  "Kia": "from-red-400/20 via-red-800/10 to-navy-950",
  "Toyota": "from-red-600/20 via-red-950/10 to-navy-950",
  "Honda": "from-zinc-400/20 via-zinc-800/10 to-navy-950",
  "MG": "from-emerald-500/20 via-emerald-900/10 to-navy-950",
  "Skoda": "from-green-500/20 via-green-900/10 to-navy-950",
  "Volkswagen": "from-blue-600/20 via-blue-950/10 to-navy-950",
};

export default function CarDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ start?: string; end?: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  
  const [car, setCar] = useState<CarData | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [bookingStatus, setBookingStatus] = useState<
    "idle" | "checking" | "available" | "unavailable" | "booking" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Check searchParams for dates
    searchParams?.then((sp) => {
      if (sp.start) setStartDate(sp.start);
      if (sp.end) setEndDate(sp.end);
    });

    getCarById(parseInt(id))
      .then((data) => {
        setCar(data as unknown as CarData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, searchParams]);

  const today = new Date().toISOString().split("T")[0];

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const days = calculateDays();
  const basePrice = car ? days * car.pricePerDay : 0;
  const gstAmount = basePrice * 0.18;
  const totalPrice = basePrice + gstAmount;

  const handleCheckAvailability = async () => {
    if (!startDate || !endDate || !car) return;
    setBookingStatus("checking");
    try {
      const isAvailable = await checkCarAvailability(car.id, startDate, endDate);
      setBookingStatus(isAvailable ? "available" : "unavailable");
    } catch {
      setBookingStatus("error");
      setErrorMessage("Failed to check availability");
    }
  };

  const handleBooking = async () => {
    if (!customerName || !customerEmail || !customerPhone || !car) {
      setErrorMessage("Please fill all contact details");
      return;
    }
    setBookingStatus("booking");
    setErrorMessage("");

    try {
      await createBooking({
        carId: car.id,
        customerName,
        customerEmail,
        customerPhone,
        startDate,
        endDate,
        totalPrice,
      });
      setBookingStatus("success");
    } catch {
      setErrorMessage("Booking failed due to a network error");
      setBookingStatus("error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <Navbar />
        <div className="pt-32 max-w-7xl mx-auto px-4 flex justify-center items-center h-[60vh]">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <Navbar />
        <div className="pt-32 text-center">
          <Car className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white/50">Car not found</h1>
          <Link href="/cars" className="btn-primary mt-6 inline-block">
            Back to Fleet
          </Link>
        </div>
      </div>
    );
  }

  let parsedFeatures: string[] = [];
  try {
    parsedFeatures = typeof car.features === 'string' ? JSON.parse(car.features) : car.features;
  } catch {
    parsedFeatures = [];
  }

  const gradient = companyGradients[car.company] || "from-blue-500/20 via-blue-900/10 to-navy-950";

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar />

      {/* Hero */}
      <section className={`relative pt-28 pb-16 bg-gradient-to-b ${gradient}`}>
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-sm text-white/40 mb-6">
            <Link href="/cars" className="hover:text-white/60 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Fleet
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/60">{car.company}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/70">{car.model}</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Car Image Placeholder */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative">
              <div className="aspect-video rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center backdrop-blur-md">
                <Car className="w-32 h-32 text-white/10" />
              </div>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/50 backdrop-blur-sm text-white border border-white/10">
                  <MapPin className="w-3 h-3 text-indigo-400" />
                  {car.cityLocation}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/20 backdrop-blur-sm text-emerald-300 border border-emerald-500/20">
                  <Battery className="w-3 h-3" />
                  {car.fuelVariant}
                </span>
              </div>
            </motion.div>

            {/* Car Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <p className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">{car.company}</p>
              <h1 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-space-grotesk)] text-white mb-4">{car.model}</h1>
              <p className="text-white/50 text-lg leading-relaxed mb-8">{car.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { icon: Users, label: "Seats", value: car.seats },
                  { icon: Gauge, label: "Fuel", value: car.fuelVariant },
                  { icon: Star, label: "Rating", value: "4.9★" },
                ].map((spec) => (
                  <div key={spec.label} className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
                    <spec.icon className="w-5 h-5 text-indigo-400/60 mx-auto mb-2" />
                    <p className="text-white font-semibold text-lg">{spec.value}</p>
                    <p className="text-white/30 text-xs">{spec.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">₹{car.pricePerDay.toLocaleString("en-IN")}</span>
                <span className="text-white/40 text-lg">/day</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" /> Key Features
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {parsedFeatures.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span className="text-neutral-300 text-sm">{feature}</span>
                    </div>
                  ))}
                  {parsedFeatures.length === 0 && <span className="text-neutral-500 text-sm">No specific features listed.</span>}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-6">Rental Policies</h2>
                <div className="space-y-4">
                  {[
                    { icon: Shield, title: "Insurance Included", desc: "Basic coverage is included in the daily rate." },
                    { icon: MapPin, title: "Location Bounds", desc: "Vehicle must remain within Telangana state limits." },
                    { icon: Clock, title: "Late Fees", desc: "Returns past the grace period incur a ₹500/hr fee." },
                  ].map((policy, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-black/20 border border-white/5">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                        <policy.icon className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{policy.title}</h4>
                        <p className="text-sm text-neutral-400">{policy.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="sticky top-24 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl">
                {bookingStatus === "success" ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
                    <p className="text-neutral-400 mb-8">We've sent the details to {customerEmail}.</p>
                    <button onClick={() => router.push("/cars")} className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-medium transition-colors">
                      Browse More Cars
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-white mb-6">Reserve This Vehicle</h3>

                    {/* Dates */}
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-2">Pick-up Date</label>
                        <div className="relative">
                          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                          <input type="date" min={today} value={startDate} onChange={(e) => { setStartDate(e.target.value); setBookingStatus("idle"); }} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-indigo-500 [color-scheme:dark]" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-2">Return Date</label>
                        <div className="relative">
                          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                          <input type="date" min={startDate || today} value={endDate} onChange={(e) => { setEndDate(e.target.value); setBookingStatus("idle"); }} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-indigo-500 [color-scheme:dark]" />
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <AnimatePresence>
                      {days > 0 && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
                          <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3">
                            <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2"><Receipt className="w-4 h-4 text-indigo-400" /> Price Breakdown</h4>
                            <div className="flex justify-between text-sm text-neutral-400">
                              <span>₹{car.pricePerDay.toLocaleString("en-IN")} x {days} days</span>
                              <span className="text-white">₹{basePrice.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between text-sm text-neutral-400 border-b border-white/5 pb-3">
                              <span>GST (18%)</span>
                              <span className="text-white">₹{gstAmount.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between font-bold text-white pt-1">
                              <span>Total Amount</span>
                              <span className="text-indigo-400">₹{totalPrice.toLocaleString("en-IN")}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Availability Check */}
                    {bookingStatus === "idle" || bookingStatus === "checking" ? (
                      <button onClick={handleCheckAvailability} disabled={!startDate || !endDate || bookingStatus === "checking"} className="w-full py-4 bg-white text-black rounded-xl font-bold hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {bookingStatus === "checking" ? "Checking Availability..." : "Check Availability"}
                      </button>
                    ) : bookingStatus === "unavailable" ? (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                        <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                        <p className="text-red-400 font-medium text-sm">Not available for selected dates</p>
                      </div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 mb-6">
                          <CheckCircle className="w-5 h-5 shrink-0" />
                          <p className="text-sm font-medium">Available! Complete details to book.</p>
                        </div>
                        
                        <input type="text" placeholder="Full Name" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none" />
                        <input type="email" placeholder="Email Address" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none" />
                        <input type="tel" placeholder="Phone Number" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none" />
                        
                        {errorMessage && <p className="text-red-400 text-sm text-center">{errorMessage}</p>}
                        
                        <button onClick={handleBooking} disabled={bookingStatus === "booking"} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/20 disabled:opacity-50">
                          {bookingStatus === "booking" ? "Processing..." : `Pay ₹${totalPrice.toLocaleString("en-IN")}`}
                        </button>
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
