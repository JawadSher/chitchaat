/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { verifyClerkWebhook } from "@/lib/verify-clerk-webhook";
import { NextRequest, NextResponse } from "next/server";

async function deleteUser({ user_id }: { user_id: string }) {
  const supabase = await createClient();

  const query = supabase
    .from("users")
    .update({ is_deleted: true })
    .eq("user_id", user_id)
    .select();

  const { error, data } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function addNewUser({
  user_id,
  username,
  avatar_url,
  email,
  full_name,
}: {
  user_id: string;
  username: string;
  avatar_url: string;
  email: string;
  full_name: string;
}) {
  const supabase = await createClient();

  const query = supabase
    .from("users")
    .insert({ user_id, username, avatar_url, email, full_name });

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function POST(request: NextRequest) {
  try {
    const { data, type } = await verifyClerkWebhook(request);

    if (type === "user.deleted") {
      await deleteUser({ user_id: data.id });
    } else if (type === "user.created") {
      const primaryEmail = data.email_addresses?.find(
        (e: any) => e.id === data.primary_email_address_id,
      )?.email_address;

      await addNewUser({
        user_id: data.id,
        username: data.username ?? null,
        full_name: [data.first_name, data.last_name].filter(Boolean).join(" "),
        email: primaryEmail,
        avatar_url: data.image_url ?? null,
      });
    }

    return new NextResponse("Ok", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 400 });
  }
}
