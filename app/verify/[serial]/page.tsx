import Link from "next/link";
import { getCertificateBySerial } from "@/lib/access-store";
import { BRAND } from "@/lib/brand";
import { stampCertificate } from "@/lib/certificates";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ serial: string }>;
}) {
  const { serial } = await params;
  const locale = await getLocale();
  const certificate = await getCertificateBySerial(decodeURIComponent(serial));
  const valid =
    Boolean(certificate) &&
    certificate !== null &&
    certificate.verifyCode === stampCertificate(certificate.serial, certificate.studentId);

  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col justify-center px-4 py-16">
      <p className="text-xs font-semibold tracking-[0.3em] text-primary/60">
        {locale === "ar" ? BRAND.nameAr : BRAND.nameEn}
      </p>
      <h1 className="mt-3 font-serif text-3xl">{t(locale, "certificateVerify")}</h1>
      {valid && certificate ? (
        <article className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-primary/10">
          <p className="text-sm font-semibold text-emerald-700">{t(locale, "certificateValid")}</p>
          <p className="mt-4 font-serif text-2xl">{certificate.name}</p>
          <p className="mt-2 font-mono text-sm" dir="ltr">
            {certificate.serial}
          </p>
          <p className="mt-3 text-sm text-foreground/65">
            {locale === "ar" ? BRAND.subjectAr : BRAND.subjectEn} · {certificate.average}%
          </p>
          <p className="mt-1 text-xs text-foreground/50">
            {new Date(certificate.issuedAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB")}
          </p>
        </article>
      ) : (
        <p className="mt-6 rounded-3xl bg-white p-6 text-sm text-red-700 ring-1 ring-red-200">
          {t(locale, "certificateInvalid")}
        </p>
      )}
      <Link href="/" className="mt-6 text-sm font-semibold text-primary">
        {t(locale, "back")}
      </Link>
    </div>
  );
}