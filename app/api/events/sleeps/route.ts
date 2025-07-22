import { createClient } from "@/src/lib/supabase/server";
import { CreateSleep } from "@/types/data/sleeps/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("naps").select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};

export const POST = async (request: NextRequest) => {
  const body: CreateSleep = await request.json();

  const supabase = await createClient();

  const { data, error } = await supabase.from("naps").insert(body).select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};
