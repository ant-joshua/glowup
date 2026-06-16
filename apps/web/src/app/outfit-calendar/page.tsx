import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sun, ArrowRight, Shirt, ShoppingBag } from "lucide-react";

export default function OutfitCalendarPage() {
  return (
    <div className="flex-1 max-w-md mx-auto px-6 py-6 md:max-w-3xl lg:max-w-5xl w-full">
      {/* Header */}
      <div className="mb-8 mt-4">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight text-on-surface mb-2">October</h2>
        <p className="font-sans text-secondary text-sm md:text-base">Plan your editorial moments.</p>
      </div>

      {/* Calendar Component */}
      <section className="bg-surface-container-low rounded-xl p-6 mb-10 shadow-ambient">
        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 mb-4 text-center">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div key={i} className="text-xs font-sans text-secondary font-semibold uppercase tracking-wider">{day}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 text-center text-sm font-sans">
          {/* Empty slots for previous month */}
          <div className="py-2 text-secondary opacity-50">29</div>
          <div className="py-2 text-secondary opacity-50">30</div>
          
          {/* Current month days */}
          {[...Array(31)].map((_, i) => {
            const day = i + 1;
            const isToday = day === 9;
            const hasTertiaryDot = [2, 4, 7, 10].includes(day);
            const hasDimDot = [15, 18].includes(day);

            return (
              <div key={day} className="py-2 relative flex flex-col items-center justify-center">
                {isToday ? (
                  <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-primary to-primary-container text-white rounded-full font-semibold shadow-[0_8px_16px_rgba(161,63,32,0.2)]">
                    {day}
                  </div>
                ) : (
                  <span>{day}</span>
                )}
                
                {isToday && <div className="w-1.5 h-1.5 rounded-full bg-white mt-1 absolute bottom-0"></div>}
                {hasTertiaryDot && <div className="w-1.5 h-1.5 rounded-full bg-tertiary mt-1 absolute bottom-0"></div>}
                {hasDimDot && <div className="w-1.5 h-1.5 rounded-full bg-surface-dim mt-1 absolute bottom-0"></div>}
              </div>
            );
          })}
          
          {/* Empty slots for next month */}
          <div className="py-2 text-secondary opacity-50">1</div>
          <div className="py-2 text-secondary opacity-50">2</div>
        </div>
      </section>

      {/* Today's Set */}
      <section className="mb-10">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="font-serif text-2xl text-on-surface">Today&apos;s Set</h3>
            <p className="text-sm text-secondary font-sans mt-1">Curated for 68° & Breezy</p>
          </div>
          <Sun className="text-primary w-8 h-8" />
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-ambient flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-1/3 aspect-[4/5] rounded-lg overflow-hidden relative group">
            <Image 
              alt="Curated Outfit" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjrJzkl34Gmz02UO4w0McKzQyvwobfQgiOqvJwr-ZMfuHmalsauHmjS5D4PTP3YfPPkZ0QGRlX5KJhh26qa7y-Kt_j9Eh_9HWhqmM4weYVTL9a9fWWjAO_T2kqMqpp-OyJt_gfQBu9qPJw8g3isjxObEn38w6Z1xUBBPbbGsJhmSBsZEEHE7cp11ttxRcu1pNKb322tHe3HDBqxa6bdSIl0JS0nGkcFy73V0KCC0g-vAf_cGOG019KblsAcoZW_xcxOrBzCRLVi6XJ"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="w-full md:w-2/3 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-surface-container-high text-on-surface text-xs font-sans font-bold uppercase tracking-widest px-3 py-1 rounded-full">Workwear</span>
              <span className="bg-surface-container-high text-on-surface text-xs font-sans font-bold uppercase tracking-widest px-3 py-1 rounded-full">Elevated</span>
            </div>
            <h4 className="font-serif text-xl mb-2 text-on-surface">The Ethereal Trench</h4>
            <p className="font-sans text-secondary text-sm mb-6 leading-relaxed">A layered approach perfect for transitional weather. The structured trench balances the soft silk blouse.</p>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center">
                <div className="w-12 h-12 relative mb-2">
                  <Image alt="Trench Coat" className="object-cover rounded-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-sSWppvkTS7mNkCQ5fEX_kYxc3wWD-OBMJCBQYrxEecoT2KyM2mgNiwhLt8Fj_3VKXe0iGGFwUhYPEHQ7BJN45qdte9SkVs05v7DKn3n1rcAhtFOC3vFwYSuRIVB2MAXPWhRrCoT0xwjwDTGfTGhhCPPWfONHlRO9BqpoZAhK9jxsAlLHGEJoUMcjsjSvUMYm2Z2_GrLyXarXjftbr3F9BsAktTlYce5fTo5IF6O72qT8iGzMWTSatMTNZQ-mtKgUwRypNmzsjqgg" fill sizes="48px" />
                </div>
                <span className="text-xs text-secondary font-sans">Outer</span>
              </div>
              <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center">
                <div className="w-12 h-12 relative mb-2">
                  <Image alt="Silk Blouse" className="object-cover rounded-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1OE1YpGZ-VHeO4nRGTs-SazqDwTqC7aPEHSAOjMfLf6Q5ybx5ZeoBQasFkFXG90XprvdqBVmuAGZMWBxCNEvT42JCNmgVE2gULCLdXTqBkS-BlRO6o-mVwIS8ybfiV3llGqweXKb7CC8yzpf9E4WneTthFOElmwYHRvuXcOxyJ4r5hXNYq0QgnvjPpoEPu9a_LXDsYb-wPXXvka04jE064_T5yMkyAtWz6-n4mfN-RDm4LMj15Mb9-pxKw5K32URGaxUE5rQTpJ6q" fill sizes="48px" />
                </div>
                <span className="text-xs text-secondary font-sans">Top</span>
              </div>
              <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center">
                <div className="w-12 h-12 relative mb-2">
                  <Image alt="Tailored Trousers" className="object-cover rounded-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwNi6X-5CIEmMqF615rRT-dHNT2CAYMjddG6Mp5RdTqEBNxhCzwWwHn4UAoHBZR3wycabdhdpPEGqidKH7u-RP6Kz_iR5TfBMfd2rfrhd937uE2IGPq9OxvlMK0n5evIbpN-DwY1z8d4C0B5WjhOus5xEHXErnfvmIFM6BJheRogTcteYAfLxWGNoEAoSjXIRwItXDcbS7FThp4QKOgzVFLXJwYmEAHDwpSzbw74KGGdFwU-sFiyUgkoicv1tpC0aYeJVLSQMMvz0u" fill sizes="48px" />
                </div>
                <span className="text-xs text-secondary font-sans">Bottom</span>
              </div>
            </div>

            <Button className="w-full bg-gradient-to-br from-primary to-primary-container text-white font-sans font-semibold text-base py-6 rounded-xl shadow-[0_8px_24px_rgba(161,63,32,0.2)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 h-auto">
              Plan Tomorrow
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-surface-container-low rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container transition-colors">
          <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-3 text-secondary">
            <Shirt className="w-6 h-6" />
          </div>
          <span className="font-sans text-sm font-semibold text-on-surface">Wash Schedule</span>
        </div>
        <div className="bg-surface-container-low rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container transition-colors">
          <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-3 text-secondary">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <span className="font-sans text-sm font-semibold text-on-surface">Wishlist</span>
        </div>
      </section>
    </div>
  );
}
