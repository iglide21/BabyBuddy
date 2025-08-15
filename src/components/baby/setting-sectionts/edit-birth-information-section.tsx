import {
  SelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  Label,
  Input,
  Button,
} from "../../ui";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Ruler, Weight } from "lucide-react";
import { useBabyFromUrl } from "@/src/hooks/useBabyFromUrl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import type { UpdateBaby } from "@/types/data/babies/types";

const birthInformationSchema = z.object({
  birth_weight: z
    .number()
    .min(0, "Weight must be positive")
    .optional()
    .nullable(),
  birth_length: z
    .number()
    .min(0, "Length must be positive")
    .optional()
    .nullable(),
  blood_type: z
    .enum([
      "A",
      "B",
      "AB",
      "O",
      "A+",
      "A-",
      "B+",
      "B-",
      "AB+",
      "AB-",
      "O+",
      "O-",
    ])
    .optional()
    .nullable(),
});

type BirthInformationFormData = z.infer<typeof birthInformationSchema>;

interface EditBirthInformationSectionProps {
  onSubmit: (data: Partial<UpdateBaby>) => void;
  isSavePending: boolean;
}

const EditBirthInformationSection = ({
  onSubmit,
  isSavePending,
}: EditBirthInformationSectionProps) => {
  const { currentBaby } = useBabyFromUrl();

  const form = useForm<BirthInformationFormData>({
    resolver: zodResolver(birthInformationSchema),
    defaultValues: {
      birth_weight: currentBaby?.birth_weight || null,
      birth_length: currentBaby?.birth_length || null,
      blood_type: currentBaby?.blood_type || null,
    },
  });

  // Update form values when currentBaby changes
  useEffect(() => {
    if (currentBaby) {
      form.reset({
        birth_weight: currentBaby.birth_weight || null,
        birth_length: currentBaby.birth_length || null,
        blood_type: currentBaby.blood_type || null,
      });
    }
  }, [currentBaby, form]);

  const handleSubmit = (data: BirthInformationFormData) => {
    const changedData: Partial<UpdateBaby> = {};

    if (data.birth_weight !== currentBaby?.birth_weight) {
      changedData.birth_weight = data.birth_weight;
    }
    if (data.birth_length !== currentBaby?.birth_length) {
      changedData.birth_length = data.birth_length;
    }
    if (data.blood_type !== currentBaby?.blood_type) {
      changedData.blood_type = data.blood_type;
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
            name="birth_weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold flex items-center gap-2">
                  <Weight className="w-4 h-4" />
                  Birth Weight (kg)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 7.5"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value
                          ? Number.parseFloat(e.target.value)
                          : null
                      )
                    }
                    className="border-red-200 focus:border-red-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birth_length"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  Birth Length (cm)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 20.5"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value
                          ? Number.parseFloat(e.target.value)
                          : null
                      )
                    }
                    className="border-red-200 focus:border-red-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="blood_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Blood Type
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger className="border-red-200 focus:border-red-400">
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="submit"
            disabled={!form.formState.isDirty || isSavePending}
          >
            {isSavePending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditBirthInformationSection;
