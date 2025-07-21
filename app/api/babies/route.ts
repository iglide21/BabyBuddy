import supabase from "@/src/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  console.log("userId", userId);

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("baby_guardians")
    .select("baby_id")
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: babies, error: babiesError } = await supabase
    .from("babies")
    .select()
    .in("id", data?.map((d) => d.baby_id) ?? []);

  if (babiesError) {
    return NextResponse.json({ error: babiesError.message }, { status: 500 });
  }

  return NextResponse.json(babies);
};
