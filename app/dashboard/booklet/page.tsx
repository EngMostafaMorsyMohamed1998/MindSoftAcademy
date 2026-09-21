import { BookletCatalog } from "./booklet-catalog";
import { getLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function BookletPage() {
  const locale = await getLocale();
  return <BookletCatalog locale={locale} />;
}
