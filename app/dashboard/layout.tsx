import type { Metadata } from "next";
import { DashboardNav } from "./nav";

export const metadata: Metadata = {
  title: "Dashboard — Lumina",
  description: "Your Baccalaureate study dashboard.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background md:flex-row">
      <DashboardNav />
      <div className="flex min-w-0 flex-1 flex-col md:pl-64">
        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 md:py-8 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
