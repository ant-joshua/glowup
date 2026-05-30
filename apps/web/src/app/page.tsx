import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
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
  Target
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-6xl px-4 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">GlowUp</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#creators" className="hover:text-foreground transition-colors">Creators</Link>
            <Link href="#clinics" className="hover:text-foreground transition-colors">Clinics</Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:inline-flex">Log In</Button>
            <Button>Start Your Journey</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 2. Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32">
          {/* Subtle glowing background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto max-w-6xl px-4 relative z-10">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-6">
              <Badge variant="secondary" className="px-4 py-1.5 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                <Sparkles className="w-4 h-4 mr-2" />
                Welcome to the future of personal transformation
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
                Who do I want to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">become?</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                The first AI-powered operating system for your appearance, style, and personal brand. Stop fragmenting your glow-up across ten different apps.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
                <Button size="lg" className="h-12 px-8 text-base">
                  Upload Your Selfie (Free AI Analysis)
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                  See How It Works
                </Button>
              </div>
            </div>

            {/* Mockup visual */}
            <div className="mt-20 relative mx-auto max-w-5xl">
              <div className="rounded-xl border border-border/50 bg-background/50 backdrop-blur shadow-2xl overflow-hidden aspect-video flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
                <div className="relative z-10 flex flex-col items-center gap-4 text-muted-foreground">
                  <ScanFace className="w-16 h-16 opacity-50" />
                  <p className="text-sm font-medium">[ AI Face Scan & Roadmap Dashboard Mockup ]</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Problem vs. Solution */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why GlowUp?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The old way of self-improvement is broken and scattered. We built a unified ecosystem.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <XCircle className="w-5 h-5" />
                    The Old Way
                  </CardTitle>
                  <CardDescription>Fragmented and overwhelming</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-destructive/50" /> Pinterest for inspiration</div>
                  <div className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-destructive/50" /> TikTok for beauty tutorials</div>
                  <div className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-destructive/50" /> Shopee for product recommendations</div>
                  <div className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-destructive/50" /> LinkedIn for personal branding</div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-primary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles className="w-24 h-24 text-primary" /></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <CheckCircle2 className="w-5 h-5" />
                    The GlowUp Way
                  </CardTitle>
                  <CardDescription>Unified and intelligent</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <div className="flex items-center gap-3 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> AI analyzes you instantly</div>
                  <div className="flex items-center gap-3 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Personalized roadmap generation</div>
                  <div className="flex items-center gap-3 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Connect with top creators</div>
                  <div className="flex items-center gap-3 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Buy products in one click</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 4. Core Product Pillars */}
        <section className="py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">6 Pillars of Transformation</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to become the best version of yourself, powered by AI.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="group hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <ScanFace className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>AI Personal Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Deep breakdowns of your face, skin, style, and grooming to establish your baseline.</p>
                </CardContent>
              </Card>

              <Card className="group hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Shirt className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Outfit & Beauty Intelligence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Smart wardrobe planners, outfit generators, and custom skincare routines tailored to you.</p>
                </CardContent>
              </Card>

              <Card className="group hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Personal Branding OS</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">LinkedIn optimization, Instagram audits, and professional persona development.</p>
                </CardContent>
              </Card>

              <Card className="group hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Creator Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Follow and adopt real routines from top influencers and beauty experts.</p>
                </CardContent>
              </Card>

              <Card className="group hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Video className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>AI Video Studio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Auto-generated tutorials and UGC creation tools to help you build your audience.</p>
                </CardContent>
              </Card>

              <Card className="group hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <ShoppingBag className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Affiliate Commerce</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Shop directly via Shopee, TikTok Shop, and Amazon right from your personalized roadmap.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 5. User Journey */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Your journey to the best version of yourself is just four steps away.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative border-l-2 border-primary/20 ml-6 md:ml-0 md:pl-0 md:border-none space-y-12">
                {/* Step 1 */}
                <div className="relative pl-8 md:pl-0 md:flex md:items-center md:justify-between md:gap-8">
                  <div className="absolute left-[-9px] md:static md:w-1/2 md:flex md:justify-end">
                    <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-background md:hidden" />
                    <div className="hidden md:flex w-16 h-16 rounded-full bg-primary/10 items-center justify-center text-primary text-xl font-bold">1</div>
                  </div>
                  <div className="md:w-1/2">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Camera className="w-5 h-5 text-primary md:hidden" />
                          <CardTitle>Upload a Selfie</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">Snap a quick photo. Our AI immediately goes to work analyzing your facial structure, skin condition, and current style baseline.</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative pl-8 md:pl-0 md:flex md:items-center md:justify-between md:gap-8 md:flex-row-reverse">
                  <div className="absolute left-[-9px] md:static md:w-1/2 md:flex md:justify-start">
                    <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-background md:hidden" />
                    <div className="hidden md:flex w-16 h-16 rounded-full bg-primary/10 items-center justify-center text-primary text-xl font-bold">2</div>
                  </div>
                  <div className="md:w-1/2 text-left md:text-right">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-3 md:justify-end">
                          <LineChart className="w-5 h-5 text-primary md:hidden" />
                          <CardTitle>Receive Transformation Score</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">Get an objective, data-driven score on your current appearance and discover your maximum potential.</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative pl-8 md:pl-0 md:flex md:items-center md:justify-between md:gap-8">
                  <div className="absolute left-[-9px] md:static md:w-1/2 md:flex md:justify-end">
                    <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-background md:hidden" />
                    <div className="hidden md:flex w-16 h-16 rounded-full bg-primary/10 items-center justify-center text-primary text-xl font-bold">3</div>
                  </div>
                  <div className="md:w-1/2">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <CalendarDays className="w-5 h-5 text-primary md:hidden" />
                          <CardTitle>Get Your Roadmap</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">Receive a highly actionable 30, 60, and 90-day plan covering skincare, fitness, grooming, and wardrobe upgrades.</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative pl-8 md:pl-0 md:flex md:items-center md:justify-between md:gap-8 md:flex-row-reverse">
                  <div className="absolute left-[-9px] md:static md:w-1/2 md:flex md:justify-start">
                    <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-background md:hidden" />
                    <div className="hidden md:flex w-16 h-16 rounded-full bg-primary/10 items-center justify-center text-primary text-xl font-bold">4</div>
                  </div>
                  <div className="md:w-1/2 text-left md:text-right">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-3 md:justify-end">
                          <Target className="w-5 h-5 text-primary md:hidden" />
                          <CardTitle>Purchase & Track</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">Buy recommended products directly and track your daily progress towards your ultimate glow-up.</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* 6. Target Audience */}
        <section className="py-24">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Who is GlowUp for?</h2>
            </div>

            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="users">Young Professionals</TabsTrigger>
                <TabsTrigger value="creators">Content Creators</TabsTrigger>
                <TabsTrigger value="brands">Brands & Clinics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="users" className="focus-visible:outline-none focus-visible:ring-0">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle>Level Up Your Life</CardTitle>
                    <CardDescription>For ambitious individuals who want to maximize their potential.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="grid gap-3">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Look better and feel incredible</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Build unshakable confidence</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Improve your social presence</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Unlock better career opportunities</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="creators" className="focus-visible:outline-none focus-visible:ring-0">
                <Card className="border-accent/20">
                  <CardHeader>
                    <CardTitle>Monetize Your Influence</CardTitle>
                    <CardDescription>For creators looking to scale their audience and income.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="grid gap-3">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Create content faster with AI tools</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Earn passive affiliate income</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Publish and sell your own routines</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Build a highly engaged audience</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="brands" className="focus-visible:outline-none focus-visible:ring-0">
                <Card className="border-secondary/50">
                  <CardHeader>
                    <CardTitle>Reach Your Ideal Customers</CardTitle>
                    <CardDescription>For businesses and clinics wanting high-intent leads.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="grid gap-3">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-secondary-foreground" /> Reach highly targeted customers</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-secondary-foreground" /> Collaborate with top creators</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-secondary-foreground" /> Generate high-quality clinic leads</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-secondary-foreground" /> Increase product conversions</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto max-w-3xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How accurate is the AI analysis?</AccordionTrigger>
                <AccordionContent>
                  Our AI is trained on millions of data points across dermatology, fashion theory, and facial aesthetics to provide highly accurate and objective baseline assessments.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is the platform free to use?</AccordionTrigger>
                <AccordionContent>
                  The core AI analysis and basic roadmap are free. We offer premium subscriptions for advanced video generation tools and exclusive creator content.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>When will GlowUp be available?</AccordionTrigger>
                <AccordionContent>
                  We are currently rolling out Phase 1 (AI Analysis & Outfit Generation) to our waitlist. Sign up below to get early access.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* 7. Call to Action */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[300px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto max-w-3xl px-4 relative z-10 text-center">
            <Badge variant="outline" className="mb-6 border-primary/30 text-primary">
              Limited Early Access
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Ready to become the best version of yourself?
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Join the waitlist for Phase 1: AI Analysis & Outfit Generation.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                className="h-12 bg-background/50 backdrop-blur"
                required
              />
              <Button type="button" size="lg" className="h-12 w-full sm:w-auto shrink-0">
                Join Waitlist
              </Button>
            </form>
          </div>
        </section>
      </main>

      {/* 8. Footer */}
      <footer className="border-t border-border/40 py-12 bg-background">
        <div className="container mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold tracking-tight">GlowUp</span>
          </div>
          
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; 2026 GlowUp. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}