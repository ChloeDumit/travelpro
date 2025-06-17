import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ClientForm } from '../../components/clients/client-form';
import { ClientFormData } from '../../types';
import { clientsService } from '../../lib/services/clients';

export function NewClientPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ClientFormData) => {
    setLoading(true);
    setError(null);

    try {
      await clientsService.createClient(data);
      navigate('/clients');
    } catch (err) {
      setError('Error creating client');
      console.error('Error creating client:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Nuevo Cliente</h2>
        <Button variant="outline" size="sm" onClick={() => navigate('/clients')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Clientes
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <ClientForm onSubmit={handleSubmit} submitLabel={loading ? 'Creando...' : 'Crear Cliente'} />
    </div>
  );
} 