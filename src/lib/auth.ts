"use server";

import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export async function signInWithGoogle() {
  const supabase = await createClient();

  console.log(
    "process.env.NEXT_PUBLIC_APP_URL",
    process.env.NEXT_PUBLIC_APP_URL
  );

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `http://localhost:3000/api/auth/callback`,
    },
  });

  console.log("data", data);
  console.log("error", error);

  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
}
