// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Add public routes that don't require authentication here
const publicRoutes = ["/", "/login", "/signup", "/forgot-password"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    path === route || path.startsWith(`${route}/`)
  );

  // Get the session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect unauthenticated users to login page for protected routes
  if (!token && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login/signup pages
  if (token && (path === "/login" || path === "/signup")) {
    return NextResponse.redirect(new URL("/overview", request.url));
  }

  return NextResponse.next();
}

// Configure the paths that require middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};