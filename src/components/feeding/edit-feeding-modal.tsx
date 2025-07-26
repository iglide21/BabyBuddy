"use client";

import { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
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
import { Milk, Trash2 } from "lucide-react";
import dayjs from "lib/dayjs";
import { useApplicationStore } from "@/src/stores/applicationStore";
import { Feeding, UpdateFeeding } from "@/types/data/feeding/types";
import useUpdateFeeding from "@/src/hooks/data/mutations/useUpdateFeeding";
import useFeeding from "@/src/hooks/data/queries/useFeeding";

// Validation schema
const feedingFormSchema = z.object({
  type: z.enum(["breast", "bottle", "solid"]),
  occurred_at: z.string().min(1, "Date is required"),
  amount: z.number().optional(),
  duration_minutes: z.number().optional(),
  note: z.string().optional(),
});

type FeedingFormData = z.infer<typeof feedingFormSchema>;

const EditFeedingModal = () => {
  const openedModal = useApplicationStore.use.currentModal();
  const closeModal = useApplicationStore.use.closeModal();
  const { mutate: updateFeeding } = useUpdateFeeding();

  const isOpen = useMemo(
    () => openedModal?.type === "feeding_edit",
    [openedModal]
  );

  const { data: feeding, status } = useFeeding(openedModal?.data?.eventId);

  const form = useForm<FeedingFormData>({
    resolver: zodResolver(feedingFormSchema),
    defaultValues: {
      type: "bottle",
      occurred_at: "",
      amount: undefined,
      duration_minutes: undefined,
      note: "",
    },
  });

  // Populate form when feeding changes
  useEffect(() => {
    if (feeding) {
      form.reset({
        type: feeding.type,
        occurred_at: dayjs(feeding.occurred_at).format("YYYY-MM-DDTHH:mm"),
        amount: feeding.amount || undefined,
        duration_minutes: feeding.duration_minutes || undefined,
        note: feeding.note || "",
      });
    }

    return () => {
      form.reset();
    };
  }, [feeding, form]);

  const onSubmit = (data: FeedingFormData) => {
    if (!feeding) return;

    const updatedLog: UpdateFeeding = {
      type: data.type,
      occurred_at: dayjs(data.occurred_at).toISOString(),
      amount: data.amount || undefined,
      duration_minutes: data.duration_minutes || undefined,
      note: data.note || undefined,
    };

    updateFeeding(updatedLog, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const handleDelete = () => {
    if (!feeding) return;
    if (confirm("Are you sure you want to delete this feeding entry?")) {
      // onDelete(feeding.id);
      closeModal();
    }
  };

  const onClose = () => {
    form.reset();
    closeModal();
  };

  const getTypeEmoji = (feedingType: Feeding["type"]) => {
    switch (feedingType) {
      case "bottle":
        return "🍼";
      case "breast":
        return "🤱";
      case "solid":
        return "🥄";
      default:
        return "🍼";
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-0 p-0 rounded-xl">
        <DialogHeader className="p-4 bg-gradient-to-tr from-orange-400 to-orange-500 text-white rounded-t-xl">
          <DialogTitle className="flex items-center gap-3">
            <span className="bg-gradient-to-tr from-orange-300 to-orange-400 rounded-xl p-2">
              <Milk className="w-5 h-5" />
            </span>
            <span className="text-white text-xl font-bold">Edit Feeding</span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Date and Time */}
              <FormField
                control={form.control}
                name="occurred_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Time</FormLabel>
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

              {/* Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium">
                      Feeding Type
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-2"
                      >
                        {[
                          {
                            type: "bottle",
                            emoji: "🍼",
                            label: "Bottle",
                          },
                          {
                            type: "breast",
                            emoji: "🤱",
                            label: "Breast",
                          },
                          {
                            type: "solid",
                            emoji: "🥄",
                            label: "Solid Food",
                          },
                        ].map(({ type, emoji, label }) => (
                          <div
                            key={type}
                            className="flex items-center space-x-2 p-3 rounded-lg border border-orange-200 bg-orange-100"
                          >
                            <RadioGroupItem
                              value={type}
                              id={type}
                              disabled={status === "pending"}
                            />
                            <Label
                              htmlFor={type}
                              className="flex-1 cursor-pointer disabled:cursor-not-allowed"
                            >
                              <div className="flex items-center gap-2 cursor-pointer">
                                <span className="text-lg">{emoji}</span>
                                <span>{label}</span>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Amount/Duration */}
              {form.watch("type") === "bottle" && (
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Amount (oz)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.5"
                          placeholder="e.g., 4"
                          className="text-lg"
                          disabled={status === "pending"}
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch("type") === "breast" && (
                <FormField
                  control={form.control}
                  name="duration_minutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Duration (minutes)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 15"
                          className="text-lg"
                          disabled={status === "pending"}
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

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
                          placeholder="e.g., Baby was very hungry, spit up a bit..."
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
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={status === "pending"}
                >
                  Save Changes {getTypeEmoji(form.watch("type"))}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditFeedingModal;
