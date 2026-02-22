import { IMessages } from "@/types/messages";
import { ISendMessageProps } from "@/types/send-message-props";
import { SupabaseClient } from "@supabase/supabase-js";

export async function sendMessage(
  supabase: SupabaseClient,
  {
    sender_id,
    message_type,
    content,
    media_url,
    file_name,
    file_size,
    duration,
    reply_to_message_id,
    recipient_id,
  }: ISendMessageProps,
) {
  try {
    const { data, error } = await supabase.from("messages").insert([
      {
        sender_id,
        message_type,
        content,
        media_url,
        file_name,
        file_size,
        duration,
        reply_to_message_id,
        recipient_id,
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getMessages(
  supabase: SupabaseClient,
  { user_id, recipient_id }: { user_id: string; recipient_id: string },
): Promise<{
  data: IMessages[];
}> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select(
        "id, sender_id, recipient_id, message_type, content, media_url, file_name, file_size, duration, reply_to_message_id, is_edited, message_read_status, created_at",
      )
      .eq("sender_id", user_id)
      .eq("recipient_id", recipient_id)
      .eq("is_deleted", false);

    if (error) throw new Error(error.message);

    return { data };
  } catch (error: any) {
    throw new Error(error.message);
  }
}
