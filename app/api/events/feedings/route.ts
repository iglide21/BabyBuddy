import { createClient } from "@/src/lib/supabase/server";
import { CreateBreastFeeding } from "@/types/breast-feedings";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const babyId = searchParams.get("babyId");
  const supabase = await createClient();

  if (!babyId) {
    const { data, error } = await supabase.from("feedings").select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  }

  const { data, error } = await supabase
    .from("feedings")
    .select()
    .eq("baby_id", babyId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const supabase = await createClient();

  const { data: feedingData, error } = await supabase
    .from("feedings")
    .insert(body.feeding)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if(body.breast_feedings.length > 0) {
    const { data: user, error: userError } = await supabase.auth.getUser();

    if(userError || !user?.user) {
      return NextResponse.json({ error: userError?.message || "User not found" }, { status: 401 });
    }

    const breastFeedings = body.breast_feedings.map(
      (bf: CreateBreastFeeding) => ({
        ...bf,
        baby_id: body.feeding.baby_id,
        feeding_id: feedingData?.[0]?.id,
        user_id: user.user.id,
      })
    );

    const { data: breastFeedingsData, error: breastFeedingsError } =
      await supabase.from("breastfeeding_segments").upsert(breastFeedings).select();

    if (breastFeedingsError) {
      return NextResponse.json(
        { error: breastFeedingsError.message },
        { status: 500 }
      );
    }
  }



  return NextResponse.json({
    feeding: feedingData
  });
};
