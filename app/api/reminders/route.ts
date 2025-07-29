import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import type { CreateReminder } from "@/types/data/reminders/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const babyId = searchParams.get("babyId");

    if (!babyId) {
      return NextResponse.json(
        { error: "Baby ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("reminders")
      .select()
      .eq("baby_id", babyId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: `Failed to fetch reminders: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateReminder = await request.json();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("reminders")
      .insert(body)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: `Failed to create reminder: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
