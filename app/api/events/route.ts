import supabase from "@/src/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const babyId = searchParams.get("babyId");

  if (!babyId) {
    return NextResponse.json({ error: "Baby ID is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("all_events_view")
    .select()
    .eq("baby_id", Number(babyId))
    .order("created_at", { ascending: false });

  console.log(error);

  if (error) {
    throw new Error(error.message);
  }

  return NextResponse.json(data);
};
