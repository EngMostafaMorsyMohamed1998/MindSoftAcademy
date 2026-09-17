export type CommunityPost = {
  id: string;
  authorId: string;
  authorName: string;
  groupId: string;
  body: string;
  createdAt: string;
};

export type CommunityComment = {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type CommunityLike = {
  postId: string;
  studentId: string;
};

export type CommunityFeedPost = CommunityPost & {
  comments: CommunityComment[];
  likes: number;
  liked: boolean;
};

export const COMMUNITY_POST_MAX = 500;
export const COMMUNITY_COMMENT_MAX = 240;

export function cleanCommunityText(value: string, max: number): string {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

export function parseCommunityPosts(value: unknown): CommunityPost[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Partial<CommunityPost>;
    const body = cleanCommunityText(String(row.body || ""), COMMUNITY_POST_MAX);
    const authorId = String(row.authorId || "").trim();
    const authorName = String(row.authorName || "").replace(/\s+/g, " ").trim();
    if (!body || !authorId || !authorName) return [];
    return [
      {
        id: typeof row.id === "string" && row.id ? row.id : `post-${index}`,
        authorId,
        authorName: authorName.slice(0, 80),
        groupId: String(row.groupId || "").trim(),
        body,
        createdAt: String(row.createdAt || new Date().toISOString()),
      },
    ];
  });
}

export function parseCommunityComments(value: unknown): CommunityComment[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Partial<CommunityComment>;
    const body = cleanCommunityText(String(row.body || ""), COMMUNITY_COMMENT_MAX);
    const postId = String(row.postId || "").trim();
    const authorId = String(row.authorId || "").trim();
    const authorName = String(row.authorName || "").replace(/\s+/g, " ").trim();
    if (!body || !postId || !authorId || !authorName) return [];
    return [
      {
        id: typeof row.id === "string" && row.id ? row.id : `comment-${index}`,
        postId,
        authorId,
        authorName: authorName.slice(0, 80),
        body,
        createdAt: String(row.createdAt || new Date().toISOString()),
      },
    ];
  });
}

export function parseCommunityLikes(value: unknown): CommunityLike[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Partial<CommunityLike>;
    const postId = String(row.postId || "").trim();
    const studentId = String(row.studentId || "").trim();
    if (!postId || !studentId) return [];
    return [{ postId, studentId }];
  });
}

export function buildCommunityFeed(
  posts: CommunityPost[],
  comments: CommunityComment[],
  likes: CommunityLike[],
  viewerId: string,
  groupIds: string[],
  seeAll = false,
): CommunityFeedPost[] {
  const allowed = new Set(groupIds);
  return posts
    .filter((post) => {
      if (seeAll) return true;
      if (!post.groupId) return true;
      return allowed.has(post.groupId);
    })
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 80)
    .map((post) => ({
      ...post,
      comments: comments
        .filter((row) => row.postId === post.id)
        .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)),
      likes: likes.filter((row) => row.postId === post.id).length,
      liked: likes.some((row) => row.postId === post.id && row.studentId === viewerId),
    }));
}

export function communityTime(value: string, locale: "ar" | "en"): string {
  const ms = Date.now() - Date.parse(value);
  if (!Number.isFinite(ms) || ms < 0) {
    return new Date(value).toLocaleString(locale === "ar" ? "ar-EG" : "en-GB");
  }
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return locale === "ar" ? "دلوقتي" : "now";
  if (minutes < 60) return locale === "ar" ? `${minutes} د` : `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return locale === "ar" ? `${hours} س` : `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return locale === "ar" ? `${days} ي` : `${days}d`;
  return new Date(value).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB");
}
