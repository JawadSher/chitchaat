import { SupabaseClient } from "@supabase/supabase-js";

export async function sendCallSignal(
  supabase: SupabaseClient,
  { callee_id }: { callee_id: string },
) {
  try {
    console.log("----> Callee_id: ", callee_id)
    const callChannel = supabase.channel(`incomming-call:${callee_id}`, {
      config: { private: false },
    });

    const response = await callChannel.send({
      type: "broadcast",
      event: "CALLING",
      payload: {
        message: "Someone is calling you",
        timestamp: new Date().toISOString(),
      },
    });

    console.log("Call signal sent:", response);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
