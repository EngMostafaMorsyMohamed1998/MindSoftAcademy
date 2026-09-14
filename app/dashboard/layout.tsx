import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { getCurrentUser } from "@/lib/current-user";
import { getLocale } from "@/lib/locale";
import { getTheme } from "@/lib/theme";
import { ChatToTeacherButton } from "@/components/chat-to-teacher-button";
import { DashboardNav } from "./nav";

export const metadata: Metadata = {
  title: `${BRAND.nameEn} — المنصة`,
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/activate");
  const locale = await getLocale();
  const theme = await getTheme();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background md:flex-row">
      <DashboardNav initialUser={user} locale={locale} theme={theme} />
      <div className="flex min-w-0 flex-1 flex-col md:ps-64">
        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 md:py-8 md:pb-8">
          {children}
        </main>
        <ChatToTeacherButton locale={locale} />
      </div>
    </div>
  );
}
