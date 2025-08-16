"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "components/ui/button";
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
import { Moon, Play } from "lucide-react";
import dayjs, { getNow } from "lib/dayjs";
import { CreateSleep } from "@/types/data/sleeps/types";
import { useApplicationStore } from "@/src/stores/applicationStore";
import { useCreateSleep } from "@/src/hooks/data/mutations/useCreateSleep";
import { useBabyFromUrl } from "@/src/hooks/useBabyFromUrl";
import { DateTimeField } from "@mui/x-date-pickers";
import AddNoteButton from "../add-note-button";

// Validation schema
const sleepFormSchema = z
  .object({
    logType: z.enum(["start", "complete"]),
    start_date: z.string().min(1, "Start date is required"),
    duration_minutes: z.number(),
    end_date: z.string().optional(),
    note: z.string().optional(),
  })
  .refine(
    (data) => {
      const start = dayjs(data.start_date);
      const end = dayjs(data.end_date);
      const diff = end.diff(start, "minute", true);

      return data.logType === "complete" ? diff >= 1 : true;
    },
    {
      message: "End date is required for complete sleep",
      path: ["end_date"],
    }
  );

type SleepFormData = z.infer<typeof sleepFormSchema>;

const LogSleepModal = () => {
  const { currentBaby } = useBabyFromUrl();
  const [showNotes, setShowNotes] = useState(false);
  const openedModal = useApplicationStore.use.currentModal();
  const isOpen = useMemo(
    () => openedModal?.type === "sleep_log",
    [openedModal]
  );

  const { mutate: createSleep } = useCreateSleep();
  const closeModal = useApplicationStore.use.closeModal();

  const form = useForm<SleepFormData>({
    resolver: zodResolver(sleepFormSchema),
    defaultValues: {
      logType: "complete",
      start_date: getNow().toString(),
      end_date: getNow().add(1, "hour").toString(),
      duration_minutes: 0,
      note: "",
    },
  });

  const watchedLogType = form.watch("logType");

  const onSubmit = (data: SleepFormData) => {
    const { logType, start_date, end_date, note } = data;

    if (logType === "start") {
      // Start a new sleep session
      const event: CreateSleep = {
        start_date: dayjs(data.start_date).toISOString(),
        duration_minutes: 0, // Will be calculated when sleep ends
        end_date: null,
        note: note || null,
        baby_id: currentBaby?.id ?? "",
      };

      form.reset();
      createSleep(event);
      closeModal();
    } else {
      // Log a complete sleep session
      const start = dayjs(start_date);
      const end = dayjs(end_date!);
      const duration = Math.round(end.diff(start, "minute", true));

      const event: CreateSleep = {
        start_date: start.toISOString(),
        end_date: end.toISOString(),
        duration_minutes: duration,
        note: note || null,
        baby_id: currentBaby?.id ?? "",
      };

      form.reset();
      createSleep(event);
      closeModal();
    }
  };

  const onClose = () => {
    form.reset();
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm max-h-[80vh] h-70vh mx-0 p-0 rounded-xl overflow-y-scroll">
        <DialogHeader className="p-4 bg-gradient-to-tr from-blue-400 to-blue-500 text-white rounded-t-xl">
          <DialogTitle className="flex items-center gap-3">
            <span className="bg-gradient-to-tr from-blue-300 to-blue-400 rounded-xl p-2">
              <Moon className="w-5 h-5" />
            </span>
            <span className="text-white text-xl font-bold">Log Sleep</span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Log Type */}
              <FormField
                control={form.control}
                name="logType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium">
                      What would you like to do?
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2 p-3 rounded-lg border border-blue-200 bg-blue-50">
                          <RadioGroupItem value="start" id="start" />
                          <Label
                            htmlFor="start"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Play className="w-4 h-4" />
                              Start sleep tracking
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Baby just fell asleep
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 rounded-lg border border-blue-200 bg-blue-50">
                          <RadioGroupItem value="complete" id="complete" />
                          <Label
                            htmlFor="complete"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Moon className="w-4 h-4" />
                              Log completed sleep
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Sleep session already finished
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date and Time Inputs for Complete Sleep */}
              {watchedLogType === "complete" && (
                <>
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-sm font-medium">
                          Start Time
                        </FormLabel>
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

                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-sm font-medium">
                          End Time
                        </FormLabel>
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
                </>
              )}

              {/* Notes Toggle */}
              {!showNotes && (
                <AddNoteButton
                  setShowNotes={setShowNotes}
                  className="border-blue-300 text-blue-600"
                />
              )}

              {/* Notes */}
              {showNotes && (
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
                          placeholder="e.g., sleep in crib, very fussy before sleep..."
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
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {watchedLogType === "start" ? (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Sleep 😴
                    </>
                  ) : (
                    <>Save Sleep 🌙</>
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

export default LogSleepModal;
