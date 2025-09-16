import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // This will refresh the auth session if needed and set cookies on the response
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Always allow public schedule pages
  if (
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/schedules")
  ) {
    return response;
  }

  // Protected routes that require authentication
  const protectedRoutes = ["/manage", "/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // If accessing a protected route without authentication, redirect to login
  if (isProtectedRoute && !user) {
    const loginUrl = new URL("/api/petrit/login", request.url);
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (request.nextUrl.pathname === "/api/petrit/login" && !user) {
    return NextResponse.redirect(new URL("/schedules", request.url));
  }
  // If accessing login page while authenticated, redirect to dashboard
  if (request.nextUrl.pathname === "/api/petrit/login" && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
