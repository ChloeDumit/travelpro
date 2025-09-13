import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { LoadingState } from "../ui/loading-spinner";
import { ErrorState } from "../ui/error-state";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { SaleItemForm } from "./sale-item-form";
import { ClientSelect } from "./client-select";
import { UserSelect } from "./user-select";
import { Modal } from "../ui/modal";
import { ClientForm } from "../clients/client-form";
import {
  SaleItemFormData,
  Client,
  Sale,
  SaleFormData,
  saleTypeOptions,
  regionOptions,
  serviceTypeOptions,
  ClientFormData,
  User,
} from "../../types";
import { usersService } from "../../lib/services/users.service";
import { clientsService } from "../../lib/services/clients.service";
import { useAuth } from "../../contexts/auth-context";
import { useAsyncOperation } from "../../hooks/useAsyncOperation";

const saleFormSchema = z.object({
  passengerName: z.string().min(1, "El nombre del pasajero es requerido"),
  clientId: z.string().min(1, "El cliente es requerido"),
  travelDate: z.string().min(1, "La fecha de viaje es requerida"),
  saleType: z.enum(["individual", "corporate", "sports", "group"]),
  serviceType: z.enum([
    "flight",
    "hotel",
    "package",
    "transfer",
    "excursion",
    "insurance",
    "other",
  ]),
  region: z.enum(["national", "international", "regional"]),
  passengerCount: z.number().min(1, "Se requiere al menos un pasajero"),
  sellerId: z.string().min(1, "El vendedor es requerido"),
  totalCost: z.number().min(0, "El costo total debe ser positivo"),
  totalSale: z.number().min(0, "El total de la venta debe ser positivo"),
});

type FormData = z.infer<typeof saleFormSchema>;

interface SaleFormProps {
  onSubmit: (
    data: SaleFormData & { client: Client | null },
    items: SaleItemFormData[]
  ) => void;
  initialData?: Sale;
  action: "new" | "edit";
  loading: boolean;
}

