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
