import { listCommunityFeed } from "@/lib/access-store";
import { getCurrentUser } from "@/lib/current-user";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { CommunityFeed } from "@/components/community-feed";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const locale = await getLocale();
  const posts = await listCommunityFeed({
    viewerId: user.id,
    groupIds: [],
    seeAll: true,
  });

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="font-serif text-3xl">{t(locale, "communityTitle")}</h1>
      <p className="mt-2 text-sm text-foreground/65">{t(locale, "communityLead")}</p>
      <div className="mt-5">
        <CommunityFeed
          locale={locale}
          viewerId={user.id}
          posts={posts}
          empty={t(locale, "communityEmpty")}
        />
      </div>
    </div>
  );
}
