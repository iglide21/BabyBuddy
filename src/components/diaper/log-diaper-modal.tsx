"use client";

import { useMemo, useState } from "react";
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
import { CreateDiaper } from "@/types/data/diapers/types";
import { useApplicationStore } from "@/src/stores/applicationStore";
import { useCreateDiaper } from "@/src/hooks/data/mutations/useCreateDiaper";
import { useCurrentBabyStore } from "@/src/stores/currentBabyStore";
import DiaperModal from "./diaper-modal";
import { DateTimeField } from "@mui/x-date-pickers";

// Validation schema
const diaperFormSchema = z.object({
  type: z.enum(["wet", "dirty", "both"]),
  occurred_at: z.string().min(1, "Date is required"),
  note: z.string().optional(),
});

type DiaperFormData = z.infer<typeof diaperFormSchema>;

const LogDiaperModal = () => {
  const currentBaby = useCurrentBabyStore.use.currentBaby();
  const [showNotes, setShowNotes] = useState(false);

  const { mutate: createDiaper } = useCreateDiaper();
  const closeModal = useApplicationStore.use.closeModal();

  const form = useForm<DiaperFormData>({
    resolver: zodResolver(diaperFormSchema),
    defaultValues: {
      type: "wet",
      occurred_at: getNow().toISOString(),
      note: "",
    },
  });

  const onSubmit = (data: DiaperFormData) => {
    const { occurred_at, note, type } = data;

    const event: CreateDiaper = {
      occurred_at: occurred_at,
      type,
      note: note || "",
      color: null,
      baby_id: currentBaby?.id ?? "",
    };

    form.reset();
    createDiaper(event);
    closeModal();
  };

  const onClose = () => {
    form.reset();
    closeModal();
  };

  const getTypeEmoji = (diaperType: string) => {
    switch (diaperType) {
      case "wet":
        return "💧";
      case "dirty":
        return "💩";
      case "both":
        return "💧💩";
      default:
        return "👶";
    }
  };

  return (
    <DiaperModal onClose={onClose} action="log">
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
                <FormLabel className="text-sm font-medium">
                  Diaper Type
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-green-200 bg-green-100">
                      <RadioGroupItem value="wet" id="wet" />
                      <Label htmlFor="wet" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">💧</span>
                          <span>Wet only</span>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-green-200 bg-green-100">
                      <RadioGroupItem value="dirty" id="dirty" />
                      <Label htmlFor="dirty" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">💩</span>
                          <span>Dirty only</span>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-green-200 bg-green-100">
                      <RadioGroupItem value="both" id="both" />
                      <Label htmlFor="both" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">💧💩</span>
                          <span>Wet & Dirty</span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notes Toggle */}
          {!showNotes && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowNotes(true)}
              className="w-full text-gray-600"
            >
              + Add note (optional)
            </Button>
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
                      placeholder="e.g., blowout, rash noticed, used cream..."
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
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              Save Change {getTypeEmoji(form.watch("type"))}
            </Button>
          </div>
        </form>
      </Form>
    </DiaperModal>
  );
};

export default LogDiaperModal;
