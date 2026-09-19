"use client";

import { useState } from "react";
import { Heart, MessageCircle, Send, Trash2 } from "lucide-react";
import {
  commentCommunityPost,
  deleteCommunityCommentAction,
  deleteCommunityPostAction,
  likeCommunityPost,
  shareCommunityPost,
} from "@/app/actions/community";
import { communityTime, type CommunityFeedPost } from "@/lib/community";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import { initials } from "@/lib/student-profile";

export function CommunityFeed({
  locale,
  viewerId,
  teacher = false,
  posts,
  empty,
}: {
  locale: Locale;
  viewerId: string;
  teacher?: boolean;
  posts: CommunityFeedPost[];
  empty: string;
}) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onShare(formData: FormData) {
    setPending(true);
    setError("");
    const result = await shareCommunityPost(formData);
    setPending(false);
    if (!result.ok) {
      setError(t(locale, "communityError"));
      return;
    }
    (document.getElementById("community-body") as HTMLTextAreaElement | null)?.form?.reset();
  }

  return (
    <div className="space-y-4">
      <form action={onShare} className="rounded-3xl bg-surface p-4 ring-1 ring-primary/10">
        <label htmlFor="community-body" className="sr-only">
          {t(locale, "communityPlaceholder")}
        </label>
        <textarea
          id="community-body"
          name="body"
          rows={3}
          maxLength={500}
          required
          placeholder={t(locale, "communityPlaceholder")}
          className="w-full resize-none rounded-2xl border border-primary/15 bg-background px-3 py-2 text-sm outline-none focus:border-primary/40"
        />
        {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white disabled:opacity-70"
          >
            <Send className="size-4" />
            {t(locale, "communityShare")}
          </button>
        </div>
      </form>

      {posts.length === 0 ? (
        <p className="rounded-3xl bg-surface p-5 text-sm text-foreground/65 ring-1 ring-primary/10">{empty}</p>
      ) : (
        posts.map((post) => {
          const mine = post.authorId === viewerId || teacher;
          return (
            <article key={post.id} className="rounded-3xl bg-surface p-4 ring-1 ring-primary/10">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {initials(post.authorName)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{post.authorName}</p>
                  <p className="text-xs text-foreground/50">{communityTime(post.createdAt, locale)}</p>
                </div>
                {mine ? (
                  <form action={deleteCommunityPostAction}>
                    <input type="hidden" name="postId" value={post.id} />
                    <button type="submit" className="rounded-full p-2 text-foreground/40 hover:bg-red-50 hover:text-red-700">
                      <Trash2 className="size-4" />
                      <span className="sr-only">{t(locale, "communityDelete")}</span>
                    </button>
                  </form>
                ) : null}
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{post.body}</p>
              <div className="mt-3 flex items-center gap-3 text-sm">
                <CommunityLikeButton postId={post.id} liked={post.liked} likes={post.likes} />
                <span className="inline-flex items-center gap-1.5 text-foreground/55">
                  <MessageCircle className="size-4" />
                  {post.comments.length}
                </span>
              </div>
              {post.comments.length ? (
                <ul className="mt-3 space-y-2 border-t border-primary/8 pt-3">
                  {post.comments.map((comment) => (
                    <li key={comment.id} className="flex items-start gap-2 text-sm">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/8 text-[10px] font-semibold text-primary">
                        {initials(comment.authorName)}
                      </span>
                      <div className="min-w-0 flex-1 rounded-2xl bg-primary/5 px-3 py-2">
                        <p className="text-xs font-semibold">
                          {comment.authorName}
                          <span className="ms-2 font-normal text-foreground/45">
                            {communityTime(comment.createdAt, locale)}
                          </span>
                        </p>
                        <p className="mt-0.5 whitespace-pre-wrap">{comment.body}</p>
                      </div>
                      {comment.authorId === viewerId || teacher ? (
                        <form action={deleteCommunityCommentAction}>
                          <input type="hidden" name="commentId" value={comment.id} />
                          <button type="submit" className="p-1 text-foreground/30 hover:text-red-700">
                            <Trash2 className="size-3.5" />
                          </button>
                        </form>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : null}
              <form action={commentCommunityPost} className="mt-3 flex items-end gap-2">
                <input type="hidden" name="postId" value={post.id} />
                <input
                  name="body"
                  maxLength={240}
                  required
                  placeholder={t(locale, "communityComment")}
                  className="h-10 flex-1 rounded-full border border-primary/15 bg-background px-3 text-sm outline-none focus:border-primary/40"
                />
                <button
                  type="submit"
                  className="inline-flex size-10 items-center justify-center rounded-full bg-primary text-white"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </article>
          );
        })
      )}
    </div>
  );
}

function CommunityLikeButton({
  postId,
  liked,
  likes,
}: {
  postId: string;
  liked: boolean;
  likes: number;
}) {
  const [state, setState] = useState({ liked, likes });

  async function onLike() {
    setState((current) => ({
      liked: !current.liked,
      likes: current.liked ? Math.max(0, current.likes - 1) : current.likes + 1,
    }));
    const form = new FormData();
    form.set("postId", postId);
    await likeCommunityPost(form);
  }

  return (
    <button
      type="button"
      onClick={() => void onLike()}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
        state.liked ? "bg-red-50 font-semibold text-red-700" : "bg-primary/5 text-foreground/70"
      }`}
    >
      <Heart className={`size-4 ${state.liked ? "fill-red-600" : ""}`} />
      {state.likes}
    </button>
  );
}
