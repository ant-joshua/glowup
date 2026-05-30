"use client";

import React, { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Sparkles, Shirt, Palette, Search, SlidersHorizontal, Calendar, Info, X } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Mock data for analysis history
const historyData = [
  {
    id: "1",
    date: new Date("2024-05-30T10:30:00"),
    type: "skin",
    title: "Skin Analysis",
    image: "https://images.unsplash.com/photo-1512496015851-a1dc8a477d95?q=80&w=400&auto=format&fit=crop",
    result: {
      skinType: "Oily",
      issues: ["Active Acne", "Redness", "Large Pores"],
      score: 75,
    },
    details: {
      routine: ["Cleanser: BHA", "Toner: Tea Tree", "Serum: Niacinamide", "Moisturizer: Gel-based"],
      avoid: ["Heavy Oils", "High Fragrance"],
    }
  },
  {
    id: "2",
    date: new Date("2024-05-25T14:15:00"),
    type: "color",
    title: "Personal Color Analysis",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    result: {
      season: "True Autumn",
      undertone: "Warm",
      score: 92,
    },
    details: {
      recommended: ["Terracotta", "Olive Green", "Mustard Gold", "Warm Beige"],
      avoid: ["Icy Blue", "Neon Pink", "Stark White"],
    }
  },
  {
    id: "3",
    date: new Date("2024-05-18T09:00:00"),
    type: "style",
    title: "Find My Style",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
    result: {
      style: "Casual Chic",
      vibe: "Relaxed yet polished",
      score: 88,
    },
    details: {
      keyPieces: ["Oversized Blazer", "Straight Leg Jeans", "White Sneakers", "Minimalist Jewelry"],
      colors: ["Navy", "Cream", "Grey", "Camel"],
    }
  },
  {
    id: "4",
    date: new Date("2024-04-20T11:45:00"),
    type: "skin",
    title: "Skin Analysis",
    image: "https://images.unsplash.com/photo-1512496015851-a1dc8a477d95?q=80&w=400&auto=format&fit=crop",
    result: {
      skinType: "Oily / Acne Prone",
      issues: ["Acne Scars", "Redness"],
      score: 65,
    },
    details: {
      routine: ["Cleanser: Salicylic Acid", "Treatment: Azelaic Acid", "Moisturizer: Centella Asiatica"],
      avoid: ["Physical Scrubs", "Coconut Oil"],
    }
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "skin": return <Sparkles className="w-5 h-5" />;
    case "style": return <Shirt className="w-5 h-5" />;
    case "color": return <Palette className="w-5 h-5" />;
    default: return <Sparkles className="w-5 h-5" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "skin": return "text-primary bg-primary/10";
    case "style": return "text-secondary bg-secondary/10";
    case "color": return "text-tertiary bg-tertiary/10";
    default: return "text-primary bg-primary/10";
  }
};

