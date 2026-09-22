import { BookletSheet } from "./booklet-sheet";
import { getLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function BookletPage() {
  const locale = await getLocale();
  return <BookletSheet locale={locale} />;
}
