import { IMessages } from "@/types/messages";
import { PaginationType } from "@/types/pagination";
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
  {
    user_id,
    recipient_id,
    page,
    limit,
  }: { user_id: string; recipient_id: string; page: number; limit: number },
): Promise<{
  data: IMessages[];
  pagination: PaginationType;
}> {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("messages")
      .select(
        "id, sender_id, recipient_id, message_type, content, media_url, file_name, file_size, duration, reply_to_message_id, is_edited, message_read_status, created_at",
        {
          count: "exact",
        },
      )
      .or(
        `and(sender_id.eq.${user_id},recipient_id.eq.${recipient_id}),and(sender_id.eq.${recipient_id},recipient_id.eq.${user_id})`,
      )
      .eq("is_deleted", false)
      .range(from, to)
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data: data ?? [],
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}
