import { NextRequest, NextResponse } from "next/server";
import { getTodayString, getStartOfDay, getEndOfDay } from "lib/dayjs";
import { createClient } from "@/src/lib/supabase/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const babyId = searchParams.get("babyId");
  const date = searchParams.get("date"); // Optional date parameter

  if (!babyId) {
    return NextResponse.json({ error: "Baby ID is required" }, { status: 400 });
  }

  // If no date is provided, default to today
  const targetDate = date || getTodayString();

  // Get start and end of the target date
  const startOfDay = getStartOfDay(targetDate);
  const endOfDay = getEndOfDay(targetDate);

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("all_events_view")
    .select()
    .eq("baby_id", babyId)
    .gte("occurred_at", startOfDay.toISOString())
    .lte("occurred_at", endOfDay.toISOString())
    .order("occurred_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return NextResponse.json(data);
};
