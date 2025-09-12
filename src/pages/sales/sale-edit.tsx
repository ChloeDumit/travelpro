import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { PageLoading } from "../../components/ui/loading-spinner";
import { SaleForm } from "../../components/sales/sale-form";
import { SaleFormData, SaleItemFormData, Sale } from "../../types";
import { salesService } from "../../lib/services/sales.service";
import { Client } from "../../types/client";

export function SaleEditPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<Sale | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchSale = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await salesService.getById(id);
        if (data.data) {
          setInitialData(data.data);
        } else {
          setError("No se encontraron datos de la venta");
        }
      } catch (err) {
        setError("Failed to fetch sale details");
        console.error("Error fetching sale:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSale();
  }, [id]);

  const handleSubmit = async (
    saleData: SaleFormData & { client: Client | null },
    items: SaleItemFormData[]
  ) => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const updateData = {
        ...saleData,
        items: items,
      };

      const sale = await salesService.update(id, updateData);

      navigate(`/sales/${sale.data?.sale.id}`);
    } catch (err) {
      setError("Error al actualizar la venta");
      console.error("Error updating sale:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !initialData) {
    return <PageLoading message="Cargando venta..." />;
  }

  if (!initialData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No se pudo cargar la venta</p>
        <Button
          variant="outline"
          onClick={() => navigate("/sales")}
          className="mt-4"
        >
          Volver a la lista
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Editar Venta</h2>
        <Button variant="outline" size="sm" onClick={() => navigate("/sales")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <SaleForm
        onSubmit={handleSubmit}
        initialData={initialData}
        action="edit"
        loading={loading}
      />
    </div>
  );
}
