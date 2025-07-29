import { NextRequest, NextResponse } from "next/server";
import dayjs, { getTodayString, getStartOfDay, getEndOfDay } from "lib/dayjs";
import { createClient } from "@/src/lib/supabase/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const babyId = searchParams.get("babyId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const tzStartDate = startDate ? dayjs(startDate).toISOString() : null;
  const tzEndDate = endDate ? dayjs(endDate).toISOString() : null;

  if (!babyId) {
    return NextResponse.json({ error: "Baby ID is required" }, { status: 400 });
  }

  const supabase = await createClient();

  let query = supabase.from("all_events_view").select().eq("baby_id", babyId);

  if (tzStartDate) {
    query = query.gte("occurred_at", tzStartDate);
  }

  if (tzEndDate) {
    query = query.lte("occurred_at", tzEndDate);
  }

  query = query.order("occurred_at", { ascending: false });
  const { data, error } = await query.select();

  if (error) {
    throw new Error(error.message);
  }

  return NextResponse.json(data);
};
