import Link from "next/link";
import { Award } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { siteUrl } from "@/lib/class-roster";
import type { CourseCertificate } from "@/lib/certificates";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

export function CertificateCard({
  locale,
  certificate,
  preview = false,
}: {
  locale: Locale;
  certificate: CourseCertificate;
  preview?: boolean;
}) {
  const issued = new Date(certificate.issuedAt).toLocaleDateString(
    locale === "ar" ? "ar-EG" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" },
  );
  const verifyUrl = `${siteUrl()}/verify/${certificate.serial}`;

  return (
    <article className="relative overflow-hidden rounded-[2rem] border-4 border-accent bg-white px-6 py-10 text-center shadow-sm print:border-accent sm:px-12">
      {preview ? (
        <p className="absolute start-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary-dark print:hidden">
          {t(locale, "certificatePreviewBadge")}
        </p>
      ) : null}
      <p className="text-xs font-semibold tracking-[0.35em] text-primary/60">
        {locale === "ar" ? BRAND.nameAr : BRAND.nameEn}
      </p>
      <Award className="mx-auto mt-4 size-10 text-accent" aria-hidden="true" />
      <h1 className="mt-3 font-serif text-4xl">{t(locale, "certificateHonor")}</h1>
      <p className="mt-2 text-sm text-foreground/60">{t(locale, "certificateLead")}</p>
      <p className="mt-8 font-serif text-3xl">{certificate.name}</p>
      <p className="mt-3 text-sm text-foreground/65">
        {locale === "ar" ? BRAND.subjectAr : BRAND.subjectEn}
      </p>
      <p className="mt-1 text-sm text-foreground/55">
        {locale === "ar" ? BRAND.gradeAr : BRAND.gradeEn} · {BRAND.year}
      </p>
      <p className="mt-4 text-sm font-semibold text-primary">
        {t(locale, "certificateAverage")}{" "}
        <span dir="ltr">{certificate.average}%</span>
      </p>
      <dl className="mx-auto mt-8 max-w-md space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-primary/5 px-4 py-2">
          <dt className="text-foreground/55">{t(locale, "certificateSerial")}</dt>
          <dd className="font-mono font-semibold" dir="ltr">
            {certificate.serial}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-primary/5 px-4 py-2">
          <dt className="text-foreground/55">{t(locale, "certificateStamp")}</dt>
          <dd className="font-mono font-semibold" dir="ltr">
            {certificate.verifyCode}
          </dd>
        </div>
      </dl>
      {preview ? (
        <p className="mt-6 text-xs text-foreground/50" dir="ltr">
          {verifyUrl.replace(certificate.serial, "MSA-YEAR-0001")}
        </p>
      ) : (
        <Link href={`/verify/${certificate.serial}`} className="mt-6 inline-block text-xs text-foreground/50" dir="ltr">
          {verifyUrl}
        </Link>
      )}
      <p className="mt-8 text-sm">{locale === "ar" ? BRAND.teacherAr : BRAND.teacherEn}</p>
      <p className="mt-1 text-xs text-foreground/45">{issued}</p>
    </article>
  );
}
