import { SupabaseClient } from "@supabase/supabase-js";

export async function sendCallSignal(
  supabase: SupabaseClient,
  { callee_id }: { callee_id: string },
) {
  try {
    const callChannel = supabase.channel(`incomming-call:${callee_id}`, {
      config: { private: true },
    });

    callChannel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        callChannel.send({
          type: "broadcast",
          event: "CALLING",
          payload: { message: "Someone is calling you" },
        });
      }
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}
