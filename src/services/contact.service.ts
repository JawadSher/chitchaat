import { SupabaseClient } from "@supabase/supabase-js";

export async function findContact(
  supabase: SupabaseClient,
  { userName, userId }: { userName: string; userId: string | undefined },
) {
  try {
    const query = supabase
      .from("users_public")
      .select("*")
      .filter("user_id", "neq", userId)
      .ilike("username", `%${userName}%`)
      .eq("is_deleted", false)
      .order("username", { ascending: true })
      .limit(10);

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function sendConnectionToContact(
  supabase: SupabaseClient,
  {
    contact_id,
    senderName,
  }: {
    contact_id: string;
    senderName: string;
  },
) {
  try {
    const { error: contactErr } = await supabase.from("contacts").insert({
      contact_user_id: contact_id,
    });

    if (contactErr) {
      throw new Error(contactErr.message);
    }

    const { error: notificationError } = await supabase
      .from("notifications")
      .insert({
        contact_id,
        notification_type: "connect_request",
        title: "New Connection Request",
        body: `${senderName} wants to connect`,
        data: null,
      });

    if (notificationError) {
      throw new Error(notificationError.message);
    }

    return null;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getPendingContacts(
  supabase: SupabaseClient,
  { userId }: { userId: string },
) {
  try {
    const { data, error } = await supabase
      .from("contacts")
      .select(
        "*, info: users!contacts_contact_user_id_fkey(avatar_url, full_name)",
      )
      .eq("user_id", userId)
      .eq("status", "requested")
      .neq("is_deleted", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getContacts(
  supabase: SupabaseClient,
  { userId }: { userId: string },
) {
  try {
    const { data, error } = await supabase
      .from("contacts")
      .select("*, info: users!contacts_contact_user_id_fkey(avatar_url, full_name)")
      .eq("user_id", userId)
      .eq("status", "accepted")
      .neq("is_deleted", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
export async function getInvitations(
  supabase: SupabaseClient,
  { userId }: { userId: string },
) {
  try {
    const { data, error } = await supabase
      .from("contacts")
      .select("*, info: users!contacts_user_id_fkey(avatar_url, full_name)")
      .eq("contact_user_id", userId)
      .eq("status", "requested")
      .neq("is_deleted", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
