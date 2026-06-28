import Link from "next/link";
import { Car, Zap, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-navy-950">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold font-[family-name:var(--font-space-grotesk)] gradient-text">
                  AutoPilot
                </span>
                <span className="text-xs block text-white/40 -mt-1 tracking-widest uppercase">
                  Rides
                </span>
              </div>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-4">
              Experience the future of mobility with our premium fleet of
              autonomous vehicles. From Tesla to Waymo, drive the revolution.
            </p>
            <div className="flex gap-3">
              {["X", "In", "Fb", "Ig"].map((social) => (
                <button
                  key={social}
                  className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-all text-xs font-bold"
                >
                  {social}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/cars", label: "Our Fleet" },
                { href: "/cars", label: "Book a Ride" },
                { href: "/admin/login", label: "Admin Portal" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/40 hover:text-white/80 text-sm transition-colors flex items-center gap-2"
                  >
                    <Zap className="w-3 h-3 text-blue-500/50" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Fleet */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">
              Our Fleet
            </h4>
            <ul className="space-y-3">
              {["Tesla", "Waymo", "Mercedes-Benz", "BMW", "Volvo", "NIO"].map(
                (brand) => (
                  <li key={brand}>
                    <Link
                      href={`/cars?company=${encodeURIComponent(brand)}`}
                      className="text-white/40 hover:text-white/80 text-sm transition-colors"
                    >
                      {brand}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/40 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-blue-400/60 shrink-0" />
                <span>
                  1 Autopilot Way<br />
                  San Francisco, CA 94105
                </span>
              </li>
              <li className="flex items-center gap-3 text-white/40 text-sm">
                <Phone className="w-4 h-4 text-blue-400/60 shrink-0" />
                +1 (888) 555-RIDE
              </li>
              <li className="flex items-center gap-3 text-white/40 text-sm">
                <Mail className="w-4 h-4 text-blue-400/60 shrink-0" />
                hello@autopilotrides.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} AutoPilot Rides. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item) => (
                <button
                  key={item}
                  className="text-white/30 hover:text-white/60 text-xs transition-colors"
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
