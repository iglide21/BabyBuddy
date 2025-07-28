"use client";

import { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import { Moon, Trash2 } from "lucide-react";
import dayjs from "lib/dayjs";
import { useApplicationStore } from "@/src/stores/applicationStore";
import { UpdateSleep } from "@/types/data/sleeps/types";
import { useUpdateSleep } from "@/src/hooks/data/mutations";
import { useSleep } from "@/src/hooks/data/queries";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";

// Validation schema
const sleepFormSchema = z
  .object({
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    note: z.string().optional(),
  })
  .refine(
    (data) => {
      const start = dayjs(data.start_date);
      const end = dayjs(data.end_date);
      const diff = end.diff(start, "minute", true);

      return diff >= 1;
    },
    {
      message: "End date must be after start date",
    }
  );

type SleepFormData = z.infer<typeof sleepFormSchema>;

const EditSleepModal = () => {
  const openedModal = useApplicationStore.use.currentModal();
  const closeModal = useApplicationStore.use.closeModal();
  const { mutate: updateSleep } = useUpdateSleep();

  const isOpen = useMemo(
    () => openedModal?.type === "sleep_edit",
    [openedModal]
  );

  const { data: sleep, status } = useSleep(openedModal?.data?.eventId, isOpen);

  const form = useForm<SleepFormData>({
    resolver: zodResolver(sleepFormSchema),
    defaultValues: {
      start_date: sleep?.start_date
        ? dayjs(sleep.start_date).format("YYYY-MM-DDTHH:mm")
        : "",
      end_date: sleep?.end_date
        ? dayjs(sleep.end_date).format("YYYY-MM-DDTHH:mm")
        : "",
      note: sleep?.note || "",
    },
  });

  // Populate form when sleep changes
  useEffect(() => {
    if (sleep) {
      form.reset({
        start_date: dayjs(sleep.start_date).format("YYYY-MM-DDTHH:mm"),
        end_date: sleep.end_date
          ? dayjs(sleep.end_date).format("YYYY-MM-DDTHH:mm")
          : "",
        note: sleep.note || "",
      });
    }

    return () => {
      form.reset();
    };
  }, [sleep, form]);

  const onSubmit = (data: SleepFormData) => {
    if (!sleep) return;

    const start = dayjs(data.start_date);
    const end = dayjs(data.end_date);
    const duration = Math.round(end.diff(start, "minute", true));

    const updatedLog: UpdateSleep = {
      id: sleep.id,
      start_date: start.toISOString(),
      end_date: end.toISOString(),
      duration_minutes: duration,
      note: data.note || undefined,
    };

    updateSleep(updatedLog, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const handleDelete = () => {
    if (!sleep) return;
    if (confirm("Are you sure you want to delete this sleep entry?")) {
      // onDelete(sleep.id);
      closeModal();
    }
  };

  const onClose = () => {
    form.reset();
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-0 p-0 rounded-xl">
        <DialogHeader className="p-4 bg-gradient-to-tr from-blue-400 to-blue-500 text-white rounded-t-xl">
          <DialogTitle className="flex items-center gap-3">
            <span className="bg-gradient-to-tr from-blue-300 to-blue-400 rounded-xl p-2">
              <Moon className="w-5 h-5" />
            </span>
            <span className="text-white text-xl font-bold">Edit Sleep</span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Start Date and Time */}
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Start Time
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        className="text-lg"
                        {...field}
                        disabled={status === "pending"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Date and Time */}
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      End Time
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        className="text-lg"
                        {...field}
                        disabled={status === "pending"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes */}
              {form.watch("note") ? (
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Notes
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={status === "pending"}
                          placeholder="e.g., sleep in crib, very fussy before sleep..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => form.setValue("note", "My note")}
                  className="w-full text-gray-600"
                >
                  + Add note (optional)
                </Button>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 bg-transparent"
                  disabled={status === "pending"}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  className="px-3"
                  disabled={status === "pending"}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={status === "pending"}
                >
                  Save Changes 🌙
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditSleepModal;
