import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { babyId: string } }
) => {
  // const { searchParams } = new URL(request.url);
  // const userId = searchParams.get("userId");
  const babyId = (await params).babyId;

  if (!babyId) {
    return NextResponse.json({ error: "Baby ID is required" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("babies")
    .select()
    .eq("id", babyId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};
