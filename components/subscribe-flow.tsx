"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, CalendarDays, Check, Copy, ImagePlus, X } from "lucide-react";
import { submitWalletSubscription } from "@/app/actions/subscription";
import {
  SUBSCRIPTION_PLANS,
  WALLET_NUMBER,
  walletInstructions,
  walletLabel,
  type PlanId,
  type WalletId,
} from "@/lib/subscription";

type Step = "plan" | "method" | "proof" | "class" | "sent";

async function shrinkProof(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const maxEdge = 1400;
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.72));
  if (!blob) throw new Error("blob");
  const finalBlob =
    blob.size > 850_000
      ? await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.5))
      : blob;
  if (!finalBlob) throw new Error("blob");
  return new File([finalBlob], "proof.jpg", { type: "image/jpeg" });
}

export function SubscribeFlow({
  studentName = "",
  senderPhone = "",
}: {
  studentName?: string;
  senderPhone?: string;
}) {
  const [step, setStep] = useState<Step>("plan");
  const [planId, setPlanId] = useState<PlanId>("month");
  const [wallet, setWallet] = useState<WalletId>("vodafone");
  const [name, setName] = useState(studentName);
  const [phone, setPhone] = useState(senderPhone);
  const [proof, setProof] = useState<File | null>(null);
  const [proofName, setProofName] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const plan = SUBSCRIPTION_PLANS.find((item) => item.id === planId) ?? SUBSCRIPTION_PLANS[1];

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(WALLET_NUMBER);
    } catch {
      const field = document.createElement("textarea");
      field.value = WALLET_NUMBER;
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function choosePlan(next: PlanId) {
    setPlanId(next);
    setError(null);
    setStep("method");
  }

  function chooseWallet(next: WalletId) {
    setWallet(next);
    setCopied(false);
    setError(null);
    setStep("proof");
  }

  async function onProof(file: File | null) {
    setError(null);
    if (!file) {
      setProof(null);
      setProofName("");
      return;
    }
    try {
      const shrunk = await shrinkProof(file);
      setProof(shrunk);
      setProofName(file.name);
    } catch {
      setProof(null);
      setProofName("");
      setError("ارفع صورة JPG أو PNG واضحة.");
    }
  }

  async function sendRequest() {
    if (pending) return;
    setError(null);
    if (!proof) {
      setError("ارفع صورة التحويل.");
      return;
    }
    setPending(true);
    const data = new FormData();
    data.set("plan", plan.id);
    data.set("wallet", wallet);
    data.set("studentName", name);
    data.set("senderPhone", phone);
    data.set("proof", proof);
    try {
      const result = await submitWalletSubscription({ error: null }, data);
      if (result.error) {
        setError(result.error);
        return;
      }
      setStep("sent");
    } catch {
      setError("حفظ الطلب وقف. حدّث الصفحة وحاول تاني.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="relative rounded-[28px] bg-white p-5 text-[#071225] shadow-[0_24px_60px_rgba(7,18,37,0.16)] ring-1 ring-primary/10 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex size-9 items-center justify-center rounded-full text-foreground/50 hover:bg-primary/5"
          aria-label="إغلاق"
        >
          <X className="size-4" aria-hidden="true" />
        </Link>
        <h1 className="text-base font-semibold">اشتراك الكورس</h1>
        <span className="size-9" aria-hidden="true" />
      </div>

      {step === "plan" ? (
        <div>
          <h2 className="text-center text-lg font-semibold">اختار الباقة</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {SUBSCRIPTION_PLANS.map((item) => {
              const selected = item.id === planId;
              const Icon = item.id === "term" ? BookOpen : CalendarDays;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => choosePlan(item.id)}
                  aria-pressed={selected}
                  className={`rounded-2xl border-2 px-3 py-5 text-center transition ${
                    item.id === "year" ? "col-span-2" : ""
                  } ${
                    selected
                      ? "border-accent bg-accent/10 shadow-sm"
                      : "border-primary/10 bg-white hover:border-primary/25"
                  }`}
                >
                  <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="mt-3 block text-base font-semibold">{item.label}</span>
                  <span className="mt-1 block text-sm font-semibold text-accent tabular-nums" dir="ltr">
                    {item.amount} جنيه
                  </span>
                </button>
              );
            })}
          </div>
          <Link href="/" className="mt-4 block py-2 text-center text-sm font-medium text-foreground/55">
            رجوع
          </Link>
        </div>
      ) : null}

      {step === "method" ? (
        <div>
          <p className="text-center text-2xl font-bold text-accent tabular-nums" dir="ltr">
            {plan.amount} جنيه
          </p>
          <p className="mt-1 text-center text-sm text-foreground/55">{plan.label}</p>
          <h2 className="mt-4 text-center text-lg font-semibold">هتدفع إزاي؟</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => chooseWallet("vodafone")}
              className="rounded-2xl border border-primary/10 bg-white px-3 py-6 text-center hover:border-primary/30"
            >
              <span className="block text-lg font-bold text-[#e60000]">فودافون كاش</span>
            </button>
            <button
              type="button"
              onClick={() => chooseWallet("instapay")}
              className="rounded-2xl border border-primary/10 bg-white px-3 py-6 text-center hover:border-primary/30"
            >
              <span className="block text-lg font-bold text-[#5c2d91]">إنستاباي</span>
            </button>
          </div>
          <div className="mt-5 rounded-2xl bg-primary/5 p-4">
            <p className="text-xs font-semibold text-primary">طريقة تانية، من غير تحويل</p>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep("class");
              }}
              className="mt-2 w-full rounded-2xl border-2 border-primary bg-white px-4 py-3 text-start"
            >
              <span className="block text-base font-semibold text-primary">الدفع في الحصة</span>
              <span className="mt-1 block text-xs leading-relaxed text-foreground/60">
                كاش مع المدرس أثناء الحصة. التسجيل من مكتب المدرس.
              </span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => setStep("plan")}
            className="mt-3 block w-full py-2 text-center text-sm font-medium text-foreground/55"
          >
            رجوع
          </button>
        </div>
      ) : null}

      {step === "proof" ? (
        <div>
          <p className="text-center text-2xl font-bold text-accent tabular-nums" dir="ltr">
            {plan.amount} جنيه
          </p>
          <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-relaxed text-foreground/70">
            {walletInstructions(wallet)}
          </p>
          <p className={`mt-4 text-center text-xl font-bold ${wallet === "vodafone" ? "text-[#e60000]" : "text-[#5c2d91]"}`}>
            {walletLabel(wallet)}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => void copyNumber()}
              className="inline-flex h-11 shrink-0 items-center gap-1 rounded-xl border border-primary/15 bg-white px-3 text-sm font-semibold"
            >
              {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
              {copied ? "تم النسخ" : "نسخ الرقم"}
            </button>
            <p className="flex h-11 flex-1 items-center justify-center rounded-xl border border-primary/15 bg-primary/5 text-base font-semibold tabular-nums" dir="ltr">
              {WALLET_NUMBER}
            </p>
          </div>
          <label className="mt-4 grid gap-1 text-sm font-medium">
            اسم الطالب
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              className="h-11 rounded-xl border border-primary/15 px-3 text-sm font-normal"
            />
          </label>
          <label className="mt-3 grid gap-1 text-sm font-medium">
            رقم الموبايل اللي حوّلت منه
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              inputMode="numeric"
              autoComplete="tel"
              placeholder="01xxxxxxxxx"
              dir="ltr"
              className="h-11 rounded-xl border border-primary/15 px-3 text-center text-sm font-normal tabular-nums placeholder:text-foreground/35"
            />
          </label>
          <p className="mt-4 text-center text-sm font-medium">صورة إثبات التحويل</p>
          <label className="mt-2 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-accent/70 bg-accent/5 px-4 py-6 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-accent/15 text-accent">
              <ImagePlus className="size-5" aria-hidden="true" />
            </span>
            <span className="mt-2 text-sm text-foreground/70">
              {proofName || "اضغط هنا وارفع صورة السكرين شوت"}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => void onProof(event.target.files?.[0] ?? null)}
            />
          </label>
          {error ? <p className="mt-3 text-center text-sm text-red-700">{error}</p> : null}
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep("method");
              }}
              className="h-11 px-4 text-sm font-medium text-foreground/60"
            >
              رجوع
            </button>
            <button
              type="button"
              onClick={() => void sendRequest()}
              disabled={pending}
              className="h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-white disabled:opacity-70"
            >
              {pending ? "جارٍ الإرسال" : "إرسال الطلب"}
            </button>
          </div>
        </div>
      ) : null}

      {step === "class" ? (
        <div>
          <h2 className="text-center text-lg font-semibold">الدفع في الحصة</h2>
          <p className="mt-3 text-center text-2xl font-bold text-primary tabular-nums" dir="ltr">
            {plan.amount} جنيه
          </p>
          <p className="mt-1 text-center text-sm text-foreground/55">{plan.label}</p>
          <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-relaxed text-foreground/75">
            ادفع المبلغ كاش في الحصة مع المدرس. مفيش تحويل، ومفيش صورة. المدرس بيسجّل السداد من سجل الاشتراك في المكتبة.
          </p>
          <button
            type="button"
            onClick={() => setStep("method")}
            className="mt-5 block w-full py-2 text-center text-sm font-medium text-foreground/55"
          >
            رجوع
          </button>
        </div>
      ) : null}

      {step === "sent" ? (
        <div className="py-6 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Check className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-lg font-semibold">وصل طلب التحويل</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-foreground/70">
            المدرس هيراجع صورة التحويل ويأكد الاشتراك. لحد ما يتأكد، السداد مش بيتسجل لوحده.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white"
          >
            رجوع للرئيسية
          </Link>
        </div>
      ) : null}
    </section>
  );
}
