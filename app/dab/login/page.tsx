"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";

const initial: LoginState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initial);

  return (
    <main className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-display text-2xl tracking-[0.3em] text-ink">
            AL-MADINA
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-soft mt-2">
            Admin Dashboard
          </p>
        </div>

        <form
          action={formAction}
          className="bg-white border border-black/10 p-8 space-y-4"
        >
          <div>
            <label className="block text-xs uppercase tracking-[0.14em] text-ink-soft mb-1.5">
              Username<span className="text-red-500"> *</span>
            </label>
            <input
              name="username"
              required
              autoComplete="username"
              className="w-full border border-black/15 px-4 py-3 text-sm text-ink focus:outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.14em] text-ink-soft mb-1.5">
              Password<span className="text-red-500"> *</span>
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full border border-black/15 px-4 py-3 text-sm text-ink focus:outline-none focus:border-ink"
            />
          </div>

          {state.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-ink text-white text-xs uppercase tracking-widest py-3.5 hover:bg-brand transition-colors disabled:opacity-50"
          >
            {pending ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
