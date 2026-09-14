"use client";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="no-print h-11 rounded-full bg-primary px-5 text-sm font-semibold text-white"
      onClick={() => window.print()}
    >
      {label}
    </button>
  );
}
