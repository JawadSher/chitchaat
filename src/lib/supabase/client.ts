// lib/supabase/client.ts
import { ENV } from "@/constants/env-exports";
import { createBrowserClient } from "@supabase/ssr";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const supabaseClientSSR = () => {
  if (!ENV.SUPABASE.SUPABASE_URL || !ENV.SUPABASE.SUPABASE_ANON_KEY) {
    throw new Error("supabase_url or supabase_anon_key is missing");
  }
  return createBrowserClient(
    ENV.SUPABASE.SUPABASE_URL,
    ENV.SUPABASE.SUPABASE_ANON_KEY,
  );
};

// Singleton instance
let supabaseInstance: SupabaseClient | null = null;

export const supabaseClient = (session: any) => {
  // Return existing instance if already created
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Create new instance only once
  supabaseInstance = createClient(
    ENV.SUPABASE.SUPABASE_URL,
    ENV.SUPABASE.SUPABASE_PUBLISHABLE_KEY,
    {
      global: {
        fetch: async (url, options = {}) => {
          const clerkToken = await session?.getToken({
            template: "supabase",
          });

          console.log("🔑 Clerk token:", clerkToken ? "Present" : "Missing");

          if (clerkToken) {
            const payload = JSON.parse(atob(clerkToken.split(".")[1]));
            console.log("📋 Token payload:", payload);
            console.log("👤 User ID in token:", payload.sub);
          }

          const headers = new Headers(options?.headers);
          headers.set("Authorization", `Bearer ${clerkToken}`);

          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    },
  );

  return supabaseInstance;
};