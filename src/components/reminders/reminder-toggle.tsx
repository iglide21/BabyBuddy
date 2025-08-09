"use client";

import { Switch } from "components/ui/switch";
import { toast } from "sonner";
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
          toast.success(`Reminder ${checked ? "enabled" : "disabled"}`);
        },
        onError: (error) => {
          toast.error(`Failed to update reminder: ${error.message}`);
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
