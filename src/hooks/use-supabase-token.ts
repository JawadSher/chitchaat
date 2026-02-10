"use client";

import { useSession } from "@clerk/nextjs";

export function useSupabaseToken() {
  const { session } = useSession();

  const getToken = async () => {
    if (!session) throw new Error("Not authenticated");
    return session.getToken({ template: "supabase" });
  };

  return { getToken };
}
