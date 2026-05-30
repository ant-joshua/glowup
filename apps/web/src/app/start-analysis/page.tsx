"use client";

import React, { useState, useCallback, useEffect } from "react";
import { ArrowLeft, X, CheckCircle2, Sparkles, Shirt, Palette, UploadCloud, ImageIcon, Loader2, Info } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const analysisOptions = [
  {
    id: "skin",
    title: "Skin analysis",
    description: "Get targeted advice for a glowing, healthy complexion.",
    icon: Sparkles,
  },
  {
    id: "style",
    title: "Find my style",
    description: "Discover looks that express your unique personality.",
    icon: Shirt,
  },
  {
    id: "color",
    title: "Personal Color Analysis",
    description: "Find the palette that perfectly complements your natural features.",
    icon: Palette,
  },
];

const mockResult = {
  skinAnalysis: {
    skinType: "Berminyak",
    identifiedIssues: [
      "Jerawat aktif (pustul dan papul)",
      "Kemerahan (eritema)",
      "Pori-pori besar",
      "Bekas jerawat (PIE/PIH)"
    ]
  },
  skincareRecommendations: [
    {
      category: "Cleanser",
      brandAndProduct: "Cosrx Salicylic Acid Daily Gentle Cleanser",
      reason: "Mengandung Salicylic Acid (BHA) yang efektif membersihkan minyak berlebih di pori-pori dan meredakan jerawat aktif."
    },
    {
      category: "Toner",
      brandAndProduct: "Avoskin Miraculous Acne Solution Toner",
      reason: "Kombinasi BHA dan Tea Tree membantu mengeksfoliasi kulit berjerawat secara lembut dan mengurangi kemerahan."
    },
    {
      category: "Serum",
      brandAndProduct: "Somethinc 5% Niacinamide + Moisture Sabi Beet Serum",
      reason: "Membantu memudarkan bekas jerawat, mengontrol produksi sebum, dan memperkuat skin barrier tanpa memicu iritasi."
    },
    {
      category: "Moisturizer",
      brandAndProduct: "The Originote Cica-B5 Soothing Moisturizer",
      reason: "Tekstur gel yang ringan dan menenangkan berkat kandungan Centella Asiatica, sangat baik untuk menghidrasi kulit berjerawat tanpa menyumbat pori."
    },
    {
      category: "Sunscreen",
      brandAndProduct: "Skin Aqua UV Moisture Gel SPF 30 PA++",
      reason: "Sunscreen berbasis air yang ringan, tidak lengket, dan cocok untuk jenis kulit berminyak serta berjerawat."
    }
  ],
  usageSchedule: {
    amRoutine: [
      "Cuci muka dengan Cosrx Salicylic Acid Daily Gentle Cleanser",
      "Gunakan Somethinc 5% Niacinamide Serum",
      "Gunakan The Originote Cica-B5 Soothing Moisturizer",
      "Aplikasikan Skin Aqua UV Moisture Gel SPF 30 PA++"
    ],
    pmRoutine: [
      "Cuci muka dengan Cosrx Salicylic Acid Daily Gentle Cleanser",
      "Gunakan Avoskin Miraculous Acne Solution Toner (2-3 kali seminggu)",
      "Gunakan Somethinc 5% Niacinamide Serum",
      "Gunakan The Originote Cica-B5 Soothing Moisturizer"
    ]
  },
  avoidances: {
    ingredients: [
      "Fragrance tinggi",
      "Alkohol denat",
      "High-concentration Retinol bersamaan dengan BHA",
      "Heavy oils (seperti Coconut Oil)"
    ],
    habits: [
      "Memencet atau menyentuh jerawat dengan tangan kotor",
      "Sering mengonsumsi makanan tinggi gula dan produk olahan susu (dairy)",
      "Jarang mengganti sarung bantal",
      "Eksfoliasi fisik (scrub) yang terlalu kasar"
    ]
  },
  personalColor: {
    undertone: "Warm",
    seasonalColor: "True Autumn",
    recommendedClothingColors: [
      "Terracotta",
      "Olive Green",
      "Mustard Gold",
      "Warm Beige",
      "Burnt Orange"
    ],
    colorsToAvoid: [
      "Icy Blue",
      "Neon Pink",
      "Stark White",
      "Lavender"
    ]
  }
};

