import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

const INTERNAL_ADMIN_PREFIX = "/admin-internal";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // A rota interna nunca deve ser acessível pelo caminho literal —
  // só é alcançada via rewrite abaixo, a partir do ADMIN_PATH secreto.
  if (
    pathname === INTERNAL_ADMIN_PREFIX ||
    pathname.startsWith(`${INTERNAL_ADMIN_PREFIX}/`)
  ) {
    return new NextResponse(null, { status: 404 });
  }

  const adminPath = process.env.ADMIN_PATH;
  if (!adminPath) return NextResponse.next();

  const secretPrefix = `/${adminPath}`;
  const isAdminRequest =
    pathname === secretPrefix || pathname.startsWith(`${secretPrefix}/`);
  if (!isAdminRequest) return NextResponse.next();

  const rest = pathname.slice(secretPrefix.length); // "" | "/login" | ...
  const isLoginRoute = rest === "/login";

  if (!isLoginRoute) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const authenticated = await verifySessionToken(token);
    if (!authenticated) {
      return NextResponse.redirect(new URL(`${secretPrefix}/login`, request.url));
    }
  }

  const url = request.nextUrl.clone();
  url.pathname = `${INTERNAL_ADMIN_PREFIX}${rest}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
