import { NextResponse } from "next/server";
import { listPresence } from "@/lib/access-store";
import { getGame } from "@/lib/games";
import { presenceFresh, presenceLabel } from "@/lib/presence";
import { listVisibleCodes } from "@/lib/teacher-roster";
import { isTeacher } from "@/lib/teacher-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isTeacher())) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  const [codes, pings] = await Promise.all([listVisibleCodes(), listPresence()]);
  const byId = new Map(pings.map((row) => [row.studentId, row]));
  const rows = codes.map((code) => {
    const ping = byId.get(code.id);
    const fresh = ping ? presenceFresh(ping.at) : false;
    const screen = fresh && ping ? ping.screen : "away";
    const tag = ping ? presenceLabel(ping.path) : "";
    const game = tag ? getGame(tag) : undefined;
    return {
      id: code.id,
      name: code.name,
      screen,
      detail: game ? game.titleAr : tag,
    };
  });
  return NextResponse.json({
    exam: rows.filter((row) => row.screen === "exam").length,
    game: rows.filter((row) => row.screen === "game").length,
    elsewhere: rows.filter((row) => row.screen === "elsewhere").length,
    away: rows.filter((row) => row.screen === "away").length,
    rows,
  });
}
