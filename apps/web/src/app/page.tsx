import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { landingMarketingAssets } from "@/features/marketing-assets/landingAssets";
import {
  Sparkles,
  ScanFace,
  Shirt,
  Briefcase,
  Users,
  Video,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Camera,
  LineChart,
  CalendarDays,
  Target,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-surface/80 backdrop-blur-xl supports-backdrop-filter:bg-surface/60">
        <div className="container mx-auto max-w-6xl px-4 flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-serif font-bold text-2xl tracking-tight text-on-surface">
              GlowUp
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-secondary">
            <Link
              href="#features"
              className="hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#creators"
              className="hover:text-primary transition-colors"
            >
              Creators
            </Link>
            <Link
              href="#clinics"
              className="hover:text-primary transition-colors"
            >
              Clinics
            </Link>
            <Link
              href="#pricing"
              className="hover:text-primary transition-colors"
            >
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:inline-flex">
              Log In
            </Button>
            <Button>Start Your Journey</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 2. Hero Section */}
        <section className="relative overflow-hidden bg-surface pb-32 pt-12 md:pt-16">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b from-primary/8 to-transparent" />
          <div className="pointer-events-none absolute left-[8%] top-24 h-56 w-56 rounded-full bg-primary/12 blur-3xl" />
          <div className="pointer-events-none absolute right-[4%] top-28 h-72 w-72 rounded-full bg-tertiary/10 blur-3xl" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[1080px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-br from-primary/14 via-primary-container/10 to-transparent blur-[150px]" />

          <div className="relative z-10 px-4 md:px-6">
            <div className="relative overflow-hidden rounded-[2.8rem] bg-surface-container-lowest/80 p-2 shadow-ambient md:p-3">
              <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-tertiary/10" />
              <div className="relative h-[72svh] min-h-[520px] max-h-[820px] overflow-hidden rounded-[2.2rem]">
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src={landingMarketingAssets.montageVideoUrl}
                  poster={landingMarketingAssets.montageVideoPoster}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 bg-linear-to-r from-on-surface/78 via-on-surface/32 to-on-surface/10" />
                <div className="absolute inset-0 bg-linear-to-t from-on-surface/74 via-on-surface/16 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-12 xl:p-16">
                  <div className="max-w-3xl">
                    <Badge
                      variant="secondary"
                      className="rounded-full border-0 bg-surface/14 px-4 py-2 text-sm text-surface shadow-none backdrop-blur hover:bg-surface/14"
                    >
                      <Sparkles className="mr-2 h-4 w-4 text-primary" />
                      GlowUp editorial launch
                    </Badge>
                    <h1 className="max-w-[8ch] font-serif text-5xl font-normal leading-[0.9] tracking-tight text-surface sm:text-6xl lg:text-[5.75rem]">
                      Become visually unforgettable.
                    </h1>
                    <p className="mt-5 max-w-[34rem] text-base leading-7 text-surface/82 sm:text-lg sm:leading-8 lg:text-xl">
                      GlowUp brings face analysis, outfit intelligence, skincare
                      ritual design, and personal brand growth into one clean,
                      premium experience.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <Button
                        size="lg"
                        className="h-15 rounded-full px-8 text-base sm:h-16 sm:px-10 sm:text-lg"
                      >
                        Upload Your Selfie
                        <ArrowRight className="ml-3 h-5 w-5" />
                      </Button>
                      <Button
                        size="lg"
                        variant="secondary"
                        className="h-15 rounded-full border border-surface/18 bg-surface/10 px-8 text-base text-surface backdrop-blur hover:bg-surface/16 sm:h-16 sm:px-10 sm:text-lg"
                      >
                        Watch Demo Story
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-[0.82fr_0.82fr_1.36fr]">
              <div className="overflow-hidden rounded-[1.85rem] bg-surface-container-lowest p-4 shadow-ambient-sm">
                <div className="relative aspect-[16/11] overflow-hidden rounded-[1.45rem]">
                  <Image
                    src={landingMarketingAssets.heroImageUrl}
                    alt="GlowUp editorial campaign still"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 24vw, 100vw"
                  />
                </div>
                <div className="mt-4">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-secondary">
                    Campaign Still
                  </p>
                  <p className="mt-2 text-sm leading-6 text-on-surface/75">
                    Still frame for calmer sections after the hero motion.
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-[1.85rem] bg-surface-container-lowest p-4 shadow-ambient-sm">
                <div className="relative aspect-[16/11] overflow-hidden rounded-[1.45rem]">
                  <Image
                    src={landingMarketingAssets.supportImageUrl}
                    alt="GlowUp supporting campaign still"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 24vw, 100vw"
                  />
                </div>
                <div className="mt-4">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-secondary">
                    Support Frame
                  </p>
                  <p className="mt-2 text-sm leading-6 text-on-surface/75">
                    Secondary still reinforcing wardrobe, skincare, and coaching
                    as one connected system.
                  </p>
                </div>
              </div>

              <div className="rounded-[1.9rem] bg-surface-container-low p-5 shadow-ambient-sm">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-primary">
                  Next Marketing Demo
                </p>
                <p className="mt-3 max-w-[14ch] font-serif text-5xl leading-[0.96] text-on-surface">
                  {landingMarketingAssets.faceAnalysisDemoPlan.title}
                </p>
                <p className="mt-4 max-w-xl text-sm leading-7 text-on-surface/75">
                  The next campaign film focuses on selfie upload, elegant scan
                  overlays, insight reveal, and roadmap conversion storytelling.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    "Selfie upload enters frame",
                    "Elegant scan overlays explain the face",
                    "Roadmap reveal closes with CTA",
                  ].map((step) => (
                    <div
                      key={step}
                      className="rounded-[1rem] bg-surface-container-lowest px-3 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-secondary"
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Problem vs. Solution */}
        <section id="features" className="py-32 bg-surface-container-low">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-serif font-normal text-on-surface mb-6">
                Why GlowUp?
              </h2>
              <p className="text-xl text-secondary max-w-2xl mx-auto">
                The old way of self-improvement is broken and scattered. We
                built a unified ecosystem.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <Card className="bg-surface-container-highest shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-secondary">
                    <XCircle className="w-6 h-6" />
                    The Old Way
                  </CardTitle>
                  <CardDescription className="text-secondary/70 text-base">
                    Fragmented and overwhelming
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4 text-on-surface text-lg">
                    <span className="w-2 h-2 rounded-full bg-secondary/50" />{" "}
                    Pinterest for inspiration
                  </div>
                  <div className="flex items-center gap-4 text-on-surface text-lg">
                    <span className="w-2 h-2 rounded-full bg-secondary/50" />{" "}
                    TikTok for beauty tutorials
                  </div>
                  <div className="flex items-center gap-4 text-on-surface text-lg">
                    <span className="w-2 h-2 rounded-full bg-secondary/50" />{" "}
                    Shopee for product recommendations
                  </div>
                  <div className="flex items-center gap-4 text-on-surface text-lg">
                    <span className="w-2 h-2 rounded-full bg-secondary/50" />{" "}
                    LinkedIn for personal branding
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-surface-container-lowest relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Sparkles className="w-32 h-32 text-primary" />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-primary">
                    <CheckCircle2 className="w-6 h-6" />
                    The GlowUp Way
                  </CardTitle>
                  <CardDescription className="text-secondary text-base">
                    Unified and intelligent
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 relative z-10">
                  <div className="flex items-center gap-4 font-bold text-on-surface text-lg">
                    <span className="w-2 h-2 rounded-full bg-primary" /> AI
                    analyzes you instantly
                  </div>
                  <div className="flex items-center gap-4 font-bold text-on-surface text-lg">
                    <span className="w-2 h-2 rounded-full bg-primary" />{" "}
                    Personalized roadmap generation
                  </div>
                  <div className="flex items-center gap-4 font-bold text-on-surface text-lg">
                    <span className="w-2 h-2 rounded-full bg-primary" /> Connect
                    with top creators
                  </div>
                  <div className="flex items-center gap-4 font-bold text-on-surface text-lg">
                    <span className="w-2 h-2 rounded-full bg-primary" /> Buy
                    products in one click
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 4. Core Product Pillars */}
        <section className="py-32 bg-surface">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-serif font-normal text-on-surface mb-6">
                6 Pillars of Transformation
              </h2>
              <p className="text-xl text-secondary max-w-2xl mx-auto">
                Everything you need to become the best version of yourself,
                powered by AI.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="group hover:-translate-y-1 transition-transform duration-300">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                    <ScanFace className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle>AI Personal Analysis</CardTitle>
                    <Badge
                      variant="secondary"
                      className="border-0 bg-primary/10 text-primary"
                    >
                      Demo Next
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-secondary leading-relaxed">
                    Deep breakdowns of your face, skin, style, and grooming to
                    establish your baseline. Next marketing asset: a cinematic
                    demo of the face analysis flow.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:-translate-y-1 transition-transform duration-300">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                    <Shirt className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle>Outfit & Beauty Intelligence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-secondary leading-relaxed">
                    Smart wardrobe planners, outfit generators, and custom
                    skincare routines tailored to you.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:-translate-y-1 transition-transform duration-300">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                    <Briefcase className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle>Personal Branding OS</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-secondary leading-relaxed">
                    LinkedIn optimization, Instagram audits, and professional
                    persona development.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:-translate-y-1 transition-transform duration-300">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle>Creator Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-secondary leading-relaxed">
                    Follow and adopt real routines from top influencers and
                    beauty experts.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:-translate-y-1 transition-transform duration-300">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                    <Video className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle>AI Video Studio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-secondary leading-relaxed">
                    Auto-generated tutorials and UGC creation tools to help you
                    build your audience.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:-translate-y-1 transition-transform duration-300">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                    <ShoppingBag className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle>Affiliate Commerce</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-secondary leading-relaxed">
                    Shop directly via Shopee, TikTok Shop, and Amazon right from
                    your personalized roadmap.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 5. User Journey */}
        <section className="py-32 bg-surface-container-low">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-serif font-normal text-on-surface mb-6">
                How It Works
              </h2>
              <p className="text-xl text-secondary max-w-2xl mx-auto">
                Your journey to the best version of yourself is just four steps
                away.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="relative border-l-2 border-surface-container-highest ml-6 md:ml-0 md:pl-0 md:border-none space-y-16">
                {/* Step 1 */}
                <div className="relative pl-10 md:pl-0 md:flex md:items-center md:justify-between md:gap-12">
                  <div className="absolute left-[-11px] md:static md:w-1/2 md:flex md:justify-end">
                    <div className="w-5 h-5 rounded-full bg-primary ring-8 ring-surface-container-low md:hidden" />
                    <div className="hidden md:flex w-20 h-20 rounded-full bg-surface-container-highest items-center justify-center text-on-surface font-serif text-3xl font-normal shadow-ambient-sm">
                      1
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <Card className="shadow-none border-0 bg-surface-container-lowest">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <Camera className="w-6 h-6 text-primary md:hidden" />
                          <CardTitle>Upload a Selfie</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-secondary text-base leading-relaxed">
                          Snap a quick photo. Our AI immediately goes to work
                          analyzing your facial structure, skin condition, and
                          current style baseline.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative pl-10 md:pl-0 md:flex md:items-center md:justify-between md:gap-12 md:flex-row-reverse">
                  <div className="absolute left-[-11px] md:static md:w-1/2 md:flex md:justify-start">
                    <div className="w-5 h-5 rounded-full bg-primary ring-8 ring-surface-container-low md:hidden" />
                    <div className="hidden md:flex w-20 h-20 rounded-full bg-surface-container-highest items-center justify-center text-on-surface font-serif text-3xl font-normal shadow-ambient-sm">
                      2
                    </div>
                  </div>
                  <div className="md:w-1/2 text-left md:text-right">
                    <Card className="shadow-none border-0 bg-surface-container-lowest">
                      <CardHeader>
                        <div className="flex items-center gap-4 md:justify-end">
                          <LineChart className="w-6 h-6 text-primary md:hidden" />
                          <CardTitle>Receive Transformation Score</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-secondary text-base leading-relaxed">
                          Get an objective, data-driven score on your current
                          appearance and discover your maximum potential.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative pl-10 md:pl-0 md:flex md:items-center md:justify-between md:gap-12">
                  <div className="absolute left-[-11px] md:static md:w-1/2 md:flex md:justify-end">
                    <div className="w-5 h-5 rounded-full bg-primary ring-8 ring-surface-container-low md:hidden" />
                    <div className="hidden md:flex w-20 h-20 rounded-full bg-surface-container-highest items-center justify-center text-on-surface font-serif text-3xl font-normal shadow-ambient-sm">
                      3
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <Card className="shadow-none border-0 bg-surface-container-lowest">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <CalendarDays className="w-6 h-6 text-primary md:hidden" />
                          <CardTitle>Get Your Roadmap</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-secondary text-base leading-relaxed">
                          Receive a highly actionable 30, 60, and 90-day plan
                          covering skincare, fitness, grooming, and wardrobe
                          upgrades.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative pl-10 md:pl-0 md:flex md:items-center md:justify-between md:gap-12 md:flex-row-reverse">
                  <div className="absolute left-[-11px] md:static md:w-1/2 md:flex md:justify-start">
                    <div className="w-5 h-5 rounded-full bg-primary ring-8 ring-surface-container-low md:hidden" />
                    <div className="hidden md:flex w-20 h-20 rounded-full bg-surface-container-highest items-center justify-center text-on-surface font-serif text-3xl font-normal shadow-ambient-sm">
                      4
                    </div>
                  </div>
                  <div className="md:w-1/2 text-left md:text-right">
                    <Card className="shadow-none border-0 bg-surface-container-lowest">
                      <CardHeader>
                        <div className="flex items-center gap-4 md:justify-end">
                          <Target className="w-6 h-6 text-primary md:hidden" />
                          <CardTitle>Purchase & Track</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-secondary text-base leading-relaxed">
                          Buy recommended products directly and track your daily
                          progress towards your ultimate glow-up.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Target Audience */}
        <section className="py-32 bg-surface">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-normal text-on-surface mb-6">
                Who is GlowUp for?
              </h2>
            </div>

            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-12 bg-surface-container-high h-14 rounded-2xl p-1">
                <TabsTrigger
                  value="users"
                  className="rounded-xl font-bold text-sm data-[state=active]:bg-tertiary data-[state=active]:text-on-tertiary"
                >
                  Young Professionals
                </TabsTrigger>
                <TabsTrigger
                  value="creators"
                  className="rounded-xl font-bold text-sm data-[state=active]:bg-tertiary data-[state=active]:text-on-tertiary"
                >
                  Content Creators
                </TabsTrigger>
                <TabsTrigger
                  value="brands"
                  className="rounded-xl font-bold text-sm data-[state=active]:bg-tertiary data-[state=active]:text-on-tertiary"
                >
                  Brands & Clinics
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="users"
                className="focus-visible:outline-none focus-visible:ring-0"
              >
                <Card className="bg-surface-container-lowest border-0 shadow-ambient">
                  <CardHeader>
                    <CardTitle className="text-3xl">
                      Level Up Your Life
                    </CardTitle>
                    <CardDescription className="text-secondary text-lg mt-2">
                      For ambitious individuals who want to maximize their
                      potential.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="grid gap-4 mt-4">
                      <li className="flex items-center gap-3 text-lg text-on-surface">
                        <CheckCircle2 className="w-6 h-6 text-primary" /> Look
                        better and feel incredible
                      </li>
                      <li className="flex items-center gap-3 text-lg text-on-surface">
                        <CheckCircle2 className="w-6 h-6 text-primary" /> Build
                        unshakable confidence
                      </li>
                      <li className="flex items-center gap-3 text-lg text-on-surface">
                        <CheckCircle2 className="w-6 h-6 text-primary" />{" "}
                        Improve your social presence
                      </li>
                      <li className="flex items-center gap-3 text-lg text-on-surface">
                        <CheckCircle2 className="w-6 h-6 text-primary" /> Unlock
                        better career opportunities
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent
                value="creators"
                className="focus-visible:outline-none focus-visible:ring-0"
              >
                <Card className="bg-surface-container-lowest border-0 shadow-ambient">
                  <CardHeader>
                    <CardTitle className="text-3xl">
                      Monetize Your Influence
                    </CardTitle>
                    <CardDescription className="text-secondary text-lg mt-2">
                      For creators looking to scale their audience and income.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="grid gap-4 mt-4">
                      <li className="flex items-center gap-3 text-lg text-on-surface">
                        <CheckCircle2 className="w-6 h-6 text-tertiary" />{" "}
                        Create content faster with AI tools
                      </li>
                      <li className="flex items-center gap-3 text-lg text-on-surface">
                        <CheckCircle2 className="w-6 h-6 text-tertiary" /> Earn
                        passive affiliate income
                      </li>
                      <li className="flex items-center gap-3 text-lg text-on-surface">
                        <CheckCircle2 className="w-6 h-6 text-tertiary" />{" "}
                        Publish and sell your own routines
                      </li>
                      <li className="flex items-center gap-3 text-lg text-on-surface">
                        <CheckCircle2 className="w-6 h-6 text-tertiary" /> Build
                        a highly engaged audience
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent
                value="brands"
                className="focus-visible:outline-none focus-visible:ring-0"
              >
                <Card className="bg-surface-container-lowest border-0 shadow-ambient">
                  <CardHeader>
                    <CardTitle className="text-3xl">
                      Reach Your Ideal Customers
                    </CardTitle>
                    <CardDescription className="text-secondary text-lg mt-2">
                      For businesses and clinics wanting high-intent leads.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="grid gap-4 mt-4">
                      <li className="flex items-center gap-3 text-lg text-on-surface">
                        <CheckCircle2 className="w-6 h-6 text-secondary" />{" "}
                        Reach highly targeted customers
                      </li>
                      <li className="flex items-center gap-3 text-lg text-on-surface">
                        <CheckCircle2 className="w-6 h-6 text-secondary" />{" "}
                        Collaborate with top creators
                      </li>
                      <li className="flex items-center gap-3 text-lg text-on-surface">
                        <CheckCircle2 className="w-6 h-6 text-secondary" />{" "}
                        Generate high-quality clinic leads
                      </li>
                      <li className="flex items-center gap-3 text-lg text-on-surface">
                        <CheckCircle2 className="w-6 h-6 text-secondary" />{" "}
                        Increase product conversions
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-32 bg-surface-container-low">
          <div className="container mx-auto max-w-3xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-normal text-on-surface mb-6">
                Frequently Asked Questions
              </h2>
            </div>

            <Accordion
              type="single"
              collapsible
              className="w-full bg-surface-container-lowest rounded-3xl p-6 shadow-ambient-sm"
            >
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="text-lg font-bold hover:no-underline py-4 text-on-surface">
                  How accurate is the AI analysis?
                </AccordionTrigger>
                <AccordionContent className="text-secondary text-base leading-relaxed pb-6">
                  Our AI is trained on millions of data points across
                  dermatology, fashion theory, and facial aesthetics to provide
                  highly accurate and objective baseline assessments.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-b-0">
                <AccordionTrigger className="text-lg font-bold hover:no-underline py-4 text-on-surface">
                  Is the platform free to use?
                </AccordionTrigger>
                <AccordionContent className="text-secondary text-base leading-relaxed pb-6">
                  The core AI analysis and basic roadmap are free. We offer
                  premium subscriptions for advanced video generation tools and
                  exclusive creator content.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-b-0">
                <AccordionTrigger className="text-lg font-bold hover:no-underline py-4 text-on-surface">
                  When will GlowUp be available?
                </AccordionTrigger>
                <AccordionContent className="text-secondary text-base leading-relaxed pb-6">
                  We are currently rolling out Phase 1 (AI Analysis & Outfit
                  Generation) to our waitlist. Sign up below to get early
                  access.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* 7. Call to Action */}
        <section className="py-40 relative overflow-hidden bg-surface">
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-primary/5 pointer-events-none" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[400px] bg-linear-to-br from-primary to-primary-container opacity-20 blur-[120px] rounded-full pointer-events-none" />

          <div className="container mx-auto max-w-3xl px-4 relative z-10 text-center">
            <Badge
              variant="outline"
              className="mb-8 border-primary/30 text-primary px-4 py-1.5 text-sm bg-primary/5"
            >
              Limited Early Access
            </Badge>
            <h2 className="text-5xl md:text-6xl font-serif font-normal mb-8 tracking-tight text-on-surface">
              Ready to become the best version of yourself?
            </h2>
            <p className="text-xl text-secondary mb-12 font-sans">
              Join the waitlist for Phase 1: AI Analysis & Outfit Generation.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="h-16 text-lg"
                required
              />
              <Button
                type="button"
                size="lg"
                className="h-16 w-full sm:w-auto shrink-0 text-lg px-10"
              >
                Join Waitlist
              </Button>
            </form>
          </div>
        </section>
      </main>

      {/* 8. Footer */}
      <footer className="py-16 bg-surface-container-low">
        <div className="container mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-serif font-bold text-xl tracking-tight text-on-surface">
              GlowUp
            </span>
          </div>

          <p className="text-base text-secondary text-center md:text-left">
            &copy; 2026 GlowUp. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-base font-bold text-secondary">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
