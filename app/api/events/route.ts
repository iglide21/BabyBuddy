import supabase from "@/src/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const babyId = searchParams.get("babyId");
  const date = searchParams.get("date"); // Optional date parameter

  if (!babyId) {
    return NextResponse.json({ error: "Baby ID is required" }, { status: 400 });
  }

  // If no date is provided, default to today
  const targetDate = date || new Date().toISOString().split("T")[0];

  // Get start and end of the target date
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("all_events_view")
    .select()
    .eq("baby_id", Number(babyId))
    .gte("occurred_at", startOfDay.toISOString())
    .lte("occurred_at", endOfDay.toISOString())
    .order("occurred_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return NextResponse.json(data);
};
