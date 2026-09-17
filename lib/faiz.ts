export { FAIZ_BOOK } from "@/lib/library";

export const FAIZ_PAPER_ID = "faiz";

export const FAIZ_UNITS = [
  {
    id: "f1",
    titleAr: "تكنولوجيا المعلومات والمجتمع",
    titleEn: "IT and Society",
  },
  {
    id: "f2",
    titleAr: "الأمن السيبراني",
    titleEn: "Cybersecurity",
  },
  {
    id: "f3",
    titleAr: "تطبيقات الويب",
    titleEn: "Web Applications",
  },
  {
    id: "f4",
    titleAr: "تصميم الويب والوسائط",
    titleEn: "Web and Media Design",
  },
] as const;

export function isFaizPaper(id: string): boolean {
  return id === FAIZ_PAPER_ID;
}

export function examPaperTitle(id: string, locale: "ar" | "en"): string {
  if (id === "mix") return locale === "ar" ? "امتحان تجريبي مخلوط" : "Mixed mock exam";
  if (isFaizPaper(id)) return locale === "ar" ? "امتحان الفائز — الجزء الأول" : "Al-Faiz exam — part 1";
  return "";
}
