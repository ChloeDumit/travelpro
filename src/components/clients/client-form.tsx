import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { ClientFormData } from '../../types';

const clientFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  clientId: z.string().min(1, 'Client ID is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required'),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => void;
  initialData?: Partial<ClientFormData>;
  submitLabel?: string;
}

export function ClientForm({ onSubmit, initialData, submitLabel = 'Save' }: ClientFormProps) {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      clientId: initialData?.clientId || '',
      email: initialData?.email || '',
      address: initialData?.address || '',
    },
  });

  return (
    <Card>
      <CardHeader>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <Input
            label="Nombre"
            {...form.register('name')}
            error={form.formState.errors.name?.message}
          />
          <Input
            label="ID/RUT"
            {...form.register('clientId')}
            error={form.formState.errors.clientId?.message}
          />
          <Input
            label="Email"
            type="email"
            {...form.register('email')}
            error={form.formState.errors.email?.message}
          />
          <Input
            label="Dirección"
            {...form.register('address')}
            error={form.formState.errors.address?.message}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Guardando...' : submitLabel}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
} 