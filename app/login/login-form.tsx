"use client";

import { useActionState, useState } from "react";
import { LoaderCircle, LogIn, UserPlus } from "lucide-react";
import {
  loginWithPassword,
  registerStudent,
  type AuthFormState,
} from "./actions";

const initial: AuthFormState = { error: null };

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loginState, loginAction, loginPending] = useActionState(
    loginWithPassword,
    initial,
  );
  const [registerState, registerAction, registerPending] = useActionState(
    registerStudent,
    initial,
  );

  const pending = loginPending || registerPending;
  const error = mode === "signup" ? registerState.error : loginState.error;

  return (
    <div className="space-y-6">
      <div
        className="grid grid-cols-2 rounded-full bg-white/8 p-1 ring-1 ring-white/10"
        role="tablist"
        aria-label="Account mode"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signin"}
          disabled={pending}
          onClick={() => setMode("signin")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            mode === "signin"
              ? "keep-white bg-white text-primary shadow-sm"
              : "text-white/70 hover:text-white"
          }`}
        >
          Log in
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signup"}
          disabled={pending}
          onClick={() => setMode("signup")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            mode === "signup"
              ? "keep-white bg-white text-primary shadow-sm"
              : "text-white/70 hover:text-white"
          }`}
        >
          Sign up
        </button>
      </div>

      <form
        key={mode}
        action={mode === "signup" ? registerAction : loginAction}
        className="space-y-4"
      >
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        {mode === "signup" ? (
          <label className="block space-y-1.5">
            <span className="text-xs font-medium tracking-wide text-white/70">
              Full name
            </span>
            <input
              name="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              className="h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/35 ring-accent/0 transition focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
            />
          </label>
        ) : null}

        <label className="block space-y-1.5">
          <span className="text-xs font-medium tracking-wide text-white/70">
            Email
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/35 transition focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-medium tracking-wide text-white/70">
            Password
          </span>
          <input
            name="password"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
            minLength={mode === "signup" ? 8 : 1}
            className="h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/35 transition focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
          />
        </label>

        {error ? (
          <p className="rounded-2xl bg-red-500/15 px-3 py-2 text-sm text-red-100 ring-1 ring-red-400/30" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="keep-white inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-primary shadow-lg shadow-black/20 transition hover:bg-white/95 disabled:opacity-70"
        >
          {pending ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : mode === "signup" ? (
            <UserPlus className="size-4" aria-hidden="true" />
          ) : (
            <LogIn className="size-4" aria-hidden="true" />
          )}
          {mode === "signup" ? "Create account" : "Continue"}
        </button>
      </form>
    </div>
  );
}
