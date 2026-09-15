import Link from "next/link";
import { redirect } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { allChaptersPassed, studentProgress } from "@/lib/chapter-progress";
import { getCurrentUser } from "@/lib/current-user";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { PrintButton } from "./print-button";

export default async function CertificatePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/activate");
  const { completed } = await studentProgress();
  if (!allChaptersPassed(completed)) {
    redirect("/dashboard");
  }
  const locale = await getLocale();
  const today = new Date().toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB");

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link href="/dashboard" className="text-sm font-medium text-primary print:hidden">
        {t(locale, "back")}
      </Link>
      <article className="mt-6 rounded-[2rem] border-4 border-accent bg-white p-8 text-center shadow-sm print:border-accent">
        <p className="text-xs font-semibold tracking-[0.3em] text-primary/60">
          {locale === "ar" ? BRAND.nameAr : BRAND.nameEn}
        </p>
        <h1 className="mt-4 font-serif text-4xl">{t(locale, "certificate")}</h1>
        <p className="mt-2 text-sm text-foreground/60">{t(locale, "certificateLead")}</p>
        <p className="mt-8 font-serif text-3xl">{user.name}</p>
        <p className="mt-3 text-sm text-foreground/65">
          {locale === "ar" ? BRAND.subjectAr : BRAND.subjectEn}
        </p>
        <p className="mt-1 text-sm text-foreground/55">
          {locale === "ar" ? BRAND.gradeAr : BRAND.gradeEn} · {BRAND.year}
        </p>
        <p className="mt-8 text-sm">
          {locale === "ar" ? BRAND.teacherAr : BRAND.teacherEn}
        </p>
        <p className="mt-1 text-xs text-foreground/45">{today}</p>
      </article>
      <PrintButton label={t(locale, "printCertificate")} />
    </div>
  );
}
