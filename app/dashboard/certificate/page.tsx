import Link from "next/link";
import { redirect } from "next/navigation";
import { issueCourseCertificate } from "@/lib/access-store";
import { allChaptersPassed } from "@/lib/chapter-progress";
import { studentProgress } from "@/lib/student-progress";
import { getCurrentUser } from "@/lib/current-user";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { CertificateCard } from "@/components/certificate-card";
import { PrintButton } from "./print-button";

export default async function CertificatePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/activate");
  const { completed } = await studentProgress();
  const locale = await getLocale();
  const ready = allChaptersPassed(completed);
  const certificate = ready
    ? await issueCourseCertificate({
        studentId: user.id,
        name: user.name,
        completed,
      })
    : null;

  if (!certificate) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <Link href="/dashboard" className="text-sm font-medium text-primary">
          {t(locale, "back")}
        </Link>
        <div className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-primary/10">
          <h1 className="font-serif text-3xl">{t(locale, "certificate")}</h1>
          <p className="mt-3 text-sm text-foreground/65">{t(locale, "certificateLocked")}</p>
          <Link
            href="/dashboard/exams"
            className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white"
          >
            {t(locale, "navExams")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link href="/dashboard" className="text-sm font-medium text-primary print:hidden">
        {t(locale, "back")}
      </Link>
      <div className="mt-6">
        <CertificateCard locale={locale} certificate={certificate} />
      </div>
      <PrintButton label={t(locale, "printCertificate")} />
    </div>
  );
}
