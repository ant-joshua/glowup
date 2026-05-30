import type { Metadata } from "next";
import { Noto_Serif, Manrope, Geist } from "next/font/google";
import "./index.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn("h-full", "antialiased", notoSerif.variable, manrope.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
