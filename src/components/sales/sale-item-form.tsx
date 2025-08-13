import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SaleItemFormData, ItemStatus, Currency, Client, Supplier, SupplierFormData } from '../../types';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';
import { SupplierSelect } from './supplier-select';
import { suppliersService } from '../../lib/services/suppliers';


const saleItemFormSchema = z.object({
  classification: z.string().min(1, 'La clasificación es requerida'),
  provider: z.string().min(1, 'El proveedor es requerido'),
  operator: z.string().min(1, 'El operador es requerido'),
  dateIn: z.string().or(z.literal('')).optional(),
  dateOut: z.string().or(z.literal('')).optional(),
  passengerCount: z.number().min(1, 'Se requiere al menos 1 pasajero'),
  status: z.enum(['pending', 'confirmed', 'cancelled']),
  description: z.string().min(1).or(z.literal('')).optional(),
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
  itemIndex?: number;
  setItems: (items: SaleItemFormData[]) => void;
  items: SaleItemFormData[];
}

export function SaleItemForm({ isOpen, onClose, initialData, itemIndex, setItems, items }: SaleItemFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch
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

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [suppliers, setSuppliers] = useState<Client[]>([]);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [newSupplierLoading, setNewSupplierLoading] = useState(false);
  const [supplierForm, setSupplierForm] = useState<SupplierFormData>({ name: '' });
  const [supplierFormError, setSupplierFormError] = useState<string | null>(null);


  const getSuppliers = async () => {
    try {
      const response = await suppliersService.getAllSuppliers();
      console.log(response);
      setSuppliers(response.clients || response);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };
  // Reset form when initialData changes
  React.useEffect(() => {
    if (initialData) {
      // Helper function to format date for HTML date input
      const formatDateForInput = (dateString: string | null | undefined): string => {
        if (!dateString) return '';
        try {
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        } catch {
          return '';
        }
      };

      reset({
        classification: initialData.classification || '',
        provider: initialData.provider || '',
        operator: initialData.operator || '',
        dateIn: formatDateForInput(initialData.dateIn),
        dateOut: formatDateForInput(initialData.dateOut),
        passengerCount: initialData.passengerCount || 1,
        status: initialData.status || 'pending',
        description: initialData.description || '',
        salePrice: initialData.salePrice || 0,
        saleCurrency: initialData.saleCurrency || 'USD',
        costPrice: initialData.costPrice || 0,
        costCurrency: initialData.costCurrency || 'USD',
        reservationCode: initialData.reservationCode || '',
        paymentDate: formatDateForInput(initialData.paymentDate),
      });
    } else {
      // Reset to empty form when adding new item
      reset({
        classification: '',
        provider: '',
        operator: '',
        dateIn: '',
        dateOut: '',
        passengerCount: 1,
        status: 'pending',
        description: '',
        salePrice: 0,
        saleCurrency: 'USD',
        costPrice: 0,
        costCurrency: 'USD',
        reservationCode: '',
        paymentDate: null,
      });
    }
    getSuppliers()
  }, [initialData, reset]);

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
    if (initialData && typeof itemIndex === 'number') {
      const updatedItems = [...items];
      updatedItems[itemIndex] = data;
      setItems(updatedItems);
    } else {
      setItems([...items, data]);
    }
    onClose();
  };

  return (
    <>
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
          <SupplierSelect 
                suppliers={suppliers}
                value={watch('supplierId')}
                onSelect={supplier => {
                  setSelectedSupplier(supplier);
                  setValue('supplierId', supplier.id);
                  setValue('supplierName', supplier.name);
                }}
                onCreateNew={() => setShowSupplierModal(true)}
                error={errors.supplierId?.message || errors.supplierName?.message}
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

<Modal isOpen={showSupplierModal} onClose={() => setShowSupplierModal(false)} title="Crear nuevo cliente">
<form
  onSubmit={async e => {
    e.preventDefault();
    setNewSupplierLoading(true);
    setSupplierFormError(null);
    try {
      const created = await suppliersService.createSupplier(supplierForm);
      // Add new client to list and select it
      setSuppliers(prev => [...prev, created]);
      setValue('supplierId', created.id);
      setValue('supplierName', created.name);
      setShowSupplierModal(false);
      setSupplierForm({ name: '' });
    } catch (err: any) {
      setSupplierFormError(err.message || 'Error al crear cliente');
    } finally {
      setNewSupplierLoading(false);
    }
  }}
  className="space-y-4"
>
  <div>
    <label className="block text-sm font-medium">Nombre</label>
    <input
      className="w-full border rounded px-2 py-1"
      value={supplierForm.name}
      onChange={e => setSupplierForm(f => ({ ...f, name: e.target.value }))}
      required
    />
  </div>
  {supplierFormError && <div className="text-red-500 text-sm">{supplierFormError}</div>}
  <div className="flex justify-end gap-2">
    <button type="button" className="px-4 py-2 border rounded" onClick={() => setShowSupplierModal(false)}>
      Cancelar
    </button>
    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={newSupplierLoading}>
      {newSupplierLoading ? 'Creando...' : 'Crear'}
    </button>
  </div>
</form>
</Modal>
</>
  );
}