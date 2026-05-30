import { Check } from "lucide-react";
import Image from "next/image";

export default function DailyDashboardPage() {
  return (
    <div className="pt-8 px-6 max-w-lg mx-auto md:max-w-2xl lg:max-w-3xl md:pt-12">
      {/* Greeting Hero */}
      <section className="pl-2 mb-10">
        <h1 className="font-serif text-4xl md:text-5xl text-secondary font-normal tracking-tight opacity-90">
          Good morning,
        </h1>
        <h2 className="font-serif text-5xl md:text-6xl text-on-surface font-bold mt-1 tracking-tighter">
          Alex.
        </h2>
      </section>

      {/* Focus Card */}
      <section className="bg-surface-container-low rounded-[1.5rem] p-6 md:p-8 mb-10 relative overflow-hidden shadow-ambient-sm">
        {/* Decorative Glow Accent */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-primary to-primary-container opacity-10 blur-3xl rounded-full" />
        <p className="font-sans text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">
          Today&apos;s Focus
        </p>
        <h3 className="font-serif text-3xl text-on-surface mb-3 leading-tight relative z-10">
          Deep Hydration <br />& Recovery
        </h3>
        <p className="font-sans text-sm md:text-base text-secondary max-w-[85%] leading-relaxed relative z-10">
          Focus on restoring your skin barrier today. Skip the actives and lean heavily into ceramides and hyaluronic acid.
        </p>
      </section>

      {/* Routine Checklist */}
      <section className="mb-12">
        <h4 className="font-serif text-2xl text-on-surface mb-5 pl-2">Morning Ritual</h4>
        <div className="flex flex-col gap-4">
          {/* Completed Task */}
          <button className="w-full text-left bg-surface-container-low rounded-[1.5rem] p-4 flex items-center gap-4 transition-all duration-300">
            <div className="w-7 h-7 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary shadow-[0_4px_12px_rgba(0,106,96,0.2)] shrink-0">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div className="flex-1">
              <span className="font-sans text-base text-secondary line-through opacity-70">
                Gentle Oil Cleanse
              </span>
            </div>
          </button>

          {/* Pending Task */}
          <button className="w-full text-left bg-surface-container-lowest rounded-[1.5rem] p-4 flex items-center gap-4 border border-outline/15 shadow-ambient-sm hover:shadow-ambient transition-all duration-300 transform hover:-translate-y-0.5 group">
            <div className="w-7 h-7 rounded-full border-[1.5px] border-primary/40 flex items-center justify-center bg-surface-container-lowest shrink-0 group-hover:border-primary/60 transition-colors">
            </div>
            <div className="flex-1 flex flex-col">
              <span className="font-sans text-base text-on-surface font-semibold">
                Hyaluronic Acid Serum
              </span>
              <span className="font-sans text-xs text-secondary mt-0.5">
                Apply on damp skin
              </span>
            </div>
          </button>

          {/* Pending Task */}
          <button className="w-full text-left bg-surface-container-lowest rounded-[1.5rem] p-4 flex items-center gap-4 border border-outline/15 shadow-ambient-sm hover:shadow-ambient transition-all duration-300 transform hover:-translate-y-0.5 group">
            <div className="w-7 h-7 rounded-full border-[1.5px] border-primary/40 flex items-center justify-center bg-surface-container-lowest shrink-0 group-hover:border-primary/60 transition-colors">
            </div>
            <div className="flex-1 flex flex-col">
              <span className="font-sans text-base text-on-surface font-semibold">
                Ceramide Moisturizer & SPF 50
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* Daily Tip */}
      <section className="mb-8">
        <h4 className="font-serif text-2xl text-on-surface mb-5 pl-2">The Atelier Edits</h4>
        <div className="relative rounded-[1.5rem] overflow-hidden shadow-ambient bg-surface-container group cursor-pointer">
          <div className="h-64 w-full relative">
            <Image
              alt="Skincare bottles flatlay"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              fill
              sizes="(max-width: 1024px) 100vw, 768px"
              src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop"
            />
            {/* Elegant gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/30 to-transparent" />
          </div>
          
          <div className="absolute bottom-0 left-0 w-full p-6">
            <span className="inline-block px-3 py-1 bg-surface-container-lowest/20 backdrop-blur-md text-surface-container-lowest font-sans text-[10px] uppercase tracking-widest rounded-full mb-3 border border-surface-container-lowest/20">
              Daily Insight
            </span>
            <h5 className="font-serif text-surface-container-lowest text-xl md:text-2xl mb-2 leading-snug">
              The Architecture of Layering
            </h5>
            <p className="font-sans text-surface-container-lowest/80 text-sm max-w-[90%]">
              Apply products from thinnest to thickest consistency to ensure maximum absorption and a flawless canvas.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
