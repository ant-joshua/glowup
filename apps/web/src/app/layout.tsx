import type { Metadata } from "next";
import { Inter, Noto_Serif, Manrope } from "next/font/google";
import "./index.css";

const inter = Inter({
  variable: "--font-sans-inter",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GlowUp | AI-Powered Personal Transformation",
  description: "The first AI-powered operating system for your appearance, style, and personal brand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSerif.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}