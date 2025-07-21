import supabase from "@/src/lib/supabase";
import { CreateBaby } from "@/types/data/babies/types";
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

export const POST = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const body = await request.json();
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const headers = request.headers;
  const accessToken = headers.get("authorization")?.split(" ")[1];

  console.log("accessToken", accessToken);

  const { data: user, error: userError } = await supabase.auth.getUser(
    accessToken
  );

  if (userError || !user?.user) {
    console.log("userError", userError);
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
    console.log("babyDataError", babyDataError);
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
    console.log("babyGuardianError", babyGuardianError);
    return NextResponse.json(
      { error: babyGuardianError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(babyData);
};
