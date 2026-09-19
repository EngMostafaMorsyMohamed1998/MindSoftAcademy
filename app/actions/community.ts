"use server";

import { revalidatePath } from "next/cache";
import {
  createCommunityComment,
  createCommunityPost,
  removeCommunityComment,
  removeCommunityPost,
  toggleCommunityLike,
} from "@/lib/access-store";
import { getCurrentUser } from "@/lib/current-user";
import { isTeacher } from "@/lib/teacher-session";
import { BRAND } from "@/lib/brand";

function refresh() {
  revalidatePath("/dashboard/community");
  revalidatePath("/admin");
}

export async function shareCommunityPost(formData: FormData): Promise<{ ok: boolean }> {
  const body = String(formData.get("body") || "");
  const teacher = await isTeacher();
  if (teacher) {
    const saved = await createCommunityPost({
      authorId: "teacher",
      authorName: BRAND.teacherAr,
      groupId: "",
      body,
    });
    if (saved) refresh();
    return { ok: Boolean(saved) };
  }
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  const saved = await createCommunityPost({
    authorId: user.id,
    authorName: user.name,
    groupId: "",
    body,
  });
  if (saved) refresh();
  return { ok: Boolean(saved) };
}

export async function likeCommunityPost(formData: FormData): Promise<void> {
  const postId = String(formData.get("postId") || "");
  if (!postId) return;
  const user = await getCurrentUser();
  const actorId = user?.id || ((await isTeacher()) ? "teacher" : "");
  if (!actorId) return;
  await toggleCommunityLike(postId, actorId);
  refresh();
}

export async function commentCommunityPost(formData: FormData): Promise<void> {
  const postId = String(formData.get("postId") || "");
  const body = String(formData.get("body") || "");
  if (!postId) return;
  const teacher = await isTeacher();
  if (teacher) {
    const saved = await createCommunityComment({
      postId,
      authorId: "teacher",
      authorName: BRAND.teacherAr,
      body,
    });
    if (saved) refresh();
    return;
  }
  const user = await getCurrentUser();
  if (!user) return;
  const saved = await createCommunityComment({
    postId,
    authorId: user.id,
    authorName: user.name,
    body,
  });
  if (saved) refresh();
}

export async function deleteCommunityPostAction(formData: FormData): Promise<void> {
  const id = String(formData.get("postId") || "");
  if (!id) return;
  const teacher = await isTeacher();
  const user = teacher ? null : await getCurrentUser();
  const actorId = teacher ? "teacher" : user?.id;
  if (!actorId) return;
  const ok = await removeCommunityPost(id, actorId, teacher);
  if (ok) refresh();
}

export async function deleteCommunityCommentAction(formData: FormData): Promise<void> {
  const id = String(formData.get("commentId") || "");
  if (!id) return;
  const teacher = await isTeacher();
  const user = teacher ? null : await getCurrentUser();
  const actorId = teacher ? "teacher" : user?.id;
  if (!actorId) return;
  const ok = await removeCommunityComment(id, actorId, teacher);
  if (ok) refresh();
}
