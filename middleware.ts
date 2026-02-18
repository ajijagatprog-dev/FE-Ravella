// middleware.ts
import { NextResponse } from "next/server";

export function middleware(req) {
  const role = req.cookies.get("role");

  if (req.nextUrl.pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/b2b") && role !== "b2b") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
