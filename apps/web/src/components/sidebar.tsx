import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScanFace, LayoutDashboard, SprayCan, Shirt, ShoppingBag, Users, Settings, LogOut, User } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-72 flex-col border-r border-border bg-surface-container-lowest h-screen sticky top-0">
      <div className="p-6 flex items-center gap-2">
        <span className="font-serif text-2xl italic font-bold text-primary">GlowUp</span>
      </div>
      
      <div className="px-4 pb-4">
        <Button className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-on-primary rounded-xl h-12">
          <ScanFace className="w-5 h-5" />
          <span className="font-semibold">Start Analysis</span>
        </Button>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        <Link href="/daily-dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container text-secondary hover:text-on-surface font-medium transition-colors">
          <LayoutDashboard className="w-5 h-5" />
          Daily Dashboard
        </Link>
        <Link href="/skincare-shelf" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container text-secondary hover:text-on-surface font-medium transition-colors">
          <SprayCan className="w-5 h-5" />
          Skincare & Bodycare Shelf
        </Link>
        <Link href="/outfit-calendar" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container text-secondary hover:text-on-surface font-medium transition-colors">
          <Shirt className="w-5 h-5" />
          Outfit Calendar
        </Link>
        <Link href="/live-shopping" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container text-secondary hover:text-on-surface font-medium transition-colors">
          <ShoppingBag className="w-5 h-5" />
          Live Shopping
        </Link>
        <Link href="/social-glow-hub" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container text-secondary hover:text-on-surface font-medium transition-colors">
          <Users className="w-5 h-5" />
          Social Glow Hub
        </Link>
      </nav>

      <div className="p-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 w-full p-4 rounded-sm hover:bg-surface-container transition-colors text-left outline-none">
            <Avatar className="w-10 h-10 border border-border">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-on-surface truncate">Alex Doe</p>
              <p className="text-xs text-secondary truncate">alex@example.com</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-3 rounded-sm bg-surface-container-lowest/80 backdrop-blur-xl border border-border shadow-ambient">
            <DropdownMenuLabel className="text-secondary font-medium">My Account</DropdownMenuLabel>
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
      </div>
    </aside>
  );
}
