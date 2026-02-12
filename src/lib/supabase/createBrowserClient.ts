import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseClient(clerkToken?: string | null) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  if (clerkToken) {
    supabase.realtime.setAuth(clerkToken);
  }

  return supabase;
}