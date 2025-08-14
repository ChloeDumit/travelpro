import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { ClassificationForm } from "../../components/classifications/classification-form";
import { ClassificationFormData } from "../../types";
import { classificationsService } from "../../lib/services/classifications.service";

export function NewClassificationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ClassificationFormData) => {
    setLoading(true);
    setError(null);

    try {
      await classificationsService.create({
        name: data.name,
      });
      navigate("/classifications");
    } catch (err) {
      setError("Error al crear clasificación");
      console.error("Error creating classification:", err);
    } finally {
      setLoading(false);
    }
  };

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

      <ClassificationForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
