import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { SubscribeFlow } from "@/components/subscribe-flow";
import { getStudentSession } from "@/lib/student-session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "اشتراك الكورس — MindSoft Academy",
};

export default async function SubscribePage() {
  let studentName = "";
  let senderPhone = "";
  try {
    const student = await getStudentSession();
    studentName = student?.name ?? "";
    senderPhone = student?.phone ?? "";
  } catch {
    studentName = "";
    senderPhone = "";
  }

  return (
    <div
      dir="rtl"
      lang="ar"
      className="flex min-h-full flex-1 flex-col bg-background text-[#071225] [font-family:var(--font-cairo),sans-serif]"
    >
      <header className="border-b-2 border-accent bg-nav text-nav-fg">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4">
          <BrandMark locale="ar" />
          <Link href="/" className="text-sm font-semibold text-primary">
            الرئيسية
          </Link>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-md flex-1 items-start px-4 py-8 sm:py-12">
        <SubscribeFlow studentName={studentName} senderPhone={senderPhone} />
      </main>
    </div>
  );
}
