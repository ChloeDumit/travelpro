import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { LoadingSpinner } from "../ui/loading-spinner";
import { ErrorMessage } from "../ui/error-message";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { CurrencyRate } from "../../types";
import { companySettingsService } from "../../lib/services/company-settings.service";
import { useAsyncOperation } from "../../hooks/useAsyncOperation";

interface CurrencyRatesListProps {
  onEditRate: (rate: CurrencyRate) => void;
  onAddRate: () => void;
  refreshTrigger?: number;
}

export function CurrencyRatesList({
  onEditRate,
  onAddRate,
  refreshTrigger,
}: CurrencyRatesListProps) {
  const [rates, setRates] = useState<CurrencyRate[]>([]);

  const getRatesOp = useAsyncOperation(companySettingsService.getCurrencyRates);
  const deleteRateOp = useAsyncOperation(
    companySettingsService.deleteCurrencyRate
  );
  const toggleRateOp = useAsyncOperation(
    companySettingsService.toggleCurrencyRate
  );

  // Load currency rates
  useEffect(() => {
    getRatesOp.execute();
  }, []);

  // Refresh when trigger changes
  useEffect(() => {
    if (refreshTrigger) {
      getRatesOp.execute();
    }
  }, [refreshTrigger]);

  // Update local state when data is loaded
  useEffect(() => {
    if (getRatesOp.data?.data) {
      console.log("Currency rates data:", getRatesOp.data.data);
      setRates(getRatesOp.data.data);
    }
  }, [getRatesOp.data]);

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar esta tasa de cambio?"
      )
    ) {
      try {
        await deleteRateOp.execute(id);
        setRates((prev) => prev.filter((rate) => rate.id !== id));
      } catch (error) {
        console.error("Error deleting currency rate:", error);
      }
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const response = await toggleRateOp.execute(id);
      if (response?.data?.data) {
        setRates((prev) =>
          prev.map((rate) =>
            rate.id === id ? { ...rate, ...response.data!.data } : rate
          )
        );
      }
    } catch (error) {
      console.error("Error toggling currency rate:", error);
    }
  };

  if (getRatesOp.loading) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Tasas de Cambio</CardTitle>
          <Button onClick={onAddRate}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Tasa
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {rates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay tasas de cambio configuradas
            </div>
          ) : (
            rates.map((rate) => (
              <div
                key={rate.id}
                className={`flex items-center justify-between p-4 border rounded-lg ${
                  !rate.isActive ? "bg-gray-50 opacity-60" : "bg-white"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{rate.currency}</span>
                    <span className="text-gray-500">
                      1 {rate.currency} = {rate.rate?.toFixed(4) || "0.0000"}{" "}
                      USD
                    </span>
                    <span className="text-xs text-gray-400">
                      Actualizado:{" "}
                      {rate.lastUpdated
                        ? new Date(rate.lastUpdated).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggle(rate.id)}
                    disabled={toggleRateOp.loading}
                  >
                    {rate.isActive ? "Desactivar" : "Activar"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditRate(rate)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(rate.id)}
                    disabled={deleteRateOp.loading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Error Messages */}
        {(deleteRateOp.error || toggleRateOp.error) && (
          <ErrorMessage
            error={
              deleteRateOp.error ||
              toggleRateOp.error ||
              "Error al procesar la solicitud"
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
