import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LayoutDashboard, SprayCan, Shirt, Users, Settings, LogOut, User } from "lucide-react";
import { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";

export function AppSidebar({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-surface">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 w-full z-40 flex justify-between items-center px-6 py-4 bg-surface/80 backdrop-blur-2xl border-b border-border">
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <Avatar className="w-10 h-10 border border-border">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AL</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 rounded-xl bg-surface-container-lowest/80 backdrop-blur-xl border border-border shadow-ambient">
              <DropdownMenuLabel className="text-secondary font-medium">Alex Doe</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem className="gap-2 cursor-pointer rounded-lg text-on-surface focus:text-on-surface focus:bg-surface-container transition-colors group">
                <User className="w-4 h-4 text-secondary group-focus:text-secondary" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer rounded-lg text-on-surface focus:text-on-surface focus:bg-surface-container transition-colors group">
                <Settings className="w-4 h-4 text-secondary group-focus:text-secondary" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem className="gap-2 cursor-pointer rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10 transition-colors group">
                <LogOut className="w-4 h-4 text-destructive group-focus:text-destructive" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="font-serif text-2xl italic font-bold text-primary absolute left-1/2 transform -translate-x-1/2">
            GlowUp
          </span>

          <button className="p-2 rounded-full hover:bg-surface-container transition-colors text-primary">
            <Settings className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 relative pb-24 md:pb-0">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-surface/90 backdrop-blur-3xl shadow-[0_-8px_32px_rgba(28,28,25,0.06)] rounded-t-[1.5rem] border-t border-border">
          <Link href="/daily-dashboard" className="flex flex-col items-center justify-center text-secondary hover:text-primary px-5 py-2 transition-all">
            <LayoutDashboard className="w-6 h-6 mb-1" />
            <span className="font-sans text-[11px] font-semibold uppercase tracking-widest">Today</span>
          </Link>
          <Link href="/skincare-shelf" className="flex flex-col items-center justify-center text-secondary hover:text-primary px-5 py-2 transition-all">
            <SprayCan className="w-6 h-6 mb-1" />
            <span className="font-sans text-[11px] font-semibold uppercase tracking-widest">Shelf</span>
          </Link>
          <Link href="/outfit-calendar" className="flex flex-col items-center justify-center text-secondary hover:text-primary px-5 py-2 transition-all">
            <Shirt className="w-6 h-6 mb-1" />
            <span className="font-sans text-[11px] font-semibold uppercase tracking-widest">Outfit</span>
          </Link>
          <Link href="/social-glow-hub" className="flex flex-col items-center justify-center text-secondary hover:text-primary px-5 py-2 transition-all">
            <Users className="w-6 h-6 mb-1" />
            <span className="font-sans text-[11px] font-semibold uppercase tracking-widest">Social</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
