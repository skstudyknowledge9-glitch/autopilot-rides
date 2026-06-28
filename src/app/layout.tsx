import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AutoPilot Rides — Premium Self-Driving Car Rentals",
  description:
    "Experience the future of mobility. Rent cutting-edge autonomous vehicles from Tesla, Waymo, Mercedes-Benz, BMW, and more. Level 2 to Level 5 self-driving technology at your fingertips.",
  keywords: [
    "self-driving car rental",
    "autonomous vehicle",
    "Tesla rental",
    "Waymo ride",
    "premium car rental",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
