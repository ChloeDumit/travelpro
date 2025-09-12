import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PassengerFormData } from "../../types";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";

const passengerFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  passengerId: z.string().min(1, "El ID del pasajero es requerido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  dateOfBirth: z.string().min(1, "La fecha de nacimiento es requerida"),
});

interface PassengerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PassengerFormData) => void;
  loading?: boolean;
  initialData?: Partial<PassengerFormData>;
  title?: string;
}

export function PassengerForm({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  initialData,
  title = "Crear Pasajero",
}: PassengerFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PassengerFormData>({
    resolver: zodResolver(passengerFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      passengerId: initialData?.passengerId || "",
      email: initialData?.email || "",
      dateOfBirth: initialData?.dateOfBirth || "",
    },
  });

  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        name: "",
        passengerId: "",
        email: "",
        dateOfBirth: "",
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: PassengerFormData) => {
    onSubmit(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Nombre Completo *"
          {...register("name")}
          error={errors.name?.message}
          placeholder="Ingresa el nombre completo"
        />

        <Input
          label="ID/RUT del Pasajero *"
          {...register("passengerId")}
          error={errors.passengerId?.message}
          placeholder="Ingresa el ID o RUT"
        />

        <Input
          type="email"
          label="Email"
          {...register("email")}
          error={errors.email?.message}
          placeholder="email@ejemplo.com"
        />

        <Input
          type="date"
          label="Fecha de Nacimiento *"
          {...register("dateOfBirth")}
          error={errors.dateOfBirth?.message}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting || loading}>
            {isSubmitting || loading ? "Guardando..." : "Crear Pasajero"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
