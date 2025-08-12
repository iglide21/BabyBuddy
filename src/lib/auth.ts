"use server";

import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signUpWithEmail(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/email-confirmation`,
    },
  });
}

export async function signInWithEmailOtp(email: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
  });

  console.log("--------------------------------");
  console.log("data", data);
  console.log("error", error);
  console.log("--------------------------------");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
