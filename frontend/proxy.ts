import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/signup"];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Let public paths and API/static routes through
    if (
        PUBLIC_PATHS.includes(pathname) ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    // Dashboard routes need auth
    if (pathname.startsWith("/dashboard")) {
        const token = request.cookies.get("token")?.value;
        // We primarily rely on localStorage-based auth on the client.
        // Middleware provides a lightweight server-side check via cookie.
        // If no cookie exists, redirect to login.
        if (!token) {
            // Check for token in header as a fallback
            const authHeader = request.headers.get("authorization");
            if (!authHeader) {
                return NextResponse.redirect(new URL("/login", request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
