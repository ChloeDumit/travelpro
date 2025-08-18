import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardContent } from "../ui/card";
import { SupplierFormData } from "../../types";

const supplierFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type SupplierFormValues = z.infer<typeof supplierFormSchema>;

interface SupplierFormProps {
  onSubmit: (data: SupplierFormData) => void;
  initialData?: Partial<SupplierFormData>;
  submitLabel?: string;
}

export function SupplierForm({
  onSubmit,
  initialData,
  submitLabel = "Save",
}: SupplierFormProps) {
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: initialData?.name || "",
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