export default function StartAnalysisPage() {
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Auto-progress from Step 3 to Step 4 after a delay
  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        setStep(4);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-surface sticky top-0 z-10">
        {step === 1 ? (
          <Link href="/daily-dashboard" className="p-2 hover:bg-surface-container rounded-full transition-colors text-primary">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        ) : step === 4 ? (
           <div className="p-2 w-10"></div> /* Placeholder for alignment */
        ) : (
          <button onClick={() => setStep(step - 1)} className="p-2 hover:bg-surface-container rounded-full transition-colors text-primary">
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        
        <h1 className="text-2xl font-serif font-bold text-primary tracking-tight">GlowUp</h1>
        
        <Link href="/daily-dashboard" className="p-2 hover:bg-surface-container rounded-full transition-colors text-primary">
          <X className="w-6 h-6" />
        </Link>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto p-6 flex flex-col gap-8 pb-32">
        {/* Progress indicator */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2 w-48 justify-center">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors duration-500",
                  i <= step ? "bg-tertiary" : "bg-surface-container-highest"
                )} 
              />
            ))}
          </div>
          <p className="text-xs font-bold tracking-widest text-tertiary uppercase">
            Step {step} of 4
          </p>
        </div>

        {/* Dynamic Content Wrapper for Animation */}
        <div key={step} className="animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both w-full flex-1 flex flex-col">
          
          {/* STEP 1: Select Goal */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-serif font-medium text-on-surface leading-tight">
                  What&apos;s your primary goal for today?
                </h2>
                <p className="text-muted-foreground text-sm">
                  Select the area you want to focus on first to personalize your journey.
                </p>
              </div>

              <div className="space-y-4">
                {analysisOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedOption === option.id;

                  return (
                    <button
                      key={option.id}
                      onClick={() => setSelectedOption(option.id)}
                      className={cn(
                        "w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 relative overflow-hidden group",
                        isSelected
                          ? "border-primary bg-surface-container-lowest shadow-sm"
                          : "border-transparent bg-surface-container-low hover:bg-surface-container"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "p-3 rounded-full shrink-0 transition-colors",
                            isSelected 
                              ? "bg-primary/10 text-primary" 
                              : "bg-surface-container-highest text-muted-foreground group-hover:text-on-surface"
                          )}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="space-y-1.5 flex-1 pr-6">
                          <h3 className="font-serif font-bold text-lg text-on-surface">{option.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {option.description}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-4 right-4 text-primary animate-in fade-in zoom-in duration-200">
                          <CheckCircle2 className="w-6 h-6 fill-primary text-surface-container-lowest" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Image Upload */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-serif font-medium text-on-surface leading-tight">
                  Upload your photos
                </h2>
                <p className="text-muted-foreground text-sm">
                  For best results, follow these guidelines when taking your photos.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <div className="aspect-[3/4] relative rounded-xl overflow-hidden bg-surface-container-high border border-border">
                    <Image
                      src="https://cdn.mailry.co/assets/3.jpeg"
                      alt="Front face example"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 150px"
                    />
                  </div>
                  <p className="text-xs text-center font-medium text-muted-foreground">Front</p>
                </div>
                <div className="space-y-2">
                  <div className="aspect-[3/4] relative rounded-xl overflow-hidden bg-surface-container-high border border-border">
                    <Image
                      src="https://cdn.mailry.co/assets/2.jpeg"
                      alt="Left side example"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 150px"
                    />
                  </div>
                  <p className="text-xs text-center font-medium text-muted-foreground">Left Side</p>
                </div>
                <div className="space-y-2">
                  <div className="aspect-[3/4] relative rounded-xl overflow-hidden bg-surface-container-high border border-border">
                    <Image
                      src="https://cdn.mailry.co/assets/1.jpeg"
                      alt="Right side example"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 150px"
                    />
                  </div>
                  <p className="text-xs text-center font-medium text-muted-foreground">Right Side</p>
                </div>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ease-in-out cursor-pointer",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border bg-surface-container-lowest hover:border-primary/50 hover:bg-surface-container-low"
                )}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-surface-container rounded-full text-primary">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-on-surface">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      SVG, PNG, JPG or GIF (max. 10MB)
                    </p>
                  </div>
                </div>
              </div>

              {files.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-on-surface">Selected Files ({files.length})</h4>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-xl border border-border">
                        <ImageIcon className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm truncate flex-1">{file.name}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setFiles(files.filter((_, i) => i !== index));
                          }}
                          className="p-1.5 hover:bg-surface-container rounded-md text-muted-foreground hover:text-on-surface transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Loading / Analyzing */}
          {step === 3 && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-12">
              <div className="relative">
                {/* Glowing background */}
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                <div className="w-24 h-24 bg-surface-container-lowest rounded-full shadow-xl flex items-center justify-center relative z-10 border border-border">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-serif font-bold text-on-surface animate-pulse">
                  Analyzing process...
                </h2>
                <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
                  Our AI is processing your photos to generate personalized recommendations.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Results */}
          {step === 4 && (
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <div className="mx-auto w-16 h-16 bg-tertiary/10 text-tertiary rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-serif font-medium text-on-surface leading-tight">
                  Your Analysis is Ready
                </h2>
                <p className="text-muted-foreground text-sm">
                  Here are your personalized insights based on your photo.
                </p>
              </div>

              {/* Skin Analysis Summary */}
              <Card className="bg-surface-container-lowest border-border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-serif flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Skin Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Skin Type</span>
                    <p className="text-lg font-medium text-on-surface capitalize mt-1">{mockResult.skinAnalysis.skinType}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block mb-2">Identified Issues</span>
                    <div className="flex flex-wrap gap-2">
                      {mockResult.skinAnalysis.identifiedIssues.map((issue, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-surface-container hover:bg-surface-container-high text-on-surface border-none font-normal">
                          {issue}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skincare Recommendations */}
              <div className="space-y-4">
                <h3 className="text-xl font-serif font-bold text-on-surface">Recommended Routine</h3>
                <div className="space-y-3">
                  {mockResult.skincareRecommendations.map((rec, idx) => (
                    <div key={idx} className="p-4 bg-surface-container-low rounded-2xl border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                          {rec.category}
                        </Badge>
                      </div>
                      <h4 className="font-bold text-on-surface mb-1">{rec.brandAndProduct}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{rec.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-surface-container-lowest border-border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-serif flex items-center gap-2">
                      🌞 AM Routine
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-on-surface">
                      {mockResult.usageSchedule.amRoutine.map((step, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-tertiary font-bold">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-surface-container-lowest border-border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-serif flex items-center gap-2">
                      🌙 PM Routine
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-on-surface">
                      {mockResult.usageSchedule.pmRoutine.map((step, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-primary font-bold">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Avoidances */}
              <Card className="bg-[#fdf8f6] border-[#fadad1] shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-serif flex items-center gap-2 text-[#a13f20]">
                    <Info className="w-5 h-5" />
                    Things to Avoid
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-xs text-[#a13f20]/70 uppercase tracking-wider font-semibold block mb-2">Ingredients</span>
                    <ul className="list-disc pl-4 space-y-1 text-sm text-[#5c2412]">
                      {mockResult.avoidances.ingredients.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-xs text-[#a13f20]/70 uppercase tracking-wider font-semibold block mb-2">Habits</span>
                    <ul className="list-disc pl-4 space-y-1 text-sm text-[#5c2412]">
                      {mockResult.avoidances.habits.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Color (only if selected option was color or we show it anyway) */}
              <Card className="bg-surface-container-lowest border-border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-serif flex items-center gap-2">
                    <Palette className="w-5 h-5 text-tertiary" />
                    Personal Color
                  </CardTitle>
                  <CardDescription>Your ideal color palette based on the analysis.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Undertone</span>
                      <p className="font-medium text-on-surface mt-1">{mockResult.personalColor.undertone}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Season</span>
                      <p className="font-medium text-on-surface mt-1">{mockResult.personalColor.seasonalColor}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block mb-2">Recommended Colors</span>
                    <div className="flex flex-wrap gap-2">
                      {mockResult.personalColor.recommendedClothingColors.map((color, idx) => (
                        <Badge key={idx} className="bg-tertiary/10 text-tertiary hover:bg-tertiary/20 border-none font-normal">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block mb-2">Colors to Avoid</span>
                    <div className="flex flex-wrap gap-2">
                      {mockResult.personalColor.colorsToAvoid.map((color, idx) => (
                        <Badge key={idx} variant="outline" className="text-muted-foreground font-normal">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Footer Buttons */}
      {step !== 3 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-surface via-surface/90 to-transparent pt-12 z-10">
          <div className="max-w-md mx-auto">
            {step === 1 && (
              <Button 
                onClick={() => setStep(2)}
                className="w-full py-7 text-lg rounded-xl shadow-lg bg-primary hover:bg-primary/90 text-white font-medium" 
                disabled={!selectedOption}
              >
                Continue
                <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
              </Button>
            )}
            
            {step === 2 && (
              <Button 
                onClick={() => setStep(3)}
                className="w-full py-7 text-lg rounded-xl shadow-lg bg-primary hover:bg-primary/90 text-white font-medium" 
                disabled={files.length === 0}
              >
                Start Analyze
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            )}

            {step === 4 && (
              <Link href="/daily-dashboard" className="block w-full">
                <Button 
                  className="w-full py-7 text-lg rounded-xl shadow-lg bg-on-surface hover:bg-on-surface/90 text-surface font-medium" 
                >
                  Done
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}