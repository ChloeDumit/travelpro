import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Trash2, Pencil } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { ConfirmModal } from "../../components/ui/confirm-modal";
import { Passenger } from "../../types/passenger";
import { passengersService } from "../../lib/services/passenger.service";

export function PassengersListPage() {
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [passengerToDelete, setPassengerToDelete] = useState<Passenger | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadPassengers();
  }, []);

  const loadPassengers = async () => {
    try {
      setLoading(true);
      const response = await passengersService.getAll();
      setPassengers(response.data?.passengers || []);
    } catch (err) {
      setError("Error loading passengers");
      console.error("Error loading passengers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!passengerToDelete) return;

    try {
      setIsDeleting(true);
      await passengersService.delete(passengerToDelete.id);
      setPassengers(passengers.filter((p) => p.id !== passengerToDelete.id));
      setPassengerToDelete(null);
    } catch (err) {
      setError("Error deleting passenger");
      console.error("Error deleting passenger:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPassengers = passengers.filter(
    (passenger) =>
      passenger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      passenger.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-medium">Pasajeros</h1>
        <Button onClick={() => navigate("/passengers/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Pasajero
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar pasajeros..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Cargando pasajeros...</div>
      ) : filteredPassengers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No se encontraron pasajeros
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPassengers.map((passenger) => (
            <Card key={passenger.id} className="p-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <h3 className="text-lg font-medium">{passenger.name}</h3>
                    {passenger.passengerId && (
                      <span className="text-sm text-gray-500">
                        ID: {passenger.passengerId}
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">{passenger.email}</p>
                    <p className="text-sm text-gray-600">
                      {passenger.dateOfBirth}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("passenger", passenger);
                      navigate(`/passengers/${passenger.id}/edit`);
                    }}
                    className="hover:bg-blue-500 hover:text-white"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPassengerToDelete(passenger);
                    }}
                    className="hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!passengerToDelete}
        onClose={() => setPassengerToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Passenger"
        description={`Are you sure you want to delete ${passengerToDelete?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
