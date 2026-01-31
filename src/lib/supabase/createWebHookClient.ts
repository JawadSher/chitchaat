import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { ENV } from "@/constants/env-exports";

export function createWebhookClient() {
  return createSupabaseClient(
    ENV.SUPABASE.SUPABASE_URL,
    ENV.SUPABASE.SUPABASE_SERVICE_ROLE_KEY,
  );
}
