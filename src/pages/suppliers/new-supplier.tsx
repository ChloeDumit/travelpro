import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { SupplierForm } from '../../components/suppliers/supplier-form';
import { SupplierFormData } from '../../types';
import { suppliersService } from '../../lib/services/suppliers'

export function NewSupplierPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: SupplierFormData) => {
    setLoading(true);
    setError(null);

    try {
      await suppliersService.createSupplier(data);
      navigate('/suppliers');
    } catch (err) {
      setError('Error creating supplier');
      console.error('Error creating supplier:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Nuevo Proveedor</h2>
        <Button variant="outline" size="sm" onClick={() => navigate('/suppliers')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Proveedores
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <SupplierForm onSubmit={handleSubmit} submitLabel={loading ? 'Creando...' : 'Crear Proveedor'} />
    </div>
  );
} 