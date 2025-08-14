import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { Classification } from "../../types";
import { classificationsService } from "../../lib/services/classifications.service";
import { ConfirmModal } from "../../components/ui/confirm-modal";
import { Input } from "../../components/ui/input";

export function ClassificationsListPage() {
  const navigate = useNavigate();
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [classificationToDelete, setClassificationToDelete] =
    useState<Classification | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchClassifications();
  }, []);

  const fetchClassifications = async () => {
    try {
      setLoading(true);
      const data = await classificationsService.getAll();
      setClassifications(data.data || []);
    } catch (err) {
      setError("Error al cargar clasificaciones");
      console.error("Error fetching classifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!classificationToDelete) return;

    try {
      await classificationsService.delete(classificationToDelete.id.toString());
      setClassifications(
        classifications.filter((c) => c.id !== classificationToDelete.id)
      );
      setDeleteModalOpen(false);
      setClassificationToDelete(null);
    } catch (err) {
      setError("Error al eliminar clasificación");
      console.error("Error deleting classification:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Cargando...</div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  const filteredClassifications = classifications.filter((classification) =>
    classification.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-medium">Clasificaciones</h1>
        <Button onClick={() => navigate("/classifications/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Clasificación
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar clasificaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Cargando clasificaciones...</div>
      ) : filteredClassifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No se encontraron clasificaciones
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredClassifications.map((classification) => (
            <Card key={classification.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{classification.name}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/classifications/${classification.id}/edit`)
                      }
                      className="hover:bg-blue-500 hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setClassificationToDelete(classification);
                        setDeleteModalOpen(true);
                      }}
                      className="hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setClassificationToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Eliminar Clasificación"
        description={`¿Estás seguro de que quieres eliminar la clasificación "${classificationToDelete?.name}"?`}
      />
    </div>
  );
}
