import Link from "next/link";
import { Arena3D } from "@/components/arena-3d";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export default async function ArenaPage() {
  const locale = await getLocale();
  return (
    <div className="arena-page">
      <Link href="/dashboard/games" className="mb-2 inline-block px-1 text-sm font-medium text-primary">
        {t(locale, "back")}
      </Link>
      <Arena3D locale={locale} />
    </div>
  );
}
