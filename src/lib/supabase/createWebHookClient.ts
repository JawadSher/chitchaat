import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { ENV } from "@/constants/env-exports";

export function createWebhookClient() {
  if (!ENV.SUPABASE.SUPABASE_URL || !ENV.SUPABASE.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("supabase_url or service_role_key is missing");
  }
  return createSupabaseClient(
    ENV.SUPABASE.SUPABASE_URL,
    ENV.SUPABASE.SUPABASE_SERVICE_ROLE_KEY,
  );
}