export default function AnalysisHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<typeof historyData[0] | null>(null);

  const filteredHistory = historyData.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.result.skinType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.result.season?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.result.style?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-serif font-bold text-on-surface tracking-tight mb-2">Analysis History</h1>
          <p className="text-secondary text-lg">Review your past consultations and track your progress over time.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search history..." 
              className="pl-9 bg-surface-container-lowest border-border rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0 rounded-xl border-border text-on-surface hover:bg-surface-container">
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* History Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredHistory.map((item) => (
          <Card 
            key={item.id} 
            className="overflow-hidden border-border bg-surface-container-lowest hover:shadow-ambient transition-all duration-300 cursor-pointer group rounded-2xl flex flex-col h-full"
            onClick={() => setSelectedItem(item)}
          >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-surface-container">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              
              <div className="absolute top-4 right-4">
                <Badge className={`border-none backdrop-blur-md ${getTypeColor(item.type)}`}>
                  <div className="flex items-center gap-1.5">
                    {getTypeIcon(item.type)}
                    <span className="capitalize">{item.type}</span>
                  </div>
                </Badge>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 text-sm font-medium mb-1 opacity-90">
                  <Calendar className="w-4 h-4" />
                  {format(item.date, "MMM d, yyyy")}
                </div>
                <h3 className="font-serif text-xl font-bold line-clamp-1">{item.title}</h3>
              </div>
            </div>

            <CardContent className="p-5 flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                {item.type === "skin" && (
                  <>
                    <div>
                      <span className="text-xs text-muted-foreground uppercase font-semibold">Skin Type</span>
                      <p className="font-medium text-on-surface">{item.result.skinType}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground uppercase font-semibold mb-1.5 block">Key Issues</span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.result.issues?.map((issue, i) => (
                          <Badge key={i} variant="secondary" className="bg-surface-container text-xs font-normal text-on-surface">
                            {issue}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                {item.type === "color" && (
                  <>
                    <div>
                      <span className="text-xs text-muted-foreground uppercase font-semibold">Season</span>
                      <p className="font-medium text-on-surface">{item.result.season}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground uppercase font-semibold">Undertone</span>
                      <p className="font-medium text-on-surface">{item.result.undertone}</p>
                    </div>
                  </>
                )}

                {item.type === "style" && (
                  <>
                    <div>
                      <span className="text-xs text-muted-foreground uppercase font-semibold">Style Profile</span>
                      <p className="font-medium text-on-surface">{item.result.style}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground uppercase font-semibold">Vibe</span>
                      <p className="font-medium text-on-surface">{item.result.vibe}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="p-5 pt-0 mt-auto">
              <div className="w-full flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Match Score</span>
                <span className="font-bold text-tertiary">{item.result.score}%</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredHistory.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-serif font-medium text-on-surface mb-2">No history found</h3>
          <p className="text-secondary">Try adjusting your search terms.</p>
        </div>
      )}

      {/* Details Dialog / Modal with Backdrop Blur */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-4xl md:min-w-4xl bg-surface/95 backdrop-blur-2xl border-border shadow-2xl rounded-3xl p-0 overflow-hidden">
          {selectedItem && (
            <div className="flex flex-col md:flex-row h-[80vh] md:h-auto md:max-h-[80vh]">
              {/* Left Side: Image (Desktop) / Top Image (Mobile) */}
              <div className="relative w-full md:w-2/5 h-64 md:h-auto shrink-0 bg-surface-container">
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge className={`border-none backdrop-blur-md mb-2 ${getTypeColor(selectedItem.type)}`}>
                    <div className="flex items-center gap-1.5">
                      {getTypeIcon(selectedItem.type)}
                      <span className="capitalize">{selectedItem.type}</span>
                    </div>
                  </Badge>
                  <h2 className="text-white font-serif text-2xl font-bold leading-tight">{selectedItem.title}</h2>
                  <p className="text-white/80 text-sm flex items-center gap-1.5 mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(selectedItem.date, "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>

              {/* Right Side: Details */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6 relative">
                {/* Custom Close Button for better aesthetics */}
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 p-2 bg-surface-container hover:bg-surface-container-high rounded-full text-on-surface transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                <DialogHeader className="hidden">
                  <DialogTitle>{selectedItem.title}</DialogTitle>
                  <DialogDescription>Details for {selectedItem.title} on {format(selectedItem.date, "PPP")}</DialogDescription>
                </DialogHeader>

                {/* Primary Results */}
                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-on-surface border-b border-border pb-2">Analysis Results</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedItem.type === "skin" && (
                      <>
                        <div className="bg-surface-container-lowest p-4 rounded-xl border border-border">
                          <span className="text-xs text-muted-foreground uppercase font-semibold block mb-1">Skin Type</span>
                          <span className="font-medium text-lg text-on-surface">{selectedItem.result.skinType}</span>
                        </div>
                        <div className="bg-surface-container-lowest p-4 rounded-xl border border-border">
                          <span className="text-xs text-muted-foreground uppercase font-semibold block mb-1">Match Score</span>
                          <span className="font-medium text-lg text-tertiary">{selectedItem.result.score}%</span>
                        </div>
                        <div className="col-span-2 bg-surface-container-lowest p-4 rounded-xl border border-border">
                          <span className="text-xs text-muted-foreground uppercase font-semibold block mb-2">Identified Issues</span>
                          <div className="flex flex-wrap gap-2">
                            {selectedItem.result.issues?.map((issue, i) => (
                              <Badge key={i} variant="secondary" className="bg-surface-container text-on-surface">{issue}</Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    
                    {selectedItem.type === "color" && (
                      <>
                        <div className="bg-surface-container-lowest p-4 rounded-xl border border-border">
                          <span className="text-xs text-muted-foreground uppercase font-semibold block mb-1">Season</span>
                          <span className="font-medium text-lg text-on-surface">{selectedItem.result.season}</span>
                        </div>
                        <div className="bg-surface-container-lowest p-4 rounded-xl border border-border">
                          <span className="text-xs text-muted-foreground uppercase font-semibold block mb-1">Undertone</span>
                          <span className="font-medium text-lg text-on-surface">{selectedItem.result.undertone}</span>
                        </div>
                      </>
                    )}

                    {selectedItem.type === "style" && (
                      <>
                        <div className="bg-surface-container-lowest p-4 rounded-xl border border-border">
                          <span className="text-xs text-muted-foreground uppercase font-semibold block mb-1">Style</span>
                          <span className="font-medium text-lg text-on-surface">{selectedItem.result.style}</span>
                        </div>
                        <div className="bg-surface-container-lowest p-4 rounded-xl border border-border">
                          <span className="text-xs text-muted-foreground uppercase font-semibold block mb-1">Vibe</span>
                          <span className="font-medium text-lg text-on-surface">{selectedItem.result.vibe}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Detailed Recommendations */}
                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-on-surface border-b border-border pb-2 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    Recommendations
                  </h3>
                  
                  {selectedItem.type === "skin" && (
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-semibold text-on-surface block mb-2">Suggested Routine</span>
                        <ul className="space-y-2">
                          {selectedItem.details?.routine?.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-secondary bg-surface-container-low p-2.5 rounded-lg border border-border">
                              <span className="text-primary font-bold mt-0.5">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-destructive block mb-2">Ingredients to Avoid</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedItem.details?.avoid?.map((item, i) => (
                            <Badge key={i} variant="outline" className="border-destructive/30 text-destructive bg-destructive/5">{item}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedItem.type === "color" && (
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-semibold text-tertiary block mb-2">Recommended Colors</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedItem.details?.recommended?.map((item, i) => (
                            <Badge key={i} className="bg-tertiary/10 text-tertiary hover:bg-tertiary/20 border-none">{item}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-destructive block mb-2">Colors to Avoid</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedItem.details?.avoid?.map((item, i) => (
                            <Badge key={i} variant="outline" className="border-border text-muted-foreground">{item}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedItem.type === "style" && (
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-semibold text-on-surface block mb-2">Key Pieces</span>
                        <ul className="space-y-2">
                          {selectedItem.details?.keyPieces?.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-secondary bg-surface-container-low p-2.5 rounded-lg border border-border">
                              <Shirt className="w-4 h-4 text-secondary mt-0.5" /> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-on-surface block mb-2">Color Palette</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedItem.details?.colors?.map((item, i) => (
                            <Badge key={i} variant="secondary" className="bg-surface-container text-on-surface">{item}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-border flex justify-end">
                  <Button onClick={() => setSelectedItem(null)} className="bg-on-surface hover:bg-on-surface/90 text-surface rounded-xl">
                    Close Details
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
