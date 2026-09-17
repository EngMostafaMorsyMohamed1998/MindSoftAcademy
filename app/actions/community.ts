"use server";

import { revalidatePath } from "next/cache";
import {
  createCommunityComment,
  createCommunityPost,
  listClassGroups,
  removeCommunityComment,
  removeCommunityPost,
  toggleCommunityLike,
} from "@/lib/access-store";
import { groupsForStudent } from "@/lib/class-groups";
import { getCurrentUser } from "@/lib/current-user";
import { isTeacher } from "@/lib/teacher-session";
import { BRAND } from "@/lib/brand";

function refresh() {
  revalidatePath("/dashboard/community");
  revalidatePath("/admin");
}

export async function shareCommunityPost(formData: FormData): Promise<void> {
  const body = String(formData.get("body") || "");
  const teacher = await isTeacher();
  if (teacher) {
    const saved = await createCommunityPost({
      authorId: "teacher",
      authorName: BRAND.teacherAr,
      groupId: String(formData.get("groupId") || ""),
      body,
    });
    if (saved) refresh();
    return;
  }
  const user = await getCurrentUser();
  if (!user) return;
  const groups = groupsForStudent(await listClassGroups(), user.id);
  const saved = await createCommunityPost({
    authorId: user.id,
    authorName: user.name,
    groupId: groups[0]?.id ?? "",
    body,
  });
  if (saved) refresh();
}

export async function likeCommunityPost(formData: FormData): Promise<void> {
  const postId = String(formData.get("postId") || "");
  if (!postId) return;
  const teacher = await isTeacher();
  const user = teacher ? null : await getCurrentUser();
  const actorId = teacher ? "teacher" : user?.id;
  if (!actorId) return;
  const ok = await toggleCommunityLike(postId, actorId);
  if (ok) refresh();
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
