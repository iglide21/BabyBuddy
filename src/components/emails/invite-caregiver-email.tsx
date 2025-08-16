import * as React from "react";
import { Button, Html } from "@react-email/components";

interface InviteCaregiverEmailProps {
  caregiverEmail: string;
  babyName: string;
  inviteLink: string;
}

const InviteCaregiverEmail = ({
  caregiverEmail,
  babyName,
  inviteLink,
}: InviteCaregiverEmailProps) => {
  return (
    <Html lang="en">
      <h1>Hey, {caregiverEmail}!</h1>
      <p>You've been invited to join BabyMax and collaborate on {babyName}.</p>
      <Button href={inviteLink}>Accept invite</Button>
      <p>
        If you don't have an account, you can create one by clicking the button
        above.
      </p>
      <p>
        If you have any questions, please contact us at{" "}
        <a href="mailto:support@babymax.app">support@babymax.app</a>.
      </p>
    </Html>
  );
};

export default InviteCaregiverEmail;
