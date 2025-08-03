import { Input, Label, Button } from "../../ui";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { useBabyFromUrl } from "@/src/hooks/useBabyFromUrl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import type { UpdateBaby } from "@/types/data/babies/types";

const currentMeasurementsSchema = z.object({
  current_weight: z
    .number()
    .min(0, "Weight must be positive")
    .optional()
    .nullable(),
  current_length: z
    .number()
    .min(0, "Length must be positive")
    .optional()
    .nullable(),
  head_circumference: z
    .number()
    .min(0, "Head circumference must be positive")
    .optional()
    .nullable(),
});

type CurrentMeasurementsFormData = z.infer<typeof currentMeasurementsSchema>;

interface EditCurrentMeasurementsSectionProps {
  onSubmit: (data: Partial<UpdateBaby>) => void;
  isSavePending: boolean;
}

const EditCurrentMeasurementsSection = ({
  onSubmit,
  isSavePending,
}: EditCurrentMeasurementsSectionProps) => {
  const { currentBaby } = useBabyFromUrl();

  const form = useForm<CurrentMeasurementsFormData>({
    resolver: zodResolver(currentMeasurementsSchema),
    defaultValues: {
      current_weight: currentBaby?.current_weight || null,
      current_length: currentBaby?.current_length || null,
      head_circumference: currentBaby?.head_circumference || null,
    },
  });

  // Update form values when currentBaby changes
  useEffect(() => {
    if (currentBaby) {
      form.reset({
        current_weight: currentBaby.current_weight || null,
        current_length: currentBaby.current_length || null,
        head_circumference: currentBaby.head_circumference || null,
      });
    }
  }, [currentBaby, form]);

  const handleSubmit = (data: CurrentMeasurementsFormData) => {
    const changedData: Partial<UpdateBaby> = {};

    if (data.current_weight !== currentBaby?.current_weight) {
      changedData.current_weight = data.current_weight;
    }
    if (data.current_length !== currentBaby?.current_length) {
      changedData.current_length = data.current_length;
    }
    if (data.head_circumference !== currentBaby?.head_circumference) {
      changedData.head_circumference = data.head_circumference;
    }

    if (Object.keys(changedData).length > 0) {
      onSubmit(changedData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="current_weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Current Weight (kg)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 15.2"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value
                          ? Number.parseFloat(e.target.value)
                          : null
                      )
                    }
                    className="border-blue-200 focus:border-blue-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="current_length"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Current Length (cm)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 28.5"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value
                          ? Number.parseFloat(e.target.value)
                          : null
                      )
                    }
                    className="border-blue-200 focus:border-blue-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="head_circumference"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Head Circumference (cm)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 16.8"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value
                          ? Number.parseFloat(e.target.value)
                          : null
                      )
                    }
                    className="border-blue-200 focus:border-blue-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            disabled={isSavePending}
          >
            {isSavePending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditCurrentMeasurementsSection;
