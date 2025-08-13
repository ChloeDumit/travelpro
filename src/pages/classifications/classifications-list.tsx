import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Classification } from "../../types";
import { classificationsService } from "../../lib/services/classifications";
import { ConfirmModal } from "../../components/ui/confirm-modal";

export function ClassificationsListPage() {
  const navigate = useNavigate();
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [classificationToDelete, setClassificationToDelete] =
    useState<Classification | null>(null);

  useEffect(() => {
    fetchClassifications();
  }, []);

  const fetchClassifications = async () => {
    try {
      setLoading(true);
      const data = await classificationsService.getAllClassifications();
      setClassifications(data);
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
      await classificationsService.deleteClassification(
        classificationToDelete.id
      );
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clasificaciones</h1>
        <Button onClick={() => navigate("/classifications/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Clasificación
        </Button>
      </div>

      <div className="grid gap-4">
        {classifications.map((classification) => (
          <Card key={classification.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{classification.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(`/classifications/${classification.id}/edit`)
                    }
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
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">ID: {classification.id}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setClassificationToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Eliminar Clasificación"
        message={`¿Estás seguro de que quieres eliminar la clasificación "${classificationToDelete?.name}"?`}
      />
    </div>
  );
}
