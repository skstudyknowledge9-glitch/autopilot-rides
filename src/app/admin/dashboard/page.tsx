"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car, Zap, DollarSign, CalendarDays, TrendingUp,
  Plus, Pencil, Trash2, LogOut, X, ChevronDown,
  LayoutDashboard, Package, BookOpen, CheckCircle,
  XCircle, AlertCircle, Users, MapPin
} from "lucide-react";
import { getAllCars, createCar, updateCar, deleteCar } from "@/actions/cars";
import { getAllBookings, updateBookingStatus } from "@/actions/bookings";
import { logoutAdmin } from "@/actions/auth";

interface CarData {
  id: number;
  company: string;
  model: string;
  fuelVariant: string;
  pricePerDay: number;
  description: string;
  features: string[] | string;
  seats: number;
  rangeMi: string;
  topSpeed: string;
  autonomyLevel: string;
  imageUrl: string;
  isAvailable: boolean;
  cityLocation: string;
  createdAt: string;
}

interface BookingData {
  id: number;
  carId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  car_company: string;
  car_model: string;
}

const COMPANIES: Record<string, string[]> = {
  "Maruti Suzuki": ["Swift", "Baleno", "Dzire", "Brezza", "Fronx", "Ertiga", "Grand Vitara", "XL6", "Jimny", "Invicto"],
  "Tata Motors": ["Tiago", "Tigor", "Altroz", "Punch", "Nexon", "Curvv", "Harrier", "Safari"],
  "Hyundai": ["Grand i10 Nios", "i20", "Aura", "Venue", "Creta", "Verna", "Alcazar", "Tucson", "Ioniq 5"],
  "Mahindra": ["XUV 3XO", "Thar", "Thar ROXX", "Scorpio Classic", "Scorpio N", "XUV700", "Bolero Neo"],
  "Kia": ["Sonet", "Seltos", "Carens"],
  "Toyota": ["Glanza", "Taisor", "Rumion", "Urban Cruiser Hyryder", "Innova Crysta", "Innova Hycross", "Fortuner", "Hilux", "Camry"],
  "Honda": ["Amaze", "City", "Elevate"],
  "MG": ["Comet EV", "Windsor EV", "Astor", "Hector", "Hector Plus", "ZS EV", "Gloster"],
  "Skoda": ["Kushaq", "Slavia", "Kodiaq"],
  "Volkswagen": ["Taigun", "Virtus", "Tiguan"]
};

const FUEL_VARIANTS = ["Petrol", "Diesel", "CNG", "Hybrid", "EV"];
const CITIES = ["Hyderabad", "Secunderabad", "Warangal"];

