import { NextRequest, NextResponse } from "next/server";
import supabase from "@/src/lib/supabase";

export const GET = async (
  request: NextRequest,
  { params }: { params: { babyId: string } }
) => {
  // const { searchParams } = new URL(request.url);
  // const userId = searchParams.get("userId");
  const babyId = params.babyId;

  if (!babyId) {
    return NextResponse.json({ error: "Baby ID is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("babies")
    .select()
    .eq("id", babyId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};
