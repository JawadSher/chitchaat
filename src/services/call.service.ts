import { API } from "@/constants/routes";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getLiveKitToken({
  RN = ""
}: {
  RN?: string | null;
}): Promise<{
  token: string;
  roomName: string;
} | null> {
  const res = await fetch(API.LIVE_KIT, {
    method: "POST",
    body: JSON.stringify({ roomName: RN }),
  });

  if (!res) return null;

  const { token, roomName } = await res?.json();

  return { token, roomName };
}
export async function sendCallSignal(
  supabase: SupabaseClient,
  {
    user_id,
    callee_id,
    call_type,
    caller_id,
    call_mode,
    call_status,
  }: {
    user_id: string;
    callee_id: string;
    call_type: "audio" | "video";
    caller_id: string;
    call_mode: "direct" | "group";
    call_status: "ringing" | "close";
  },
) {
  try {
    const { data, error } = await supabase
      .from("contacts")
      .select("user_id, contact_user_id, status, is_deleted")
      .eq("user_id", caller_id)
      .eq("contact_user_id", callee_id)
      .eq("status", "accepted")
      .eq("is_deleted", false)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("Calls are allowed for contacts only.");
    }

    if (call_status === "ringing") {
      const { error: is_in_call_error, data: is_in_call_data } = await supabase
        .from("users_public")
        .select("user_id, is_in_call")
        .eq("user_id", callee_id);

      if (is_in_call_error) throw new Error(is_in_call_error.message);
      if (is_in_call_data[0].is_in_call)
        throw new Error("The user is busy on another call.");
    }

    const callChannel = supabase.channel(`incomming-call:${callee_id}`, {
      config: { private: false },
    });

    let roomName = null;
    let token = null;
    if (call_status === "ringing") {
      const result = await getLiveKitToken({});
      if (!result) {
        throw new Error("Failed to create a call session");
      }
      const { token: TN, roomName: RN } = result;
      roomName = RN;
      token = TN;
    }

    const [, channel_Res] = await Promise.all([
      supabase
        .from("users")
        .update({ is_in_call: call_status === "close" ? false : true })
        .eq("user_id", user_id),

      callChannel.send({
        type: "broadcast",
        event: "CALL",
        payload: {
          caller_id,
          call_type,
          callDirection: "outgoing",
          call_mode,
          call_status,
          roomName,
        },
      }),
    ]);

    return { channel_Res, token, roomName };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateIsInCall(
  supabase: SupabaseClient,
  { user_id, is_in_call }: { user_id: string; is_in_call: boolean },
) {
  try {
    await supabase.from("users").update({ is_in_call }).eq("user_id", user_id);

    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
