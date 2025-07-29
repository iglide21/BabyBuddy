"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { RadioGroup, RadioGroupItem } from "components/ui/radio-group";
import { Bell, Clock, AlertCircle, Plus } from "lucide-react";
import dayjs from "lib/dayjs";
import type { ReminderType } from "@/types/data/reminders/types";
import { useApplicationStore } from "@/src/stores/applicationStore";
import { useCreateReminder } from "@/src/hooks/data/mutations/useCreateReminder";
import { useBabyFromUrl } from "@/src/hooks/useBabyFromUrl";
import { DateTimeField, TimeField } from "@mui/x-date-pickers";

// Validation schema
const reminderFormSchema = z
  .object({
    type: z.enum(["daily", "interval"]),
    label: z.string().min(1, "Reminder title is required"),
    start_time: z.string().min(1, "Start time is required"),
    end_time: z.string().min(1, "End time is required"),
    time_of_day: z.string().optional(),
    interval_minutes: z.number().optional(),
    is_active: z.boolean().default(true),
  })
  .refine(
    (data) => {
      if (data.type === "daily") {
        return !!data.time_of_day;
      }
      return data.type === "interval" ? !!data.interval_minutes : true;
    },
    {
      message:
        "Time of day is required for daily reminders, interval in minutes is required for interval reminders",
      path: ["time_of_day"],
    }
  )
  .refine(
    (data) => {
      const start = dayjs(data.start_time);
      const end = dayjs(data.end_time);
      return end.isAfter(start);
    },
    {
      message: "End time must be after start time",
      path: ["end_time"],
    }
  );

type ReminderFormData = z.infer<typeof reminderFormSchema>;

const LogReminderModal = () => {
  const { currentBaby } = useBabyFromUrl();
  const openedModal = useApplicationStore.use.currentModal();
  const isOpen = useMemo(
    () => openedModal?.type === "reminder_log",
    [openedModal]
  );

  const { mutate: createReminder, isPending } = useCreateReminder();
  const closeModal = useApplicationStore.use.closeModal();

  const form = useForm<ReminderFormData>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      type: "daily",
      label: "",
      start_time: dayjs().format("YYYY-MM-DD HH:mm"),
      end_time: dayjs().add(1, "year").format("YYYY-MM-DD HH:mm"),
      time_of_day: dayjs().set("hours", 12).set("minutes", 0).format("HH:mm"),
      interval_minutes: 180, // 3 hours
      is_active: true,
    },
  });

  const watchedType = form.watch("type");

  const onSubmit = (data: ReminderFormData) => {
    if (!currentBaby?.id) return;

    const reminder = {
      baby_id: currentBaby.id,
      type: data.type as ReminderType,
      label: data.label,
      start_time: data.start_time,
      end_time: data.end_time,
      time_of_day: data.type === "daily" ? data.time_of_day : null,
      interval_minutes: data.type === "interval" ? data.interval_minutes : null,
      is_active: data.is_active,
      created_at: dayjs().toISOString(),
    };

    createReminder(reminder, {
      onSuccess: () => {
        form.reset();
        closeModal();
      },
    });
  };

  const onClose = () => {
    form.reset();
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-0 p-0 rounded-xl">
        <DialogHeader className="p-4 bg-gradient-to-tr from-purple-400 to-purple-500 text-white rounded-t-xl">
          <DialogTitle className="flex items-center gap-3">
            <span className="bg-gradient-to-tr from-purple-300 to-purple-400 rounded-xl p-2">
              <Bell className="w-5 h-5" />
            </span>
            <span className="text-white text-xl font-bold">Add Reminder</span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Reminder Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium">
                      Reminder Type
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2 p-3 rounded-lg border border-purple-200 bg-purple-50">
                          <RadioGroupItem value="daily" id="daily" />
                          <Label
                            htmlFor="daily"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Daily reminder
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Remind me at the same time every day
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 rounded-lg border border-purple-200 bg-purple-50">
                          <RadioGroupItem value="interval" id="interval" />
                          <Label
                            htmlFor="interval"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              Interval reminder
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Remind me every X minutes
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Reminder Title */}
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Reminder Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Evening feeding time"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Time of Day (for daily reminders) */}
              {watchedType === "daily" && (
                <FormField
                  control={form.control}
                  name="time_of_day"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel className="text-sm font-medium">
                        Time of Day
                      </FormLabel>
                      <FormControl>
                        <TimeField
                          onChange={(value) => {
                            field.onChange(value?.format("HH:mm"));
                          }}
                          value={dayjs(field.value, "HH:mm")}
                          ampm={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Interval Minutes (for interval reminders) */}
              {watchedType === "interval" && (
                <FormField
                  control={form.control}
                  name="interval_minutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Interval (minutes)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="180"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Start Time */}
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-sm font-medium">
                      Start Date
                    </FormLabel>
                    <FormControl>
                      <DateTimeField
                        value={dayjs(field.value)}
                        onChange={(value) => {
                          field.onChange(value?.format("YYYY-MM-DD HH:mm"));
                        }}
                        ampm={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Time */}
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-sm font-medium">
                      End Date
                    </FormLabel>
                    <FormControl>
                      <DateTimeField
                        value={dayjs(field.value)}
                        onChange={(value) => {
                          field.onChange(value?.format("YYYY-MM-DD HH:mm"));
                        }}
                        ampm={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 bg-transparent"
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                  disabled={isPending}
                >
                  {isPending ? (
                    "Creating..."
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Reminder
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogReminderModal;
