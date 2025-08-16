import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";

export const GET = async (
  _: NextRequest,
  { params }: { params: { id: number } }
) => {
  const { id } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("feedings")
    .select(`
      *,
      breastfeeding_segments (
        id,
        side,
        start_at,
        end_at
      )
      `)
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: number } }
) => {
  const { id } = await params;
  const body = await request.json();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("feedings")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};

export const DELETE = async (
  _: NextRequest,
  { params }: { params: { id: number } }
) => {
  const { id } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("feedings")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};
