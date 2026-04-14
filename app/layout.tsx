import type { Metadata } from "next";
import { Inter, Anton, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Temporal One — Stop applying. Start building.",
  description:
    "A structured 6-week sprint where unemployed tech professionals build real products with real teams. $20/mo. 15 spots per cohort.",
  openGraph: {
    title: "Temporal One — Stop applying. Start building.",
    description:
      "A structured 6-week sprint where unemployed tech professionals build real products with real teams.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${anton.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
