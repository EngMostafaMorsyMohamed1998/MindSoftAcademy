"use client";

import { useState, useTransition } from "react";
import { Activity, CheckCircle2, Database, Download, RefreshCw, XCircle } from "lucide-react";
import { checkSystemHealth, exportFullDataBackup, type SystemHealthReport } from "@/app/actions/system-health";

export function SystemStatusCard({
  initialReport,
}: {
  initialReport: SystemHealthReport | null;
}) {
  const [report, setReport] = useState<SystemHealthReport | null>(initialReport);
  const [isChecking, startChecking] = useTransition();
  const [isExporting, startExporting] = useTransition();
  const [exportMsg, setExportMsg] = useState<string | null>(null);

  function handleCheck() {
    startChecking(async () => {
      const updated = await checkSystemHealth();
      if (updated) setReport(updated);
    });
  }

  function handleDownloadBackup() {
    startExporting(async () => {
      setExportMsg(null);
      const res = await exportFullDataBackup();
      if (res.ok && res.data && res.filename) {
        const blob = new Blob([res.data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = res.filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setExportMsg("تم تنزيل النسخة الاحتياطية بنجاح.");
      } else {
        setExportMsg(res.error || "تعذر تصدير النسخة.");
      }
    });
  }

  return (
    <section className="rounded-3xl bg-white p-5 text-foreground ring-1 ring-primary/10">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Activity className="size-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold">حالة النظام والتخزين والنسخ الاحتياطي</h2>
            <p className="text-xs text-foreground/60">
              فحص لحظي مباشر لحالة قاعدة البيانات (Postgres) والتخزين السحابي.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCheck}
            disabled={isChecking}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-primary/15 bg-white px-3 text-xs font-semibold text-primary transition hover:bg-primary/5 disabled:opacity-60"
          >
            <RefreshCw className={`size-3.5 ${isChecking ? "animate-spin" : ""}`} />
            فحص الاتصال الآن
          </button>
          <button
            type="button"
            onClick={handleDownloadBackup}
            disabled={isExporting}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
          >
            <Download className="size-3.5" />
            تحميل نسخة احتياطية (JSON)
          </button>
        </div>
      </div>

      {exportMsg ? (
        <p className="mt-3 text-xs font-medium text-emerald-800">{exportMsg}</p>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* Database Status */}
        <div className="rounded-2xl border border-primary/10 bg-primary/3 p-3.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground/75">
              <Database className="size-4 text-primary" />
              قاعدة البيانات (PostgreSQL)
            </span>
            {report?.dbConnected ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                <CheckCircle2 className="size-3" />
                متصلة ({report.dbLatencyMs} ms)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                <XCircle className="size-3" />
                وضع الحفظ المحلي
              </span>
            )}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-foreground/65">
            {report?.dbConnected
              ? "الاتصال متصل وقيد العمل مع جداول المنصة."
              : report?.dbError || "قاعدة البيانات مشغولة، والمنصة تحفظ مؤقتاً في ذاكرة السيرفر."}
          </p>
        </div>

        {/* Storage Cache */}
        <div className="rounded-2xl border border-primary/10 bg-primary/3 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground/75">
              تخزين النسخ الاحتياطية (Cloud Blob)
            </span>
            {report?.blobConfigured ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                <CheckCircle2 className="size-3" />
                مفعل
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
                تخزين محلي نشط
              </span>
            )}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-foreground/65">
            {report?.blobConfigured
              ? "متصل بحاوية Vercel Blob للتخزين الدائم للصور والملفات."
              : "الحفظ الاحتياطي يعتمد على السيرفر، وتستطيع تنزيل نسخة JSON يدوياً في أي وقت."}
          </p>
        </div>

        {/* Live Records Count */}
        <div className="rounded-2xl border border-primary/10 bg-primary/3 p-3.5 sm:col-span-2 lg:col-span-1">
          <span className="text-xs font-semibold text-foreground/75">السجلات المحفوظة حالياً</span>
          <div className="mt-2 flex items-center justify-around text-center text-xs">
            <div>
              <p className="text-base font-bold text-primary">{report?.studentCount ?? 0}</p>
              <p className="text-[10px] text-foreground/50">طلاب مسجلين</p>
            </div>
            <div className="h-6 w-px bg-primary/10" />
            <div>
              <p className="text-base font-bold text-accent">{report?.subscriptionCount ?? 0}</p>
              <p className="text-[10px] text-foreground/50">طلبات اشتراك</p>
            </div>
            <div className="h-6 w-px bg-primary/10" />
            <div>
              <p className="text-base font-bold text-emerald-700">{report?.messageCount ?? 0}</p>
              <p className="text-[10px] text-foreground/50">رسائل شات</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
