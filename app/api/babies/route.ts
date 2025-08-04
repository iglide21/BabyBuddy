import { createClient } from "@/src/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();

  if (!user?.user || userError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("baby_guardians")
    .select("baby_id")
    .eq("user_id", user?.user?.id);

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

export const POST = async (request: NextRequest) => {
  const body = await request.json();

  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user?.user) {
    return NextResponse.json(
      { error: userError?.message || "User not found" },
      { status: 401 }
    );
  }

  // Create baby
  const { data: babyData, error: babyDataError } = await supabase
    .from("babies")
    .insert(body)
    .select();

  if (babyDataError) {
    return NextResponse.json({ error: babyDataError.message }, { status: 500 });
  }

  const { data: babyGuardian, error: babyGuardianError } = await supabase
    .from("baby_guardians")
    .insert({
      user_id: user.user.id,
      baby_id: babyData[0].id,
      role: "parent",
    })
    .select();

  if (babyGuardianError) {
    return NextResponse.json(
      { error: babyGuardianError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(babyData);
};
