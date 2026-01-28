import { updateSession } from "@/lib/supabase/proxy";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "./lib/supabase/server";

async function authMiddleware(request: NextRequest) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    const signInUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return null;
}

export async function proxy(request: NextRequest) {
  const authRes = await authMiddleware(request);
  if (authRes) {
    return authRes;
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sign-in|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
