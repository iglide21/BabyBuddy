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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { RadioGroup, RadioGroupItem } from "components/ui/radio-group";
import dayjs, { getNow } from "lib/dayjs";
import { useApplicationStore } from "@/src/stores/applicationStore";
import { Feeding, UpdateFeeding } from "@/types/data/feeding/types";
import { useUpdateFeeding } from "@/src/hooks/data/mutations";
import { useFeeding } from "@/src/hooks/data/queries";
import FeedingModal from "./feeding-modal";
import { DateTimeField } from "@mui/x-date-pickers";
import BreastFeedingSegmentsField from "./breast-feeding-segments-field";

// Validation schema
const feedingFormSchema = z
  .object({
    type: z.enum(["breast", "bottle", "solid"]),
    occurred_at: z.string().min(1, "Date is required"),
    amount_ml: z.string().optional(),
    duration_minutes: z.string().optional(),
    breast_feed: z.array(
      z.object({
        side: z.enum(["left", "right"]),
        start_at: z.string().min(1, "Start time is required"),
        end_at: z.string().min(1, "End time is required"),
      })
    ),
    note: z.string().optional(),
  })
  .refine(
    (data) => {
      // For bottle and solid feeding, amount_ml is required
      if (
        (data.type === "bottle" || data.type === "solid") &&
        (!data.amount_ml || data.amount_ml.trim() === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Amount is required for bottle or solid feeding",
      path: ["amount_ml"],
    }
  )
  .refine(
    (data) => {
      // For breast feeding, duration_minutes is required
      if (!data.duration_minutes || data.duration_minutes.trim() === "") {
        return false;
      }
      return true;
    },
    {
      message: "Feeding duration is required",
      path: ["duration_minutes"],
    }
  );

type FeedingFormData = z.infer<typeof feedingFormSchema>;

const EditFeedingModal = () => {
  const openedModal = useApplicationStore.use.currentModal();
  const closeModal = useApplicationStore.use.closeModal();
  const { mutate: updateFeeding } = useUpdateFeeding();

  const isOpen = useMemo(
    () => openedModal?.type === "feeding_edit",
    [openedModal]
  );

  const { data: feeding, status } = useFeeding(
    openedModal?.data?.eventId,
    isOpen
  );

  const form = useForm<FeedingFormData>({
    resolver: zodResolver(feedingFormSchema),
    defaultValues: {
      type: "bottle",
      occurred_at: getNow().toISOString(),
      amount_ml: "",
      duration_minutes: "",
      note: "",
      breast_feed: [],
    },
  });

  const type = form.watch("type");

  // Populate form when feeding changes
  useEffect(() => {
    if (feeding) {
      form.reset({
        type: feeding.type,
        occurred_at: feeding.occurred_at,
        amount_ml: feeding.amount_ml?.toString() || "",
        duration_minutes: feeding.duration_minutes?.toString() || "",
        note: feeding.note || "",
        breast_feed: feeding.breastfeeding_segments || [],
      });
    }

    return () => {
      form.reset();
    };
  }, [feeding, form]);

  const onSubmit = (data: FeedingFormData) => {
    if (!feeding) return;

    const updatedLog: UpdateFeeding = {
      id: feeding.id,
      type: data.type,
      occurred_at: data.occurred_at,
      amount_ml:
        data.type === "breast"
          ? null
          : data.amount_ml
            ? Number(data.amount_ml)
            : null,
      duration_minutes: data.duration_minutes
        ? Number(data.duration_minutes)
        : null,
      note: data.note || null,
    };

    updateFeeding(updatedLog, {
      onSuccess: () => {
        closeModal();
      },
    });
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
    <FeedingModal onClose={onClose} action="edit">
      <div className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Date and Time */}
            <FormField
              control={form.control}
              name="occurred_at"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="text-sm font-medium">Time</FormLabel>
                  <FormControl>
                    <DateTimeField
                      value={dayjs(field.value)}
                      onChange={(value) => {
                        field.onChange(value?.toISOString());
                      }}
                      ampm={false}
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

            {["bottle", "solid"].includes(type) && (
              <>
                <FormField
                  control={form.control}
                  name="amount_ml"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Amount (ml)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.5"
                          placeholder="e.g., 120"
                          className="text-lg"
                          disabled={status === "pending"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <BreastFeedingSegmentsField />

            {/* Notes */}
            {form.watch("note") ? (
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Notes</FormLabel>
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
    </FeedingModal>
  );
};

export default EditFeedingModal;
