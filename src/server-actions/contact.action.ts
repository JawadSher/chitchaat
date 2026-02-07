"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";

export async function findContact({ userName }: { userName: string }) {
  try {
    const { userId } = await auth();
    const supabase = await supabaseServer();
    const query = supabase
      .from("users")
      .select("user_id,full_name,username,avatar_url")
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

export async function sendConnectionToContact({
  contact_id,
}: {
  contact_id: string;
}) {
  try {
    const { userId, has } = await auth();
    const supabase = await supabaseServer();

    const { error: contactErr } = await supabase.from("contacts").insert({
      user_id: userId,
      contact_user_id: contact_id,
      status: "requested",
      is_deleted: false,
    });

    if (contactErr) {
      throw new Error(contactErr.message);
    }

    const { error: notificationError } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        notification_type: "connect_request",
        title: "New Connection Request",
        body: `${has.name} wants to connect`,
        data: "",
      });

    if (notificationError) {
      throw new Error(notificationError.message);
    }

    return null;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
