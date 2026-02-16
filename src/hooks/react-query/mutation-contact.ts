import { capitalizeName } from "@/lib/capitalize-name";
import { useSupabase } from "@/providers/supabase-provider";
import {
  sendConnectionToContact,
  withdrawConnectionRequest,
} from "@/services/contact.service";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSendConnection = ({ setIsSended } : { setIsSended: (e: boolean) => void}) => {
  const supabase = useSupabase();
  const { user } = useUser();
  const client = useQueryClient();
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
      client.invalidateQueries({
        queryKey: ["get-pending-contacts", user?.id],
      });
      setIsSended(true)
      toast.success("Connection Sended Successfully.");
    },
  });
};

export const useWithdrawConnectionRequest = () => {
  const supabase = useSupabase();
  const client = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationKey: ["withdraw-connection-request"],
    mutationFn: async ({ contact_id }: { contact_id: string }) => {
      return await withdrawConnectionRequest(supabase, {
        contact_id,
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (_, variables) => {
      client.setQueryData(["get-pending-contacts", user?.id], (old: any) => {
        if (!old) return old;

        return old.filter(
          (contact: any) => contact.id !== variables.contact_id,
        );
      });

      toast.success("Connection request withdrawn successfully.");
    },
  });
};
