import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { ClassificationForm } from "../../components/classifications/classification-form";
import { ClassificationFormData, Classification } from "../../types";
import { classificationsService } from "../../lib/services/classifications.service";

export function EditClassificationPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classification, setClassification] = useState<Classification | null>(
    null
  );

  useEffect(() => {
    if (id) {
      fetchClassification();
    }
  }, [id]);

  const fetchClassification = async () => {
    try {
      const data = await classificationsService.getById(id || "");
      setClassification(data.data || null);
    } catch (err) {
      setError("Error al cargar clasificación");
      console.error("Error fetching classification:", err);
    }
  };

  const handleSubmit = async (data: ClassificationFormData) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      await classificationsService.update(id, {
        name: data.name,
      });
      navigate("/classifications");
    } catch (err) {
      setError("Error al actualizar clasificación");
      console.error("Error updating classification:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!classification) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/classifications")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <ClassificationForm
        onSubmit={handleSubmit}
        loading={loading}
        initialData={classification}
      />
    </div>
  );
}
