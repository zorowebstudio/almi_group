import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "almi-group-super-secret-key-2026-must-be-long-enough";
const secretKey = new TextEncoder().encode(JWT_SECRET);
const SESSION_COOKIE_NAME = "almi_session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  let session: { role?: string; companyId?: string; id?: string; name?: string } | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secretKey, {
        algorithms: ["HS256"],
      });
      session = payload as { role?: string; companyId?: string; id?: string; name?: string };
    } catch {
      // Token expired or signature invalid
    }
  }

  // 1. Protect Admin Panel
  if (pathname.startsWith("/admin")) {
    if (!session || session.role !== "ADMIN") {
      const loginUrl = new URL("/vhod", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protect Customer/Technician Portals
  if (pathname.startsWith("/portal")) {
    if (!session) {
      const loginUrl = new URL("/vhod", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Route technicians trying to access main portal home if desired,
    // or protect specific technician files
    if (pathname.startsWith("/portal/tehnik")) {
      if (session.role !== "TECHNICIAN" && session.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/portal", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};
