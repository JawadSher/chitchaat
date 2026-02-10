import { ENV } from "@/constants/env-exports";
import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export const supabaseClientSSR = () => {
  if (!ENV.SUPABASE.SUPABASE_URL || !ENV.SUPABASE.SUPABASE_ANON_KEY) {
    throw new Error("supabase_url or supabase_anon_key is missing");
  }
  return createBrowserClient(
    ENV.SUPABASE.SUPABASE_URL,
    ENV.SUPABASE.SUPABASE_ANON_KEY,
  );
};

export function createSupabaseClient(token?: string) {
  if (!ENV.SUPABASE.SUPABASE_URL || !ENV.SUPABASE.SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("Supabase env variables missing");
  }

  return createClient(
    ENV.SUPABASE.SUPABASE_URL,
    ENV.SUPABASE.SUPABASE_PUBLISHABLE_KEY,
    token
      ? {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        }
      : {},
  );
}
