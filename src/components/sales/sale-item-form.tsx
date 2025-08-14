import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SaleItemFormData,
  Supplier,
  SupplierFormData,
  Operator,
  OperatorFormData,
  Classification,
  ClassificationFormData,
} from "../../types";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";
import { SearchSelect } from "../ui/search-select";
import { suppliersService } from "../../lib/services/suppliers.service";
import { operatorsService } from "../../lib/services/operators.service";
import { classificationsService } from "../../lib/services/classifications.service";

const saleItemFormSchema = z.object({
  classificationId: z.number().min(1, "La clasificación es requerida"),
  supplierId: z.number().min(1, "El proveedor es requerido"),
  operatorId: z.number().min(1, "El operador es requerido"),
  dateIn: z.string().or(z.literal("")).optional(),
  dateOut: z.string().or(z.literal("")).optional(),
  passengerCount: z.number().min(1, "Se requiere al menos 1 pasajero"),
  status: z.enum(["pending", "confirmed", "cancelled"]),
  description: z.string().min(1).or(z.literal("")).optional(),
  salePrice: z.number().min(0, "El precio de venta debe ser positivo"),
  costPrice: z.number().min(0, "El precio de costo debe ser positivo"),
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

export function SaleItemForm({
  isOpen,
  onClose,
  initialData,
  itemIndex,
  setItems,
  items,
}: SaleItemFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<SaleItemFormData>({
    resolver: zodResolver(saleItemFormSchema),
    defaultValues: {
      classificationId: initialData?.classificationId || 0,
      supplierId: initialData?.supplierId || 0,
      operatorId: initialData?.operatorId || 0,
      dateIn: initialData?.dateIn || "",
      dateOut: initialData?.dateOut || "",
      passengerCount: initialData?.passengerCount || 1,
      status: initialData?.status || "pending",
      description: initialData?.description || "",
      salePrice: initialData?.salePrice || 0,
      costPrice: initialData?.costPrice || 0,
      reservationCode: initialData?.reservationCode || "",
      paymentDate: initialData?.paymentDate || null,
    },
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showOperatorModal, setShowOperatorModal] = useState(false);
  const [showClassificationModal, setShowClassificationModal] = useState(false);
  const [newSupplierLoading, setNewSupplierLoading] = useState(false);
  const [newOperatorLoading, setNewOperatorLoading] = useState(false);
  const [newClassificationLoading, setNewClassificationLoading] =
    useState(false);
  const [supplierForm, setSupplierForm] = useState<SupplierFormData>({
    name: "",
  });
  const [operatorForm, setOperatorForm] = useState<OperatorFormData>({
    name: "",
  });
  const [classificationForm, setClassificationForm] =
    useState<ClassificationFormData>({
      name: "",
    });
  const [supplierFormError, setSupplierFormError] = useState<string | null>(
    null
  );
  const [operatorFormError, setOperatorFormError] = useState<string | null>(
    null
  );
  const [classificationFormError, setClassificationFormError] = useState<
    string | null
  >(null);

  const getSuppliers = async () => {
    try {
      const response = await suppliersService.getAll();
      console.log("Suppliers response:", response);
      setSuppliers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const getOperators = async () => {
    try {
      const response = await operatorsService.getAll();
      console.log("Operators response:", response);
      setOperators(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching operators:", error);
    }
  };

  const getClassifications = async () => {
    try {
      const response = await classificationsService.getAll();
      console.log("Classifications response:", response);
      setClassifications(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching classifications:", error);
    }
  };

  // Reset form when initialData changes
  React.useEffect(() => {
    if (initialData) {
      // Helper function to format date for HTML date input
      const formatDateForInput = (
        dateString: string | null | undefined
      ): string => {
        if (!dateString) return "";
        try {
          const date = new Date(dateString);
          return date.toISOString().split("T")[0];
        } catch {
          return "";
        }
      };

      reset({
        classificationId: initialData.classificationId || 0,
        supplierId: initialData.supplierId || 0,
        operatorId: initialData.operatorId || 0,
        dateIn: formatDateForInput(initialData.dateIn),
        dateOut: formatDateForInput(initialData.dateOut),
        passengerCount: initialData.passengerCount || 1,
        status: initialData.status || "pending",
        description: initialData.description || "",
        salePrice: initialData.salePrice || 0,
        costPrice: initialData.costPrice || 0,
        reservationCode: initialData.reservationCode || "",
        paymentDate: formatDateForInput(initialData.paymentDate),
      });
    } else {
      // Reset to empty form when adding new item
      reset({
        classificationId: 0,
        supplierId: 0,
        operatorId: 0,
        dateIn: "",
        dateOut: "",
        passengerCount: 1,
        status: "pending",
        description: "",
        salePrice: 0,
        costPrice: 0,
        reservationCode: "",
        paymentDate: null,
      });
    }
    getSuppliers();
    getOperators();
    getClassifications();
  }, [initialData, reset]);

  const statusOptions = [
    { value: "pending", label: "Pendiente" },
    { value: "confirmed", label: "Confirmado" },
    { value: "cancelled", label: "Cancelado" },
  ];

  const handleFormSubmit = (data: SaleItemFormData) => {
    console.log("Form data submitted:", data);

    // Crear el objeto completo del item
    const newItem: SaleItemFormData = {
      ...data,
      // Asegurarse de que todos los campos requeridos estén presentes
      classificationId: data.classificationId,
      classificationName:
        classifications.find((c) => c.id === data.classificationId)?.name || "",
      supplierId: data.supplierId,
      supplierName: suppliers.find((s) => s.id === data.supplierId)?.name || "",
      operatorId: data.operatorId,
      operatorName: operators.find((o) => o.id === data.operatorId)?.name || "",
    };

    console.log("New item to add:", newItem);

    if (initialData && typeof itemIndex === "number") {
      const updatedItems = [...items];
      updatedItems[itemIndex] = newItem;
      setItems(updatedItems);
      console.log("Updated items:", updatedItems);
    } else {
      const newItems = [...items, newItem];
      setItems(newItems);
      console.log("New items array:", newItems);
    }

    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={initialData ? "Editar Item de Venta" : "Agregar Item de Venta"}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchSelect
              items={classifications}
              value={watch("classificationId")}
              onSelect={(classification) => {
                setValue("classificationId", classification.id);
              }}
              error={errors.classificationId?.message}
              label="Clasificación"
              placeholder="Selecciona una clasificación..."
              noResultsText="No se encontraron clasificaciones"
              getItemLabel={(classification) => classification.name}
              getItemId={(classification) => classification.id}
            />
            <SearchSelect
              items={suppliers}
              value={watch("supplierId")}
              onSelect={(supplier) => {
                setValue("supplierId", supplier.id);
              }}
              error={errors.supplierId?.message}
              label="Proveedor"
              placeholder="Selecciona un proveedor..."
              noResultsText="No se encontraron proveedores"
              getItemLabel={(supplier) => supplier.name}
              getItemId={(supplier) => supplier.id}
            />
            <SearchSelect
              items={operators}
              value={watch("operatorId")}
              onSelect={(operator) => {
                setValue("operatorId", operator.id);
              }}
              error={errors.operatorId?.message}
              label="Operador"
              placeholder="Selecciona un operador..."
              noResultsText="No se encontraron operadores"
              getItemLabel={(operator) => operator.name}
              getItemId={(operator) => operator.id}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="date"
              label="Fecha de Entrada"
              {...register("dateIn")}
              error={errors.dateIn?.message}
            />
            <Input
              type="date"
              label="Fecha de Salida"
              {...register("dateOut")}
              error={errors.dateOut?.message}
            />
            <Input
              type="number"
              label="Número de Pasajeros"
              min={1}
              {...register("passengerCount", { valueAsNumber: true })}
              error={errors.passengerCount?.message}
            />
          </div>

          <Select
            label="Estado"
            options={statusOptions}
            {...register("status")}
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
              {...register("description")}
            />
            {errors.description?.message && (
              <p className="text-xs text-danger-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                label="Precio de Venta"
                min={0}
                step={0.01}
                {...register("salePrice", { valueAsNumber: true })}
                error={errors.salePrice?.message}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                label="Precio de Costo"
                min={0}
                step={0.01}
                {...register("costPrice", { valueAsNumber: true })}
                error={errors.costPrice?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Código de Reserva"
              {...register("reservationCode")}
              error={errors.reservationCode?.message}
            />
            <Input
              type="date"
              label="Fecha de Pago (Opcional)"
              {...register("paymentDate")}
              error={errors.paymentDate?.message}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Guardando..."
                : initialData
                ? "Guardar Cambios"
                : "Agregar Item"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
