import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormControl, FormMessage } from "../ui/form";
import { FeedingFormData } from "./log-feeding-modal";
import { X } from "lucide-react";
import dayjs from "dayjs";
import { DateTimeField } from "@mui/x-date-pickers";
import { Button } from "../ui/button";
import { useState } from "react";
import { Label, RadioGroup, RadioGroupItem } from "../ui";
import { calculateBreastFeedingDuration } from "@/src/lib/calculations";

const BreastFeedingSegmentsField = () => {
  const [breastFeeding, setBreastFeeding] = useState<
    FeedingFormData["breast_feed"][number]
  >({
    side: "left",
    start_at: dayjs().toISOString(),
    end_at: dayjs().add(10, "minutes").toISOString(),
  });

  const form = useFormContext<FeedingFormData>();

  const watchedType = form.watch("type");

  if (watchedType !== "breast") return null;

  return (
    <FormField
      control={form.control}
      name="breast_feed"
      render={({ field }) => (
        <FormItem className="space-y-4">
          {field?.value?.length > 0 && (
            <div className="text-sm text-gray-500 space-y-4">
              <h2 className="text-sm font-medium">Logged segments</h2>
              <div className="flex flex-col gap-2">
                {field?.value?.map((segment, idx) => (
                  <div
                    className="flex flex-row justify-between border border-gray-200 rounded-md p-2 items-center"
                    key={segment.side + idx}
                  >
                    <div className="flex flex-row gap-2">
                      <span className="capitalize">{segment.side}</span> breast:{" "}
                      {dayjs(segment.start_at).format("HH:mm")} -{" "}
                      {dayjs(segment.end_at).format("HH:mm")} (
                      {dayjs(segment.end_at).diff(
                        dayjs(segment.start_at),
                        "minutes"
                      )}
                      min)
                    </div>
                    <X
                      className="w-4 h-4 text-red-500"
                      onClick={() => {
                        field.onChange(field.value.filter((_, i) => i !== idx));
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-row gap-2">
                <span>Total duration:</span>
                <span>{calculateBreastFeedingDuration(field.value)} min</span>
              </div>
            </div>
          )}

          <FormControl>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-4">
                <Label className="text-sm font-medium">Start Time</Label>
                <DateTimeField
                  value={dayjs(breastFeeding.start_at)}
                  onChange={(value) => {
                    setBreastFeeding({
                      ...breastFeeding,
                      start_at: value?.toISOString() ?? "",
                    });
                  }}
                  ampm={false}
                />

                <Label className="text-sm font-medium">End Time</Label>
                <DateTimeField
                  value={dayjs(breastFeeding.end_at)}
                  onChange={(value) => {
                    setBreastFeeding({
                      ...breastFeeding,
                      end_at: value?.toISOString() ?? "",
                    });
                  }}
                  ampm={false}
                />

                <Label className="text-sm font-medium">Side</Label>
                <RadioGroup
                  className="flex flex-row gap-2"
                  defaultValue="left"
                  onValueChange={(value) => {
                    setBreastFeeding({
                      ...breastFeeding,
                      side: value as "left" | "right",
                    });
                  }}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="left" id="r1" />
                    <Label htmlFor="r1">Left</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="right" id="r2" />
                    <Label htmlFor="r2">Right</Label>
                  </div>
                </RadioGroup>

                <FormMessage />

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    if (
                      dayjs(breastFeeding.end_at).diff(
                        dayjs(breastFeeding.start_at),
                        "minutes"
                      ) < 0.1
                    ) {
                      form.setError("breast_feed", {
                        message: "End time must be after start time",
                      });
                      return;
                    } else {
                      form.clearErrors("breast_feed");

                      field.onChange([
                        ...field.value,
                        {
                          side: breastFeeding.side,
                          start_at: breastFeeding.start_at,
                          end_at: breastFeeding.end_at,
                        },
                      ]);

                      setBreastFeeding({
                        side: "left",
                        start_at: breastFeeding.end_at,
                        end_at: dayjs(breastFeeding.end_at)
                          .add(10, "minutes")
                          .toISOString(),
                      });
                    }
                  }}
                >
                  Add Breast Feeding Segment
                </Button>
              </div>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default BreastFeedingSegmentsField;
