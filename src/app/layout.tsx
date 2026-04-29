import type { Metadata } from "next";
import { Chewy } from "next/font/google"; // Ganti Bebas_Neue dengan Chewy
import "./globals.css";

const chewy = Chewy({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-chewy",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Scream Challenge",
  description: "How loud can you scream?",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${chewy.variable}`}>
      <body className="bg-[#0169dc] overflow-hidden">{children}</body>
    </html>
  );
}
