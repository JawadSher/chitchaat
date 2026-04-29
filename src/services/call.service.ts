import { SupabaseClient } from "@supabase/supabase-js";

export async function sendCallSignal(
  supabase: SupabaseClient,
  {
    callee_id,
    call_type,
    caller_id,
    call_mode,
    call_status
  }: {
    callee_id: string;
    call_type: "audio" | "video";
    caller_id: string;
    call_mode: "direct" | "group";
    call_status: "ringing" | "close"
  },
) {
  try {
    const {data, error} = await supabase
      .from("contacts")
      .select("user_id, contact_user_id, status, is_deleted")
      .eq("user_id", caller_id)
      .eq("contact_user_id", callee_id)
      .eq("status", "accepted")
      .eq("is_deleted", false)
      .maybeSingle();
    
    if(error){
      throw new Error(error.message);
    }

    if(!data){
      throw new Error("Calls are allowed for contacts only.");
    }

    const callChannel = supabase.channel(`incomming-call:${callee_id}`, {
      config: { private: false },
    });

    const response = await callChannel.send({
      type: "broadcast",
      event: "CALL",
      payload: {
        caller_id,
        call_type,
        callDirection: "outgoing",
        call_mode,
        call_status
      },
    });

    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
