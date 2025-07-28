import { createClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sleeps")
    .select()
    .eq("id", Number(id))
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = await params;
  const body = await request.json();

  const supabase = await createClient();

  const { data: updatedData, error } = await supabase
    .from("sleeps")
    .update(body)
    .eq("id", Number(id))
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(updatedData);
};
