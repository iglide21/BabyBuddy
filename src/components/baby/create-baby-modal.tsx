import { useApplicationStore } from "@/src/stores/applicationStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, Label } from "../ui";
import { Input, RadioGroup, RadioGroupItem, Button } from "../ui";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { DialogFooter } from "../ui/dialog";
import dayjs from "lib/dayjs";
import type { CreateBaby } from "@/types/data/babies/types";
import { useCreateBaby } from "@/src/hooks/data/mutations/useCreateBaby";
import { cn } from "@/src/lib/utils";

// Validation schema
const babyFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    birthDate: z.string().min(1, "Birth date is required"),
    gender: z.enum(["male", "female", "other"]),
  })
  .refine(
    (data) => {
      const birthDate = dayjs(data.birthDate);
      const now = dayjs();

      if (birthDate.isAfter(now)) {
        return false;
      }

      return true;
    },
    {
      message: "Your little one is not yet born? Add them later!",
      path: ["birthDate"],
    }
  );

type BabyFormData = z.infer<typeof babyFormSchema>;

const CreateBabyModal = () => {
  const modal = useApplicationStore.use.currentModal();
  const closeModal = useApplicationStore.use.closeModal();

  const { mutate: createBaby, isPending } = useCreateBaby();

  const form = useForm<BabyFormData>({
    resolver: zodResolver(babyFormSchema),
    defaultValues: {
      name: "",
      birthDate: dayjs().format("YYYY-MM-DDTHH:mm"),
      gender: "male",
    },
  });

  const onSubmit = (data: BabyFormData) => {
    const baby: CreateBaby = {
      name: data.name,
      birth_date: data.birthDate,
      gender: data.gender,
    };
    createBaby(baby);
  };

  const onClose = () => {
    form.reset();
    closeModal();
  };

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];

  return (
    <Dialog open={modal?.type === "create_baby"} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto p-0 border-none">
        <DialogHeader className="bg-gradient-to-r from-pink-400 to-purple-400 text-white p-6">
          <DialogTitle className="flex items-center gap-2">
            Create Baby Profile
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 flex flex-col gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium">
                      Baby's Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="babyName"
                        type="text"
                        placeholder="Enter baby's name"
                        required
                        className="pl-10 border-gray-300 focus:border-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium">
                      Birth Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="birthDate"
                        type="datetime-local"
                        required
                        className="pl-10 border-gray-300 focus:border-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium">
                      Gender
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        className="flex flex-row gap-2"
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        {genderOptions.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-2 p-3 rounded-lg border border-gray-300 bg-gray-100 cursor-pointer"
                          >
                            <RadioGroupItem
                              value={option.value}
                              id={option.value}
                            />
                            <Label
                              htmlFor={option.value}
                              className="flex-1 cursor-pointer"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className={cn(
                    "w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white",
                    isPending && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={isPending}
                >
                  {isPending ? "Creating..." : "Create Baby"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBabyModal;
