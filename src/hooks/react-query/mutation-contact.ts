import { capitalizeName } from "@/lib/capitalize-name";
import { useSupabase } from "@/providers/supabase-provider";
import { sendConnectionToContact } from "@/services/contact.service";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSendConnection = () => {
  const supabase = useSupabase();
  const { user } = useUser();

  return useMutation({
    mutationKey: ["send-connection"],
    mutationFn: async ({ contact_id }: { contact_id: string }) => {
      return await sendConnectionToContact(supabase, {
        contact_id,
        senderName: capitalizeName({ name: user?.fullName! }),
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Connection Sended Successfully.");
    },
  });
};
