import { ENV } from "@/constants/env-exports";
import { createBrowserClient } from "@supabase/ssr";

export const supabaseClient = () => {
  if (!ENV.SUPABASE.SUPABASE_URL || !ENV.SUPABASE.SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("supabase_url or publishable_key is missing");
  }
  return createBrowserClient(
    ENV.SUPABASE.SUPABASE_URL,
    ENV.SUPABASE.SUPABASE_PUBLISHABLE_KEY,
  );
};
