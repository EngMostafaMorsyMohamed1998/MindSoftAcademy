import type { Metadata } from "next";
import { ExamSimulator } from "./exam-simulator";

export const metadata: Metadata = {
  title: "Exam Simulator — Lumina",
  description: "Timed Baccalaureate mock exam with scored results.",
};

export default function ExamSimulatorPage() {
  return <ExamSimulator />;
}
