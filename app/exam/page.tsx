import type { Metadata } from "next";
import { ExamSimulator } from "../dashboard/exam-simulator/exam-simulator";

export const metadata: Metadata = {
  title: "Exam — Lumina",
  description: "Sit a timed Baccalaureate mock exam and save your score.",
};

export default function ExamPage() {
  return (
    <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <ExamSimulator />
    </div>
  );
}
