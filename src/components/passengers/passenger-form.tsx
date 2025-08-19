import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardContent } from "../ui/card";
import { PassengerFormData } from "../../types";

const passengerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  passengerId: z.string().min(1, "Passenger ID is required"),
  email: z.string().email("Invalid email address").or(z.literal("")).optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

type PassengerFormValues = z.infer<typeof passengerFormSchema>;

interface PassengerFormProps {
  onSubmit: (data: PassengerFormData) => void;
  initialData?: Partial<PassengerFormData>;
  submitLabel?: string;
}

export function PassengerForm({
  onSubmit,
  initialData,
  submitLabel = "Save",
}: PassengerFormProps) {
  const form = useForm<PassengerFormValues>({
    resolver: zodResolver(passengerFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      passengerId: initialData?.passengerId || "",
      email: initialData?.email || "",
      dateOfBirth: initialData?.dateOfBirth || "",
    },
  });

  return (
    <Card>
      <CardHeader />
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <Input
            label="Nombre *"
            {...form.register("name")}
            error={form.formState.errors.name?.message}
          />
          <Input
            label="ID/Pasaporte"
            {...form.register("passengerId")}
            error={form.formState.errors.passengerId?.message}
          />
          <Input
            label="Email"
            type="email"
            {...form.register("email")}
            error={form.formState.errors.email?.message}
          />
          <Input
            label="Fecha de Nacimiento"
            {...form.register("dateOfBirth")}
            error={form.formState.errors.dateOfBirth?.message}
          />
          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Guardando..." : submitLabel}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
