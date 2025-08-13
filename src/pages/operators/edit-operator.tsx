import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { OperatorForm } from "../../components/operators/operator-form";
import { OperatorFormData, Operator } from "../../types";
import { operatorsService } from "../../lib/services/operators";

export function EditOperatorPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);

  useEffect(() => {
    if (id) {
      fetchOperator();
    }
  }, [id]);

  const fetchOperator = async () => {
    try {
      const data = await operatorsService.getOperatorById(parseInt(id || "0"));
      setOperator(data);
    } catch (err) {
      setError("Error al cargar operador");
      console.error("Error fetching operator:", err);
    }
  };

  const handleSubmit = async (data: OperatorFormData) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      await operatorsService.updateOperator(parseInt(id), data);
      navigate("/operators");
    } catch (err) {
      setError("Error al actualizar operador");
      console.error("Error updating operator:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!operator) {
    return <div>Cargando...</div>;
  }

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

      <OperatorForm
        onSubmit={handleSubmit}
        loading={loading}
        initialData={operator}
      />
    </div>
  );
}
