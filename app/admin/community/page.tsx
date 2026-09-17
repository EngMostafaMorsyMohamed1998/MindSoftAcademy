import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { HeaderTools } from "@/components/header-tools";
import { CommunityFeed } from "@/components/community-feed";
import { LogoutButton } from "@/app/dashboard/logout-button";
import { listCommunityFeed } from "@/lib/access-store";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { getTheme } from "@/lib/theme";
import { isTeacher } from "@/lib/teacher-session";

export const dynamic = "force-dynamic";

export default async function TeacherCommunityPage() {
  if (!(await isTeacher())) redirect("/admin/login");
  const locale = await getLocale();
  const theme = await getTheme();
  const posts = await listCommunityFeed({ viewerId: "teacher", groupIds: [], seeAll: true });

  return (
    <div className="min-h-full bg-background text-foreground">
      <header className="border-b-2 border-accent bg-nav text-nav-fg shadow-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <BrandMark locale={locale} href="/admin" />
          <div className="flex items-center gap-2">
            <HeaderTools locale={locale} theme={theme} />
            <Link href="/admin" className="text-xs font-semibold text-primary">
              {t(locale, "back")}
            </Link>
            <LogoutButton
              label={t(locale, "logout")}
              className="inline-flex items-center gap-1 rounded-full border-2 border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary"
            />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="font-serif text-3xl">{t(locale, "communityTitle")}</h1>
        <p className="mt-2 text-sm text-foreground/65">{t(locale, "communityLead")}</p>
        <div className="mt-5">
          <CommunityFeed
            locale={locale}
            viewerId="teacher"
            teacher
            posts={posts}
            empty={t(locale, "communityEmpty")}
          />
        </div>
      </main>
    </div>
  );
}
