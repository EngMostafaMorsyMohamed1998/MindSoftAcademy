import { BRAND } from "@/lib/brand";
import { siteUrl } from "@/lib/class-roster";
import type { CourseCertificate } from "@/lib/certificates";
import type { Locale } from "@/lib/locale";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sheetHtml(locale: Locale, certificate: CourseCertificate, preview: boolean): string {
  const ar = locale === "ar";
  const issued = new Date(certificate.issuedAt).toLocaleDateString(ar ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const honor = ar ? "شهادة تقدير وإتمام" : "Certificate of merit and completion";
  const lead = ar
    ? "أنهيت منهج البرمجة والذكاء الاصطناعي بعد اجتياز امتحانات الفصول والاختبار النهائي."
    : "You finished Programming and AI after passing the chapter exams and the final exam.";
  const average = ar ? "متوسط الدرجات" : "Average score";
  const serial = ar ? "الرقم المسلسل" : "Serial number";
  const stamp = ar ? "ختم التوثيق" : "Verification stamp";
  const verify = preview
    ? `${siteUrl()}/verify/MSA-YEAR-0001`
    : `${siteUrl()}/verify/${certificate.serial}`;
  const badge = preview ? `<p class="badge">${ar ? "نموذج" : "Sample"}</p>` : "";

  return `<section class="sheet">
    ${badge}
    <p class="brand">${escapeHtml(ar ? BRAND.nameAr : BRAND.nameEn)}</p>
    <h1>${escapeHtml(honor)}</h1>
    <p class="lead">${escapeHtml(lead)}</p>
    <p class="name">${escapeHtml(certificate.name)}</p>
    <p class="meta">${escapeHtml(ar ? BRAND.subjectAr : BRAND.subjectEn)}</p>
    <p class="meta">${escapeHtml(ar ? BRAND.gradeAr : BRAND.gradeEn)} · ${escapeHtml(BRAND.year)}</p>
    <p class="avg">${escapeHtml(average)} <b dir="ltr">${certificate.average}%</b></p>
    <div class="row"><span>${escapeHtml(serial)}</span><b dir="ltr">${escapeHtml(certificate.serial)}</b></div>
    <div class="row"><span>${escapeHtml(stamp)}</span><b dir="ltr">${escapeHtml(certificate.verifyCode)}</b></div>
    <p class="url" dir="ltr">${escapeHtml(verify)}</p>
    <p class="teacher">${escapeHtml(ar ? BRAND.teacherAr : BRAND.teacherEn)}</p>
    <p class="date">${escapeHtml(issued)}</p>
  </section>`;
}

export function printCertificates(locale: Locale, certificates: CourseCertificate[], preview = false) {
  const win = window.open("", "_blank", "noopener,noreferrer,width=1100,height=800");
  if (!win) return;
  const ar = locale === "ar";
  const pages = certificates.map((row) => sheetHtml(locale, row, preview)).join("");
  win.document.write(`<!doctype html>
<html lang="${ar ? "ar" : "en"}" dir="${ar ? "rtl" : "ltr"}">
<head>
  <meta charset="utf-8">
  <title>${ar ? "شهادة تقدير وإتمام" : "Certificate"}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    @page { size: A4 landscape; margin: 10mm; }
    * { box-sizing: border-box; letter-spacing: 0; }
    html, body { margin: 0; background: #fff; color: #071225; }
    body { font-family: "Cairo", "Noto Naskh Arabic", "Geeza Pro", Tahoma, sans-serif; }
    .sheet {
      page-break-after: always;
      position: relative;
      min-height: 180mm;
      border: 10px solid #d4a017;
      padding: 28px 40px;
      text-align: center;
      background: #fff;
    }
    .sheet:last-child { page-break-after: auto; }
    .badge {
      position: absolute; top: 16px; inset-inline-start: 16px;
      margin: 0; padding: 4px 12px; border-radius: 999px;
      background: #d4a017; color: #071c45; font-size: 12px; font-weight: 800;
    }
    .brand { margin: 8px 0 0; font-size: 13px; font-weight: 800; color: #0c2d6b; }
    h1 { margin: 18px 0 8px; font-size: 40px; line-height: 1.35; color: #0c2d6b; }
    .lead { margin: 0 auto; max-width: 720px; font-size: 16px; line-height: 1.8; color: #334; }
    .name { margin: 28px 0 8px; font-size: 36px; font-weight: 800; line-height: 1.5; }
    .meta { margin: 4px 0; font-size: 16px; color: #445; }
    .avg { margin: 16px 0 20px; font-size: 18px; color: #0c2d6b; font-weight: 700; }
    .row {
      display: flex; justify-content: space-between; align-items: center;
      max-width: 520px; margin: 8px auto; padding: 10px 16px;
      background: #f4f7fb; border-radius: 14px; font-size: 16px;
    }
    .url { margin-top: 18px; font-size: 12px; color: #667; }
    .teacher { margin-top: 22px; font-size: 18px; font-weight: 700; }
    .date { margin: 4px 0 0; font-size: 13px; color: #667; }
  </style>
</head>
<body>${pages}</body>
</html>`);
  win.document.close();
  const printWhenReady = () => {
    win.focus();
    win.print();
  };
  if (win.document.fonts?.ready) {
    void win.document.fonts.ready.then(printWhenReady).catch(printWhenReady);
  } else {
    win.onload = printWhenReady;
    setTimeout(printWhenReady, 600);
  }
}
