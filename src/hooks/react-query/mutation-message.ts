import { useSupabase } from "@/providers/supabase-provider";
import { deleteMessage, sendMessage } from "@/services/message.service";
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

      client.setQueryData(
        ["messages", variables.recipient_id],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any, index: number) => {
              if (index === 0) {
                return {
                  ...page,
                  data: [...page.data, optimisticMessage],
                };
              }

              return page;
            }),
          };
        },
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

export const useDeleteMessage = ({
  setOpen,
  recipient_id,
}: {
  setOpen: (e: boolean) => void;
  recipient_id: string;
}) => {
  const client = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationKey: ["deleteMessage"],
    mutationFn: async ({ message_id }: { message_id: string }) => {
      return deleteMessage(supabase, { message_id });
    },
    onError: (error) => {
      toast.error("Failed to delete message", {
        description: error.message,
      });
    },
    onSuccess: (_, { message_id }) => {
      client.setQueryData(["messages", recipient_id], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((msg: any) => msg.id !== message_id),
          })),
        };
      });

      setOpen(false);
      toast.success("Message deleted");
    },
  });
};
