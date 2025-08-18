import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { OperatorForm } from "../../components/operators/operator-form";
import { OperatorFormData } from "../../types";
import { operatorsService } from "../../lib/services/operators.service";

export function NewOperatorPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: OperatorFormData) => {
    setLoading(true);
    setError(null);

    try {
      await operatorsService.create(data);
      navigate("/operators");
    } catch (err) {
      setError("Error al crear operador");
      console.error("Error creating operator:", err);
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
          onClick={() => navigate("/operators")}
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

      <OperatorForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
