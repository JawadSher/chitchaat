import { useSupabase } from "@/providers/supabase-provider";
import { sendCallSignal } from "@/services/call.service";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSendCallSignal = ({ callee_id, setIsRinging }: { callee_id?: string, setIsRinging: (v:boolean) => void; }) => {
  const supabase = useSupabase();
  const user = useUser();

  return useMutation({
    mutationKey: ["send-call-signal", callee_id],
    mutationFn: async ({
      calleeId,
      callType,
    }: {
      calleeId: string;
      callType: "audio" | "video";
    }) => {
      return await sendCallSignal(supabase, {
        callee_id: calleeId,
        call_type: callType,
        caller_id: user.user?.id!,
        call_mode: "direct"
      });
    },
    onSuccess: () => {
      setIsRinging(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
