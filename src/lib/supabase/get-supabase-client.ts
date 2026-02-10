"use client";

import { useSupabaseToken } from "@/hooks/use-supabase-token";
import { createSupabaseClient } from "./client";

export function useSupabaseClient() {
  const { getToken } = useSupabaseToken();

  const getClient = async () => {
    const token = await getToken() as any;
    return createSupabaseClient(token);
  };

  return { getClient };
}
