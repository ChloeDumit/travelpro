import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { ErrorMessage } from "../ui/error-message";
import { Save, X } from "lucide-react";
import { CurrencyRate } from "../../types";
import { companySettingsService } from "../../lib/services/company-settings.service";
import { useAsyncOperation } from "../../hooks/useAsyncOperation";

const currencyRateSchema = z.object({
  currency: z.string().min(1, "La moneda es requerida"),
  rate: z.number().min(0.0001, "La tasa debe ser mayor a 0"),
  isActive: z.boolean(),
});

type CurrencyRateFormData = z.infer<typeof currencyRateSchema>;

interface CurrencyRateFormProps {
  rate?: CurrencyRate | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CurrencyRateForm({
  rate,
  onSuccess,
  onCancel,
}: CurrencyRateFormProps) {
  const isEditing = !!rate;

  const addRateOp = useAsyncOperation(companySettingsService.addCurrencyRate);
  const updateRateOp = useAsyncOperation(
    companySettingsService.updateCurrencyRate
  );

  const form = useForm<CurrencyRateFormData>({
    resolver: zodResolver(currencyRateSchema),
    defaultValues: {
      currency: "",
      rate: 0,
      isActive: true,
    },
  });

  // Update form when rate changes (for editing)
  useEffect(() => {
    if (rate) {
      form.reset({
        currency: rate.currency,
        rate: rate.rate,
        isActive: rate.isActive,
      });
    } else {
      form.reset({
        currency: "",
        rate: 0,
        isActive: true,
      });
    }
  }, [rate, form]);

  const handleSubmit = async (data: CurrencyRateFormData) => {
    try {
      if (isEditing && rate) {
        // Update existing rate
        const response = await updateRateOp.execute(rate.id, data);
        console.log("Update rate response:", response);
        if (response?.data?.data) {
          onSuccess();
        }
      } else {
        // Add new rate
        const response = await addRateOp.execute(data);
        console.log("Add rate response:", response);
        if (response?.data?.data) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error saving currency rate:", error);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Editar Tasa" : "Nueva Tasa de Cambio"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Moneda *"
              {...form.register("currency")}
              error={form.formState.errors.currency?.message}
              disabled={isEditing}
            />
            <Input
              type="number"
              step="0.0001"
              label="Tasa a USD *"
              {...form.register("rate", { valueAsNumber: true })}
              error={form.formState.errors.rate?.message}
              placeholder="0.0000"
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                {...form.register("isActive")}
                className="rounded border-gray-300"
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                Activa
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={addRateOp.loading || updateRateOp.loading}
            >
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? "Actualizar" : "Guardar"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          </div>
        </form>

        {/* Error Messages */}
        {(addRateOp.error || updateRateOp.error) && (
          <ErrorMessage
            error={
              addRateOp.error ||
              updateRateOp.error ||
              "Error al procesar la solicitud"
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
