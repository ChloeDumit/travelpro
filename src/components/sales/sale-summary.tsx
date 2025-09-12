import {
  formatCurrency,
  formatDate,
  getStatusColor,
  mapStatusToLabel,
} from "../../lib/utils";
import { Sale, SaleItemFormData, CurrencyRate } from "../../types";
import { Badge } from "../ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  convertToUSD,
  formatCurrencyWithSymbol,
} from "../../lib/currency-utils";
import { companySettingsService } from "../../lib/services/company-settings.service";
import { useAsyncOperation } from "../../hooks/useAsyncOperation";
import { useEffect, useState } from "react";

interface SaleSummaryProps {
  sale: Sale;
}

export function SaleSummary({ sale }: SaleSummaryProps) {
  const items = sale.items;
  const saleData = sale;
  const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>([]);

  const currencyRatesOp = useAsyncOperation(
    companySettingsService.getCurrencyRates
  );

  useEffect(() => {
    currencyRatesOp.execute();
  }, []);

  useEffect(() => {
    if (currencyRatesOp.data?.data) {
      setCurrencyRates(currencyRatesOp.data.data);
    }
  }, [currencyRatesOp.data]);

  // Calculate totals in USD
  const totalCostUSD = items.reduce((sum, item) => {
    const usdAmount = convertToUSD(
      item.costPrice,
      saleData.currency,
      currencyRates
    );
    return sum + usdAmount;
  }, 0);

  const totalSaleUSD = items.reduce((sum, item) => {
    const usdAmount = convertToUSD(
      item.salePrice,
      saleData.currency,
      currencyRates
    );
    return sum + usdAmount;
  }, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Venta #{saleData.id}</span>
            <Badge className={getStatusColor(saleData.status)}>
              {mapStatusToLabel(saleData.status)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Cliente</h3>
              <p className="mt-1 text-sm font-medium">
                {saleData.passengerName}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">ID/RUT</h3>
              <p className="mt-1 text-sm font-medium">
                {saleData.client.clientId}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Fecha de Creación
              </h3>
              <p className="mt-1 text-sm font-medium">
                {formatDate(saleData.creationDate)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Fecha de Viaje
              </h3>
              <p className="mt-1 text-sm font-medium">
                {formatDate(saleData.travelDate)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Tipo de Venta
              </h3>
              <p className="mt-1 text-sm font-medium capitalize">
                {saleData.saleType}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Región</h3>
              <p className="mt-1 text-sm font-medium capitalize">
                {saleData.region}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Tipo de Servicio
              </h3>
              <p className="mt-1 text-sm font-medium capitalize">
                {saleData.serviceType}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Moneda</h3>
              <p className="mt-1 text-sm font-medium">{saleData.currency}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Vendedor</h3>
              <p className="mt-1 text-sm font-medium">
                {saleData.seller.email}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pasajeros</h3>
              <p className="mt-1 text-sm font-medium">
                {saleData.passengerCount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item, index) => (
              <SaleItemCard
                key={index}
                item={item as SaleItemFormData}
                saleCurrency={saleData.currency}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumen Financiero</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Original Currency */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">
                En {saleData.currency}
              </h4>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Costo Total:</span>
                <span>
                  {formatCurrency(saleData.totalCost, saleData.currency)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Venta Total:</span>
                <span>
                  {formatCurrency(saleData.salePrice, saleData.currency)}
                </span>
              </div>
              <div className="flex justify-between py-2 font-bold text-lg">
                <span>Ganancia:</span>
                <span
                  className={
                    saleData.salePrice - saleData.totalCost >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {formatCurrency(
                    saleData.salePrice - saleData.totalCost,
                    saleData.currency
                  )}
                </span>
              </div>
            </div>

            {/* USD Conversion */}
            {saleData.currency !== "USD" && currencyRates.length > 0 && (
              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-medium text-gray-900">Conversión a USD</h4>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Costo Total:</span>
                  <span>{formatCurrencyWithSymbol(totalCostUSD, "USD")}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Venta Total:</span>
                  <span>{formatCurrencyWithSymbol(totalSaleUSD, "USD")}</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-lg">
                  <span>Ganancia:</span>
                  <span
                    className={
                      totalSaleUSD - totalCostUSD >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {formatCurrencyWithSymbol(
                      totalSaleUSD - totalCostUSD,
                      "USD"
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* No rates warning */}
            {saleData.currency !== "USD" && currencyRates.length === 0 && (
              <div className="pt-4 border-t">
                <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
                  ⚠️ No hay tasas de cambio configuradas. No se puede mostrar la
                  conversión a USD.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface SaleItemCardProps {
  item: SaleItemFormData;
  saleCurrency: string;
}

function SaleItemCard({ item, saleCurrency }: SaleItemCardProps) {
  const classificationName = item.classification?.at(0)?.name || "N/A";

  const supplierName = item.supplier?.at(0)?.name || "N/A";
  const operatorName = item.operator?.at(0)?.name || "N/A";

  return (
    <div className="border rounded-md p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{classificationName}</h4>
          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div>
          <h5 className="text-xs text-gray-500">Proveedor</h5>
          <p className="text-sm">{supplierName}</p>
        </div>
        <div>
          <h5 className="text-xs text-gray-500">Operador</h5>
          <p className="text-sm">{operatorName}</p>
        </div>
        <div>
          <h5 className="text-xs text-gray-500">Rango de Fecha</h5>
          <p className="text-sm">
            {item.dateIn ? formatDate(item.dateIn) : "N/A"} -{" "}
            {item.dateOut ? formatDate(item.dateOut) : "N/A"}
          </p>
        </div>
        <div>
          <h5 className="text-xs text-gray-500">Pasajeros</h5>
          <p className="text-sm">
            {item.passengers?.map((passenger) => passenger.name).join(", ")}
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-4 pt-2 border-t">
        <div>
          <h5 className="text-xs text-gray-500">Precio de Venta</h5>
          <p className="text-sm font-medium">
            {formatCurrency(item.salePrice, saleCurrency)}
          </p>
        </div>
        <div>
          <h5 className="text-xs text-gray-500">Precio de Costo</h5>
          <p className="text-sm">
            {formatCurrency(item.costPrice, saleCurrency)}
          </p>
        </div>
        <div>
          <h5 className="text-xs text-gray-500">Código de Reserva</h5>
          <p className="text-sm">{item.reservationCode || "N/A"}</p>
        </div>
        <div>
          <h5 className="text-xs text-gray-500">Fecha de Pago</h5>
          <p className="text-sm">
            {item.paymentDate ? formatDate(item.paymentDate) : "Pending"}
          </p>
        </div>
      </div>
    </div>
  );
}
