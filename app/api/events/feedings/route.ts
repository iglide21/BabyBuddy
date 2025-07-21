import supabase from "@/src/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const babyId = searchParams.get("babyId");

  if (!babyId) {
    const { data, error } = await supabase.from("feedings").select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  }

  const { data, error } = await supabase
    .from("feedings")
    .select()
    .eq("baby_id", babyId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const { data, error } = await supabase.from("feedings").insert(body).select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};
