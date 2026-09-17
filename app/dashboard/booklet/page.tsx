import { PrintButton } from "@/components/print-button";
import { BookletDoc } from "./booklet-doc";
import { LESSON_NOTES } from "@/lib/lessons";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { BRAND } from "@/lib/brand";

export default async function BookletPage() {
  const locale = await getLocale();

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="no-print mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">{t(locale, "bookletTitle")}</h1>
          <p className="mt-2 text-sm text-foreground/65">{t(locale, "bookletLead")}</p>
        </div>
        <PrintButton label={t(locale, "printNow")} />
      </div>
      <BookletDoc
        locale={locale}
        notes={LESSON_NOTES}
        teacher={locale === "ar" ? BRAND.teacherAr : BRAND.teacherEn}
        brand={locale === "ar" ? BRAND.nameAr : BRAND.nameEn}
      />
    </div>
  );
}
