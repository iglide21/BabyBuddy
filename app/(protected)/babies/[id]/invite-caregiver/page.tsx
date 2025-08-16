"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/src/components/ui/form";
import { useBabyFromUrl } from "@/src/hooks/useBabyFromUrl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Input } from "@/src/components/ui";
import z from "zod";
import { toast } from "sonner";

const inviteCaregiverSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type InviteCaregiverFormData = z.infer<typeof inviteCaregiverSchema>;

const InviteCaregiverPage = () => {
  const { currentBaby } = useBabyFromUrl();

  const form = useForm<InviteCaregiverFormData>({
    resolver: zodResolver(inviteCaregiverSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: InviteCaregiverFormData) => {
    const { email } = data;

    fetch(`/api/babies/${currentBaby?.id}/invite-caregiver`, {
      method: "POST",
      body: JSON.stringify({
        email,
        babyId: currentBaby?.id,
        babyName: currentBaby?.name,
      }),
    }).then((res) => {
      if (res.ok) {
        toast.success("Invite sent");
        console.log(res.json());
      } else {
        toast.error("Failed to invite caregiver");
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50 p-4">
      <div className="flex flex-col items-center justify-center space-y-2">
        <h1 className="text-4xl font-bold mb-4">You need some help?</h1>
        <h2 className="text-xl font-bold">Invite Caregiver</h2>
        <p className="text-sm text-gray-500">
          Invite a caregiver to collaborate on your baby's data
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Invite
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default InviteCaregiverPage;
