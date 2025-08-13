import  { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { saleTypeOptions, regionOptions, serviceTypeOptions, currencyOptions } from '../../types/sales';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { SaleItemForm } from './sale-item-form';
import { SaleItemFormData, User, ClientFormData, SaleItem, Sale } from '../../types';
import { usersService } from '../../lib/services/users';
import { clientsService } from '../../lib/services/clients';
import { Client } from '../../types/client';
import { Modal } from '../ui/modal';
import { ClientSelect } from './client-select';
import { UserSelect } from './user-select';

const saleFormSchema = z.object({
  passengerName: z.string().min(1, 'El nombre del pasajero es requerido'),
  clientId: z.string().min(1, 'El ID del cliente es requerido'),
  travelDate: z.string().min(1, 'La fecha de viaje es requerida'),
  saleType: z.enum(['individual', 'corporate', 'sports', 'group']),
  serviceType: z.enum(['flight', 'hotel', 'package', 'transfer', 'excursion', 'insurance', 'other']),
  region: z.enum(['national', 'international', 'regional']),
  passengerCount: z.number().min(1, 'Se requiere al menos un pasajero'),
  currency: z.enum(['USD', 'EUR', 'local']),
  seller: z.string().min(1, 'El vendedor es requerido'),
  totalCost: z.number().min(0, 'El total de la venta debe ser positivo'),
  totalSale: z.number().min(0, 'El total de la venta debe ser positivo'),
});

type SaleFormData = z.infer<typeof saleFormSchema>;

interface SaleFormProps {
  onSubmit: (data: SaleFormData & { client: Client | null }, items: SaleItemFormData[]) => void;
  initialData?: Sale;
  action: 'new' | 'edit';
}

export function SaleForm({ onSubmit, initialData, action }: SaleFormProps) {
  const [items, setItems] = useState<SaleItemFormData[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [showClientModal, setShowClientModal] = useState(false);
  const [newClientLoading, setNewClientLoading] = useState(false);
  const [clientForm, setClientForm] = useState<ClientFormData>({ name: '', clientId: '', email: '', address: '' });
  const [clientFormError, setClientFormError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const form = useForm<SaleFormData>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      saleType: 'individual',
      serviceType: 'package',
      region: 'national',
      currency: 'USD',
      passengerCount: 1,
      passengerName: '',
      clientId: '',
      travelDate: '',
      seller: '',
    },
  });

  const getUsers = async () => {
    try{
    const response = await usersService.getAllUsers();
      setUsers(response.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const getClients = async () => {
    try {
      const response = await clientsService.getAllClients();
      console.log(response);
      setClients(response.clients || response);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  useEffect(() => {
    if (initialData) {
      const formattedDate = initialData.travelDate instanceof Date 
        ? initialData.travelDate.toISOString().split('T')[0]
        : new Date(initialData.travelDate).toISOString().split('T')[0];
      form.reset({
        passengerName: initialData.passengerName,
        clientId: initialData.clientId,
        travelDate: formattedDate,
        saleType: initialData.saleType,
        serviceType: initialData.serviceType,
        region: initialData.region,
        passengerCount: initialData.passengerCount,
        currency: initialData.currency,
        seller: initialData.seller.id,
        totalCost: initialData.totalCost,
        totalSale: initialData.totalCost - initialData.pendingBalance,
      });

      // Set selected client if available
      if (initialData.client) {
        setSelectedClient(initialData.client);
      }

      // Set items if available
      if (initialData.items && initialData.items.length > 0) {
        const formattedItems: SaleItemFormData[] = initialData.items.map((item: SaleItem) => ({
          classification: item.classification,
          provider: item.provider,
          operator: item.operator,
          dateIn: item.dateIn instanceof Date 
            ? item.dateIn.toISOString().split('T')[0]
            : new Date(item.dateIn).toISOString().split('T')[0],
          dateOut: item.dateOut instanceof Date 
            ? item.dateOut.toISOString().split('T')[0]
            : new Date(item.dateOut).toISOString().split('T')[0],
          passengerCount: item.passengerCount,
          status: item.status,
          description: item.description,
          salePrice: item.salePrice,
          saleCurrency: item.saleCurrency,
          costPrice: item.costPrice,
          costCurrency: item.costCurrency,
          reservationCode: item.reservationCode || '',
          paymentDate: item.paymentDate 
            ? (item.paymentDate instanceof Date 
              ? item.paymentDate.toISOString().split('T')[0]
              : new Date(item.paymentDate).toISOString().split('T')[0])
            : '',
        }));
        setItems(formattedItems);
      }
    }
    getUsers();
    getClients();
  }, [initialData, form]);



  const handleEditItem = (index: number) => {
    console.log(index);
    setEditingItemIndex(index);
    setShowItemForm(true);
  };

  const handleDeleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleFormSubmit = (data: SaleFormData) => {
    console.log('Form submitted with data:', data);
    const totalCost = items.reduce((sum, item) => sum + item.costPrice, 0);
    const totalSale = items.reduce((sum, item) => sum + item.salePrice, 0);
    console.log('Calculated total cost:', totalCost);
    
    if (!selectedClient) {
      form.setError('clientId', { type: 'manual', message: 'Client is required' });
      return;
    }

    onSubmit({ 
      ...data, 
      totalCost: totalCost, 
      totalSale: totalSale, 
      client: selectedClient 
    }, items);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{action === 'new' ? 'Nuevo Registro de Venta' : 'Editar Venta'}</CardTitle>
        </CardHeader>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ClientSelect
                clients={clients}
                value={form.watch('clientId')}
                onSelect={client => {
                  setSelectedClient(client);
                  form.setValue('clientId', client.clientId);
                  form.setValue('passengerName', client.name);
                }}
                onCreateNew={() => setShowClientModal(true)}
                error={form.formState.errors.clientId?.message || form.formState.errors.passengerName?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Fecha de Viaje"
                {...form.register('travelDate')}
                error={form.formState.errors.travelDate?.message}
              />
              <Input
                type="number"
                label="Número de Pasajeros"
                min={1}
                {...form.register('passengerCount', { valueAsNumber: true })}
                error={form.formState.errors.passengerCount?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Tipo de Venta"
                options={saleTypeOptions}
                {...form.register('saleType')}
                error={form.formState.errors.saleType?.message}
              />
              <Select
                label="Región"
                options={regionOptions}
                {...form.register('region')}
                error={form.formState.errors.region?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Tipo de Servicio"
                options={serviceTypeOptions}
                {...form.register('serviceType')}
                error={form.formState.errors.serviceType?.message}
              />
              <Select
                label="Moneda"
                options={currencyOptions}
                {...form.register('currency')}
                error={form.formState.errors.currency?.message}
              />
            </div>
            <UserSelect
              users={users}
              value={form.watch('seller')}
              onSelect={user => form.setValue('seller', user.id)}
              error={form.formState.errors.seller?.message}
            />
          </CardContent>
        </form>
      </Card>

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
                    <div>
                      <h3 className="font-medium">{item.classification}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Proveedor:</span>
                          <p className="text-sm">{item.provider}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Operador:</span>
                          <p className="text-sm">{item.operator}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">Precio de Venta:</span>
                        <p className="text-sm font-medium">
                          {new Intl.NumberFormat('es-CL', {
                            style: 'currency',
                            currency: item.saleCurrency,
                          }).format(item.salePrice)}
                        </p>
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

              {/* Summary Section */}
              <div className="mt-6 p-4 border rounded-lg bg-white">
                <h3 className="text-lg font-medium mb-4 ">Resumen de Venta</h3>
                <div>
                  <span className="text-sm text-gray-500">Total de Venta:</span>
                  <p className="text-lg font-medium">
                    {new Intl.NumberFormat('es-CL', {
                      style: 'currency',
                      currency: form.getValues('currency'),
                    }).format(
                      items.reduce((sum, item) => sum + item.salePrice, 0)
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Total de Costo:</span>
                  <p className="text-lg font-medium">
                    {new Intl.NumberFormat('es-CL', {
                      style: 'currency',
                      currency: form.getValues('currency'),
                    }).format(
                      items.reduce((sum, item) => sum + item.costPrice, 0)
                    )}
                  </p>
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

      <SaleItemForm
        isOpen={showItemForm}
        onClose={() => {
          setShowItemForm(false);
          setEditingItemIndex(null);
        }}
        initialData={editingItemIndex !== null ? items[editingItemIndex] : undefined}
        itemIndex={editingItemIndex !== null ? editingItemIndex : undefined}
        setItems={setItems}
        items={items}
      />

      <Modal isOpen={showClientModal} onClose={() => setShowClientModal(false)} title="Crear nuevo cliente">
        <form
          onSubmit={async e => {
            e.preventDefault();
            setNewClientLoading(true);
            setClientFormError(null);
            try {
              const created = await clientsService.createClient(clientForm);
              // Add new client to list and select it
              setClients(prev => [...prev, created]);
              form.setValue('clientId', created.clientId);
              form.setValue('passengerName', created.name);
              setShowClientModal(false);
              setClientForm({ name: '', clientId: '', email: '', address: '' });
            } catch (err: any) {
              setClientFormError(err.message || 'Error al crear cliente');
            } finally {
              setNewClientLoading(false);
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={clientForm.name}
              onChange={e => setClientForm(f => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">ID/RUT</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={clientForm.clientId}
              onChange={e => setClientForm(f => ({ ...f, clientId: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={clientForm.email}
              onChange={e => setClientForm(f => ({ ...f, email: e.target.value }))}
              type="email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Dirección</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={clientForm.address}
              onChange={e => setClientForm(f => ({ ...f, address: e.target.value }))}
              required
            />
          </div>
          {clientFormError && <div className="text-red-500 text-sm">{clientFormError}</div>}
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 border rounded" onClick={() => setShowClientModal(false)}>
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={newClientLoading}>
              {newClientLoading ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>

      <div className="flex justify-end gap-2 mt-6">
        <Button
          type="submit"
          onClick={() => {
            handleFormSubmit(form.getValues());
          }}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Guardando...' : 'Guardar Venta'}
        </Button>
      </div>
    </div>
  );
}