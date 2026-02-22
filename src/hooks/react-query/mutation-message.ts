import { useSupabase } from "@/providers/supabase-provider";
import { sendMessage } from "@/services/message.service";
import { ISendMessageProps } from "@/types/send-message-props";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSendMessage = () => {
  const supabase = useSupabase();
  const { user } = useUser();
  return useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: async ({
      message_type,
      content,
      media_url,
      file_name,
      file_size,
      duration,
      reply_to_message_id,
      recipient_id,
    }: ISendMessageProps) => {
      console.log("recipient_id: ", recipient_id, "user_id: ", user?.id);

      return sendMessage(supabase, {
        sender_id: user?.id!,
        message_type,
        content,
        media_url,
        file_name,
        file_size,
        duration,
        reply_to_message_id,
        recipient_id,
      });
    },
    onError: (error) => {
      toast.error("Failed to send message: ", {
        description: error.message,
      });
    },
  });
};
