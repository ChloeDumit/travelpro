import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassificationFormData, Classification } from "../../types";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const classificationFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
});

interface ClassificationFormProps {
  onSubmit: (data: ClassificationFormData) => void;
  loading?: boolean;
  initialData?: Classification;
}

export function ClassificationForm({
  onSubmit,
  loading = false,
  initialData,
}: ClassificationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassificationFormData>({
    resolver: zodResolver(classificationFormSchema),
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? "Editar Clasificación" : "Nueva Clasificación"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nombre"
            {...register("name")}
            error={errors.name?.message}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading
                ? "Guardando..."
                : initialData
                ? "Guardar Cambios"
                : "Crear Clasificación"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
