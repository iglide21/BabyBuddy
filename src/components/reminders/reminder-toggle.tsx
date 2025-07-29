"use client";

import { Switch } from "components/ui/switch";
import { toast } from "@/src/hooks/use-toast";
import { useUpdateReminder } from "@/src/hooks/data/mutations/useUpdateReminder";
import type { Reminder } from "@/types/data/reminders/types";

interface ReminderToggleProps {
  reminder: Reminder;
  className?: string;
}

const ReminderToggle = ({ reminder, className }: ReminderToggleProps) => {
  const { mutate: updateReminder, isPending } = useUpdateReminder();

  const handleToggle = (checked: boolean) => {
    updateReminder(
      {
        id: reminder.id,
        reminder: {
          is_active: checked,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: `Reminder ${checked ? "enabled" : "disabled"}`,
            variant: "default",
          });
        },
        onError: (error) => {
          toast({
            title: "Failed to update reminder",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Switch
      checked={reminder.is_active}
      onCheckedChange={handleToggle}
      disabled={isPending}
      className={className}
    />
  );
};

export default ReminderToggle;
