import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SaleItemFormData, ItemStatus, Currency } from '../../types';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';

const saleItemFormSchema = z.object({
  classification: z.string().min(1, 'La clasificación es requerida'),
  provider: z.string().min(1, 'El proveedor es requerido'),
  operator: z.string().min(1, 'El operador es requerido'),
  dateIn: z.string().min(1, 'La fecha de entrada es requerida'),
  dateOut: z.string().min(1, 'La fecha de salida es requerida'),
  passengerCount: z.number().min(1, 'Se requiere al menos 1 pasajero'),
  status: z.enum(['pending', 'confirmed', 'cancelled']),
  description: z.string().min(1, 'La descripción es requerida'),
  salePrice: z.number().min(0, 'El precio de venta debe ser positivo'),
  saleCurrency: z.enum(['USD', 'EUR', 'local']),
  costPrice: z.number().min(0, 'El precio de costo debe ser positivo'),
  costCurrency: z.enum(['USD', 'EUR', 'local']),
  reservationCode: z.string().optional(),
  paymentDate: z.string().optional().nullable(),
});

interface SaleItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<SaleItemFormData>;
  setItems: (items: SaleItemFormData[]) => void;
  items: SaleItemFormData[];
}

export function SaleItemForm({ isOpen, onClose,  initialData, setItems, items }: SaleItemFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SaleItemFormData>({
    resolver: zodResolver(saleItemFormSchema),
    defaultValues: {
      classification: initialData?.classification || '',
      provider: initialData?.provider || '',
      operator: initialData?.operator || '',
      dateIn: initialData?.dateIn || '',
      dateOut: initialData?.dateOut || '',
      passengerCount: initialData?.passengerCount || 1,
      status: initialData?.status || 'pending',
      description: initialData?.description || '',
      salePrice: initialData?.salePrice || 0,
      saleCurrency: initialData?.saleCurrency || 'USD',
      costPrice: initialData?.costPrice || 0,
      costCurrency: initialData?.costCurrency || 'USD',
      reservationCode: initialData?.reservationCode || '',
      paymentDate: initialData?.paymentDate || null,
    },
  });

  const statusOptions = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'cancelled', label: 'Cancelado' },
  ];

  const currencyOptions = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'local', label: 'Moneda Local' },
  ];

  const handleFormSubmit = (data: SaleItemFormData) => {
    setItems([...items, data]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Item de Venta' : 'Agregar Item de Venta'}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Clasificación"
            {...register('classification')}
            error={errors.classification?.message}
          />
          <Input
            label="Proveedor"
            {...register('provider')}
            error={errors.provider?.message}
          />
          <Input
            label="Operador"
            {...register('operator')}
            error={errors.operator?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="date"
            label="Fecha de Entrada"
            {...register('dateIn')}
            error={errors.dateIn?.message}
          />
          <Input
            type="date"
            label="Fecha de Salida"
            {...register('dateOut')}
            error={errors.dateOut?.message}
          />
          <Input
            type="number"
            label="Número de Pasajeros"
            min={1}
            {...register('passengerCount', { valueAsNumber: true })}
            error={errors.passengerCount?.message}
          />
        </div>

        <Select
          label="Estado"
          options={statusOptions}
          {...register('status')}
          error={errors.status?.message}
        />

        <div className="space-y-1">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="description"
          >
            Descripción
          </label>
          <textarea
            id="description"
            className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
            {...register('description')}
          />
          {errors.description?.message && (
            <p className="text-xs text-danger-500">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              label="Precio de Venta"
              min={0}
              step={0.01}
              {...register('salePrice', { valueAsNumber: true })}
              error={errors.salePrice?.message}
            />
            <Select
              label="Moneda"
              options={currencyOptions}
              {...register('saleCurrency')}
              error={errors.saleCurrency?.message}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              label="Precio de Costo"
              min={0}
              step={0.01}
              {...register('costPrice', { valueAsNumber: true })}
              error={errors.costPrice?.message}
            />
            <Select
              label="Moneda"
              options={currencyOptions}
              {...register('costCurrency')}
              error={errors.costCurrency?.message}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Código de Reserva"
            {...register('reservationCode')}
            error={errors.reservationCode?.message}
          />
          <Input
            type="date"
            label="Fecha de Pago (Opcional)"
            {...register('paymentDate')}
            error={errors.paymentDate?.message}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : initialData ? 'Guardar Cambios' : 'Agregar Item'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}