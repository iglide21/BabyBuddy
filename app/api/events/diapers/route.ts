import supabase from "@/src/lib/supabase";
import { NextResponse } from "next/server";

export const GET = async () => {
  const { data, error } = await supabase.from("diapers").select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};

export const POST = async (request: Request) => {
  const body = await request.json();

  const { data, error } = await supabase
    .from("diapers")
    .insert({
      ...body,
      baby_id: 1,
    })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};
