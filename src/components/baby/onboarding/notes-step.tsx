import { useFormContext } from "react-hook-form";
import { Textarea } from "components/ui";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "components/ui/form";

const NotesStep = () => {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <FormField
          control={control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>General Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional information about your baby (preferences, habits, special needs, etc.)"
                  className="border-purple-200 focus:border-purple-400"
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default NotesStep;
