import { useSupabase } from "@/providers/supabase-provider";
import { sendCallSignal, updateIsInCall } from "@/services/call.service";
import { useCallRNDState } from "@/store/use-call-rnd";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSendCallSignal = ({
  callee_id,
  setIsRinging,
}: {
  callee_id?: string;
  setIsRinging: (v: boolean) => void;
}) => {
  const supabase = useSupabase();
  const { user } = useUser();
  const setDisableCallRND = useCallRNDState((state) => state.setDisableCallRND);
  const updateLiveKitInfo = useCallRNDState((state) => state.updateLiveKitInfo);

  return useMutation({
    mutationKey: ["send-call-signal", callee_id],
    mutationFn: async ({
      calleeId,
      callType,
      call_status,
    }: {
      calleeId: string;
      callType: "audio" | "video";
      call_status: "ringing" | "close" | "missed" | "accepted";
    }) => {
      return await sendCallSignal(supabase, {
        user_id: user?.id!,
        callee_id: calleeId,
        caller_id: user?.id!,
        call_type: callType,
        call_mode: "direct",
        call_status,
      });
    },
    onSuccess: (res: any, variables) => {
      const { roomName, token } = res;
      updateLiveKitInfo({ roomName, token });
      setIsRinging(variables.call_status === "ringing");
    },
    onError: (error) => {
      toast.error(error.message);
      setDisableCallRND();
    },
  });
};

export const useUpdateIsInCall = () => {
  const supabase = useSupabase();
  const { user } = useUser();

  return useMutation({
    mutationKey: ["update-is-in-call"],
    mutationFn: async ({ is_in_call }: { is_in_call: boolean }) => {
      return await updateIsInCall(supabase, { user_id: user?.id!, is_in_call });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
