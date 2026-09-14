import type { Metadata } from "next";
import { Orbitron, Space_Mono } from "next/font/google";
import { AppShell } from "@/components/chrome/AppShell";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "700", "900"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-ui",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "SPARKVERSE",
  description: "The doorway into The First Spark universe.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${spaceMono.variable}`}>
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
