import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAnnouncement, getCodeById } from "@/lib/access-store";
import { ensureBoundDevice } from "@/lib/student-session";
import { BRAND } from "@/lib/brand";
import { getCurrentUser } from "@/lib/current-user";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { getTheme } from "@/lib/theme";
import { ChatToTeacherButton } from "@/components/chat-to-teacher-button";
import { PresenceBeacon } from "@/components/presence-beacon";
import { SurpriseCatcher } from "@/components/surprise-catcher";
import { LogoutButton } from "./logout-button";
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
  const [announcement, record] = await Promise.all([
    getAnnouncement(),
    user.via === "code" ? getCodeById(user.id) : Promise.resolve(null),
  ]);

  if (record?.suspendedAt) {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-background px-6 text-center">
        <h1 className="font-serif text-3xl">{t(locale, "suspendedTitle")}</h1>
        <p className="mt-3 max-w-md text-sm text-foreground/65">{t(locale, "suspendedLead")}</p>
        <LogoutButton
          label={t(locale, "logout")}
          className="mt-6 inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
        />
      </div>
    );
  }

  if (user.via === "code") {
    try {
      await ensureBoundDevice(user.id);
    } catch (error) {
      if (error instanceof Error && error.message === "DEVICE_LIMIT") {
        return (
          <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-background px-6 text-center">
            <h1 className="font-serif text-3xl">{t(locale, "deviceBlockedTitle")}</h1>
            <p className="mt-3 max-w-md text-sm text-foreground/65">{t(locale, "deviceBlockedLead")}</p>
            <LogoutButton
              label={t(locale, "logout")}
              className="mt-6 inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
            />
          </div>
        );
      }
      throw error;
    }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background md:flex-row">
      <DashboardNav initialUser={user} locale={locale} theme={theme} />
      <div className="flex min-w-0 flex-1 flex-col md:ps-64">
        {announcement?.active ? (
          <p className="bg-accent px-4 py-2 text-center text-sm font-semibold text-primary-dark">
            {announcement.body}
          </p>
        ) : null}
        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 md:py-8 md:pb-8">
          {children}
        </main>
        <PresenceBeacon />
        <SurpriseCatcher locale={locale} />
        <ChatToTeacherButton locale={locale} />
      </div>
    </div>
  );
}
