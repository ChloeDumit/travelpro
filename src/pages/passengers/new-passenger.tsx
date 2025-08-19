import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { PassengerForm } from "../../components/passengers/passenger-form.tsx";
import { PassengerFormData } from "../../types";
import { passengersService } from "../../lib/services/passenger.service";

export function NewPassengerPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: PassengerFormData) => {
    setLoading(true);
    setError(null);

    try {
      await passengersService.create({
        name: data.name,
        email: data.email || "",
        passengerId: data.passengerId || "",
        dateOfBirth: data.dateOfBirth || "",
      });
      navigate("/passengers");
    } catch (err) {
      setError("Error creating passenger");
      console.error("Error creating passenger:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Nuevo Pasajero</h2>
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

      <PassengerForm
        onSubmit={handleSubmit}
        submitLabel={loading ? "Creando..." : "Crear Pasajero"}
      />
    </div>
  );
}
