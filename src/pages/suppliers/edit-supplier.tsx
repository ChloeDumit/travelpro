import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { SupplierForm } from "../../components/suppliers/supplier-form";
import { SupplierFormData } from "../../types";
import { suppliersService } from "../../lib/services/suppliers.service";

export function EditSupplierPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supplier, setSupplier] = useState<SupplierFormData | null>(null);

  useEffect(() => {
    loadSupplier();
  }, [id]);

  const loadSupplier = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await suppliersService.getById(id);
      setSupplier(response.data || null);
    } catch (err) {
      setError("Error loading supplier");
      console.error("Error loading supplier:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: SupplierFormData) => {
    if (!id) return;

    setSaving(true);
    setError(null);

    try {
      await suppliersService.update(id, data);
      navigate("/suppliers");
    } catch (err) {
      setError("Error updating supplier");
      console.error("Error updating supplier:", err);
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

  if (!supplier) {
    return (
      <div className="text-center py-8 text-gray-500">
        Proveedor no encontrado
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Editar Proveedor</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/suppliers")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Proveedores
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <SupplierForm
        onSubmit={handleSubmit}
        initialData={supplier}
        submitLabel={saving ? "Guardando..." : "Guardar Cambios"}
      />
    </div>
  );
}
