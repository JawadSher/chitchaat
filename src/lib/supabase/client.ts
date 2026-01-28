import { ENV } from "@/constants/env-exports";
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    ENV.SUPABASE.SUPABASE_URL,
    ENV.SUPABASE.SUPABASE_PUBLISHABLE_KEY,
  );
}