export function SaleForm({
  onSubmit,
  initialData,
  action,
  loading,
}: SaleFormProps) {
  const { user: currentUser } = useAuth();
  const [items, setItems] = useState<SaleItemFormData[]>([]);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Async operations
  const usersOp = useAsyncOperation(usersService.getAll);
  const clientsOp = useAsyncOperation(clientsService.getAll);
  const createClientOp = useAsyncOperation(clientsService.create);

  const form = useForm<FormData>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      saleType: "individual",
      serviceType: "package",
      region: "national",
      passengerCount: 1,
      passengerName: "",
      clientId: "",
      travelDate: "",
      sellerId: currentUser?.id || "",
      totalCost: 0,
      totalSale: 0,
    },
  });

  // Load initial data
  useEffect(() => {
    usersOp.execute();
    clientsOp.execute(1, 100); // Load first 100 clients
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Set initial form data
  useEffect(() => {
    if (initialData) {
      const formattedDate = initialData.travelDate
        ? new Date(initialData.travelDate).toISOString().split("T")[0]
        : "";

      form.reset({
        passengerName: initialData.passengerName,
        clientId: initialData.client?.id?.toString() || "",
        travelDate: formattedDate,
        saleType: initialData.saleType,
        serviceType: initialData.serviceType,
        region: initialData.region,
        passengerCount: initialData.passengerCount,
        sellerId: initialData.seller.id.toString(),
        totalCost: initialData.totalCost,
        totalSale: initialData.salePrice,
      });

      if (initialData.client) {
        setSelectedClient(initialData.client);
      }

      if (initialData.items) {
        setItems(initialData.items as SaleItemFormData[]);
      }
    } else if (currentUser) {
      form.setValue("sellerId", currentUser.id.toString());
    }
  }, [initialData, form, currentUser]);

  const handleEditItem = (index: number) => {
    setEditingItemIndex(index);
    setShowItemForm(true);
  };

  const handleDeleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleCreateClient = async (clientData: ClientFormData) => {
    try {
      const response = await clientsService.create(clientData);
      if (response.data?.client) {
        // Add to clients list and select it
        clientsOp.execute(1, 100); // Refresh clients list
        setSelectedClient(response.data.client);
        form.setValue("clientId", response.data.client.id.toString());
        form.setValue("passengerName", response.data.client.name);
        setShowClientModal(false);
      }
    } catch (error) {
      console.error("Error creating client:", error);
    }
  };

  const handleFormSubmit = (data: FormData) => {
    const totalCost = items.reduce((sum, item) => sum + item.costPrice, 0);
    const totalSale = items.reduce((sum, item) => sum + item.salePrice, 0);

    if (!selectedClient) {
      form.setError("clientId", {
        type: "manual",
        message: "El cliente es requerido",
      });
      return;
    }

    onSubmit(
      {
        ...data,
        totalCost,
        totalSale,
        client: selectedClient,
      },
      items
    );
  };

  if (usersOp.loading || clientsOp.loading) {
    return <LoadingState message="Cargando formulario..." />;
  }

  if (usersOp.error || clientsOp.error) {
    return (
      <ErrorState
        error={usersOp.error || clientsOp.error || "Error al cargar datos"}
        onRetry={() => {
          usersOp.execute();
          clientsOp.execute();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Sale Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {action === "new" ? "Nuevo Registro de Venta" : "Editar Venta"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            {/* Client Selection */}
            <ClientSelect
              clients={clientsOp.data?.data || []}
              value={form.watch("clientId")}
              onSelect={(client) => {
                setSelectedClient(client);
                form.setValue("clientId", client.id.toString());
                form.setValue("passengerName", client.name);
              }}
              onCreateNew={() => setShowClientModal(true)}
              error={form.formState.errors.clientId?.message}
              loading={clientsOp.loading}
            />

            {/* Travel Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Fecha de Viaje *"
                {...form.register("travelDate")}
                error={form.formState.errors.travelDate?.message}
              />
              <Input
                type="number"
                label="Número de Pasajeros *"
                min={1}
                {...form.register("passengerCount", { valueAsNumber: true })}
                error={form.formState.errors.passengerCount?.message}
              />
            </div>

            {/* Sale Type and Region */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Tipo de Venta *"
                options={saleTypeOptions}
                {...form.register("saleType")}
                error={form.formState.errors.saleType?.message}
              />
              <Select
                label="Región *"
                options={regionOptions}
                {...form.register("region")}
                error={form.formState.errors.region?.message}
              />
            </div>

            {/* Service Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Tipo de Servicio *"
                options={serviceTypeOptions}
                {...form.register("serviceType")}
                error={form.formState.errors.serviceType?.message}
              />
            </div>

            {/* Seller Selection */}
            <UserSelect
              users={usersOp.data?.users || []}
              value={form.watch("sellerId")}
              onSelect={(user) => form.setValue("sellerId", user.id.toString())}
              error={form.formState.errors.sellerId?.message}
              currentUser={currentUser as User}
            />
          </form>
        </CardContent>
      </Card>

      {/* Sale Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Items de Venta</CardTitle>
          <Button onClick={() => setShowItemForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Item
          </Button>
        </CardHeader>
        <CardContent>
          {items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {item.classificationName ||
                          item.classification?.[0]?.name ||
                          "Sin clasificación"}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.description}
                      </p>

                      <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Proveedor:</span>
                          <p className="font-medium">
                            {item.supplierName ||
                              item.supplier?.[0]?.name ||
                              "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Operador:</span>
                          <p className="font-medium">
                            {item.operatorName ||
                              item.operator?.[0]?.name ||
                              "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">
                            Pasajeros ({item.passengerCount}):
                          </span>
                          <p className="font-medium">
                            {item.passengers
                              ?.map((passenger) => passenger.name)
                              .join(", ") || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-6">
                        <div>
                          <span className="text-sm text-gray-500">
                            Precio de Venta:
                          </span>
                          <p className="font-medium">
                            ${item.salePrice.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">
                            Precio de Costo:
                          </span>
                          <p className="font-medium">
                            ${item.costPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditItem(index)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Summary */}
              <div className="mt-6 p-4 border rounded-lg bg-white">
                <h3 className="text-lg font-medium mb-4">Resumen de Venta</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">
                      Total de Venta:
                    </span>
                    <p className="text-lg font-medium">
                      $
                      {items
                        .reduce((sum, item) => sum + item.salePrice, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Total de Costo:
                    </span>
                    <p className="text-lg font-medium">
                      $
                      {items
                        .reduce((sum, item) => sum + item.costPrice, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No hay items agregados
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-2">
        <Button
          type="submit"
          onClick={form.handleSubmit(handleFormSubmit)}
          disabled={loading || items.length === 0}
        >
          {loading ? "Guardando..." : "Guardar Venta"}
        </Button>
      </div>

      {/* Modals */}
      <SaleItemForm
        isOpen={showItemForm}
        onClose={() => {
          setShowItemForm(false);
          setEditingItemIndex(null);
        }}
        initialData={
          editingItemIndex !== null ? items[editingItemIndex] : undefined
        }
        itemIndex={editingItemIndex ?? undefined}
        setItems={setItems}
        items={items}
      />

      <Modal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        title="Crear Nuevo Cliente"
      >
        <ClientForm
          onSubmit={handleCreateClient}
          submitLabel={createClientOp.loading ? "Creando..." : "Crear Cliente"}
        />
        {createClientOp.error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{createClientOp.error}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
