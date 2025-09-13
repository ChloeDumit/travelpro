import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SaleItemFormData,
  Supplier,
  Operator,
  Classification,
  Passenger,
} from "../../types";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";
import { SearchSelect } from "../ui/search-select";
import { suppliersService } from "../../lib/services/suppliers.service";
import { operatorsService } from "../../lib/services/operators.service";
import { classificationsService } from "../../lib/services/classifications.service";
import { passengersService } from "../../lib/services/passenger.service";
import PassengerSelect from "./passenger-select";

const saleItemFormSchema = z.object({
  classificationId: z.union([z.string(), z.number()]).transform((val) => {
    const num = typeof val === "string" ? parseInt(val, 10) : val;
    if (isNaN(num) || num <= 0) {
      throw new Error("La clasificación es requerida");
    }
    return num;
  }),
  supplierId: z.union([z.string(), z.number()]).transform((val) => {
    const num = typeof val === "string" ? parseInt(val, 10) : val;
    if (isNaN(num) || num <= 0) {
      throw new Error("El proveedor es requerido");
    }
    return num;
  }),
  operatorId: z.union([z.string(), z.number()]).transform((val) => {
    const num = typeof val === "string" ? parseInt(val, 10) : val;
    if (isNaN(num) || num <= 0) {
      throw new Error("El operador es requerido");
    }
    return num;
  }),
  dateIn: z.string().or(z.literal("")).optional(),
  dateOut: z.string().or(z.literal("")).optional(),
  passengerCount: z.number().min(1, "Se requiere al menos 1 pasajero"),
  description: z.string().min(1).or(z.literal("")).optional(),
  salePrice: z.number().min(0, "El precio de venta debe ser positivo"),
  costPrice: z.number().min(0, "El precio de costo debe ser positivo"),
  reservationCode: z.string().optional(),
  paymentDate: z.string().optional().nullable(),
  passengers: z
    .array(
      z.object({
        passengerId: z.string(),
        name: z.string(),
        email: z.string().optional(),
        dateOfBirth: z.string(),
      })
    )
    .min(1, "Se requiere al menos 1 pasajero"),
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
      classificationId: initialData?.classification?.at(0)?.id
        ? Number(initialData.classification[0].id)
        : 0,
      supplierId: initialData?.supplier?.at(0)?.id
        ? Number(initialData.supplier[0].id)
        : 0,
      operatorId: initialData?.operator?.at(0)?.id
        ? Number(initialData.operator[0].id)
        : 0,
      dateIn: initialData?.dateIn || "",
      dateOut: initialData?.dateOut || "",
      passengerCount: initialData?.passengerCount || 1,
      description: initialData?.description || "",
      salePrice: initialData?.salePrice || 0,
      costPrice: initialData?.costPrice || 0,
      reservationCode: initialData?.reservationCode || "",
      paymentDate: initialData?.paymentDate || undefined,
      passengers: initialData?.passengers || [],
      classification: initialData?.classification || [],
      supplier: initialData?.supplier || [],
      operator: initialData?.operator || [],
    },
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);

  const getSuppliers = React.useCallback(async () => {
    try {
      const response = await suppliersService.getAll();
      setSuppliers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  }, []);

  const getOperators = React.useCallback(async () => {
    try {
      const response = await operatorsService.getAll();
      setOperators(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching operators:", error);
    }
  }, []);

  const getClassifications = React.useCallback(async () => {
    try {
      const response = await classificationsService.getAll();
      setClassifications(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching classifications:", error);
    }
  }, []);

  const getPassengers = React.useCallback(async () => {
    try {
      const response = await passengersService.getAll();
      setPassengers(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching passengers:", error);
      setPassengers([]);
    }
  }, []);

  React.useEffect(() => {
    getSuppliers();
    getOperators();
    getClassifications();
    getPassengers();
  }, [getSuppliers, getOperators, getClassifications, getPassengers]);

  // Handle merging existing passengers when editing
  React.useEffect(() => {
    if (initialData?.passengers && initialData.passengers.length > 0) {
      setPassengers((prevPassengers) => {
        // Add existing passengers that might not be in the main list
        const existingPassengers = (initialData.passengers || []).filter(
          (p) => !prevPassengers.some((ap) => ap.passengerId === p.passengerId)
        );

        // Combine existing passengers with available ones
        return [...existingPassengers, ...prevPassengers];
      });
    }
  }, [initialData?.passengers]);

  // Reset form when initialData changes (for editing)
  React.useEffect(() => {
    if (initialData) {
      // Extract IDs from the arrays or use direct IDs, ensuring they are numbers
      const classificationId =
        initialData.classificationId ||
        (initialData.classification && initialData.classification.length > 0
          ? Number(initialData.classification[0].id)
          : 0);

      const supplierId =
        initialData.supplierId ||
        (initialData.supplier && initialData.supplier.length > 0
          ? Number(initialData.supplier[0].id)
          : 0);

      const operatorId =
        initialData.operatorId ||
        (initialData.operator && initialData.operator.length > 0
          ? Number(initialData.operator[0].id)
          : 0);

      // Ensure we have the correct data structure
      const formData = {
        classificationId: classificationId,
        supplierId: supplierId,
        operatorId: operatorId,
        dateIn: initialData.dateIn || "",
        dateOut: initialData.dateOut || "",
        passengerCount: initialData.passengerCount || 1,
        description: initialData.description || "",
        salePrice: initialData.salePrice || 0,
        costPrice: initialData.costPrice || 0,
        reservationCode: initialData.reservationCode || "",
        paymentDate: initialData.paymentDate || undefined,
        passengers: initialData.passengers || [],
        classification: initialData.classification || [],
        supplier: initialData.supplier || [],
        operator: initialData.operator || [],
      };

      reset(formData);

      // Also set the values individually to ensure they're set
      setValue("classificationId", formData.classificationId);
      setValue("supplierId", formData.supplierId);
      setValue("operatorId", formData.operatorId);
      setValue("dateIn", formData.dateIn);
      setValue("dateOut", formData.dateOut);
      setValue("passengerCount", formData.passengerCount);
      setValue("description", formData.description);
      setValue("salePrice", formData.salePrice);
      setValue("costPrice", formData.costPrice);
      setValue("reservationCode", formData.reservationCode);
      setValue("paymentDate", formData.paymentDate || undefined);
      setValue("passengers", formData.passengers);
      setValue("classification", formData.classification);
      setValue("supplier", formData.supplier);
      setValue("operator", formData.operator);
    } else {
      // Reset to empty form when adding new item
      reset({
        classificationId: 0,
        supplierId: 0,
        operatorId: 0,
        dateIn: "",
        dateOut: "",
        passengerCount: 1,
        description: "",
        salePrice: 0,
        costPrice: 0,
        reservationCode: "",
        paymentDate: undefined,
        passengers: [],
        classification: [],
        supplier: [],
        operator: [],
      });
    }
  }, [initialData, reset, setValue]);

  const handleFormSubmit = (data: SaleItemFormData) => {
    // Prevent form submission if passenger creation form is open
    // This is handled by the PassengerSelect component, but adding extra safety
    if (document.querySelector("[data-passenger-creation-form]")) {
      return;
    }

    // Find the selected objects based on IDs
    const selectedClassification = classifications.find(
      (c) => c.id === data.classificationId
    );
    const selectedSupplier = suppliers.find((s) => s.id === data.supplierId);
    const selectedOperator = operators.find((o) => o.id === data.operatorId);

    // Create the complete item object
    const newItem: SaleItemFormData = {
      ...data,
      classificationId: data.classificationId,
      classificationName: selectedClassification?.name || "",
      supplierId: data.supplierId,
      supplierName: selectedSupplier?.name || "",
      operatorId: data.operatorId,
      operatorName: selectedOperator?.name || "",
      passengers: data.passengers,
      classification: selectedClassification ? [selectedClassification] : [],
      supplier: selectedSupplier ? [selectedSupplier] : [],
      operator: selectedOperator ? [selectedOperator] : [],
    };

    if (initialData && typeof itemIndex === "number") {
      // Editing existing item
      const updatedItems = [...items];
      updatedItems[itemIndex] = newItem;
      setItems(updatedItems);
    } else {
      // Adding new item
      const newItems = [...items, newItem];
      setItems(newItems);
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
              value={watch("classificationId") || 0}
              onSelect={(classification) => {
                setValue("classificationId", classification.id);
              }}
              error={errors.classificationId?.message}
              label="Clasificación *"
              placeholder="Selecciona una clasificación..."
              noResultsText="No se encontraron clasificaciones"
              getItemLabel={(classification) => classification.name}
              getItemId={(classification) => classification.id}
            />
            <SearchSelect
              items={suppliers}
              value={watch("supplierId") || 0}
              onSelect={(supplier) => {
                setValue("supplierId", supplier.id);
              }}
              error={errors.supplierId?.message}
              label="Proveedor *"
              placeholder="Selecciona un proveedor..."
              noResultsText="No se encontraron proveedores"
              getItemLabel={(supplier) => supplier.name}
              getItemId={(supplier) => supplier.id}
            />
            <SearchSelect
              items={operators}
              value={watch("operatorId") || 0}
              onSelect={(operator) => {
                setValue("operatorId", operator.id);
              }}
              error={errors.operatorId?.message}
              label=" Operador *"
              placeholder="Selecciona un operador..."
              noResultsText="No se encontraron operadores"
              getItemLabel={(operator) => operator.name}
              getItemId={(operator) => operator.id}
            />
          </div>

          <PassengerSelect
            items={passengers}
            value={watch("passengers")}
            onSelect={(selectedPassengers) => {
              setValue("passengers", selectedPassengers);
              // Also update passenger count immediately
              setValue("passengerCount", selectedPassengers.length);
            }}
            onPassengersUpdate={(updatedPassengers) => {
              setPassengers(updatedPassengers);
            }}
            error={errors.passengers?.message}
            label="Pasajeros *"
            placeholder="Selecciona pasajeros..."
            noResultsText="No se encontraron pasajeros"
            getItemLabel={(passenger) => passenger.name}
            getItemId={(passenger) => passenger.passengerId}
          />

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
              label="Número de Pasajeros *"
              min={1}
              readOnly
              className="bg-gray-50 cursor-not-allowed"
              {...register("passengerCount", { valueAsNumber: true })}
              error={errors.passengerCount?.message}
            />
          </div>

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
            <Input
              type="number"
              label="Precio de Venta *"
              min={0}
              step={0.01}
              {...register("salePrice", { valueAsNumber: true })}
              error={errors.salePrice?.message}
            />
            <Input
              type="number"
              label="Precio de Costo *"
              min={0}
              step={0.01}
              {...register("costPrice", { valueAsNumber: true })}
              error={errors.costPrice?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Código de Reserva"
              {...register("reservationCode")}
              error={errors.reservationCode?.message}
            />
            <Input
              type="date"
              label="Fecha de Pago a Proveedor"
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
