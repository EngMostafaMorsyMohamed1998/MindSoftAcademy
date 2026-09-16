"use client";

import { printCertificates } from "@/lib/certificate-print";
import type { CourseCertificate } from "@/lib/certificates";
import type { Locale } from "@/lib/locale";

export function CertificatePrintButton({
  locale,
  certificates,
  preview = false,
  label,
}: {
  locale: Locale;
  certificates: CourseCertificate[];
  preview?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => printCertificates(locale, certificates, preview)}
      className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white print:hidden"
    >
      {label}
    </button>
  );
}
