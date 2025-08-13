import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { OperatorFormData, Operator } from '../../types';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const operatorFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
});

interface OperatorFormProps {
  onSubmit: (data: OperatorFormData) => void;
  loading?: boolean;
  initialData?: Operator;
}

export function OperatorForm({ onSubmit, loading = false, initialData }: OperatorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OperatorFormData>({
    resolver: zodResolver(operatorFormSchema),
    defaultValues: {
      name: initialData?.name || '',
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? 'Editar Operador' : 'Nuevo Operador'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nombre"
            {...register('name')}
            error={errors.name?.message}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="submit"
              disabled={loading}
            >
              {loading
                ? 'Guardando...'
                : initialData
                ? 'Guardar Cambios'
                : 'Crear Operador'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

