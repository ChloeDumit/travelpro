import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { SaleForm } from "../../components/sales/sale-form";
import { SaleFormData, SaleItemFormData } from "../../types";
import { salesService } from "../../lib/services/sales.service";
import { Client } from "../../types/client";

export function NewSalePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    saleData: SaleFormData & { client: Client | null },
    items: SaleItemFormData[]
  ) => {
    console.log(saleData, items);
    setLoading(true);
    setError(null);

    try {
      console.log(saleData, items);
      const sale = await salesService.create({
        saleData: {
          ...saleData,
          client: { id: saleData.client?.id || "" },
        },
        items: items.map((item) => ({
          ...item,
          classificationId: item.classificationId?.toString(),
          supplierId: item.supplierId?.toString(),
          operatorId: item.operatorId?.toString(),
          paymentDate: item.paymentDate?.toString(),
        })),
      });
      navigate(`/sales/${sale.data?.sale.id}`);
    } catch (err) {
      setError("Error al crear la venta");
      console.error("Error creating sale:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
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

      <SaleForm onSubmit={handleSubmit} action="new" loading={loading} />
    </div>
  );
}
