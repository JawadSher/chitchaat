import { sendConnectionToContact } from "@/server-actions/contact.action";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSendConnection = () => {
  return useMutation({
    mutationKey: ["send-connection"],
    mutationFn: async ({ contact_id }: { contact_id: string }) => {
      return await sendConnectionToContact({ contact_id });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Connection Sended Successfully.");
    },
  });
};
