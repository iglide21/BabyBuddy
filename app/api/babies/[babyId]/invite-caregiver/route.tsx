import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import InviteCaregiverEmail from "@/src/components/emails/invite-caregiver-email";
import { createClient } from "@/src/lib/supabase/server";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export const GET = async (req: NextRequest) => {
  const supabase = await createClient(true);

  const { searchParams } = new URL(req.url);
  const babyId = searchParams.get("babyId");
  const caregiverEmail = searchParams.get("caregiverEmail");

  if (!babyId) {
    return NextResponse.json({ error: "Baby ID is required" }, { status: 400 });
  }

  if (!caregiverEmail) {
    return NextResponse.json(
      { error: "Caregiver email is required" },
      { status: 400 }
    );
  }

  const { data: user, error: userError } = await supabase.rpc(
    "get_user_id_by_email",
    {
      p_email: caregiverEmail,
    }
  );

  if (userError) {
    console.log("userError", userError);

    // navigate him to here again
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?redirectTo=${process.env.NEXT_PUBLIC_APP_URL}/api/babies/${babyId}/invite-caregiver?babyId=${babyId}&caregiverEmail=${caregiverEmail}`
    );
  } else {
    console.log("user", user);
    // add user as guardian
    const { data: guardian, error: guardianError } = await supabase
      .from("baby_guardians")
      .insert({
        baby_id: babyId,
        user_id: user.id,
      });

    if (guardianError) {
      return NextResponse.json(
        { error: guardianError.message },
        { status: 400 }
      );
    }

    // redirect to babies page
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/babies`);
  }
};

export const POST = async (req: NextRequest) => {
  const { email, babyId, babyName } = await req.json();
  const supabase = await createClient(true);

  const { data: user, error: userError } = await supabase.rpc(
    "get_user_id_by_email",
    {
      p_email: "mellowparadisee@gmail.com",
    }
  );

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 400 });
  }

  const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/babies/${babyId}/invite-caregiver?babyId=${babyId}&caregiverEmail=${email}`;

  const { data, error } = await resend.emails.send({
    from: "BabyMax <noreply@babymax.app>",
    to: [email],
    subject: `You've been invited to collaborate on baby ${babyName}`,
    react: (
      <InviteCaregiverEmail
        caregiverEmail={email}
        babyName={babyName}
        inviteLink={inviteLink}
      />
    ),
  });

  console.log(error);
  console.log(data);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Invite sent", data });
};
