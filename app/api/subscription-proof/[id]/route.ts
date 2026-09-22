import { readSubscriptionProof } from "@/lib/subscription-store";
import { isTeacher } from "@/lib/teacher-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isTeacher())) {
    return new Response("Forbidden", { status: 403 });
  }
  const { id } = await params;
  const proof = await readSubscriptionProof(id);
  if (!proof) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(proof.bytes), {
    headers: {
      "Content-Type": proof.mime,
      "Cache-Control": "private, no-store",
      "Content-Disposition": "inline",
    },
  });
}
