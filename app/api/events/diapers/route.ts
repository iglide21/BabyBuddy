import { createClient } from "@/src/lib/supabase/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("diapers").select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};

export const POST = async (request: Request) => {
  const body = await request.json();

  const supabase = await createClient();

  const { data, error } = await supabase.from("diapers").insert(body).select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};
