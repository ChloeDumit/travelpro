import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { PageLoading } from "../../components/ui/loading-spinner";
import { ClientForm } from "../../components/clients/client-form";
import { ClientFormData } from "../../types";
import { clientsService } from "../../lib/services/clients.service";

export function EditClientPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<ClientFormData | null>(null);

  useEffect(() => {
    loadClient();
  }, [id]);

  const loadClient = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await clientsService.getById(id);
      setClient(response.data || null);
    } catch (err) {
      setError("Error loading client");
      console.error("Error loading client:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: ClientFormData) => {
    if (!id) return;

    setSaving(true);
    setError(null);

    try {
      await clientsService.update(id, data);
      navigate("/clients");
    } catch (err) {
      setError("Error updating client");
      console.error("Error updating client:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageLoading message="Cargando cliente..." />;
  }

  if (!client) {
    return (
      <div className="text-center py-8 text-gray-500">
        Cliente no encontrado
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Editar Cliente</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/clients")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Clientes
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <ClientForm
        onSubmit={handleSubmit}
        initialData={client}
        submitLabel={saving ? "Guardando..." : "Guardar Cambios"}
      />
    </div>
  );
}
