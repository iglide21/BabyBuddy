"use client";

import { useState } from "react";
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
import { CreateFeeding } from "@/types/data/feeding/types";
import { useApplicationStore } from "@/src/stores/applicationStore";
import { useCreateFeeding } from "@/src/hooks/data/mutations/useCreateFeeding";
import { useBabyFromUrl } from "@/src/hooks/useBabyFromUrl";
import FeedingModal from "./feeding-modal";
import { DateTimeField } from "@mui/x-date-pickers";
import AddNoteButton from "../add-note-button";
import { calculateDurationInMinutes } from "@/src/lib/calculations";
import BreastFeedingSegmentsField from "./breast-feeding-segments-field";
import { CreateBreastFeeding } from "@/types/breast-feedings";

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
      if (data.type === "breast") {
        return data.breast_feed.length > 0;
      }

      if (!data.duration_minutes || data.duration_minutes.trim() === "") {
        return false;
      }

      return true;
    },
    {
      message: "Feeding duration is required",
      path: ["duration_minutes", "breast_feed"],
    }
  )
  .superRefine((data, ctx) => {
    if (data.type === "breast") {
      if (data.breast_feed.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Atleast 1 segment is required when breastfeeding",
          path: ["breast_feed"],
        });
      }
    }

    if (data.type === "breast") {
      data.breast_feed.forEach((feed) => {
        const start = dayjs(feed.start_at);
        const end = dayjs(feed.end_at);
        if (end.isBefore(start) || end.isSame(start)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "End time must be after start time",
            path: ["breast_feed"],
          });
        }
      });
    }
  });

export type FeedingFormData = z.infer<typeof feedingFormSchema>;

const LogFeedingModal = () => {
  const { currentBaby } = useBabyFromUrl();
  const [showNotes, setShowNotes] = useState(false);
  const { mutate: createFeeding } = useCreateFeeding();
  const closeModal = useApplicationStore.use.closeModal();

  const form = useForm<FeedingFormData>({
    resolver: zodResolver(feedingFormSchema),
    defaultValues: {
      type: "bottle",
      occurred_at: getNow().toISOString(),
      amount_ml: "",
      duration_minutes: "",
      breast_feed: [],
      note: "",
    },
  });

  const watchedType = form.watch("type");

  const onSubmit = (data: FeedingFormData) => {
    const { occurred_at, amount_ml, note, type } = data;

    const durationInMinutes = calculateDurationInMinutes(data);

    const event: {
      feeding: CreateFeeding;
    } & { breast_feedings: CreateBreastFeeding[] } = {
      feeding: {
        occurred_at: occurred_at,
        type,
        amount_ml: amount_ml ? Number(amount_ml) : null,
        duration_minutes: durationInMinutes,
        note: note || null,
        baby_id: currentBaby?.id ?? "",
      },
      breast_feedings: data.breast_feed,
    };

    form.reset();
    createFeeding(event);
    closeModal();
  };

  const onClose = () => {
    form.reset();
    closeModal();
  };

  return (
    <FeedingModal onClose={onClose} action="log">
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
                  <FormLabel className="font-bold text-lg">
                    Feeding Type
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-orange-200 bg-orange-50">
                        <RadioGroupItem value="bottle" id="bottle" />
                        <Label
                          htmlFor="bottle"
                          className="flex-1 cursor-pointer"
                        >
                          🍼 Bottle
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-orange-200 bg-orange-50">
                        <RadioGroupItem value="breast" id="breast" />
                        <Label
                          htmlFor="breast"
                          className="flex-1 cursor-pointer"
                        >
                          🤱 Breast
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-orange-200 bg-orange-50">
                        <RadioGroupItem value="solid" id="solid" />
                        <Label
                          htmlFor="solid"
                          className="flex-1 cursor-pointer"
                        >
                          🥄 Solid Food
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {["bottle", "solid"].includes(watchedType) && (
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
                          placeholder="e.g., 4"
                          className="text-lg"
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

            {/* Notes Toggle */}
            {!showNotes && (
              <AddNoteButton
                setShowNotes={setShowNotes}
                className="border-orange-300 text-orange-700"
              />
            )}

            {/* Notes */}
            {showNotes && (
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Baby was very hungry, spit up a bit..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              >
                Save Feeding 🍼
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </FeedingModal>
  );
};

export default LogFeedingModal;
