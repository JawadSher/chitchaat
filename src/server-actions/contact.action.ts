"use server";

import { createClient } from "@/lib/supabase/server";

export async function findContact({ userName }: { userName: string }) {
  try {
    console.log(userName);
    const supabase = await createClient();
    const query = supabase
      .from("users")
      .select("id,full_name,username,avatar_url")
      .ilike("username", `%${userName}%`)
      .eq("is_deleted", false)
      .limit(10);

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
