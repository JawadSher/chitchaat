import { useSupabase } from "@/providers/supabase-provider";
import { sendMessage } from "@/services/message.service";
import { IMessages } from "@/types/messages";
import { ISendMessageProps } from "@/types/send-message-props";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSendMessage = () => {
  const supabase = useSupabase();
  const { user } = useUser();
  const client = useQueryClient();

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

    onMutate: async (variables) => {
      await client.cancelQueries({
        queryKey: ["messages", variables.recipient_id],
      });

      const previousMessages = client.getQueryData<{ data: IMessages[] }>([
        "messages",
        variables.recipient_id,
      ]);

      const optimisticMessage: IMessages = {
        id: crypto.randomUUID(),
        sender_id: user?.id!,
        recipient_id: variables.recipient_id!,
        message_type: variables.message_type,
        content: variables.content ?? "",
        media_url: variables.media_url,
        file_name: variables.file_name,
        file_size: variables.file_size,
        duration: variables.duration,
        reply_to_message_id: variables.reply_to_message_id,
        is_edited: false,
        message_read_status: "sent",
        created_at: new Date().toISOString(),
      };

      client.setQueryData<{ data: IMessages[] }>(
        ["messages", variables.recipient_id],
        (old) => ({
          data: [...(old?.data ?? []), optimisticMessage],
        }),
      );

      return { previousMessages };
    },

    onError: (error, variables, context) => {
      toast.error("Failed to send message", {
        description: error.message,
      });

      if (context?.previousMessages) {
        client.setQueryData(
          ["messages", variables.recipient_id],
          context.previousMessages,
        );
      }
    },

    onSettled: (_data, _error, variables) => {
      client.invalidateQueries({
        queryKey: ["messages", variables.recipient_id],
      });
    },
  });
};