export default function AdminDashboard() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<"overview" | "vehicles" | "bookings">("overview");
  const [cars, setCars] = useState<CarData[]>([]);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<CarData | null>(null);
  const [formData, setFormData] = useState({
    company: "",
    model: "",
    fuelVariant: "",
    pricePerDay: "",
    description: "",
    seats: "5",
    cityLocation: "Hyderabad"
  });

  // Delete Confirmation State
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedCars = await getAllCars();
      const fetchedBookings = await getAllBookings();
      setCars(fetchedCars as unknown as CarData[]);
      setBookings(fetchedBookings as unknown as BookingData[]);
    } catch (err) {
      console.error(err);
      if ((err as Error).message.includes("Unauthorized")) {
        router.push("/admin/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin/login");
  };

  const openForm = (car?: CarData) => {
    if (car) {
      setEditingCar(car);
      setFormData({
        company: car.company,
        model: car.model,
        fuelVariant: car.fuelVariant,
        pricePerDay: car.pricePerDay.toString(),
        description: car.description || "",
        seats: car.seats ? car.seats.toString() : "5",
        cityLocation: car.cityLocation || "Hyderabad"
      });
    } else {
      setEditingCar(null);
      setFormData({
        company: "",
        model: "",
        fuelVariant: "",
        pricePerDay: "",
        description: "",
        seats: "5",
        cityLocation: "Hyderabad"
      });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCar(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      pricePerDay: parseFloat(formData.pricePerDay),
      seats: parseInt(formData.seats),
    };

    try {
      if (editingCar) {
        await updateCar(editingCar.id, payload);
      } else {
        await createCar(payload);
      }
      closeForm();
      fetchData();
    } catch (err) {
      alert("Failed to save car");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteCar(deleteId);
      setDeleteId(null);
      fetchData();
    } catch (err) {
      alert("Failed to delete car");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBookingStatus = async (id: number, status: string) => {
    try {
      await updateBookingStatus(id, status);
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Compute Stats
  const availableCars = cars.filter(c => c.isAvailable).length;
  const activeBookings = bookings.filter(b => b.status === "confirmed" && new Date(b.endDate) >= new Date()).length;
  const totalRevenue = bookings.filter(b => b.status === "confirmed").reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex">
      {/* Sidebar */}
      <div className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col h-screen sticky top-0">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="h-6 w-6 text-indigo-500" />
            AutoPilot <span className="text-neutral-400 font-light">Admin</span>
          </h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "overview" ? "bg-indigo-600/10 text-indigo-400" : "hover:bg-neutral-800 text-neutral-400"}`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium">Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab("vehicles")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "vehicles" ? "bg-indigo-600/10 text-indigo-400" : "hover:bg-neutral-800 text-neutral-400"}`}
          >
            <Car className="h-5 w-5" />
            <span className="font-medium">Vehicles</span>
          </button>
          <button 
            onClick={() => setActiveTab("bookings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "bookings" ? "bg-indigo-600/10 text-indigo-400" : "hover:bg-neutral-800 text-neutral-400"}`}
          >
            <BookOpen className="h-5 w-5" />
            <span className="font-medium">Bookings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><Car className="h-6 w-6" /></div>
                    <div>
                      <p className="text-sm text-neutral-400">Total Fleet</p>
                      <p className="text-2xl font-bold text-white">{cars.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl"><CheckCircle className="h-6 w-6" /></div>
                    <div>
                      <p className="text-sm text-neutral-400">Available</p>
                      <p className="text-2xl font-bold text-white">{availableCars}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl"><CalendarDays className="h-6 w-6" /></div>
                    <div>
                      <p className="text-sm text-neutral-400">Active Bookings</p>
                      <p className="text-2xl font-bold text-white">{activeBookings}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl"><DollarSign className="h-6 w-6" /></div>
                    <div>
                      <p className="text-sm text-neutral-400">Total Revenue</p>
                      <p className="text-2xl font-bold text-white">₹{totalRevenue.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "vehicles" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Fleet Management</h1>
                <button onClick={() => openForm()} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-900/20 font-medium">
                  <Plus className="h-5 w-5" /> Add Vehicle
                </button>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-neutral-950 border-b border-neutral-800">
                      <tr>
                        <th className="px-6 py-4 text-sm font-medium text-neutral-400">Vehicle</th>
                        <th className="px-6 py-4 text-sm font-medium text-neutral-400">Location</th>
                        <th className="px-6 py-4 text-sm font-medium text-neutral-400">Variant</th>
                        <th className="px-6 py-4 text-sm font-medium text-neutral-400">Price/Day</th>
                        <th className="px-6 py-4 text-sm font-medium text-neutral-400">Status</th>
                        <th className="px-6 py-4 text-sm font-medium text-neutral-400 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {cars.map(car => (
                        <tr key={car.id} className="hover:bg-neutral-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-white">{car.company}</div>
                            <div className="text-sm text-neutral-500">{car.model}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-300">
                            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {car.cityLocation}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-block px-3 py-1 bg-neutral-800 rounded-full text-xs text-neutral-300 font-medium">{car.fuelVariant}</span>
                          </td>
                          <td className="px-6 py-4 font-medium text-indigo-400">
                            ₹{car.pricePerDay.toLocaleString("en-IN")}
                          </td>
                          <td className="px-6 py-4">
                            {car.isAvailable ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium"><CheckCircle className="h-3.5 w-3.5" /> Available</span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs font-medium"><AlertCircle className="h-3.5 w-3.5" /> Rented</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => openForm(car)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"><Pencil className="h-4 w-4" /></button>
                              <button onClick={() => setDeleteId(car.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {cars.length === 0 && !isLoading && (
                        <tr><td colSpan={6} className="px-6 py-12 text-center text-neutral-500">No vehicles found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "bookings" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h1 className="text-3xl font-bold text-white mb-8">Booking Management</h1>
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-neutral-950 border-b border-neutral-800">
                      <tr>
                        <th className="px-6 py-4 text-sm font-medium text-neutral-400">Customer</th>
                        <th className="px-6 py-4 text-sm font-medium text-neutral-400">Vehicle</th>
                        <th className="px-6 py-4 text-sm font-medium text-neutral-400">Dates</th>
                        <th className="px-6 py-4 text-sm font-medium text-neutral-400">Total (₹)</th>
                        <th className="px-6 py-4 text-sm font-medium text-neutral-400">Status</th>
                        <th className="px-6 py-4 text-sm font-medium text-neutral-400 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {bookings.map(booking => (
                        <tr key={booking.id} className="hover:bg-neutral-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-white">{booking.customerName}</div>
                            <div className="text-sm text-neutral-500">{booking.customerEmail}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-neutral-300">{booking.car_company}</div>
                            <div className="font-medium text-white">{booking.car_model}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-neutral-300">{new Date(booking.startDate).toLocaleDateString()}</div>
                            <div className="text-xs text-neutral-500">to {new Date(booking.endDate).toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-4 font-medium text-indigo-400">₹{booking.totalPrice.toLocaleString("en-IN")}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {booking.status === 'confirmed' && (
                              <button onClick={() => handleBookingStatus(booking.id, 'cancelled')} className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors">Cancel</button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {bookings.length === 0 && !isLoading && (
                        <tr><td colSpan={6} className="px-6 py-12 text-center text-neutral-500">No bookings found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeForm} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden">
              <div className="px-8 py-6 border-b border-neutral-800 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{editingCar ? "Edit Vehicle" : "Add New Vehicle"}</h3>
                <button onClick={closeForm} className="text-neutral-400 hover:text-white transition-colors"><X className="h-6 w-6" /></button>
              </div>
              <form onSubmit={handleFormSubmit} className="p-8">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* Cascading Dropdowns */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Company</label>
                    <select 
                      required 
                      value={formData.company} 
                      onChange={e => setFormData({ ...formData, company: e.target.value, model: "" })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Select Company</option>
                      {Object.keys(COMPANIES).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Model</label>
                    <select 
                      required 
                      value={formData.model} 
                      onChange={e => setFormData({ ...formData, model: e.target.value })}
                      disabled={!formData.company}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                    >
                      <option value="">Select Model</option>
                      {formData.company && COMPANIES[formData.company]?.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Fuel Variant</label>
                    <select 
                      required 
                      value={formData.fuelVariant} 
                      onChange={e => setFormData({ ...formData, fuelVariant: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="">Select Variant</option>
                      {FUEL_VARIANTS.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">City Location</label>
                    <select 
                      required 
                      value={formData.cityLocation} 
                      onChange={e => setFormData({ ...formData, cityLocation: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                    >
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Price Per Day (₹)</label>
                    <input 
                      type="number" 
                      required min="500" step="100"
                      value={formData.pricePerDay} 
                      onChange={e => setFormData({ ...formData, pricePerDay: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Seats</label>
                    <input 
                      type="number" 
                      required min="2" max="10"
                      value={formData.seats} 
                      onChange={e => setFormData({ ...formData, seats: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex gap-4 justify-end">
                  <button type="button" onClick={closeForm} className="px-6 py-3 text-neutral-400 hover:text-white font-medium transition-colors">Cancel</button>
                  <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-900/20">
                    {editingCar ? "Save Changes" : "Add Vehicle"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-8 text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Delete Vehicle?</h3>
              <p className="text-neutral-400 mb-8">This action cannot be undone. Bookings associated with this vehicle will also be removed.</p>
              <div className="flex gap-4">
                <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-medium transition-colors">Cancel</button>
                <button onClick={confirmDelete} disabled={isDeleting} className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50">
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
