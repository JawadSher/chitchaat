import { SupabaseClient } from "@supabase/supabase-js";

export async function getNotifications(
  supabase: SupabaseClient,
  user_id: string,
) {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select(
        "id, created_at, data, body, is_read, notification_type, title, info:users(avatar_url)",
      )
      .eq("contact_id", user_id)
      .eq("is_deleted", false);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
