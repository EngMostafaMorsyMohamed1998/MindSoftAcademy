import { BookletAnswersPane, BookletCover, BookletFaizPane, BookletPartPane } from "./booklet-doc";
import { BookletViewer } from "./booklet-viewer";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { BRAND } from "@/lib/brand";

export default async function BookletPage() {
  const locale = await getLocale();

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="no-print mb-5">
        <h1 className="font-serif text-3xl">{t(locale, "bookletTitle")}</h1>
        <p className="mt-2 text-sm text-foreground/65">{t(locale, "bookletLead")}</p>
      </div>
      <BookletCover
        locale={locale}
        teacher={locale === "ar" ? BRAND.teacherAr : BRAND.teacherEn}
        brand={locale === "ar" ? BRAND.nameAr : BRAND.nameEn}
      />
      <BookletViewer
        locale={locale}
        printLabel={t(locale, "printNow")}
        tabs={[
          {
            id: "p1",
            labelAr: "الجزء الأول",
            labelEn: "Part 1",
            body: <BookletPartPane locale={locale} part={1} />,
          },
          {
            id: "p2",
            labelAr: "الجزء الثاني",
            labelEn: "Part 2",
            body: <BookletPartPane locale={locale} part={2} />,
          },
          {
            id: "faiz",
            labelAr: "الفائز",
            labelEn: "Al-Faiz",
            body: <BookletFaizPane locale={locale} />,
          },
          {
            id: "key",
            labelAr: "الإجابات",
            labelEn: "Answers",
            body: <BookletAnswersPane locale={locale} />,
          },
        ]}
      />
    </div>
  );
}
