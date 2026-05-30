import { AppSidebar } from "@/components/app-sidebar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AppSidebar>
      {children}
    </AppSidebar>
  );
}
