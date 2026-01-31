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

export async function POST(request: NextRequest) {
  try {
    const { data, type } = await verifyClerkWebhook(request);

    if (type === "user.deleted") {
      await deleteUser({ user_id: data.id });
    }

    return new NextResponse("Ok", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 400 });
  }
}
