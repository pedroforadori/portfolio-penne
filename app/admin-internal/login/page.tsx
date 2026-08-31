"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [error, formAction, isPending] = useActionState(loginAction, null);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#171412] px-4">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-2xl bg-[#1f1b18] p-8 shadow-xl"
      >
        <h1 className="text-lg font-medium text-[#f4ede6] mb-1">Penne — acesso</h1>
        <p className="text-sm text-[#a89a8c] mb-6">Digite a senha para continuar.</p>

        <input
          type="password"
          name="password"
          autoFocus
          placeholder="Senha"
          className="w-full rounded-lg border border-[#3a332c] bg-[#12100e] px-4 py-2.5 text-[#f4ede6] placeholder:text-[#6b5f54] outline-none focus:border-[#c97b5c]"
        />

        {error && <p className="mt-3 text-sm text-[#e08a6d]">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="mt-5 w-full rounded-lg bg-[#c97b5c] py-2.5 text-sm font-medium text-[#171412] transition hover:bg-[#dc8e6e] disabled:opacity-60"
        >
          {isPending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
