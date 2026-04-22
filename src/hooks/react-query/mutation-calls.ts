import { useSupabase } from "@/providers/supabase-provider";
import { sendCallSignal } from "@/services/call.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSendCallSignal = ({ callee_id }: { callee_id?: string }) => {
  const supabase = useSupabase();

  return useMutation({
    mutationKey: ["send-call-signal", callee_id],
    mutationFn: async ({calleeId} : { calleeId: string}) => {
      return await sendCallSignal(supabase, { callee_id: calleeId });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
