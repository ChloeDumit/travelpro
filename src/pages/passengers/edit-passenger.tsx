import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { PassengerFormPage } from "../../components/passengers/passenger-form-page";
import { PassengerFormData } from "../../types";
import { passengersService } from "../../lib/services/passenger.service";

export function EditPassengerPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passenger, setPassenger] = useState<PassengerFormData | null>(null);

  useEffect(() => {
    loadPassenger();
  }, [id]);

  const loadPassenger = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await passengersService.getById(id);
      setPassenger(response.data as unknown as PassengerFormData);
    } catch (err) {
      setError("Error loading passenger");
      console.error("Error loading passenger:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: PassengerFormData) => {
    if (!id) return;

    setSaving(true);
    setError(null);

    try {
      await passengersService.update(id, data);
      navigate("/passengers");
    } catch (err) {
      setError("Error updating passenger");
      console.error("Error updating passenger:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!passenger) {
    return (
      <div className="text-center py-8 text-gray-500">
        Pasajero no encontrado
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Editar Pasajero</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/passengers")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Pasajeros
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <PassengerFormPage
        onSubmit={handleSubmit}
        loading={saving}
        initialData={passenger}
        title="Editar Pasajero"
        submitLabel={saving ? "Guardando..." : "Guardar Cambios"}
      />
    </div>
  );
}
