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
import { Operator } from "../../types";
import { operatorsService } from "../../lib/services/operators";
import { ConfirmModal } from "../../components/ui/confirm-modal";

export function OperatorsListPage() {
  const navigate = useNavigate();
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [operatorToDelete, setOperatorToDelete] = useState<Operator | null>(
    null
  );

  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    try {
      setLoading(true);
      const data = await operatorsService.getAllOperators();
      setOperators(data);
    } catch (err) {
      setError("Error al cargar operadores");
      console.error("Error fetching operators:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!operatorToDelete) return;

    try {
      await operatorsService.deleteOperator(operatorToDelete.id);
      setOperators(operators.filter((op) => op.id !== operatorToDelete.id));
      setDeleteModalOpen(false);
      setOperatorToDelete(null);
    } catch (err) {
      setError("Error al eliminar operador");
      console.error("Error deleting operator:", err);
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
        <h1 className="text-2xl font-bold">Operadores</h1>
        <Button onClick={() => navigate("/operators/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Operador
        </Button>
      </div>

      <div className="grid gap-4">
        {operators.map((operator) => (
          <Card key={operator.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{operator.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/operators/${operator.id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setOperatorToDelete(operator);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">ID: {operator.id}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setOperatorToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Eliminar Operador"
        message={`¿Estás seguro de que quieres eliminar el operador "${operatorToDelete?.name}"?`}
      />
    </div>
  );
}
