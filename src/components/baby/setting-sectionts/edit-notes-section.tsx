import { useBabyFromUrl } from "@/src/hooks";
import { Label, Textarea, Button } from "../../ui";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import type { UpdateBaby } from "@/types/data/babies/types";

const notesSchema = z.object({
  notes: z.string().optional().nullable(),
});

type NotesFormData = z.infer<typeof notesSchema>;

interface EditNotesSectionProps {
  onSubmit: (data: Partial<UpdateBaby>) => void;
  isSavePending: boolean;
}

const EditNotesSection = ({
  onSubmit,
  isSavePending,
}: EditNotesSectionProps) => {
  const { currentBaby } = useBabyFromUrl();

  const form = useForm<NotesFormData>({
    resolver: zodResolver(notesSchema),
    defaultValues: {
      notes: currentBaby?.notes || "",
    },
  });

  // Update form values when currentBaby changes
  useEffect(() => {
    if (currentBaby) {
      form.reset({
        notes: currentBaby.notes || "",
      });
    }
  }, [currentBaby, form]);

  const handleSubmit = (data: NotesFormData) => {
    const changedData: Partial<UpdateBaby> = {};

    if (data.notes !== currentBaby?.notes) {
      changedData.notes = data.notes;
    }

    if (Object.keys(changedData).length > 0) {
      onSubmit(changedData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                General Notes
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional information about your baby (preferences, habits, special needs, etc.)"
                  value={field.value || ""}
                  onChange={field.onChange}
                  className="border-purple-200 focus:border-purple-400"
                  rows={6}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            {isSavePending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditNotesSection;
