"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export async function loginAction(_prevState: string | null, formData: FormData) {
  const password = formData.get("password");
  if (typeof password !== "string" || password.length === 0) {
    return "Informe a senha.";
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    return "Senha incorreta.";
  }

  const token = await createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  redirect(`/${process.env.ADMIN_PATH}`);
}
