"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login({
  formData,
}: {
  formData: { email: string; password: string };
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  console.log(error);

  if (error) {
    redirect(`/error?CODE=${error.code}`)
  }

  return redirect("/");
}
