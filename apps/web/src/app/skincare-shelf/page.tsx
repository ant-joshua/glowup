import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Droplets, MoreHorizontal, Hourglass, Sparkles, SprayCan, FlaskConical, AlertTriangle, Target, Plus } from "lucide-react";

export default function SkincareShelfPage() {
  return (
    <div className="flex-1 px-6 pt-8 pb-8 md:p-12 md:max-w-7xl md:mx-auto w-full">
      {/* Header Section */}
      <div className="mb-12 md:ml-8">
        <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-on-surface mb-2">My Shelf</h1>
        <p className="font-sans text-secondary text-base md:text-lg">Curated essentials for your combination skin journey.</p>
      </div>

      {/* View Toggle */}
      <div className="flex bg-surface-container-low rounded-full p-1 w-max mb-12 md:ml-8 shadow-sm">
        <button className="bg-tertiary text-on-tertiary px-6 py-2 rounded-full font-sans text-sm font-medium transition-colors shadow-[0_4px_12px_rgba(0,106,96,0.15)]">Shelf View</button>
        <button className="text-secondary hover:text-on-surface px-6 py-2 rounded-full font-sans text-sm font-medium transition-colors">Regimen Order</button>
      </div>

      {/* Shelf Grid */}
      <div className="space-y-16">
        {/* Step: Cleanse */}
        <section>
          <div className="flex items-center gap-4 mb-6 md:ml-8">
            <Droplets className="text-tertiary w-10 h-10 bg-surface-container-low p-2 rounded-full" />
            <h2 className="font-serif text-2xl text-on-surface">Cleanse</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Product Card */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="font-sans text-xs font-bold text-secondary uppercase tracking-widest mb-1 block">Tatcha</span>
                  <h3 className="font-serif text-xl text-on-surface">The Camellia Cleansing Oil</h3>
                </div>
                <button className="text-secondary hover:text-primary transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              <div className="h-40 bg-surface-container-low rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                <Image 
                  alt="Cleansing oil product" 
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCenbBXWazhmXwBv5UJwVMDc97E9iG3W-vQwYKEw9U7og51uPayfEpQtJcBPhY5gNGvGJJSqdPNAW83efBz-1AKCxnwYmxB5u06039VyC0SnAt2-dLTPWdxBCOwqwk48P2wbdv2QmTiK0Ef2XB5EvmTfsdUMwZJAzCAy2_Ngpjl7zTn5jsNY2cMGARI_PGwW4GaxT97Qn7ssYRQRvJFgij12aprEDAZ0lbl3M9ShtGF_xZ_EzkGqcSeSOyleN1lCwpCu3tRLVDPDTq"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2 text-sm text-secondary font-sans bg-surface-container py-1 px-3 rounded-full">
                  <Hourglass className="w-4 h-4" />
                  <span>Opened 2mo ago</span>
                </div>
                <span className="text-primary bg-primary-fixed py-1 px-2 rounded-lg" title="Makeup Removal">
                  <Sparkles className="w-5 h-5" />
                </span>
              </div>
            </div>

            {/* Product Card */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="font-sans text-xs font-bold text-secondary uppercase tracking-widest mb-1 block">Youth To The People</span>
                  <h3 className="font-serif text-xl text-on-surface">Superfood Cleanser</h3>
                </div>
                <button className="text-secondary hover:text-primary transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              <div className="h-40 bg-surface-container-low rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                <Image 
                  alt="Superfood cleanser" 
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVHSMNuGJ78CQAY0rDMaGtI-YUKY8uIwRPFvHsTepF14i6KcuYk0C--4XNfkATJXG2ootKhX0ct5EMUsnU5U3CFGxrvkBJXKems_l-x5hdsoVzYK97MdgV477eh2_lG6_2awf2z0URgRTRQPL3Lln65MkLl0ONMqXrJnu6HUEq16izYtL98slIA2d24iqhGf3tjFB6Xe7cId1A1xouOXWvmNvMTfv5JYabWBM5UqUuL8jB8iVKMVFn3MLDs9vAVaReLjVdrVHQP3VX"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2 text-sm text-secondary font-sans bg-surface-container py-1 px-3 rounded-full">
                  <Hourglass className="w-4 h-4" />
                  <span>Opened 1mo ago</span>
                </div>
                <span className="text-tertiary bg-tertiary-fixed py-1 px-2 rounded-lg" title="Deep Clean">
                  <SprayCan className="w-5 h-5" />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Step: Treat */}
        <section>
          <div className="flex items-center gap-4 mb-6 md:ml-8">
            <FlaskConical className="text-primary w-10 h-10 bg-surface-container-low p-2 rounded-full" />
            <h2 className="font-serif text-2xl text-on-surface">Treat</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Product Card */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="font-sans text-xs font-bold text-secondary uppercase tracking-widest mb-1 block">Paula&apos;s Choice</span>
                  <h3 className="font-serif text-xl text-on-surface">2% BHA Liquid Exfoliant</h3>
                </div>
                <button className="text-secondary hover:text-primary transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              <div className="h-40 bg-surface-container-low rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                <Image 
                  alt="BHA Liquid Exfoliant" 
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDbSOIFp0rMvAcGEOvqThSeU3bYo3Jz0WsR-oh9Jt-wbDpt3JZTyC1BzNXb_kupt9542kJ9LjVZT-KfCXsgAWpym7p9Z4p7N9-TaEJzGm_R3T1a4k0zTWw_tdHyS3Q0ko9ovRH6PFeTwHeEYgJjLCo2E6AjJBnycPo5ie2VErwQYkSgWoN_SEaugV1GlM2mlkGBn_GhcRVQyYZtp-POANNKo-I6z4O79FC1kFm2bXhePrNu9OMu_TqHVkYv-Sd0goo0eN2nJPyJFsH"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2 text-sm text-secondary font-sans bg-surface-container py-1 px-3 rounded-full">
                  <AlertTriangle className="w-4 h-4 text-primary" />
                  <span className="text-primary font-medium">Expires in 1mo</span>
                </div>
                <span className="text-secondary bg-surface-variant py-1 px-2 rounded-lg" title="Pore Care">
                  <Target className="w-5 h-5" />
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Add New Action Area */}
      <div className="mt-16 text-center">
        <Button className="inline-flex items-center justify-center gap-2 font-sans font-semibold text-lg bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl px-8 py-6 shadow-[0_8px_24px_rgba(161,63,32,0.2)] hover:shadow-[0_12px_32px_rgba(161,63,32,0.3)] transition-all transform hover:-translate-y-1 h-auto">
          <Plus className="w-5 h-5" />
          Add to Shelf
        </Button>
      </div>
    </div>
  );
}
