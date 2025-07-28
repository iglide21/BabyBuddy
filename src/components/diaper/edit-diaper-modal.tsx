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
import dayjs from "lib/dayjs";
import DiaperModal from "./diaper-modal";
import { useApplicationStore } from "@/src/stores/applicationStore";
import { Diaper, UpdateDiaper } from "@/types/data/diapers/types";
import { useUpdateDiaper } from "@/src/hooks/data/mutations";
import { useDiaper } from "@/src/hooks/data/queries";
import { DateTimeField } from "@mui/x-date-pickers";

// Validation schema
const diaperFormSchema = z.object({
  type: z.enum(["wet", "dirty", "both"]),
  occurred_at: z.string().min(1, "Date is required"),
  note: z.string().optional(),
});

type DiaperFormData = z.infer<typeof diaperFormSchema>;

const EditDiaperModal = () => {
  const openedModal = useApplicationStore.use.currentModal();
  const closeModal = useApplicationStore.use.closeModal();
  const { mutate: updateDiaper } = useUpdateDiaper();

  const isOpen = useMemo(
    () => openedModal?.type === "diaper_edit",
    [openedModal]
  );

  const { data: diaper, status } = useDiaper(
    openedModal?.data?.eventId,
    isOpen
  );

  const form = useForm<DiaperFormData>({
    resolver: zodResolver(diaperFormSchema),
  });

  // Populate form when diaper changes
  useEffect(() => {
    if (diaper) {
      form.reset({
        type: diaper.type,
        occurred_at: diaper.occurred_at,
        note: diaper.note || "",
      });
    }

    return () => {
      form.reset();
    };
  }, [diaper, form]);

  const onSubmit = (data: DiaperFormData) => {
    if (!diaper) return;

    const updatedLog: UpdateDiaper = {
      id: diaper.id,
      note: data.note || undefined,
      type: data.type,
      occurred_at: data.occurred_at,
    };

    updateDiaper(updatedLog, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const handleDelete = () => {
    if (!diaper) return;
    if (confirm("Are you sure you want to delete this diaper entry?")) {
      // onDelete(diaper.id);
      closeModal();
    }
  };

  const onClose = () => {
    form.reset();
    closeModal();
  };

  const getTypeEmoji = (diaperType: Diaper["type"]) => {
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

  if (!isOpen) return null;

  return (
    <DiaperModal onClose={onClose} action="edit">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

          <FormField
            control={form.control}
            name="type"
            disabled={status === "pending"}
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
                    {[
                      {
                        type: "wet",
                        emoji: "💧",
                        label: "Wet only",
                      },
                      {
                        type: "dirty",
                        emoji: "💩",
                        label: "Dirty only",
                      },
                      {
                        type: "both",
                        emoji: "💧💩",
                        label: "Wet & Dirty",
                      },
                    ].map(({ type, emoji, label }) => (
                      <div
                        key={type}
                        className="flex items-center space-x-2 p-3 rounded-lg border border-green-200 bg-green-100"
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

          {/* Notes */}
          {form.watch("note") ? (
            <FormField
              control={form.control}
              name="note"
              disabled={status === "pending"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={status === "pending"}
                      placeholder="e.g., blowout, rash noticed, used cream..."
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
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              disabled={status === "pending"}
            >
              Save Changes {getTypeEmoji(form.watch("type"))}
            </Button>
          </div>
        </form>
      </Form>
    </DiaperModal>
  );
};

export default EditDiaperModal;
