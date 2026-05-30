import { AppSidebar } from "@/components/app-sidebar";
import { ReactNode } from "react";

export default function AnalysisHistoryLayout({ children }: { children: ReactNode }) {
  return (
    <AppSidebar>
      {children}
    </AppSidebar>
  );
}
