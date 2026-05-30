"use client";

import Image from "next/image";
import { X, Heart, ShoppingCart, ShoppingBag, Send, Gift } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function LiveShoppingPage() {
  const [isTrayOpen, setIsTrayOpen] = useState(false);

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-on-surface text-surface font-sans">
      {/* Main Fullscreen Video Feed Container */}
      <div className="relative flex-1 overflow-hidden">
        {/* Background Live Video Simulation */}
        <div className="absolute inset-0 z-0">
          <Image 
            alt="Live Streamer" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz2gZaK-RLBTqyOwDS8UIvYSeosj5KFCaIqzH-3h2JIh9YNRdht0y3Y975h8FSwTB3H6JuY0YLmsxyQ2GLdPoCTCifxnQZaNZJ-HdXxO-knNr1-2bPxCxetYkUpTtv18AdBp6t2LWSbzBBbtbqcvqoO_0R2cvQBb_QYZtXKvOXBMAIlX3CqHM2SvM0RveY2TLYL3F-DbxatdsOxcZ_gT4k--78YPIAw_7UYnSYqyU0Tnz1BowXHO9SIMhAHD6jhtocneDqdHqThFpV"
            fill
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        </div>

        {/* Interaction Layers */}
        <div className="relative z-10 h-full flex flex-col p-6 pointer-events-none">
          {/* TOP OVERLAY: Header Info */}
          <header className="flex items-start justify-between pointer-events-auto">
            <div className="flex items-center gap-3">
              {/* Profile Info */}
              <div className="flex items-center gap-2 bg-on-surface/30 backdrop-blur-md rounded-full pl-1 pr-4 py-1 border border-white/10">
                <div className="w-9 h-9 relative rounded-full overflow-hidden border border-white/20">
                  <Image alt="Creator" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXhwAygtyMEcM2zUtP4OGx0S7o5kFTuZRlP4hLcoaj4s0BTs5tGOTXxk_S3eip2FUSsxvvc-MFWJuibVHp3PR987bEPManNVoVttOdd6IUcQgsioY9KH0wRKBOZTToeIFFQlolthctSyo9Gh3BdCy3TEwtxn-p4x5fRKFEfmLH_MMlsc8zGqRl0DCmz735C7na4Ll_ia3oi9bngApSp8u1YqLKaQ66499GvItd_QwgC1uP3JH3zGI-A9e9CCiiGlp8RER0ULflBADu" fill sizes="36px" className="object-cover" />
                </div>
                <div>
                  <p className="text-xs font-semibold leading-tight text-white">Elena Vance</p>
                  <p className="text-[10px] text-white/80">2.4k watching</p>
                </div>
                <button className="ml-2 bg-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white hover:bg-primary-container transition-colors">Follow</button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-primary px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-white">Live</span>
              </div>
              <button className="p-2 rounded-full bg-on-surface/30 backdrop-blur-md text-white hover:bg-on-surface/50 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* MIDDLE SECTION (Spacer) */}
          <div className="flex-1"></div>

          {/* LOWER INTERACTION AREA */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end gap-6">
              {/* COMMENTS SECTION */}
              <div className="flex-1 max-w-[70%] pointer-events-auto h-48 overflow-y-auto flex flex-col gap-3 no-scrollbar mask-gradient-b">
                <div className="flex items-center gap-2 group">
                  <span className="bg-surface-container-highest/20 backdrop-blur-sm px-3 py-1.5 rounded-2xl text-xs text-white">
                    <span className="font-bold text-primary-container mr-1">Sophia R.</span> I need this for my morning routine! ✨
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-surface-container-highest/20 backdrop-blur-sm px-3 py-1.5 rounded-2xl text-xs text-white">
                    <span className="font-bold text-primary-container mr-1">Marc_88</span> Is it good for sensitive skin?
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-surface-container-highest/20 backdrop-blur-sm px-3 py-1.5 rounded-2xl text-xs text-white">
                    <span className="font-bold text-primary-container mr-1">SkinLover</span> Just bought one! Can&apos;t wait! 🧴
                  </span>
                </div>
                <div className="flex items-center gap-2 animate-bounce">
                  <span className="bg-primary/40 backdrop-blur-sm px-3 py-1.5 rounded-2xl text-xs text-white border border-primary/30">
                    <span className="font-bold mr-1">System:</span> Elena shared a limited time coupon!
                  </span>
                </div>
                <div className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-300">
                  <span className="bg-surface-container-highest/20 backdrop-blur-sm px-3 py-1.5 rounded-2xl text-xs text-white">
                    <span className="font-bold text-primary-container mr-1">Chloe_S</span> Added to cart!
                  </span>
                </div>
              </div>

              {/* FLOATING REACTIONS AREA */}
              <div className="relative w-12 h-48 flex flex-col-reverse items-center pointer-events-auto cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center text-white hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6 fill-white" />
                </div>
              </div>
            </div>

            {/* PRODUCT SPOTLIGHT */}
            <div className="pointer-events-auto animate-in slide-in-from-bottom-4 duration-700">
              <div className="bg-white/95 dark:bg-on-surface/90 backdrop-blur-2xl rounded-2xl p-3 flex items-center gap-4 shadow-2xl ring-1 ring-white/20">
                <div className="w-16 h-16 relative rounded-xl bg-surface-container overflow-hidden flex-shrink-0">
                  <Image alt="Radiance Serum" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1f8sB7t4n1jsFYswrpn-fwl5BUxCX2Al8HmaAY_E7XFTUsFt6YeUQ37IDoT7lzqpfavT-JWqKFUaeGY-0ONKk8HL4DBXcZ2jOf5BtW8p2nty7D3rCeGg8b-sB1ZyULzggiBpMeYc5DBJWOGp3Eq4mHuCH4RBV5J2oT5dDA4LqiR3PNTQWaaV8BIeBDtPx6JWfPFnIh1EItmX1vFgVX_VyxjorGFDsCKn-vo4_NmRLrkxfY3Ci0rXHT0CthGavL5yg0ScclvypMHHd" fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-primary tracking-widest uppercase mb-0.5">Currently Discussing</p>
                  <h3 className="font-serif italic text-on-surface text-lg leading-tight truncate">Radiance Vitamin C Serum</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-on-surface font-bold text-sm">$48.00</span>
                    <span className="text-secondary text-[10px] line-through">$62.00</span>
                  </div>
                </div>
                <button className="bg-gradient-to-br from-primary to-primary-container text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:scale-[1.02] active:scale-95 transition-all">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR: Interaction Controls */}
      <div className={cn("absolute inset-x-0 bottom-0 z-30 transform transition-transform duration-500 ease-in-out pointer-events-auto flex flex-col h-[70%]", isTrayOpen ? "translate-y-0" : "translate-y-[calc(100%-80px)]")}>
        {/* Tray Handle/Header */}
        <div className="bg-surface/90 backdrop-blur-2xl rounded-t-3xl border-t border-white/20 p-4 cursor-pointer flex-shrink-0" onClick={() => setIsTrayOpen(!isTrayOpen)}>
          <div className="w-12 h-1 bg-outline-variant/50 rounded-full mx-auto mb-4"></div>
          <div className="flex justify-between items-center px-2 mb-2">
            <h2 className="font-serif italic text-lg text-on-surface">Featured Products</h2>
            <span className="text-primary text-xs font-bold uppercase tracking-widest">4 Items</span>
          </div>
        </div>
        
        {/* Product List */}
        <div className="bg-surface/90 backdrop-blur-2xl px-6 pb-24 flex-1 overflow-y-auto space-y-4">
          {/* Product Item 1 */}
          <div className="flex items-center gap-4 p-3 bg-surface-container-low/50 rounded-2xl border border-outline-variant/20">
            <div className="w-20 h-20 relative rounded-xl bg-surface-container overflow-hidden flex-shrink-0">
              <Image alt="Radiance Serum" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1f8sB7t4n1jsFYswrpn-fwl5BUxCX2Al8HmaAY_E7XFTUsFt6YeUQ37IDoT7lzqpfavT-JWqKFUaeGY-0ONKk8HL4DBXcZ2jOf5BtW8p2nty7D3rCeGg8b-sB1ZyULzggiBpMeYc5DBJWOGp3Eq4mHuCH4RBV5J2oT5dDA4LqiR3PNTQWaaV8BIeBDtPx6JWfPFnIh1EItmX1vFgVX_VyxjorGFDsCKn-vo4_NmRLrkxfY3Ci0rXHT0CthGavL5yg0ScclvypMHHd" fill sizes="80px" className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-on-surface text-sm truncate">Radiance Vitamin C Serum</h4>
              <p className="text-xs text-secondary mb-2">Brightening & Anti-Aging</p>
              <div className="flex items-center gap-2">
                <span className="text-on-surface font-bold">$48.00</span>
                <span className="text-secondary text-[10px] line-through">$62.00</span>
              </div>
            </div>
            <button className="p-2.5 rounded-full bg-primary text-white shadow-sm">
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>

          {/* Product Item 2 */}
          <div className="flex items-center gap-4 p-3 bg-surface-container-low/50 rounded-2xl border border-outline-variant/20">
            <div className="w-20 h-20 relative rounded-xl bg-surface-container overflow-hidden flex-shrink-0">
              <Image alt="Cleansing Balm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-6L4rK4rW-2Q3jW7F-zG2F9V-vJ5v6D1u3V8P2V4L-M4L6K4R4V-2Q3jW7F-zG2F9V-vJ5v6D1u3V8P2V4L-M4L6K4R4V-2Q3jW7F-zG2F9V" fill sizes="80px" className="object-cover bg-surface-variant" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-on-surface text-sm truncate">Velvet Cleansing Balm</h4>
              <p className="text-xs text-secondary mb-2">Gentle Makeup Remover</p>
              <div className="flex items-center gap-2">
                <span className="text-on-surface font-bold">$32.00</span>
              </div>
            </div>
            <button className="p-2.5 rounded-full bg-primary text-white shadow-sm">
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <footer className="z-20 bg-on-surface px-6 pt-4 pb-8 flex items-center gap-4 border-t border-white/5 relative mt-auto">
        <button className="p-3 rounded-full bg-surface-container-highest/10 text-white hover:bg-surface-container-highest/20 transition-all flex items-center justify-center" title="Shopping Bag">
          <ShoppingBag className="w-5 h-5" />
        </button>
        <div className="flex-1 relative">
          <input className="w-full bg-surface-container-highest/10 border-none rounded-full py-3 px-6 text-sm text-white placeholder:text-white/40 focus:ring-2 focus:ring-primary/50 transition-all outline-none" placeholder="Say something nice..." type="text" />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary-container">
            <Send className="w-4 h-4 fill-current" />
          </button>
        </div>
        <button className="p-3 rounded-full bg-gradient-to-tr from-yellow-400 to-primary-container text-on-surface-variant shadow-lg hover:scale-105 active:scale-95 transition-all" title="Send Gift">
          <Gift className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
}
